import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from '@stellar/stellar-sdk/minimal/contract';
import type { u32, i128 } from '@stellar/stellar-sdk/minimal/contract';
/**
 * Storage container for token metadata
 */
export interface Metadata {
    decimals: u32;
    name: string;
    symbol: string;
}
export declare const Errors: {
    /**
     * Error thrown when an unauthorized user attempts a restricted operation.
     */
    1: {
        message: string;
    };
    /**
     * The operation failed because the contract is paused.
     */
    100: {
        message: string;
    };
    /**
     * The operation failed because the contract is not paused.
     */
    101: {
        message: string;
    };
    /**
     * Indicates an error related to the current balance of account from which
     * tokens are expected to be transferred.
     */
    200: {
        message: string;
    };
    /**
     * Indicates a failure with the allowance mechanism when a given spender
     * doesn't have enough allowance.
     */
    201: {
        message: string;
    };
    /**
     * Indicates an invalid value for `live_until_ledger` when setting an
     * allowance.
     */
    202: {
        message: string;
    };
    /**
     * Indicates an error when an input that must be >= 0
     */
    203: {
        message: string;
    };
    /**
     * Indicates overflow when adding two values
     */
    204: {
        message: string;
    };
    /**
     * Indicates access to uninitialized metadata
     */
    205: {
        message: string;
    };
    /**
     * Indicates that the operation would have caused `total_supply` to exceed
     * the `cap`.
     */
    206: {
        message: string;
    };
    /**
     * Indicates the supplied `cap` is not a valid cap value.
     */
    207: {
        message: string;
    };
    /**
     * Indicates the Cap was not set.
     */
    208: {
        message: string;
    };
};
/**
 * Storage key that maps to [`AllowanceData`]
 */
export interface AllowanceKey {
    owner: string;
    spender: string;
}
/**
 * Storage container for the amount of tokens for which an allowance is granted
 * and the ledger number at which this allowance expires.
 */
export interface AllowanceData {
    amount: i128;
    live_until_ledger: u32;
}
/**
 * Storage keys for the data associated with `FungibleToken`
 */
