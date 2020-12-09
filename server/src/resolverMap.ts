import { IResolvers } from 'graphql-tools';
import { pubsub } from './pubsub';
import { withFilter } from 'graphql-subscriptions';
import api from './api';

const resolverMap: IResolvers = {
  Query: {
    channel: (_, args, context) => {
      return api.channels.find(args.id);
    },
    channelList: (_, __, context) => {
      return api.channels.list();
    },
    userList: (_, __, context) => {
      return api.users.list();
    },
    channelLog: (_, args, context) => {
      const {id} = args;
      return api.logs.list(id).map((log:any) => ({...log, channelId:id}));
    },
  },
  Mutation: {
    registerUser: (_, args, context) => {
      const {name} = args;
      return api.users.add({name});
    },
    postMessage: (_, args, context) => {
      const {channelId, userId, message} = args;
      const { userId: newUserId, ...rest } = api.logs.add(channelId, {userId, message});
      const log = {
        ...rest,
        channelId,
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
    name: (parent, _, context) => {
      const channel = api.channels.find(parent.id);
      return channel?.name;
    }
  },
  User: {
    name: (parent, _, context) => {
      const user = api.users.find(parent.id);
      return user?.name;
    }
  },
  Log: {
    user: (parent, _, context) => {
      const log = api.logs.find(parent.channelId, parent.id);
      return {id: log?.userId};
    },
    message: (parent, _, context) => {
      const log = api.logs.find(parent.channelId, parent.id);
      return log?.message;
    },
    timestamp: (parent, _, context) => {
      const log = api.logs.find(parent.channelId, parent.id);
      return log?.timestamp;
    }
  }
};

export default resolverMap;