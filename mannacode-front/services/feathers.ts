const io = require("socket.io-client");
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import getConfig from 'next/config'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || {}
const baseSocketUrl = process.env.baseSocketUrl;


const socket = io(baseSocketUrl, {
  transports: ['websocket'],
  upgrade: false
});

const client = feathers()

client.configure(socketio(socket, {
  timeout: 10000,
}));

client.configure(auth());

export default client
