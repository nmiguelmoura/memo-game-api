import endpoints
from models import String_message
from google.appengine.ext import ndb

class Cancel_handler():
    def __init__(self):
        pass

    def cancel_handler(self, request):

        game_key = ndb.Key(urlsafe=request.web_safe_key)
        if not game_key:
            raise endpoints.UnauthorizedException('Game is not available!')

        game = game_key.get()

        if not game:
            raise endpoints.UnauthorizedException('Game is not available')

        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required!')

        user_id = user.email()
        if game.user_id != user_id:
            raise endpoints.UnauthorizedException('Authentication required!')

        message = String_message()

        if game.complete == False:
            game.key.delete()
            message.message = 'Game deleted successfully!'
        else:
            message.message = "You can't delete this game!"

        return message