from api import types
from images import serializers
from images.search import Search


class ActionHandler:

    def __init__(self, connection, action_type, action_payload):
        self.connection = connection
        self.type = action_type
        self.payload = action_payload


class SyncActionHandler(ActionHandler):

    def __init__(self, connection, action_type, action_payload):
        super().__init__(connection, action_type, action_payload)

    def process_action(self):
        pass


class AsyncActionHandler(ActionHandler):

    def __init__(self, connection, action_type, action_payload):
        super().__init__(connection, action_type, action_payload)

    async def process_action(self):
        pass


class GoogleSearchHandler(AsyncActionHandler):
    serializer_class = serializers.SearchSerializer

    def _validate_and_send(self):
        pass

    async def process_action(self, *args, **kwargs):
        user = kwargs.get('user', None)
        serializer = self.serializer_class(data=self.payload)
        if serializer.is_valid():
            serializer.save()

            search = Search.objects.get(id=serializer.data['id'])
            search.user = user
            search.save()

            await self.connection.send(types.CREATE_GOOGLE_SEARCH_SUCCESS, serializer.data)

            search.send = self.connection.send
            saved_images, failed_images = await search.download_google_images()
            search.images.set(saved_images)
            search.save()

            updated_search = Search.objects.get(id=serializer.data['id'])
            updated_serializer = self.serializer_class(updated_search)
            await self.connection.send(types.CREATE_GOOGLE_SEARCH_COMPLETE,  updated_serializer.data)  # updated_serializer.data)

        else:
            await self.connection.send(types.CREATE_GOOGLE_SEARCH_FAILURE, serializer.errors)
        return True

ASYNC_HANDLERS = {
    types.CREATE_GOOGLE_SEARCH: GoogleSearchHandler
}

HANDLERS = {

}
