import endpoints
from models import Ranking, Ranking_forms
from copy_to_forms import copy_ranking_from_list_to_form


class Rankings_handler():
    """This class delivers a list of players ordered by ranking (descend)."""
    def __init__(self):
        pass

    def rankings_handler(self, request):
        rankings = Ranking.query()
        rankings = rankings.order(-Ranking.ranking)

        return Ranking_forms(
            items=[copy_ranking_from_list_to_form(rank) \
                   for rank in rankings]
        )