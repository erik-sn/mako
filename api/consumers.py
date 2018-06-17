from channels.generic.websocket import JsonWebsocketConsumer, AsyncJsonWebsocketConsumer

from api import types
from api.handlers import HANDLERS, ASYNC_HANDLERS


class WebSocketConsumer(JsonWebsocketConsumer):
    groups = ["broadcast"]

    def connect(self):
        # Called on connection. Either call
        self.accept()

    def send(self, action_type, action_payload):
        self.send_json({
            'type': action_type,
            'payload': action_payload
        })

    def receive_json(self, action=None):
        try:
            handler_class = HANDLERS[action['type']]
            handler = handler_class(self, action['type'], action['payload'])
            handler.process_action()
        except KeyError:
            self.send(types.INVALID_ACTION_ERROR, 'input action must have a type and payload')
        except ValueError:
            self.send(types.ACTION_RESPONSE_ERROR,
                      'there was an error processing the response - type or payload not found')
        except Exception as e:
            self.send(types.GENERIC_WEBSOCKET_ERROR, str(e))

    def disconnect(self, close_code):
        # Called when the socket closes
        self.close()


class AsyncWebSocketConsumer(AsyncJsonWebsocketConsumer):
    groups = ["broadcast"]

    async def connect(self):
        # Called on connection. Either call
        await self.accept()

    async def send(self, action_type, action_payload):
        await self.send_json({
            'type': action_type,
            'payload': action_payload
        })

    async def receive_json(self, action=None):
        try:
            action_type = action['type']
            handler_class = ASYNC_HANDLERS[action_type]
            handler = handler_class(self, action_type, action['payload'])
            user = self.scope['user']
            if user.is_anonymous:
                await self.send(types.UNAUTHENTICATED_USER_ERROR, 'user is not authenticated')
                await self.send(f'{action_type}_FAILURE', 'user is not authenticated')
                return
            await handler.process_action(user=user)
        except KeyError:
            await self.send(types.INVALID_ACTION_ERROR, 'input action must have a type and payload')
        except ValueError:
            await self.send(types.ACTION_RESPONSE_ERROR,
                      'there was an error processing the response - type or payload not found')
        except Exception as e:
            await self.send(types.GENERIC_WEBSOCKET_ERROR, str(e))
            raise e

    async def disconnect(self, close_code):
        # Called when the socket closes
        await self.close()
