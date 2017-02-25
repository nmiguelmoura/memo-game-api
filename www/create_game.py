import endpoints
from random import shuffle
import time
from models import Game, User
from google.appengine.ext import ndb
from copy_to_forms import copy_game_to_form


class Create_game():
    """Class that handles game creation."""

    def __init__(self):
        pass

    def get_random_tiles(self, level):
        sequence = []
        found = []
        limit = None

        # Estabilish a limit based on selected dificulty.
        if level == 'easy':
            limit = 5
        elif level == 'medium':
            limit = 8
        elif level == 'hard':
            limit = 12
        else:
            level = 'easy'
            limit = 5

        # Create a sequence of duplicate values, according to limit.
        # Also create a list of found values defaultly set to -1, which means
        # not found.
        for i in range(0, limit):
            sequence.append(i)
            sequence.append(i)
            found.append(-1)
            found.append(-1)

        # Randomize sequence.
        shuffle(sequence)

        return {
            "level": level,
            "sequence": sequence,
            "found": found
        }


    def create_new_game(self, request):
        # Get current user data.
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required.')

        # Get user id.
        user_id = user.email()

        # Get user key.
        u_key = ndb.Key(User, user_id)

        # Get new id to game.
        # Game is a descendant of user.
        game_id = Game.allocate_ids(size=1, parent=u_key)[0]

        # Create game key.
        game_key = ndb.Key(Game, game_id, parent=u_key)

        random = self.get_random_tiles(request.level)
        level = random['level']
        sequence = random['sequence']
        tiles_found = random['found']
        move_record = []
        score = 0
        creation_date = time.time()

        # Store game and game attributes in datastore.
        game = Game(
            key=game_key,
            user_id=user_id,
            level=level,
            tile_number=len(sequence),
            sequence=sequence,
            tiles_found=tiles_found,
            move_record=move_record,
            score=score,
            complete=False,
            creation_date=creation_date
        )

        game.put()

        # Copy newly created game data to form.
        return copy_game_to_form(game)







