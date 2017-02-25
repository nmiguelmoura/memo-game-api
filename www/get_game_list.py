import endpoints
from models import User, Game, Game_list_forms
from google.appengine.ext import ndb
from copy_to_forms import copy_game_from_list_to_form

class Get_game_list():
    """Class that delivers a list of all games. Passing an argument complete,
    allows to choose if query is filtered by finished or unfinished games."""

    def __init__(self):
        pass

    def get_list_handler(self, request, complete):
        # Check for current user.
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required')

        # Get user id.
        user_id = user.email()

        # Get user key.
        u_key = ndb.Key(User, user_id)

        # Query all games with current user as an ancestor.
        games = Game.query(ancestor=u_key)

        # Filter games according to complete argument.
        # If complete is True, deliver only finished games.
        # If complete is False, deliver only unfinished games.
        games = games.filter(Game.complete == complete)

        # Copy results to form.
        return Game_list_forms(
            items=[copy_game_from_list_to_form(game) \
                   for game in games]
        )