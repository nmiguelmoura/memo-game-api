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
    tile_number = ndb.IntegerProperty(required=True)
    sequence = ndb.IntegerProperty(repeated=True)
    tiles_found = ndb.IntegerProperty(repeated=True)
    move_record = ndb.IntegerProperty(repeated=True)
    score = ndb.IntegerProperty()
    complete = ndb.BooleanProperty()
    creation_date = ndb.FloatProperty()


class Game_form(messages.Message):
    user_id = messages.StringField(1)
    level = messages.StringField(2)
    tile_number = messages.IntegerField(3)
    sequence = messages.IntegerField(4, repeated=True)
    tiles_found = messages.IntegerField(5, repeated=True)
    move_record = messages.IntegerField(6, repeated=True)
    score = messages.IntegerField(7)
    complete = messages.BooleanField(8)
    creation_date = messages.FloatField(9)
    web_safe_key = messages.StringField(10)


class String_message(messages.Message):
    message = messages.StringField(1, required=True)
