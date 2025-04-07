import { hash, Keypair, StrKey } from '@stellar/stellar-sdk/minimal'
import { basicNodeSigner } from '@stellar/stellar-sdk/minimal/contract';
import { Client } from 'fungible-pausable-sdk'
import { server } from './passkey-kit';

const keypair = Keypair.fromRawEd25519Seed(hash(Buffer.from('kalepail')));
const publicKey = keypair.publicKey()

export async function deployNewFungiblePausableToken(env: Env, owner: string, name: string, symbol: string, initial_supply: bigint, cap: bigint) {
    const at = await Client.deploy({
        owner,
        name,
        symbol,
        decimals: 0,
        initial_supply,
        cap
    }, {
        // TODO js-stellar-sdk simulation shouldn't error here 
        // we need to be more careful about when we error when calling getAccount or just when we require calling getAccount in the first place
        // publicKey: StrKey.encodeEd25519PublicKey(Buffer.alloc(32)),
        // ✘ [ERROR] ERROR {
        //     code: 404,
        //     message: 'Account not found: GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
        //   }
        ////

        address: publicKey,
        rpcUrl: env.RPC_URL,
        wasmHash: env.FUNGIBLE_PAUSABLE_WASM_HASH,
        networkPassphrase: env.NETWORK_PASSPHRASE,
    });

    await at.signAuthEntries({
        address: publicKey,
        signAuthEntry: basicNodeSigner(keypair, env.NETWORK_PASSPHRASE).signAuthEntry
    });

    const res = await server.send(at)

    console.log(res);

    return {
        ...res,
        contractId: StrKey.encodeContract(at.simulationData.result.retval.address().contractId())
    }
}