export type StorageKey = {
    tag: "TotalSupply";
    values: void;
} | {
    tag: "Balance";
    values: readonly [string];
} | {
    tag: "Allowance";
    values: readonly [AllowanceKey];
};
export interface Client {
    /**
     * Construct and simulate a paused transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Checks if the contract is currently paused.
     *
     * Returns a boolean indicating the pause state of the contract.
     *
     * # Returns
     *
     * * `bool` - true if the contract is paused, false otherwise
     */
    paused: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a pause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Pauses all token operations marked with #[when_not_paused].
     *
     * This is an emergency function that can be used to freeze token transfers
     * and other operations if a security issue is discovered.
     *
     * # Arguments
     *
     * * `caller` - The address attempting to pause the contract
     *
     * # Errors
     *
     * * `ExampleContractError::Unauthorized` - If caller is not the contract owner
     */
    pause: ({ caller }: {
        caller: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a unpause transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Unpauses the contract, restoring normal operation.
     *
     * Re-enables all functionality that was disabled when the contract was paused.
     *
     * # Arguments
     *
     * * `caller` - The address attempting to unpause the contract
     *
     * # Errors
     *
     * * `ExampleContractError::Unauthorized` - If caller is not the contract owner
     */
    unpause: ({ caller }: {
        caller: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Returns the total number of tokens in circulation.
     *
     * # Returns
     *
     * * `i128` - The total supply of tokens
     */
    total_supply: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets the token balance of a specific account.
     *
     * # Arguments
     *
     * * `account` - The address to check the balance of
     *
     * # Returns
     *
     * * `i128` - The token balance of the specified account
     */
    balance: ({ account }: {
        account: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a allowance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Gets the amount of tokens that a spender is allowed to withdraw from an owner.
     *
     * # Arguments
     *
     * * `owner` - The address that owns the tokens
     * * `spender` - The address that can spend the tokens
     *
     * # Returns
     *
     * * `i128` - The remaining allowance
     */
    allowance: ({ owner, spender }: {
        owner: string;
        spender: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Transfers tokens from one account to another.
     *
     * The sender must have sufficient balance and must authorize the transaction.
     * This function is protected by the pause mechanism.
     *
     * # Arguments
     *
     * * `from` - The address to transfer tokens from
     * * `to` - The address to transfer tokens to
     * * `amount` - The amount of tokens to transfer
     *
     * # Errors
     *
     * * Panics if the contract is paused
     * * Panics if `from` has insufficient balance
     * * Panics if `from` does not authorize the transaction
     */
    transfer: ({ from, to, amount }: {
        from: string;
        to: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Transfers tokens on behalf of another account.
     *
     * The spender must have sufficient allowance from the token owner.
     * This function is protected by the pause mechanism.
     *
     * # Arguments
     *
     * * `spender` - The address authorized to spend tokens
     * * `from` - The address to transfer tokens from
     * * `to` - The address to transfer tokens to
     * * `amount` - The amount of tokens to transfer
     *
     * # Errors
     *
     * * Panics if the contract is paused
     * * Panics if `spender` has insufficient allowance
     * * Panics if `from` has insufficient balance
     * * Panics if `spender` does not authorize the transaction
     */
    transfer_from: ({ spender, from, to, amount }: {
        spender: string;
        from: string;
        to: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Approves a spender to withdraw from the caller's account.
     *
     * Sets the amount of tokens that a spender can withdraw from the owner's account.
     *
     * # Arguments
     *
     * * `owner` - The address that owns the tokens
     * * `spender` - The address that can spend the tokens
     * * `amount` - The maximum amount that can be spent
     * * `live_until_ledger` - The ledger sequence number until which the approval is valid
     *
     * # Errors
     *
     * * Panics if `owner` does not authorize the transaction
     */
    approve: ({ owner, spender, amount, live_until_ledger }: {
        owner: string;
        spender: string;
        amount: i128;
        live_until_ledger: u32;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Returns the number of decimal places used by the token.
     *
     * # Returns
     *
     * * `u32` - The number of decimal places
     */
    decimals: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Returns the human-readable name of the token.
     *
     * # Returns
     *
     * * `String` - The name of the token
     */
    name: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Returns the token symbol.
     *
     * # Returns
     *
     * * `String` - The symbol of the token (e.g., "TKN")
     */
    symbol: (options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<string>>;
    /**
     * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Burns (destroys) tokens from an account.
     *
     * The account must authorize this operation and have sufficient balance.
     * This function is protected by the pause mechanism.
     *
     * # Arguments
     *
     * * `from` - The address to burn tokens from
     * * `amount` - The amount of tokens to burn
     *
     * # Errors
     *
     * * Panics if the contract is paused
     * * Panics if `from` has insufficient balance
     * * Panics if `from` does not authorize the transaction
     */
    burn: ({ from, amount }: {
        from: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a burn_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Burns tokens from an account using an allowance.
     *
     * The spender must have sufficient allowance from the token owner.
     * This function is protected by the pause mechanism.
     *
     * # Arguments
     *
     * * `spender` - The address authorized to burn tokens
     * * `from` - The address to burn tokens from
     * * `amount` - The amount of tokens to burn
     *
     * # Errors
     *
     * * Panics if the contract is paused
     * * Panics if `spender` has insufficient allowance
     * * Panics if `from` has insufficient balance
     * * Panics if `spender` does not authorize the transaction
     */
    burn_from: ({ spender, from, amount }: {
        spender: string;
        from: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Creates new tokens and assigns them to a specified account.
     *
     * This function can only be called by the contract owner and will fail
     * if the cap would be exceeded. This function is protected by the pause mechanism.
     *
     * # Arguments
     *
     * * `account` - The address to receive the newly minted tokens
     * * `amount` - The amount of tokens to mint
     *
     * # Errors
     *
     * * Panics if the contract is paused
     * * Panics if caller is not the contract owner
     * * Panics if the operation would exceed the token cap
     */
    mint: ({ account, amount }: {
        account: string;
        amount: i128;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: BASE_FEE
         */
        fee?: number;
        /**
         * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
         */
        timeoutInSeconds?: number;
        /**
         * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
         */
        simulate?: boolean;
    }) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { owner, name, symbol, decimals, initial_supply, cap }: {
        owner: string;
        name: string;
        symbol: string;
        decimals: u32;
        initial_supply: i128;
        cap: i128;
    }, 
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
        address?: string;
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        paused: (json: string) => AssembledTransaction<boolean>;
        pause: (json: string) => AssembledTransaction<null>;
        unpause: (json: string) => AssembledTransaction<null>;
        total_supply: (json: string) => AssembledTransaction<bigint>;
        balance: (json: string) => AssembledTransaction<bigint>;
        allowance: (json: string) => AssembledTransaction<bigint>;
        transfer: (json: string) => AssembledTransaction<null>;
        transfer_from: (json: string) => AssembledTransaction<null>;
        approve: (json: string) => AssembledTransaction<null>;
        decimals: (json: string) => AssembledTransaction<number>;
        name: (json: string) => AssembledTransaction<string>;
        symbol: (json: string) => AssembledTransaction<string>;
        burn: (json: string) => AssembledTransaction<null>;
        burn_from: (json: string) => AssembledTransaction<null>;
        mint: (json: string) => AssembledTransaction<null>;
    };
}
