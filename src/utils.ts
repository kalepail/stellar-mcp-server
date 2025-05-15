import { Server } from "@stellar/stellar-sdk/minimal/rpc";

export function rpc(env: Env) {
	return new Server(env.RPC_URL);
}