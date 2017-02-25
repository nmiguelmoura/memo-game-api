import endpoints
from models import Game, Game_form, User
from google.appengine.ext import ndb
from copy_to_forms import copy_game_to_form

class Get_game():
    """Class that delivers created game data using web safe key."""

    def __init__(self):
        pass

    def get_game_handler(self, request):
        # Get game data using web safe key.
        game_key = ndb.Key(urlsafe=request.web_safe_key)
        if not game_key:
            raise endpoints.UnauthorizedException('Game is not available!')

        # Fetch game from datastore, using game key.
        game = game_key.get()

        # Check for current user.
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required!')

        # Get current user id.
        user_id = user.email()

        # Check if game creator id matches current user id
        if game.user_id != user_id:
            raise endpoints.UnauthorizedException('Authentication required!')

        # Return fetched data to form.
        return copy_game_to_form(game)


