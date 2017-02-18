import endpoints
from protorpc import remote, messages, message_types
from models import User_profile_form, Game_form, Game_list_forms, Move_form, \
    Score_forms, String_message

from settings import WEB_CLIENT_ID

import user_handler
import create_game
import get_game
import get_game_list
import make_move
import score_list

API_EXPLORER_CLIENT_ID = endpoints.API_EXPLORER_CLIENT_ID
EMAIL_SCOPE = endpoints.EMAIL_SCOPE

# -------------- REQUEST MESSAGES -----------------#

REQUEST_USER = endpoints.ResourceContainer(name=messages.StringField(1),
                                           email=messages.StringField(2))

REQUEST_NEW_GAME = endpoints.ResourceContainer(level=messages.StringField(1))

REQUEST_GET_EXISTING_GAME = endpoints.ResourceContainer(
    web_safe_key=messages.StringField(1))

REQUEST_MOVE = endpoints.ResourceContainer(
    web_safe_key=messages.StringField(1),
    move_one=messages.IntegerField(2),
    move_two=messages.IntegerField(3)
)

REQUEST_SCORE = endpoints.ResourceContainer(list_length=messages.IntegerField(1))

user_h = user_handler.User_handler()
new_game = create_game.Create_game()
get_g = get_game.Get_game()
get_g_list = get_game_list.Get_game_list()
mk_move = make_move.Make_move_handler()
score_l = score_list.Score_list_handler()


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
    @endpoints.method(request_message=REQUEST_NEW_GAME,
                      response_message=Game_form,
                      path="create_new_game",
                      http_method="POST",
                      name="create_game")
    def create_game(self, request):
        return new_game.create_new_game(request)

    # Get game with web_safe_key
    @endpoints.method(request_message=REQUEST_GET_EXISTING_GAME,
                      response_message=Game_form,
                      path='game/{web_safe_key}',
                      name='get_game',
                      http_method='GET')
    def get_existing_game(self, request):
        return get_g.get_game_handler(request)

    # Get list of games created by user that are not complete
    @endpoints.method(request_message=message_types.VoidMessage,
                      response_message=Game_list_forms,
                      path='active_games',
                      name='get_user_games',
                      http_method='GET')
    def get_active_games(self, request):
        return get_g_list.get_list_handler(request, False)

    # Get list of games created by user that are complete
    @endpoints.method(request_message=message_types.VoidMessage,
                      response_message=Game_list_forms,
                      path='get_user_complete_games',
                      name='get_user_complete_games',
                      http_method='GET')
    def get_complete_games(self, request):
        return get_g_list.get_list_handler(request, True)

    # Make a move
    @endpoints.method(request_message=REQUEST_MOVE,
                      response_message=Move_form,
                      path='move/{web_safe_key}',
                      http_method='PUT',
                      name='move')
    def move(self, request):
        return mk_move.move_handler(request)

    # Get top ten score list
    @endpoints.method(request_message=REQUEST_SCORE,
                      response_message=Score_forms,
                      path='score/{list_length}',
                      name='get_high_scores',
                      http_method='GET')
    def score(self, request):
        return score_l.score_list_handler(request)


api = endpoints.api_server([Memo_game_API])
