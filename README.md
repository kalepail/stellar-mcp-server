# Stellar Smart MCP Demo

Heavily inspired by https://blog.cloudflare.com/remote-model-context-protocol-servers-mcp/ and https://github.com/cloudflare/ai/tree/main/demos/remote-mcp-github-oauth. If you're having issues I actually suggest reviewing the [Cloudflare docs](https://developers.cloudflare.com/agents/guides/remote-mcp-server/) vs worrying too much about debugging inside this specific repo.

For this specific MCP server there are a few things you'll want to keep in mind:

* Be sure to setup your wallet first by triggering the `setWallet` tool
* If you add contracts to track via the `setContractAddress` you'll also need to add a `ed25519` signer if you want to automate the signing. Atm this is done via my [Super Peach wallet](https://superpeach.xyz/).

Be safe, have fun!