"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pubsub_1 = require("./pubsub");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var api_1 = __importDefault(require("./api"));
var resolverMap = {
    Query: {
        channel: function (_, args, context) {
            return api_1.default.channels.find(args.id);
        },
        channelList: function (_, __, context) {
            return api_1.default.channels.list();
        },
        userList: function (_, __, context) {
            return api_1.default.users.list();
        },
        channelLog: function (_, args, context) {
            var id = args.id;
            return api_1.default.logs.list(id).map(function (log) { return (__assign(__assign({}, log), { channelId: id })); });
        },
    },
    Mutation: {
        registerUser: function (_, args, context) {
            var name = args.name;
            return api_1.default.users.add({ name: name });
        },
        postMessage: function (_, args, context) {
            var channelId = args.channelId, userId = args.userId, message = args.message;
            var _a = api_1.default.logs.add(channelId, { userId: userId, message: message }), newUserId = _a.userId, rest = __rest(_a, ["userId"]);
            var log = __assign(__assign({}, rest), { channelId: channelId, user: { id: newUserId } });
            pubsub_1.pubsub.publish('logAdded', log);
            return log;
        }
    },
    Subscription: {
        channelLog: {
            resolve: function (payload) {
                return payload;
            },
            subscribe: graphql_subscriptions_1.withFilter(function () { return pubsub_1.pubsub.asyncIterator('logAdded'); }, function (payload, variables) {
                return payload.channelId === variables.id;
            }),
        }
    },
    Channel: {
        name: function (parent, _, context) {
            var channel = api_1.default.channels.find(parent.id);
            return channel === null || channel === void 0 ? void 0 : channel.name;
        }
    },
    User: {
        name: function (parent, _, context) {
            var user = api_1.default.users.find(parent.id);
            return user === null || user === void 0 ? void 0 : user.name;
        }
    },
    Log: {
        user: function (parent, _, context) {
            var log = api_1.default.logs.find(parent.channelId, parent.id);
            return { id: log === null || log === void 0 ? void 0 : log.userId };
        },
        message: function (parent, _, context) {
            var log = api_1.default.logs.find(parent.channelId, parent.id);
            return log === null || log === void 0 ? void 0 : log.message;
        },
        timestamp: function (parent, _, context) {
            var log = api_1.default.logs.find(parent.channelId, parent.id);
            return log === null || log === void 0 ? void 0 : log.timestamp;
        }
    }
};
exports.default = resolverMap;
