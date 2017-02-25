from models import Game_form, Game_list_form, Move_form, Score_form, \
    History_form, Ranking_form, User_profile_form


def copy_user_profile_to_form(user_profile):
    usr_pf = User_profile_form()
    for field in usr_pf.all_fields():
        if (user_profile, field.name):
            setattr(usr_pf, field.name, getattr(user_profile, field.name))

    usr_pf.check_initialized()
    return usr_pf


def copy_game_to_form(game):
    game_pf = Game_form()
    for field in game_pf.all_fields():
        if hasattr(game, field.name):
            setattr(game_pf, field.name, getattr(game, field.name))
        elif field.name == "web_safe_key":
            setattr(game_pf, field.name, game.key.urlsafe())
    game_pf.check_initialized()
    return game_pf


def copy_game_from_list_to_form(game):
    game_l_pf = Game_list_form()
    for field in game_l_pf.all_fields():
        if hasattr(game, field.name):
            setattr(game_l_pf, field.name, getattr(game, field.name))
        elif field.name == "web_safe_key":
            setattr(game_l_pf, field.name, game.key.urlsafe())
    game_l_pf.check_initialized()
    return game_l_pf


def copy_move_result_to_form(game, move_one_key, move_two_key, guessed):
    move_f = Move_form()
    setattr(move_f, 'score', game.score)
    setattr(move_f, 'complete', game.complete)
    setattr(move_f, 'guessed', guessed)
    setattr(move_f, 'move_one_key', move_one_key)
    setattr(move_f, 'move_two_key', move_two_key)
    move_f.check_initialized()
    return move_f


def copy_score_list_to_form(score):
    score_f = Score_form()
    for field in score_f.all_fields():
        if hasattr(score, field.name):
            setattr(score_f, field.name, getattr(score, field.name))
        elif field.name == 'user_name':
            user_name = score.user.get().name
            setattr(score_f, field.name, user_name)

    score_f.check_initialized()
    return score_f

def copy_history_to_form(json, score, level):
    # Following an aproach as seen in
    # http://stackoverflow.com/questions/13576140/protorpc-returning-dict
    hist_f = History_form()
    setattr(hist_f, 'history', json)
    setattr(hist_f, 'score', score)
    setattr(hist_f, 'level', level)
    hist_f.check_initialized()
    return hist_f


def copy_ranking_from_list_to_form(rank):
    rank_f = Ranking_form()
    setattr(rank_f, 'user_name', rank.user.get().name)
    setattr(rank_f, 'ranking', rank.ranking)
    rank_f.check_initialized()
    return rank_f
