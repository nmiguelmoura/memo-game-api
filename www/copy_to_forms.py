from models import Game_form, Game_list_form, User_profile_form


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
        if hasattr(game, field.name) and field.name != 'sequence':
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