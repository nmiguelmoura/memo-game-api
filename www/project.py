import endpoints
from protorpc import remote, messages
from models import User_profile_form, String_message
from settings import WEB_CLIENT_ID # TODO ADD WEB_CLIENT_ID



import user_handler

API_EXPLORER_CLIENT_ID = endpoints.API_EXPLORER_CLIENT_ID
EMAIL_SCOPE = endpoints.EMAIL_SCOPE

# -------------- REQUEST MESSAGES -----------------#

REQUEST_USER = endpoints.ResourceContainer(user_name=messages.StringField(1),
                                           email=messages.StringField(2))



user_h = user_handler.User_handler()

@endpoints.api(name="memo_game",
               version="v1",
               allowed_client_ids=[WEB_CLIENT_ID, API_EXPLORER_CLIENT_ID],
               scopes=[EMAIL_SCOPE])
class Memo_game_API(remote.Service):
    """Game API"""
    @endpoints.method(request_message=REQUEST_USER,
                      response_message=User_profile_form,
                      path="user",
                      http_method="POST",
                      name="create_user")
    def create_user(self, request):
        return user_h.handle_user()

api = endpoints.api_server([Memo_game_API])