import webapp2
from google.appengine.api import mail, app_identity
from project import Memo_game_API

from models import Game


class SendReminderEmail(webapp2.RequestHandler):
    """Class that handles email sending by cron job."""
    def get(self):
        # Get app id.
        app_id = app_identity.get_application_id

        # Query only for unfinished games.
        games = Game.query(Game.complete == False)

        # Store users emails that have unfinished games in a list.
        user_emails = []
        for game in games:
            user_emails.append(game.user_id)

        # Transform list in set to assure all emails are unique.
        user_emails = set(user_emails)

        # Send email.
        email_subject = "You have unfinished games!"
        for user_email in user_emails:
            body = 'Hello, try out Guess A Number!'
            # This will send test emails, the arguments to send_mail are:
            # from, to, subject, body
            mail.send_mail('noreply@{}.appspotmail.com'.format(app_id),
                           user_email,
                           email_subject,
                           body)


app = webapp2.WSGIApplication([
    ('/crons/send_reminder', SendReminderEmail)
], debug=True)