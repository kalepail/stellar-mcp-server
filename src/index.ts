import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// @ts-ignore
import module from '@stellar/stellar-xdr-json/stellar_xdr_json_bg.wasm';
import init, { decode } from "@stellar/stellar-xdr-json";
import { rpc } from "./utils";
import { AssembledTransaction, AssembledTransactionOptions, Client } from "@stellar/stellar-sdk/minimal/contract";
import { Address, Keypair, Operation, xdr } from "@stellar/stellar-sdk/minimal";
import { PasskeyClient } from "passkey-kit";
import { server, wallet } from "./passkey-kit";
import { deployNewFungiblePausableToken } from "./fungible-pausable";

export { StellarMCPStore } from "./store-do";

await init(module);

// e.g. Smart Wallet user contract
// CCXA7FAXWNUEAGMJCLXICBJTRAVYFYWQ4TICHKDVWSXMGOXDC3VQV52K

// e.g. Fungible Pausable contract
// CAS6GHCKOFOFRU5IULG2AHRR2VPPUOWMQ6NBKSRUND3M3VWLYDX3FSVC

type Props = {
	ip: string;
};

// Define our MCP agent with tools
export class MyMCP extends McpAgent<Env, unknown, Props> {
	public server = new McpServer({
		name: "Stellar MCP Server Demo",
		version: "1.0.0",
	});

	async init() {
		let id = this.env.STELLAR_MCP_STORE.idFromName('stellar-smart-mcp:v1');
		let stub = this.env.STELLAR_MCP_STORE.get(id);

		const contractIds = await stub.getContracts(this.props.ip);

		for (let [contract_name, contractId] of contractIds) {
			let wasm: Buffer;

			try {
				wasm = await rpc(this.env).getContractWasmByContractId(contractId);
			} catch { continue }

			const contract = await Client.fromWasm(wasm, {
				contractId,
				rpcUrl: this.env.RPC_URL,
				networkPassphrase: this.env.NETWORK_PASSPHRASE,
			});

			for (let func of contract.spec.funcs()) {
				let func_name = func.name().toString();
	
				if (func_name.includes("__")) {
					continue;
				}
	
				let params = new Map<string, z.ZodTypeAny>();
	
				// TODO warn if docs are missing

				for (let input of func.inputs()) {
					params.set(
						input.name().toString(),
						z
							.string() // TODO Not all types are strings? e.g. Vector or map. Hmm...
							.describe(input.doc().toString())
							.transform((val) => contract.spec.nativeToScVal(val, input.type()))
					)
				}
	
				let toolName = `${contract_name}: ${func_name}`;
					toolName = toolName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 64);
					toolName = toolName.replace('__', '_');

				this.server.tool(
					toolName,
					func.doc().toString(),
					Object.fromEntries(params),
					async (params) => {
						try {
							const at = await AssembledTransaction.buildWithOp(
								Operation.invokeHostFunction({
									func: xdr.HostFunction.hostFunctionTypeInvokeContract(new xdr.InvokeContractArgs({
										contractAddress: Address.fromString(contract.options.contractId).toScAddress(),
										functionName: func_name,
										args: Object.values(params)
									}))
								}),
								contract.options as AssembledTransactionOptions
							);
	
							console.log('isReadCall', at.isReadCall);
							console.log('needsNonInvokerSigningBy', at.needsNonInvokerSigningBy());
		
							const json = decode("ScVal", at.simulationData.result.retval.toXDR('base64'));
	
							if (at.isReadCall) {
								return {
									content: [{ 
										type: "text", 
										text: json
									}],
								};	
							} else {
								const address_sk = await stub.getAddress(this.props.ip);
								const [ address, sk ] = address_sk;
		
								wallet.wallet = new PasskeyClient({
									contractId: address,
									networkPassphrase: this.env.NETWORK_PASSPHRASE,
									rpcUrl: this.env.RPC_URL,
								});
		
								await wallet.sign(at, { keypair: Keypair.fromSecret(sk) });
		
								const res = await server.send(at);
								
								console.log(res);

								return {
									content: [{ 
										type: "text", 
										text: JSON.stringify({
											result: JSON.parse(json),
											success: res,
										}) 
									}],
								};	
							}
						} catch (err) {
							console.error('ERROR', err)
		
							return {
								content: [{ type: "text", text: JSON.stringify(err) }],
							};
						}
					}
				);
			}
		}

