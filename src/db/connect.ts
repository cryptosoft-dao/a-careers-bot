import * as fs from 'fs'

import { Client, 
    ClientConfig, 
    Pool, 
    PoolConfig } from 'pg'

export class MySql {
    private host = 'db-postgresql-nyc3-43333-do-user-14640609-0.b.db.ondigitalocean.com'

    private user = 'doadmin'

    private password = 'AVNS_vg-xd9srMK1qq7-Ig79'

    private database = 'test'

    private port = 25061

    private connection: Pool

    private config = {
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database,
        port: this.port,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: {
            rejectUnauthorized: false,
            cert: fs.readFileSync('./ca-certificate.crt').toString()
        }
    }

    private client: Client

    constructor () {
        const pool = new Pool(this.config)
        // now get a Promise wrapped instance of that pool
        this.connection = pool

        this.client = new Client(this.config)

        // console.log('connected')
    }

    public async sync (): Promise<MySql> {
        this.client.connect((err) => {
            if (err) {
                console.error('error connecting', err.stack)
            } else {
                console.log('connected')
                this.client.end()
            }
        })

        await this.client.connect(() => {
            // console.error('error connecting', err.stack)
            // throw Error()
        })

        this.connection.connect()
        console.log('synced')
        // this.connection.connect()

        // this.connection.query('USE bot').then((_data) => {
        //     console.log(_data.rows[0])
        // })

        // const client = await this.connection.connect()
        // await client.query('SET GLOBAL connect_timeout=28800')
        // await this.connection.query('SET GLOBAL wait_timeout=28800')
        // await this.connection.query('SET GLOBAL interactive_timeout=28800')
        // console.log('synced')
        return this
    }

    public get pool (): Pool {
        return this.connection
    }
}
