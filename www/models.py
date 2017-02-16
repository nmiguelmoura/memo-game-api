from protorpc import messages

from google.appengine.ext import ndb


class User(ndb.Model):
    name = ndb.StringProperty()
    email = ndb.StringProperty()


class User_profile_form(messages.Message):
    name = messages.StringField(1)
    email = messages.StringField(2)


class Game(ndb.Model):
    user_id = ndb.StringProperty(required=True)
    level = ndb.StringProperty(required=True)
    sequence = ndb.IntegerProperty(repeated=True)
    tiles_found = ndb.IntegerProperty(repeated=True)
    move_record = ndb.IntegerProperty(repeated=True)
    score = ndb.IntegerProperty()
    creation_date = ndb.FloatProperty()


class Game_form(messages.Message):
    user_id = messages.StringField(1)
    level = messages.StringField(2)
    sequence = messages.IntegerField(3, repeated=True)
    tiles_found = messages.IntegerField(4, repeated=True)
    move_record = messages.IntegerField(5, repeated=True)
    score = messages.IntegerField(6)
    creation_date = messages.FloatField(7)
    web_safe_key = messages.StringField(8)


class String_message(messages.Message):
    message = messages.StringField(1, required=True)
