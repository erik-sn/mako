from django.conf.urls import url

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.routing import AsgiHandler

from api.consumers import WebSocketConsumer, AsyncWebSocketConsumer

application = ProtocolTypeRouter({
    # WebSocket chat handler
    "websocket": AuthMiddlewareStack(
        URLRouter([
            # url("^socket/v1/$", WebSocketConsumer),
            url("^socket/v1/async/$", AsyncWebSocketConsumer),
            url("^$", AsgiHandler),
        ])
    ),
})
