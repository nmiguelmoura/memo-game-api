import endpoints
from models import Game, Game_form, User
from google.appengine.ext import ndb
from copy_to_forms import copy_game_to_form

class Get_game():
    def __init__(self):
        pass

    def get_game_handler(self, request):
        game_key = ndb.Key(urlsafe=request.web_safe_key)
        if not game_key:
            raise endpoints.UnauthorizedException('Game is not available!')

        game = game_key.get()

        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required!')

        user_id = user.email()
        if game.user_id != user_id:
            raise endpoints.UnauthorizedException('Authentication required!')

        return copy_game_to_form(game)


