from models import Score, Score_forms
from google.appengine.ext import ndb
from copy_to_forms import copy_score_list_to_form


class Score_list_handler():
    """Class that delivers a list of achieved scores ordered descend."""
    def __init(self):
        pass

    def score_list_handler(self, request):
        # Limit number of fetched results to list_length value.
        list_length = request.list_length

        scores = Score.query()
        scores = scores.order(-Score.score)
        scores = scores.fetch(list_length)

        return Score_forms(
            items=[copy_score_list_to_form(score) \
                   for score in scores]
        )
