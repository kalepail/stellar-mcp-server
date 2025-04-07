import { Address, Keypair } from "@stellar/stellar-sdk/minimal";
import { DurableObject } from "cloudflare:workers";

export class StellarMCPStore extends DurableObject<Env> {
    sql: SqlStorage

    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
        this.sql = ctx.storage.sql;

        this.ctx.blockConcurrencyWhile(async () => {
            await this.createTables();
        });
    }

    private async createTables() {
        this.ctx.storage.sql.exec(`
			CREATE TABLE IF NOT EXISTS addresses(
				login		STRING PRIMARY KEY,
				address  	STRING,
                sk          STRING
			)
		`);

        this.ctx.storage.sql.exec(`
            CREATE TABLE IF NOT EXISTS contracts(
                login        STRING,
                name         STRING,
                address      STRING,
                UNIQUE (login, address)
            )
        `);
    }

    public dropTables() {
        this.ctx.storage.sql.exec(`
            Drop TABLE IF EXISTS addresses;
        `);

        this.ctx.storage.sql.exec(`
            Drop TABLE IF EXISTS contracts;
        `);
    }

    public addContract(login: string, name: string, address: string) {
        const contract = new Address(address).toString();

        this.ctx.storage.sql.exec(`
            INSERT OR IGNORE INTO contracts (login, name, address) VALUES
            (?1, ?2, ?3);
        `, login, name, contract);
    }

    public removeContract(login: string, address: string) {
        const contract = new Address(address).toString();

        this.ctx.storage.sql.exec(`
            DELETE FROM contracts WHERE login = ?1 AND address = ?2
        `, login, contract);
    }

    public getContracts(login: string) {
        return this.ctx.storage.sql.exec(`
            SELECT name, address FROM contracts WHERE login = ?1
        `, login).toArray().map((row) => [row.name, row.address] as [string, string]);
    }

    public setAddress(login: string, wallet: string) {
        const address = new Address(wallet).toString();

        this.ctx.storage.sql.exec(`
            INSERT OR IGNORE INTO addresses (login, address, sk) VALUES
            (?1, ?2, ?3);
        `, login, address, Keypair.random().secret());
    }

    public getAddress(login: string) {
        const { address, sk } = this.ctx.storage.sql.exec(`
            SELECT address, sk FROM addresses WHERE login = ?1
        `, login).one();

        return [address, sk] as [string, string];
    }
}