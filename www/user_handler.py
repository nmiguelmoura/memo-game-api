import endpoints
from models import User, User_profile_form, String_message
from google.appengine.ext import ndb
from copy_to_forms import copy_user_profile_to_form

class User_handler():
    def __init__(self):
        pass

    def get_user_id(self, user):
        return user.email()

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
        return copy_user_profile_to_form(user_profile)

    def handle_user(self):
        user = endpoints.get_current_user()
        if not user:
            raise endpoints.UnauthorizedException('Authentication required.')

        return self.check_if_user_exists(user)