#Memo Game API

API that allows any user to create a memo with three difficulty levels.

##Features
- The code runs in Google App Engine with Python.
- API methods to create user, create games, make guesses, get list of games, rankings, score
- Cron task to remind users of incomplete games

##Project install on local development server
- Create a new Cloud Platform Console project or retrieve the project ID of an existing project from the Google Cloud Platform Console.
- Install the gcloud tool and initialize the Google Cloud SDK. Follow Google Cloud Quickstart Guide for Python App Engine Standard Environment to install Google Cloud in your system. [Link](https://cloud.google.com/appengine/docs/python/quickstart)
- Download the project to your system.
- Through terminal or command line tools, navigate to /www project folder.
- Run command `dev_appserver.py app.yaml`.
- Use Google API Explorer running `localhost:8080/_ah/api/explorer` in your browser.

##API methods
####create_user
Allows to login a user email and name to be used with third party authentication provider. Saves new users email and nickname to datastore.

Parameters:
- **email:** string,
- **name:** string

Response:
- **email:** string,
- **name:** string

####create_new_game
Allows a user to create a new game, with three difficulty levels. It then creates a random integer sequence, that stores keys to implement memo game. A possible sequence could be `[0, 2, 0, 1, 3, 4, 3, 2, 4, 1]`. In this sequence, each integer might correspond to a different figure in memo game.

Parameters:
- **level:** string (options: easy, medium, hard - defaults to easy)

Response:
- **user_id:** string (email of the user that registered the game)
- **level:** string (easy, medium or hard)
- **tile_number:** integer (10, 16, 24, depends on difficulty level)
- **tiles_found:** list (order found tiles according to position. Positions not found have -1 value, positions found have corresponding key value)
- **complete:** boolean (False for incomplete game, True for complete)
- **creation_date:** integer (timestamp for creation date)
- **web_safe_key:** string (key that points to game in datastore

####get_user_games
Returns a list of all unfinished games registered by logged user.

Response (for each game in list):
- **user_id:** string (returns email from user)
- **complete:** boolean (returns game status)
- **score:** integer (return game current score)
- **creation_date:** integer (timestamp for creation date)
- **web_safe_key:** string (key that points to game in datastore

####get_user_complete_games
Returns a list of games that are already finished.

Response (for each game in list):
- **user_id:** string (returns email from user)
- **complete:** boolean (returns game status)
- **score:** integer (return game current score)
- **creation_date:** integer (timestamp for creation date)
- **web_safe_key:** string (key that points to game in datastore)

####get_game
Returns a specific game from logged.

Parameters:
- **web_safe_key:** string

Response:
- **user_id:** string (email of the user that registered the game)
- **level:** string (easy, medium or hard)
- **tile_number:** integer (10, 16, 24, depends on difficulty level)
- **tiles_found:** list (order found tiles according to position. Positions not found have -1 value, positions found have corresponding key value)
- **complete:** boolean (False for incomplete game, True for complete)
- **creation_date:** integer (timestamp for creation date)
- **web_safe_key:** string (key that points to game in datastore)

####move
Allows user to make a guess in a game. Everytime a user picks a card, the api responds with the key corresponding to the card position.

Parameters:
- **web_safe_key:** string (key that points to game in datastore)
- **move_one:** integer (position corresponding to first card picked)
- **move_two:** integer (position corresponding to second card picked - order is not relevant)

Response:
- **move_one_key:** integer (corresponds to the key in game sequence that matchs the move_one position)
- **move_two_key:** integer (corresponds to the key in game sequence that matchs the move_two position)
- **guessed:** boolean (responds True if user guessed or False if not)
- **score:** integer (returns game score after move)
- **complete:** boolean (False for incomplete game, True for complete)

####get_high_scores
Returns a list of n best game scores.

Parameters:
- list_length: integer (number of results to return)

Response (for each result in list):
- user_name: string (name of the user)
- score: integer (points scored in game)
- total_moves: integer (returns the total number of pair guesses in a game)

####get_game_history
Returns a base64 string with data from all guesses for a complete game.

Parameters:
- **web_safe_key:** string (key that points to game in datastore)

Response:
- **history:** base64 string (string holds a json file with info related to each move: move_one, move_one_key, move_two, move_two_key, guessed)

####cancel_game
Allows user to cancel its own games.

Parameters:
- **web_safe_key:** string (key that points to game in datastore)

####get_user_ranking
Returns a list of users ordered by ranking. Ranking is calculated dividing guessed moves by total moves and takes into account info from all user games.

Response (for each player in ranking):
- **user_name:** string (player nickname)
- **ranking:** float (from 0 to 1)