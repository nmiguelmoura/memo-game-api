import endpoints
from copy_to_forms import copy_move_result_to_form
from google.appengine.ext import ndb
from models import User, Score, Ranking

class Make_move_handler():
    """Class that allows user to make a move."""

    def __init__(self):
        pass

    def move_handler(self, request):
        # Check for current user.
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnexpectedException('Authentication required!')

        # Get game web safe key.
        web_safe_key = request.web_safe_key

        # Get key for cards moved.
        move_one = request.move_one
        move_two = request.move_two

        # If no card as been turned, raise exception.
        if move_one is None and move_two is None:
            raise endpoints.UnauthorizedException('No move has been made!')

        # Get game key using web safe key.
        game_key = ndb.Key(urlsafe=request.web_safe_key)
        if not game_key:
            raise endpoints.UnauthorizedException('Game is not available!')

        # Fetch game.
        game = game_key.get()
        if game.complete:
            raise endpoints.UnauthorizedException('This game is already finished!')

        sequence = game.sequence
        tiles_found = game.tiles_found
        score = game.score
        move_record = game.move_record

        # If car as been already guessed, alert user.
        if (move_one is not None and tiles_found[move_one] >= 0) or \
                (move_two is not None and tiles_found[move_two] >= 0):
            raise endpoints.UnauthorizedException('Figure already found')

        # If move one and two correspond to the same card, its an illegal move.
        # Alert user.
        if (move_one == move_two):
            raise endpoints.UnauthorizedException('Illegal move')

        # -1 stands for None because has to be Integer, not Boolean
        move_one_key = -1
        move_two_key = -1

        # Get figures from sequence list corresponding to turned card.
        if move_one is not None:
            move_one_key = sequence[move_one]

        if move_two is not None:
            move_two_key = sequence[move_two]

        guessed = False

        # Run if two carsd were turned.
        if move_one_key != -1 and move_two_key != -1:
            complete = None

            # Get user key
            u_key = ndb.Key(User, user.email())

            # Fetch user ranking.
            rankings = Ranking.query()
            rankings = rankings.filter(Ranking.user == u_key)
            rankings = rankings.fetch(1)

            ranking = rankings[0]

            # Update user ranking.
            ranking.total_moves = ranking.total_moves + 1

            # Run if user guessed.
            if move_one_key == move_two_key:
                guessed = True
                score = score + 3
                tiles_found[move_one] = move_one_key
                tiles_found[move_two] = move_two_key
                game.tiles_found = tiles_found

                complete = True

                # Check if game is over.
                for t in tiles_found:
                    if t == -1:
                        complete = False
                        break
                game.complete = complete
                ranking.guessed_moves = ranking.guessed_moves + 1

            else:
                score = score - 1

                if score < 0:
                    score = 0

            # Update game data.
            move_record.append(move_one)
            move_record.append(move_two)
            game.move_record = move_record
            game.score = score
            game.put()

            # Update ranking data.
            ranking.ranking = float(ranking.guessed_moves) / ranking.total_moves
            ranking.put()

            # update score data table if games is complete.
            if complete:
                score = Score(
                    user=u_key,
                    score=score,
                    total_moves=len(move_record) / 2
                )
                score.put()

        # Return move info.
        return copy_move_result_to_form(game, move_one_key, move_two_key, guessed)