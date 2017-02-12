from protorpc import messages

class String_message(messages.Message):
    message = messages.StringField(1, required=True)
