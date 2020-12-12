import { gql } from "@apollo/client/core";

export const REGISTER_USER = gql`
  mutation registerUser($name: String!) {
    registerUser(name: $name) {
      id
      name
    }
  }
`;
export const ADD_LOG = gql`
  mutation addLog($channelId: String!, $userId: String!, $message: String!) {
    postMessage(userId: $userId, channelId: $channelId, message: $message) {
      id
      message
      user {
        id
        name
      }
    }
  }
`;

export const GET_CHANNELS = gql`
  query channels {
    channelList {
      id
      name
    }
  }
`;
export const GET_CHANNEL = gql`
  query channel($id: String!) {
    channel(id: $id) {
      id
      name
    }
  }
`;
export const GET_LOGS = gql`
  query channelLog($id: String!) {
    channelLog(id: $id) {
      id
      message
      user {
        id
        name
      }
    }
  }
`;

export const SUBSCRIBE_TO_LOGS = gql`
  subscription channelLog($id: String!) {
    channelLog(id: $id) {
      id
      message
      user {
        id
        name
      }
    }
  }
`;
