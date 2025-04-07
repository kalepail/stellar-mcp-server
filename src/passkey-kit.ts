import { Networks } from '@stellar/stellar-sdk/minimal'
import { PasskeyKit, PasskeyServer } from 'passkey-kit'

const launchtubeUrl = 'https://testnet.launchtube.xyz'
const launchtubeJwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4YTA5NDMwMTA5MjE4OGQ3YmNkOTBiNTllNzA1ZmI5ZmE1ZjRjNzgyZTI3NTMyNTQxYzVhZGJmMTQyNzBjNTMyIiwiZXhwIjoxNzUwMzUwNzUyLCJjcmVkaXRzIjoxMDAwMDAwMDAwLCJpYXQiOjE3NDMwOTMxNTJ9.dbx3vhtVu4HIwJBWNFbEFZb50no7Sus8QIDWtfI3dHc'

export const wallet = new PasskeyKit({
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: Networks.TESTNET,
    walletWasmHash: 'ecd990f0b45ca6817149b6175f79b32efb442f35731985a084131e8265c4cd90',
});

export const server = new PasskeyServer({
    launchtubeUrl,
    launchtubeJwt,
})