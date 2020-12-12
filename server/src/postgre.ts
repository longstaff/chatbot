import { Pool, QueryResult } from 'pg';
import * as queries from './postgreQueries';

let pool:Pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'thisShouldBeInASecretManager',
    database: 'postgres',
});

export const query = async (query: string, args?: string[]) : Promise<QueryResult<any>> => {
    return  pool.query(query, args);
}

export const init = async () => pool.query(queries.initTables);

export const drain = () => {
    return pool.end();
}