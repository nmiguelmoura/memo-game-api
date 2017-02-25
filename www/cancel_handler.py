import endpoints
from models import String_message
from google.appengine.ext import ndb

class Cancel_handler():
    """Class to handle deletion of a stored game."""
    def __init__(self):
        pass

    def cancel_handler(self, request):

        # Get game key using request web_safe_key.
        game_key = ndb.Key(urlsafe=request.web_safe_key)
        if not game_key:
            raise endpoints.UnauthorizedException('Game is not available!')

        # Fetch game.
        game = game_key.get()

        if not game:
            raise endpoints.UnauthorizedException('Game is not available')

        # Check current user.
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required!')

        # Get user id.
        user_id = user.email()
        if game.user_id != user_id:
            raise endpoints.UnauthorizedException('Authentication required!')

        # Set response as a string using form String_message
        message = String_message()

        if game.complete == False:
            # If game is unfinished, delete.
            game.key.delete()
            message.message = 'Game deleted successfully!'
        else:
            # Dont delete if game is complete.
            message.message = "You can't delete this game!"

        return message