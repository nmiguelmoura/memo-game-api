import endpoints
from random import shuffle
import time
from models import Game, User
from google.appengine.ext import ndb
from copy_to_forms import copy_game_to_form


class Create_game():
    def __init__(self):
        pass

    def get_random_tiles(self, level):
        sequence = []
        found = []
        limit = None

        if level == 'easy':
            limit = 5
        elif level == 'medium':
            limit = 8
        elif level == 'hard':
            limit = 12
        else:
            level = 'easy'
            limit = 5

        for i in range(0, limit):
            sequence.append(i)
            sequence.append(i)
            found.append(-1)
            found.append(-1)

        shuffle(sequence)

        return {
            "level": level,
            "sequence": sequence,
            "found": found
        }


    def create_new_game(self, request):
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required.')

        user_id = user.email()
        u_key = ndb.Key(User, user_id)
        game_id = Game.allocate_ids(size=1, parent=u_key)[0]
        game_key = ndb.Key(Game, game_id, parent=u_key)

        random = self.get_random_tiles(request.level)
        level = random['level']
        sequence = random['sequence']
        tiles_found = random['found']
        move_record = []
        score = 0
        creation_date = time.time()

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

        return copy_game_to_form(game)







