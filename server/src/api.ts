import { v4 as uuidv4, v4 } from 'uuid';

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
    userId: string
    message: string
    timestamp: string
}

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
const logs: {[key: string] : Log[]} = {};

const api = {
    channels: {
        list: () => channels,
        find: (id:string) => channels.find(channel => channel.id === id),
        add: (channel: Omit<Channel, "id">) => {
            const id = v4();
            const newChannel = {...channel, id};
            channels.push(newChannel);
            return newChannel;
        }
    },
    users: {
        list: () => users,
        find: (id:string) => users.find(user => user.id === id),
        add: (user: Omit<User, "id">) => {
            const id = v4();
            const newUser = {...user, id};
            users.push(newUser);
            return newUser;
        }
    },
    logs: {
        list: (channelId:string) => logs[channelId] || [],
        find: (channelId:string, id:string) => (logs[channelId] || []).find(log => log.id === id),
        add: (channelId:string, log: Omit<Log, "id"|"timestamp">) => {
            const id = v4();
            const timestamp = Date.now().toString();
            const channel = logs[channelId] || [];
            const newLog = {...log, id, timestamp};
            logs[channelId] = channel.concat([newLog]);
            return newLog
        }
    }
};

export default api;