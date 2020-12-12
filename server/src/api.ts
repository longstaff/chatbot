import { v4 as uuidv4, v4 } from 'uuid';
import * as queries from './postgreQueries';
import {query} from './postgre'

type Channel = {
    id: string
    name: string
}
type User = {
    id: string
    name: string
}
type Log = {
    id: string
    channelId: string
    userId: string
    message: string
    timestamp: string
}

/*
const channels: Channel[] = [{
    name: "Channel 1",
    id: v4()
}, {
    name: "Channel 2",
    id: v4()
}, {
    name: "Channel 3",
    id: v4()
}];
const users: User[] = [];
*/
const logs: {[key: string] : Log[]} = {};

const api: any = {
    channels: {
        list: async () => {
            const list = await query(queries.channelList);
            return list.rows;
        },
        find: async (id:string) => {
            const list = await query(queries.channelSearch, [id]);
            return list.rows?.[0];
        }
    },
    users: {
        list: async () => {
            const list = await query(queries.userList);
            return list.rows;
        },
        find: async (id:string) =>  {
            const list = await query(queries.userSearch, [id]);
            return list.rows?.[0];
        },
        add: async (user: Omit<User, "id">) => {
            const id = v4();
            const newUser = {...user, id};
            const add = await query(queries.userInsert, [id, user.name]);
            return newUser;
        }
    },
    logs: {
        list: async (channelId:string) => {
            const list = await query(queries.logList, [channelId]);
            return list.rows.map(log => ({
                id: log.id,
                channelId: log.channelid,
                userId: log.userid,
                message: log.message,
                timestamp: log.timestamp
            }));
        },
        find: async (channelId:string, id:string) => {
            const list = await query(queries.logSearch, [channelId, id]);
            return {
                id: list.rows[0].id,
                channelId: list.rows[0].channelid,
                userId: list.rows[0].userid,
                message: list.rows[0].message,
                timestamp: list.rows[0].timestamp
            };
        },
        add: async (log: Omit<Log, "id"|"timestamp">) => {
            const id = v4();
            const timestamp = Date.now().toString();
            
            await query(queries.logInsert, [id, log.channelId, log.userId, log.message, timestamp]);
            const newLog = {...log, id, timestamp};
            return newLog
        }
    }
};

export default api;