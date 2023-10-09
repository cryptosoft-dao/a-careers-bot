import { Pool, QueryResult } from 'pg'

interface User {
    id: number,
    username: string | undefined,
    id_telegram: number,
    address: string,
}

interface User2 {
    id: number,
    username: string | undefined,
    id_telegram: number,
    pay: number,
}


function getCurrentUnixTimestamp () {
    return Math.floor(Date.now() / 1000)
}

export class DB {
    private pool: Pool

    constructor (_pool: Pool) {
        this.pool = _pool
    }

    public async addUser (_user: User): Promise<any> {
        const res = await this.pool.query(
            `INSERT INTO users 
            (username, id_telegram )
            VALUES 
            ($1, $2);`,
            [ _user.username, _user.id_telegram ]
        )
        return res.rows[0]
    }

    public async addUser2 (_user: User2): Promise<any> {
        const res = await this.pool.query(
            `INSERT INTO users2 
            (username, id_telegram )
            VALUES 
            ($1, $2);`,
            [ _user.username, _user.id_telegram ]
        )
        return res.rows[0]
    }


    public async getUser (id_telegram: number): Promise<User> {
        const query = {
            text: 'SELECT * FROM users WHERE id_telegram = $1',
            values: [ id_telegram ]
        }
        const res = await this.pool.query(query)
        return res.rows[0]
    }

    public async getUser2 (id_telegram: number): Promise<User2> {
        const query = {
            text: 'SELECT * FROM users2 WHERE id_telegram = $1',
            values: [ id_telegram ]
        }
        const res = await this.pool.query(query)
        return res.rows[0]
    }

    public async getUser2FromUserName (username: string): Promise<User2> {
        const query = {
            text: 'SELECT * FROM users2 WHERE username = $1',
            values: [ username ]
        }
        const res = await this.pool.query(query)
        return res.rows[0]
    }

    public async getAllUsers2 (): Promise<User2[]> {
        const query = {
            text: 'SELECT * FROM users2 WHERE true ORDER BY pay DESC',
            values: [ ]
        }
        const res = await this.pool.query(query)
        return res.rows
    }

    public async getUserFromAddress (address: string): Promise<User> {
        const query = {
            text: 'SELECT * FROM users WHERE address = $1',
            values: [ address ]
        }
        const res = await this.pool.query(query)
        return res.rows[0]
    }

    public async updateUserAddress (id_telegram: number, address: string): Promise<User> {
        const query = {
            text: 'UPDATE users SET address = $1 WHERE id_telegram = $2',
            values: [ address, id_telegram ]
        }
        const res = await this.pool.query(query)
        return res.rows[0]
    }

    public async updateUserPayFromUsername (username: string): Promise<User> {
        const query = {
            text: 'UPDATE users2 SET pay = 1 WHERE username = $1',
            values: [ username ]
        }
        const res = await this.pool.query(query)
        return res.rows[0]
    }

    public async updateUserPayFromId (id_telegram: number): Promise<User> {
        const query = {
            text: 'UPDATE users2 SET pay = 1 WHERE id_telegram = $1',
            values: [ id_telegram ]
        }
        const res = await this.pool.query(query)
        return res.rows[0]
    }
}

export type { User, User2 }
