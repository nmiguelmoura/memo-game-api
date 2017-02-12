import endpoints
from protorpc import remote, messages
from models import String_message

# -------------- REQUEST MESSAGES -----------------#

REQUEST_USER = endpoints.ResourceContainer(user_name=messages.StringField(1),
                                           email=messages.StringField(2))


@endpoints.api(name="memo_game", version="v1")
class Memo_game_API(remote.Service):
    """Game API"""
    @endpoints.method(request_message=REQUEST_USER,
                      response_message=String_message,
                      path="user",
                      http_method="POST",
                      name="create_user")
    def create_user(self, request):
        return String_message(message='hello')

api = endpoints.api_server([Memo_game_API])