		// TODO
		// Lookup balance
		// Mint tokens (likely don't need initial supply)
		// this should go to a list of addresses
		// this could be a new airdrop contract using an policy signer

		// Add new contract address to the user
		this.server.tool(
			"setContractAddress",
			"Add a new contract address to track",
			{
				name: z.string().describe("The name of the contract"),
				address: z.string().describe("The contract address to add"),
			},
			async ({ name, address }) => {
				const address_sk = await stub.getAddress(this.props.ip);

				if (!address_sk) {
					return {
						content: [{ type: "text", text: "No wallet address set" }],
					};
				}
				
				const [_address, sk] = address_sk;

				await stub.addContract(this.props.ip, name, address);

				return {
					content: [{ 
						type: "text", 
						text: JSON.stringify({
							message: "Success! Now reload to see your new tools",
							instructions: `Open the link to add a policy signer to sign transactions for this ${address} contract`,
							link: `https://superpeach.xyz/add-signer?publicKey=${Keypair.fromSecret(sk).publicKey()}&signerLimits=${address}`
						})
					}],
				};
			}
		);

		// Get all contract addresses for the user
		this.server.tool(
			"getContractAddresses",
			"Get all contract addresses for the user",
			{},
			async () => {
				const contracts = await stub.getContracts(this.props.ip);

				return {
					content: [{ type: "text", text: JSON.stringify(contracts) }],
				}
			}
		);

		// Remove a contract address from the user
		this.server.tool(
			"removeContractAddress",
			"Remove a contract address from the user",
			{
				address: z.string().describe("The contract address to remove"),
			},
			async ({ address }) => {
				stub.removeContract(this.props.ip, address);

				return {
					content: [{ type: "text", text: `Success! Now reload to see your new tools` }],
				};
			}
		);

		// Set the wallet address for the user
		this.server.tool(
			"setWallet",
			"Set your Stellar wallet address",
			{
				wallet: z.string().describe("The wallet address to set"),
			},
			async ({ wallet }) => {
				stub.setAddress(this.props.ip, wallet);

				return {
					content: [{ type: "text", text: `Wallet address set to ${wallet}` }],
				};
			}
		);

		// Get the wallet address for the user
		this.server.tool(
			"getWallet",
			"Get your Stellar wallet address",
			{},
			async () => {
				const address_sk = await stub.getAddress(this.props.ip);

				if (address_sk.length) {
					const [address, _sk] = address_sk;
					return {
						content: [{ type: "text", text: `Wallet address is ${address}` }],
					};
				} else {
					return {
						content: [{ type: "text", text: "No wallet address set" }],
					};
				}
			}
		);

		// Deploy a new token contract
		this.server.tool(
			"deployToken",
			"Deploy a new token contract",
			{
				name: z.string().describe("The name of the token"),
				symbol: z.string().describe("The symbol of the token"),
				initial_supply: z
					.string()
					.describe("The initial supply of the token")
					.transform(val => BigInt(val)),
				cap: z
					.string()
					.describe("The cap of the token")
					.transform(val => BigInt(val)),
			},
			async ({ name, symbol, initial_supply, cap }) => {
				try {
					const address_sk = await stub.getAddress(this.props.ip);

					if (!address_sk) {
						return {
							content: [{ type: "text", text: "No wallet address set" }],
						};
					}

					const [address, _sk] = address_sk;
					const res = await deployNewFungiblePausableToken(
						this.env,
						address,
						name,
						symbol,
						initial_supply,
						cap,
					)

					return {
						content: [{ type: "text", text: JSON.stringify(res) }],
					};
				} catch (err) {
					console.error('ERROR', err)

					return {
						content: [{ type: "text", text: JSON.stringify(err) }],
					};
				}
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		const ip = request.headers.get("cf-connecting-ip")

		if (!ip) {
			return new Response("No IP address found", { status: 400 });
		}

		ctx.props = {
			ip
		}

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			// @ts-ignore
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			// @ts-ignore
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
