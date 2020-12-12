import { IResolvers } from 'graphql-tools';
import { pubsub } from './pubsub';
import { withFilter } from 'graphql-subscriptions';
import api from './api';

const resolverMap: IResolvers = {
  Query: {
    channel: (_, args, context) => {
      return api.channels.find(args.id);
    },
    channelList: async (_, __, context) => {
      return api.channels.list();
    },
    userList: (_, __, context) => {
      return api.users.list();
    },
    channelLog: async (_, args, context) => {
      //const {id} = args;
      return await api.logs.list(args.id)
      //return logs.map((log:any) => ({...log, channelId:id}));
    },
  },
  Mutation: {
    registerUser: (_, args, context) => {
      const {name} = args;
      return api.users.add({name});
    },
    postMessage: async (_, args, context) => {
      const {channelId, userId, message} = args;
      const { userId: newUserId, ...rest } = await api.logs.add({channelId, message, userId});
      const log = {
        ...rest,
        user: { id: newUserId },
      }
      
      pubsub.publish('logAdded', log)
      return log;
    }
  },
  Subscription: {
    channelLog: {
      resolve: (payload) => {
        return payload;
      },
      subscribe: withFilter(() => pubsub.asyncIterator('logAdded'), (payload, variables) => {
        return payload.channelId === variables.id;
      }),
    }
  },
  
  Channel: {
    name: async (parent, _, context) => {
      const channel = await api.channels.find(parent.id);
      return channel?.name;
    }
  },
  User: {
    name: async (parent, _, context) => {
      const user = await api.users.find(parent.id);
      return user?.name;
    }
  },
  Log: {
    user: async (parent, _, context) => {
      const log = await api.logs.find(parent.channelId, parent.id);
      return {id: log?.userId};
    },
    message: async (parent, _, context) => {
      const log = await api.logs.find(parent.channelId, parent.id);
      return log?.message;
    },
    timestamp: async (parent, _, context) => {
      const log = await api.logs.find(parent.channelId, parent.id);
      return log?.timestamp;
    }
  }
};

export default resolverMap;