import endpoints
from google.appengine.ext import ndb
from copy_to_forms import copy_history_to_form
import json

class History_handler():
    """Class that delivers game info according to a web safe key.
    This class only handles finished games."""

    def __init__(self):
        pass

    def history_handler(self, request):
        # get game key using web safe key.
        game_key = ndb.Key(urlsafe=request.web_safe_key)
        if not game_key:
            raise endpoints.UnauthorizedException('Game is not available!')

        # Fetch game using game key.
        game = game_key.get()

        # Check for current user.
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required!')

        # Get user id.
        user_id = user.email()

        # Check if game creator id matches current user id.
        if game.user_id != user_id:
            raise endpoints.UnauthorizedException('Authentication required!')

        sequence = game.sequence
        score = game.score
        level = game.level
        move_record = game.move_record
        loop_range = len(move_record) / 2
        result = []
        move = None
        m0 = None
        m1 = None

        # Get moves data.
        for x in range(0, loop_range):
            m0 = move_record[x * 2]
            m1 = move_record[x * 2 + 1]
            move = {
                "move_one": m0,
                "move_two": m1,
                "move_one_key": sequence[m0],
                "move_two_key": sequence[m1],
                "guessed": sequence[m0] == sequence[m1],
            }
            result.append(move)

        # Transform data in json to later transform in a ByteString.
        # Following an aproach as seen in
        # http://stackoverflow.com/questions/13576140/protorpc-returning-dict
        return copy_history_to_form(json.dumps(result), score, level)
