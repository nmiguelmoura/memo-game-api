import endpoints
from protorpc import remote, messages
from models import User_profile_form, Game_form, String_message

from settings import WEB_CLIENT_ID

import user_handler
import create_game

API_EXPLORER_CLIENT_ID = endpoints.API_EXPLORER_CLIENT_ID
EMAIL_SCOPE = endpoints.EMAIL_SCOPE

# -------------- REQUEST MESSAGES -----------------#

REQUEST_USER = endpoints.ResourceContainer(name=messages.StringField(1),
                                           email=messages.StringField(2))

REQUEST_NEW_GAME = endpoints.ResourceContainer(level=messages.StringField(1))

user_h = user_handler.User_handler()
new_game = create_game.Create_game()

@endpoints.api(name="memo_game",
               version="v1",
               allowed_client_ids=[WEB_CLIENT_ID, API_EXPLORER_CLIENT_ID],
               scopes=[EMAIL_SCOPE])
class Memo_game_API(remote.Service):
    """Memo Game API"""

    # Login a new or existing user
    @endpoints.method(request_message=REQUEST_USER,
                      response_message=User_profile_form,
                      path="user",
                      http_method="POST",
                      name="create_user")
    def create_user(self, request):
        return user_h.handle_user()

    # Create a new game
    @endpoints.method(request_message=Game_form,
                      response_message=Game_form,
                      path="create_new_game",
                      http_method="POST",
                      name="create_game")
    def create_game(self, request):
        return new_game.create_new_game(request)


api = endpoints.api_server([Memo_game_API])
