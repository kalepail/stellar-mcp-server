# js-stellar-xdr-json
A JS library for XDR conversion to and from JSON.

## Usage

```js
import init, { decode, encode, guess, types, schema } from "@stellar/stellar-xdr-json";

// Fetch and initialize the Wasm module.
await init();

// Get a list of XDR types.
console.log(types());

// Get the JSON schema for any type.
console.log(schema("TransactionResult"));

// Guess what types an XDR value could be.
console.log(guess("AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA="));

// Encode an XDR value.
console.log(encode(
    "TransactionResult",
    JSON.stringify(
        {
            "fee_charged": 100,
            "result": {
                "tx_success": [{ "op_inner": { "payment": "success" } }],
            },
            "ext": "v0",
        },
    ),
));

// Decode an XDR value.
console.log(
    decode("TransactionResult", "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA="),
);
