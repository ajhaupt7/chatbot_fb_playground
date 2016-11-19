import Hapi from 'hapi';
import Boom from 'boom';
import { receivedMessage,sendGenericMessage,sendTextMessage,callSendAPI } from './utils'

const PORT = process.env.PORT || 8000;
const server = new Hapi.Server();

const plugins = [
  require('h2o2'),
  require('inert'),
  require('vision'),
  require('blipp')
];

server.register(plugins, () => {
  server.connection({ port: PORT });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply("Hello world, I'm a chatbot")
    }
  });

  server.route({
    method: 'GET',
    path: '/webhook/',
    handler: (request, reply) => {
      if (request.query['hub.verify_token'] === 'testy_token') {
        reply(request.query['hub.challenge'])
      } else {
        reply('Error, wrong token')
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/webhook/',
    handler: (request, reply) => {
      var data = request.payload;
      if (data.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach((entry) => {
          var pageID = entry.id;
          var timeOfEvent = entry.time;
          // Iterate over each messaging event
          entry.messaging.forEach((event) => {
            if (event.message) {
              receivedMessage(event);
            } else if (messagingEvent.postback) {
              receivedPostback(messagingEvent); 
            } else {
              console.log("Webhook received unknown event: ", event);
            }
          });
        });

        reply("All good")
      }
    }
  });


  // Start your Server
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});

export default server;
