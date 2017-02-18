import endpoints
from models import User, Game, Game_list_forms
from google.appengine.ext import ndb
from copy_to_forms import copy_game_from_list_to_form

class Get_game_list():
    def __init__(self):
        pass

    def get_list_handler(self, request, complete):
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required')

        user_id = user.email()
        u_key = ndb.Key(User, user_id)

        games = Game.query(ancestor=u_key)
        games = games.filter(Game.complete == complete)

        return Game_list_forms(
            items=[copy_game_from_list_to_form(game) \
                   for game in games]
        )