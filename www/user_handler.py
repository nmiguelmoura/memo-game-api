import endpoints
from models import User, User_profile_form, String_message
from google.appengine.ext import ndb

class User_handler():
    def __init__(self):
        pass

    def get_user_id(self, user):
        return user.email()

    def copy_user_profile_to_form(self, user_profile):
        usr_pf = User_profile_form()
        for field in usr_pf.all_fields():
            if(user_profile, field.name):
                setattr(usr_pf, field.name, getattr(user_profile, field.name))

        usr_pf.check_initialized()
        return usr_pf

    def check_if_user_exists(self, user):
        user_id = self.get_user_id(user)
        u_key = ndb.Key(User, user_id)
        user_profile = u_key.get()

        if not user_profile:
            user_profile = User(
                key=u_key,
                name=user.nickname(),
                email=user.email()
            )
            user_profile.put()
        return self.copy_user_profile_to_form(user_profile)

    def handle_user(self):
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required.')

        return self.check_if_user_exists(user)