import endpoints
from random import shuffle
import time
from models import Game, Game_form, User
from google.appengine.ext import ndb


class Create_game():
    def __init__(self):
        pass

    def copy_game_to_form(self, game):
        game_pf = Game_form()
        for field in game_pf.all_fields():
            if(game, field.name):
                setattr(game_pf, field.name, getattr(game, field.name))
        game_pf.check_initialized()
        return game_pf

    def get_random_tiles(self, level):
        result = []
        limit = None

        if level == 'easy':
            limit = 5
        elif level == 'medium':
            limit = 8
        elif level == 'hard':
            limit = 12

        for i in range(0, limit):
            result.append(i)
            result.append(i)

        shuffle(result)

        return result


    def create_new_game(self, request):
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required.')

        if not request.level:
            raise endpoints.UnauthorizedException('Level not selected.')

        user_id = user.email()
        u_key = ndb.Key(User, user_id)
        game_id = Game.allocate_ids(size=1, parent=u_key)[0]
        game_key = ndb.Key(Game, game_id, parent=u_key)

        level = request.level
        sequence = self.get_random_tiles(level)
        tiles_found = []
        move_record = []
        score = 0
        creation_date = time.time()

        game = Game(
            key=game_key,
            user_id=user_id,
            level=level,
            sequence=sequence,
            tiles_found=tiles_found,
            move_record=move_record,
            score=score,
            creation_date=creation_date
        )

        game.put()

        return self.copy_game_to_form(game)







