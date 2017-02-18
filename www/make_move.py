import endpoints
from copy_to_forms import copy_move_result_to_form
from google.appengine.ext import ndb
from models import User, Score

class Make_move_handler():
    def __init__(self):
        pass

    def move_handler(self, request):
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnexpectedException('Authentication required!')

        web_safe_key = request.web_safe_key
        move_one = request.move_one
        move_two = request.move_two

        if move_one is None and move_two is None:
            raise endpoints.UnauthorizedException('No move has been made!')

        game_key = ndb.Key(urlsafe=request.web_safe_key)
        if not game_key:
            raise endpoints.UnauthorizedException('Game is not available!')

        game = game_key.get()
        if game.complete:
            raise endpoints.UnauthorizedException('This game is already finished!')

        sequence = game.sequence
        tiles_found = game.tiles_found
        score = game.score
        move_record = game.move_record

        if (move_one is not None and tiles_found[move_one] >= 0) or \
                (move_two is not None and tiles_found[move_two] >= 0):
            raise endpoints.UnauthorizedException('Figure already found')

        if (move_one == move_two):
            raise endpoints.UnauthorizedException('Illegal move')

        # -1 stands for None because has to be Integer, not Boolean
        move_one_key = -1
        move_two_key = -1

        if move_one is not None:
            move_one_key = sequence[move_one]

        if move_two is not None:
            move_two_key = sequence[move_two]

        guessed = False

        if move_one_key != -1 and move_two_key != -1:
            complete = None
            if move_one_key == move_two_key:
                guessed = True
                score = score + 3
                tiles_found[move_one] = move_one_key
                tiles_found[move_two] = move_two_key
                game.tiles_found = tiles_found

                complete = True

                for t in tiles_found:
                    if t == -1:
                        complete = False
                        break
                game.complete = complete

            else:
                score = score - 1

                if score < 0:
                    score = 0

            move_record.append(move_one)
            move_record.append(move_two)
            game.move_record = move_record
            game.score = score
            game.put()


            if complete:
                score = Score(
                    user=ndb.Key(User, user.email()),
                    score=score,
                    total_moves=len(move_record) / 2
                )
                score.put()

        return copy_move_result_to_form(game, move_one_key, move_two_key, guessed)