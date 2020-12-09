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
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var channels = [{
        name: "Channel 1",
        id: uuid_1.v4()
    }, {
        name: "Channel 2",
        id: uuid_1.v4()
    }, {
        name: "Channel 3",
        id: uuid_1.v4()
    }];
var users = [];
var logs = {};
var api = {
    channels: {
        list: function () { return channels; },
        find: function (id) { return channels.find(function (channel) { return channel.id === id; }); },
        add: function (channel) {
            var id = uuid_1.v4();
            var newChannel = __assign(__assign({}, channel), { id: id });
            channels.push(newChannel);
            return newChannel;
        }
    },
    users: {
        list: function () { return users; },
        find: function (id) { return users.find(function (user) { return user.id === id; }); },
        add: function (user) {
            var id = uuid_1.v4();
            var newUser = __assign(__assign({}, user), { id: id });
            users.push(newUser);
            return newUser;
        }
    },
    logs: {
        list: function (channelId) { return logs[channelId] || []; },
        find: function (channelId, id) { return (logs[channelId] || []).find(function (log) { return log.id === id; }); },
        add: function (channelId, log) {
            var id = uuid_1.v4();
            var timestamp = Date.now().toString();
            var channel = logs[channelId] || [];
            var newLog = __assign(__assign({}, log), { id: id, timestamp: timestamp });
            logs[channelId] = channel.concat([newLog]);
            return newLog;
        }
    }
};
exports.default = api;
