import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/minimal/contract';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const Errors = {
    /**
     * Error thrown when an unauthorized user attempts a restricted operation.
     */
    1: { message: "Unauthorized" },
    /**
     * The operation failed because the contract is paused.
     */
    100: { message: "EnforcedPause" },
    /**
     * The operation failed because the contract is not paused.
     */
    101: { message: "ExpectedPause" },
    /**
     * Indicates an error related to the current balance of account from which
     * tokens are expected to be transferred.
     */
    200: { message: "InsufficientBalance" },
    /**
     * Indicates a failure with the allowance mechanism when a given spender
     * doesn't have enough allowance.
     */
    201: { message: "InsufficientAllowance" },
    /**
     * Indicates an invalid value for `live_until_ledger` when setting an
     * allowance.
     */
    202: { message: "InvalidLiveUntilLedger" },
    /**
     * Indicates an error when an input that must be >= 0
     */
    203: { message: "LessThanZero" },
    /**
     * Indicates overflow when adding two values
     */
    204: { message: "MathOverflow" },
    /**
     * Indicates access to uninitialized metadata
     */
    205: { message: "UnsetMetadata" },
    /**
     * Indicates that the operation would have caused `total_supply` to exceed
     * the `cap`.
     */
    206: { message: "ExceededCap" },
    /**
     * Indicates the supplied `cap` is not a valid cap value.
     */
    207: { message: "InvalidCap" },
    /**
     * Indicates the Cap was not set.
     */
    208: { message: "CapNotSet" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { owner, name, symbol, decimals, initial_supply, cap }, 
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ owner, name, symbol, decimals, initial_supply, cap }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAABAAAAHZFcnJvciBjb2RlcyB1c2VkIHRocm91Z2hvdXQgdGhlIGNvbnRyYWN0LgoKRXJyb3JzIGFyZSByZXByZXNlbnRlZCBhcyB1MzIgdmFsdWVzIGZvciBlZmZpY2llbnQgZXJyb3IgaGFuZGxpbmcgb24tY2hhaW4uAAAAAAAAAAAAFEV4YW1wbGVDb250cmFjdEVycm9yAAAAAQAAAEdFcnJvciB0aHJvd24gd2hlbiBhbiB1bmF1dGhvcml6ZWQgdXNlciBhdHRlbXB0cyBhIHJlc3RyaWN0ZWQgb3BlcmF0aW9uLgAAAAAMVW5hdXRob3JpemVkAAAAAQ==",
            "AAAAAAAAAp5Jbml0aWFsaXplcyBhIG5ldyB0b2tlbiB3aXRoIGFsbCBuZWNlc3NhcnkgcGFyYW1ldGVycy4KClRoaXMgY29uc3RydWN0b3Igc2V0cyB1cCB0aGUgdG9rZW4gd2l0aCBpdHMgbWV0YWRhdGEsIGluaXRpYWwgc3VwcGx5LAphbmQgbWF4aW11bSBjYXAuIEl0J3MgY2FsbGVkIG9uY2Ugd2hlbiB0aGUgY29udHJhY3QgaXMgZGVwbG95ZWQuCgojIEFyZ3VtZW50cwoKKiBgb3duZXJgIC0gVGhlIGFkZHJlc3MgdGhhdCB3aWxsIG93biB0aGUgY29udHJhY3QgYW5kIGhhdmUgc3BlY2lhbCBwZXJtaXNzaW9ucwoqIGBuYW1lYCAtIFRoZSBodW1hbi1yZWFkYWJsZSBuYW1lIG9mIHRoZSB0b2tlbgoqIGBzeW1ib2xgIC0gVGhlIHRva2VuIHN5bWJvbCAoZS5nLiwgIlRLTiIpCiogYGRlY2ltYWxzYCAtIE51bWJlciBvZiBkZWNpbWFsIHBsYWNlcyB0aGUgdG9rZW4gdXNlcyAobWF4IDE4KQoqIGBpbml0aWFsX3N1cHBseWAgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBpbml0aWFsbHkgbWludCB0byB0aGUgb3duZXIKKiBgY2FwYCAtIFRoZSBtYXhpbXVtIHRvdGFsIHN1cHBseSB0aGUgdG9rZW4gY2FuIGV2ZXIgaGF2ZQoKIyBFcnJvcnMKCiogUGFuaWNzIGlmIGRlY2ltYWxzIGlzIGdyZWF0ZXIgdGhhbiAxOAoqIFBhbmljcyBpZiBpbml0aWFsX3N1cHBseSBpcyBncmVhdGVyIHRoYW4gY2FwAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAYAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAEbmFtZQAAABAAAAAAAAAABnN5bWJvbAAAAAAAEAAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAAAAAA5pbml0aWFsX3N1cHBseQAAAAAACwAAAAAAAAADY2FwAAAAAAsAAAAA",
            "AAAAAAAAALFDaGVja3MgaWYgdGhlIGNvbnRyYWN0IGlzIGN1cnJlbnRseSBwYXVzZWQuCgpSZXR1cm5zIGEgYm9vbGVhbiBpbmRpY2F0aW5nIHRoZSBwYXVzZSBzdGF0ZSBvZiB0aGUgY29udHJhY3QuCgojIFJldHVybnMKCiogYGJvb2xgIC0gdHJ1ZSBpZiB0aGUgY29udHJhY3QgaXMgcGF1c2VkLCBmYWxzZSBvdGhlcndpc2UAAAAAAAAGcGF1c2VkAAAAAAAAAAAAAQAAAAE=",
            "AAAAAAAAAV1QYXVzZXMgYWxsIHRva2VuIG9wZXJhdGlvbnMgbWFya2VkIHdpdGggI1t3aGVuX25vdF9wYXVzZWRdLgoKVGhpcyBpcyBhbiBlbWVyZ2VuY3kgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmcmVlemUgdG9rZW4gdHJhbnNmZXJzCmFuZCBvdGhlciBvcGVyYXRpb25zIGlmIGEgc2VjdXJpdHkgaXNzdWUgaXMgZGlzY292ZXJlZC4KCiMgQXJndW1lbnRzCgoqIGBjYWxsZXJgIC0gVGhlIGFkZHJlc3MgYXR0ZW1wdGluZyB0byBwYXVzZSB0aGUgY29udHJhY3QKCiMgRXJyb3JzCgoqIGBFeGFtcGxlQ29udHJhY3RFcnJvcjo6VW5hdXRob3JpemVkYCAtIElmIGNhbGxlciBpcyBub3QgdGhlIGNvbnRyYWN0IG93bmVyAAAAAAAABXBhdXNlAAAAAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
            "AAAAAAAAASJVbnBhdXNlcyB0aGUgY29udHJhY3QsIHJlc3RvcmluZyBub3JtYWwgb3BlcmF0aW9uLgoKUmUtZW5hYmxlcyBhbGwgZnVuY3Rpb25hbGl0eSB0aGF0IHdhcyBkaXNhYmxlZCB3aGVuIHRoZSBjb250cmFjdCB3YXMgcGF1c2VkLgoKIyBBcmd1bWVudHMKCiogYGNhbGxlcmAgLSBUaGUgYWRkcmVzcyBhdHRlbXB0aW5nIHRvIHVucGF1c2UgdGhlIGNvbnRyYWN0CgojIEVycm9ycwoKKiBgRXhhbXBsZUNvbnRyYWN0RXJyb3I6OlVuYXV0aG9yaXplZGAgLSBJZiBjYWxsZXIgaXMgbm90IHRoZSBjb250cmFjdCBvd25lcgAAAAAAB3VucGF1c2UAAAAAAQAAAAAAAAAGY2FsbGVyAAAAAAATAAAAAA==",
            "AAAAAAAAAGRSZXR1cm5zIHRoZSB0b3RhbCBudW1iZXIgb2YgdG9rZW5zIGluIGNpcmN1bGF0aW9uLgoKIyBSZXR1cm5zCgoqIGBpMTI4YCAtIFRoZSB0b3RhbCBzdXBwbHkgb2YgdG9rZW5zAAAADHRvdGFsX3N1cHBseQAAAAAAAAABAAAACw==",
            "AAAAAAAAAK9HZXRzIHRoZSB0b2tlbiBiYWxhbmNlIG9mIGEgc3BlY2lmaWMgYWNjb3VudC4KCiMgQXJndW1lbnRzCgoqIGBhY2NvdW50YCAtIFRoZSBhZGRyZXNzIHRvIGNoZWNrIHRoZSBiYWxhbmNlIG9mCgojIFJldHVybnMKCiogYGkxMjhgIC0gVGhlIHRva2VuIGJhbGFuY2Ugb2YgdGhlIHNwZWNpZmllZCBhY2NvdW50AAAAAAdiYWxhbmNlAAAAAAEAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAL",
            "AAAAAAAAAOxHZXRzIHRoZSBhbW91bnQgb2YgdG9rZW5zIHRoYXQgYSBzcGVuZGVyIGlzIGFsbG93ZWQgdG8gd2l0aGRyYXcgZnJvbSBhbiBvd25lci4KCiMgQXJndW1lbnRzCgoqIGBvd25lcmAgLSBUaGUgYWRkcmVzcyB0aGF0IG93bnMgdGhlIHRva2VucwoqIGBzcGVuZGVyYCAtIFRoZSBhZGRyZXNzIHRoYXQgY2FuIHNwZW5kIHRoZSB0b2tlbnMKCiMgUmV0dXJucwoKKiBgaTEyOGAgLSBUaGUgcmVtYWluaW5nIGFsbG93YW5jZQAAAAlhbGxvd2FuY2UAAAAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAEAAAAL",
            "AAAAAAAAAdNUcmFuc2ZlcnMgdG9rZW5zIGZyb20gb25lIGFjY291bnQgdG8gYW5vdGhlci4KClRoZSBzZW5kZXIgbXVzdCBoYXZlIHN1ZmZpY2llbnQgYmFsYW5jZSBhbmQgbXVzdCBhdXRob3JpemUgdGhlIHRyYW5zYWN0aW9uLgpUaGlzIGZ1bmN0aW9uIGlzIHByb3RlY3RlZCBieSB0aGUgcGF1c2UgbWVjaGFuaXNtLgoKIyBBcmd1bWVudHMKCiogYGZyb21gIC0gVGhlIGFkZHJlc3MgdG8gdHJhbnNmZXIgdG9rZW5zIGZyb20KKiBgdG9gIC0gVGhlIGFkZHJlc3MgdG8gdHJhbnNmZXIgdG9rZW5zIHRvCiogYGFtb3VudGAgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byB0cmFuc2ZlcgoKIyBFcnJvcnMKCiogUGFuaWNzIGlmIHRoZSBjb250cmFjdCBpcyBwYXVzZWQKKiBQYW5pY3MgaWYgYGZyb21gIGhhcyBpbnN1ZmZpY2llbnQgYmFsYW5jZQoqIFBhbmljcyBpZiBgZnJvbWAgZG9lcyBub3QgYXV0aG9yaXplIHRoZSB0cmFuc2FjdGlvbgAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAAAAAjJUcmFuc2ZlcnMgdG9rZW5zIG9uIGJlaGFsZiBvZiBhbm90aGVyIGFjY291bnQuCgpUaGUgc3BlbmRlciBtdXN0IGhhdmUgc3VmZmljaWVudCBhbGxvd2FuY2UgZnJvbSB0aGUgdG9rZW4gb3duZXIuClRoaXMgZnVuY3Rpb24gaXMgcHJvdGVjdGVkIGJ5IHRoZSBwYXVzZSBtZWNoYW5pc20uCgojIEFyZ3VtZW50cwoKKiBgc3BlbmRlcmAgLSBUaGUgYWRkcmVzcyBhdXRob3JpemVkIHRvIHNwZW5kIHRva2VucwoqIGBmcm9tYCAtIFRoZSBhZGRyZXNzIHRvIHRyYW5zZmVyIHRva2VucyBmcm9tCiogYHRvYCAtIFRoZSBhZGRyZXNzIHRvIHRyYW5zZmVyIHRva2VucyB0bwoqIGBhbW91bnRgIC0gVGhlIGFtb3VudCBvZiB0b2tlbnMgdG8gdHJhbnNmZXIKCiMgRXJyb3JzCgoqIFBhbmljcyBpZiB0aGUgY29udHJhY3QgaXMgcGF1c2VkCiogUGFuaWNzIGlmIGBzcGVuZGVyYCBoYXMgaW5zdWZmaWNpZW50IGFsbG93YW5jZQoqIFBhbmljcyBpZiBgZnJvbWAgaGFzIGluc3VmZmljaWVudCBiYWxhbmNlCiogUGFuaWNzIGlmIGBzcGVuZGVyYCBkb2VzIG5vdCBhdXRob3JpemUgdGhlIHRyYW5zYWN0aW9uAAAAAAANdHJhbnNmZXJfZnJvbQAAAAAAAAQAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAcJBcHByb3ZlcyBhIHNwZW5kZXIgdG8gd2l0aGRyYXcgZnJvbSB0aGUgY2FsbGVyJ3MgYWNjb3VudC4KClNldHMgdGhlIGFtb3VudCBvZiB0b2tlbnMgdGhhdCBhIHNwZW5kZXIgY2FuIHdpdGhkcmF3IGZyb20gdGhlIG93bmVyJ3MgYWNjb3VudC4KCiMgQXJndW1lbnRzCgoqIGBvd25lcmAgLSBUaGUgYWRkcmVzcyB0aGF0IG93bnMgdGhlIHRva2VucwoqIGBzcGVuZGVyYCAtIFRoZSBhZGRyZXNzIHRoYXQgY2FuIHNwZW5kIHRoZSB0b2tlbnMKKiBgYW1vdW50YCAtIFRoZSBtYXhpbXVtIGFtb3VudCB0aGF0IGNhbiBiZSBzcGVudAoqIGBsaXZlX3VudGlsX2xlZGdlcmAgLSBUaGUgbGVkZ2VyIHNlcXVlbmNlIG51bWJlciB1bnRpbCB3aGljaCB0aGUgYXBwcm92YWwgaXMgdmFsaWQKCiMgRXJyb3JzCgoqIFBhbmljcyBpZiBgb3duZXJgIGRvZXMgbm90IGF1dGhvcml6ZSB0aGUgdHJhbnNhY3Rpb24AAAAAAAdhcHByb3ZlAAAAAAQAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWxpdmVfdW50aWxfbGVkZ2VyAAAAAAAABAAAAAA=",
            "AAAAAAAAAGpSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgdXNlZCBieSB0aGUgdG9rZW4uCgojIFJldHVybnMKCiogYHUzMmAgLSBUaGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAAFxSZXR1cm5zIHRoZSBodW1hbi1yZWFkYWJsZSBuYW1lIG9mIHRoZSB0b2tlbi4KCiMgUmV0dXJucwoKKiBgU3RyaW5nYCAtIFRoZSBuYW1lIG9mIHRoZSB0b2tlbgAAAARuYW1lAAAAAAAAAAEAAAAQ",
            "AAAAAAAAAFhSZXR1cm5zIHRoZSB0b2tlbiBzeW1ib2wuCgojIFJldHVybnMKCiogYFN0cmluZ2AgLSBUaGUgc3ltYm9sIG9mIHRoZSB0b2tlbiAoZS5nLiwgIlRLTiIpAAAABnN5bWJvbAAAAAAAAAAAAAEAAAAQ",
            "AAAAAAAAAZZCdXJucyAoZGVzdHJveXMpIHRva2VucyBmcm9tIGFuIGFjY291bnQuCgpUaGUgYWNjb3VudCBtdXN0IGF1dGhvcml6ZSB0aGlzIG9wZXJhdGlvbiBhbmQgaGF2ZSBzdWZmaWNpZW50IGJhbGFuY2UuClRoaXMgZnVuY3Rpb24gaXMgcHJvdGVjdGVkIGJ5IHRoZSBwYXVzZSBtZWNoYW5pc20uCgojIEFyZ3VtZW50cwoKKiBgZnJvbWAgLSBUaGUgYWRkcmVzcyB0byBidXJuIHRva2VucyBmcm9tCiogYGFtb3VudGAgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBidXJuCgojIEVycm9ycwoKKiBQYW5pY3MgaWYgdGhlIGNvbnRyYWN0IGlzIHBhdXNlZAoqIFBhbmljcyBpZiBgZnJvbWAgaGFzIGluc3VmZmljaWVudCBiYWxhbmNlCiogUGFuaWNzIGlmIGBmcm9tYCBkb2VzIG5vdCBhdXRob3JpemUgdGhlIHRyYW5zYWN0aW9uAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAgBCdXJucyB0b2tlbnMgZnJvbSBhbiBhY2NvdW50IHVzaW5nIGFuIGFsbG93YW5jZS4KClRoZSBzcGVuZGVyIG11c3QgaGF2ZSBzdWZmaWNpZW50IGFsbG93YW5jZSBmcm9tIHRoZSB0b2tlbiBvd25lci4KVGhpcyBmdW5jdGlvbiBpcyBwcm90ZWN0ZWQgYnkgdGhlIHBhdXNlIG1lY2hhbmlzbS4KCiMgQXJndW1lbnRzCgoqIGBzcGVuZGVyYCAtIFRoZSBhZGRyZXNzIGF1dGhvcml6ZWQgdG8gYnVybiB0b2tlbnMKKiBgZnJvbWAgLSBUaGUgYWRkcmVzcyB0byBidXJuIHRva2VucyBmcm9tCiogYGFtb3VudGAgLSBUaGUgYW1vdW50IG9mIHRva2VucyB0byBidXJuCgojIEVycm9ycwoKKiBQYW5pY3MgaWYgdGhlIGNvbnRyYWN0IGlzIHBhdXNlZAoqIFBhbmljcyBpZiBgc3BlbmRlcmAgaGFzIGluc3VmZmljaWVudCBhbGxvd2FuY2UKKiBQYW5pY3MgaWYgYGZyb21gIGhhcyBpbnN1ZmZpY2llbnQgYmFsYW5jZQoqIFBhbmljcyBpZiBgc3BlbmRlcmAgZG9lcyBub3QgYXV0aG9yaXplIHRoZSB0cmFuc2FjdGlvbgAAAAlidXJuX2Zyb20AAAAAAAADAAAAAAAAAAdzcGVuZGVyAAAAABMAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAddDcmVhdGVzIG5ldyB0b2tlbnMgYW5kIGFzc2lnbnMgdGhlbSB0byBhIHNwZWNpZmllZCBhY2NvdW50LgoKVGhpcyBmdW5jdGlvbiBjYW4gb25seSBiZSBjYWxsZWQgYnkgdGhlIGNvbnRyYWN0IG93bmVyIGFuZCB3aWxsIGZhaWwKaWYgdGhlIGNhcCB3b3VsZCBiZSBleGNlZWRlZC4gVGhpcyBmdW5jdGlvbiBpcyBwcm90ZWN0ZWQgYnkgdGhlIHBhdXNlIG1lY2hhbmlzbS4KCiMgQXJndW1lbnRzCgoqIGBhY2NvdW50YCAtIFRoZSBhZGRyZXNzIHRvIHJlY2VpdmUgdGhlIG5ld2x5IG1pbnRlZCB0b2tlbnMKKiBgYW1vdW50YCAtIFRoZSBhbW91bnQgb2YgdG9rZW5zIHRvIG1pbnQKCiMgRXJyb3JzCgoqIFBhbmljcyBpZiB0aGUgY29udHJhY3QgaXMgcGF1c2VkCiogUGFuaWNzIGlmIGNhbGxlciBpcyBub3QgdGhlIGNvbnRyYWN0IG93bmVyCiogUGFuaWNzIGlmIHRoZSBvcGVyYXRpb24gd291bGQgZXhjZWVkIHRoZSB0b2tlbiBjYXAAAAAABG1pbnQAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
            "AAAAAQAAACRTdG9yYWdlIGNvbnRhaW5lciBmb3IgdG9rZW4gbWV0YWRhdGEAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ",
            "AAAABAAAAAAAAAAAAAAAEkZ1bmdpYmxlVG9rZW5FcnJvcgAAAAAACQAAAG5JbmRpY2F0ZXMgYW4gZXJyb3IgcmVsYXRlZCB0byB0aGUgY3VycmVudCBiYWxhbmNlIG9mIGFjY291bnQgZnJvbSB3aGljaAp0b2tlbnMgYXJlIGV4cGVjdGVkIHRvIGJlIHRyYW5zZmVycmVkLgAAAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAAyAAAAGRJbmRpY2F0ZXMgYSBmYWlsdXJlIHdpdGggdGhlIGFsbG93YW5jZSBtZWNoYW5pc20gd2hlbiBhIGdpdmVuIHNwZW5kZXIKZG9lc24ndCBoYXZlIGVub3VnaCBhbGxvd2FuY2UuAAAAFUluc3VmZmljaWVudEFsbG93YW5jZQAAAAAAAMkAAABNSW5kaWNhdGVzIGFuIGludmFsaWQgdmFsdWUgZm9yIGBsaXZlX3VudGlsX2xlZGdlcmAgd2hlbiBzZXR0aW5nIGFuCmFsbG93YW5jZS4AAAAAAAAWSW52YWxpZExpdmVVbnRpbExlZGdlcgAAAAAAygAAADJJbmRpY2F0ZXMgYW4gZXJyb3Igd2hlbiBhbiBpbnB1dCB0aGF0IG11c3QgYmUgPj0gMAAAAAAADExlc3NUaGFuWmVybwAAAMsAAAApSW5kaWNhdGVzIG92ZXJmbG93IHdoZW4gYWRkaW5nIHR3byB2YWx1ZXMAAAAAAAAMTWF0aE92ZXJmbG93AAAAzAAAACpJbmRpY2F0ZXMgYWNjZXNzIHRvIHVuaW5pdGlhbGl6ZWQgbWV0YWRhdGEAAAAAAA1VbnNldE1ldGFkYXRhAAAAAAAAzQAAAFJJbmRpY2F0ZXMgdGhhdCB0aGUgb3BlcmF0aW9uIHdvdWxkIGhhdmUgY2F1c2VkIGB0b3RhbF9zdXBwbHlgIHRvIGV4Y2VlZAp0aGUgYGNhcGAuAAAAAAALRXhjZWVkZWRDYXAAAAAAzgAAADZJbmRpY2F0ZXMgdGhlIHN1cHBsaWVkIGBjYXBgIGlzIG5vdCBhIHZhbGlkIGNhcCB2YWx1ZS4AAAAAAApJbnZhbGlkQ2FwAAAAAADPAAAAHkluZGljYXRlcyB0aGUgQ2FwIHdhcyBub3Qgc2V0LgAAAAAACUNhcE5vdFNldAAAAAAAANA=",
            "AAAAAQAAACpTdG9yYWdlIGtleSB0aGF0IG1hcHMgdG8gW2BBbGxvd2FuY2VEYXRhYF0AAAAAAAAAAAAMQWxsb3dhbmNlS2V5AAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdzcGVuZGVyAAAAABM=",
            "AAAAAQAAAINTdG9yYWdlIGNvbnRhaW5lciBmb3IgdGhlIGFtb3VudCBvZiB0b2tlbnMgZm9yIHdoaWNoIGFuIGFsbG93YW5jZSBpcyBncmFudGVkCmFuZCB0aGUgbGVkZ2VyIG51bWJlciBhdCB3aGljaCB0aGlzIGFsbG93YW5jZSBleHBpcmVzLgAAAAAAAAAADUFsbG93YW5jZURhdGEAAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWxpdmVfdW50aWxfbGVkZ2VyAAAAAAAABA==",
            "AAAAAgAAADlTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgRnVuZ2libGVUb2tlbmAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAMAAAAAAAAAAAAAAAtUb3RhbFN1cHBseQAAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAJQWxsb3dhbmNlAAAAAAAAAQAAB9AAAAAMQWxsb3dhbmNlS2V5",
            "AAAABAAAAAAAAAAAAAAADVBhdXNhYmxlRXJyb3IAAAAAAAACAAAANFRoZSBvcGVyYXRpb24gZmFpbGVkIGJlY2F1c2UgdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAANRW5mb3JjZWRQYXVzZQAAAAAAAGQAAAA4VGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgY29udHJhY3QgaXMgbm90IHBhdXNlZC4AAAANRXhwZWN0ZWRQYXVzZQAAAAAAAGU="]), options);
        this.options = options;
    }
    fromJSON = {
        paused: (this.txFromJSON),
        pause: (this.txFromJSON),
        unpause: (this.txFromJSON),
        total_supply: (this.txFromJSON),
        balance: (this.txFromJSON),
        allowance: (this.txFromJSON),
        transfer: (this.txFromJSON),
        transfer_from: (this.txFromJSON),
        approve: (this.txFromJSON),
        decimals: (this.txFromJSON),
        name: (this.txFromJSON),
        symbol: (this.txFromJSON),
        burn: (this.txFromJSON),
        burn_from: (this.txFromJSON),
        mint: (this.txFromJSON)
    };
}
