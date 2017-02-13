from protorpc import messages

from google.appengine.ext import ndb

class User(ndb.Model):
    name = ndb.StringProperty()
    email = ndb.StringProperty()


class User_profile_form(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)

class String_message(messages.Message):
    message = messages.StringField(1, required=True)
