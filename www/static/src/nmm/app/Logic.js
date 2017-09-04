/**
 * Created by Nuno on 01/09/17.
 */

nmm.app.Logic = (function () {
    'use strict';

    function Logic() {

    }

    var p = Logic.prototype;

    p.sort_data = function (varToTrack, data) {
        function compare(a, b) {
            if (a[varToTrack] < b[varToTrack]) {
                return 1;
            } else if (a[varToTrack] > b[varToTrack]) {
                return -1;
            }
            return 0;
        }

        return data.sort(compare);
    };

    p.create_player_ranking = function (user_name) {
        var playerData = this.get_player_ranking(user_name);

        if (!playerData) {
            playerData = {
                'guessed_moves': 0,
                'ranking': 0,
                'total_moves': 0,
                'user_name': user_name
            };


            var rankingData = this.get_rankings();
            rankingData[user_name] = playerData;
            localStorage.setItem('ranking', JSON.stringify(rankingData));
        }
    };

    p.update_player_ranking = function (user_name, dataToSave) {
        var rankingData = this.get_rankings();

        if (rankingData && rankingData[user_name]) {
            rankingData[user_name] = {
                'guessed_moves': dataToSave.guessed_moves,
                'ranking': dataToSave.ranking,
                'total_moves': dataToSave.total_moves,
                'user_name': user_name
            };

            localStorage.setItem('ranking', JSON.stringify(rankingData));
        }
    };

    p.get_rankings = function () {
        var rankingData = localStorage.getItem('ranking');

        if (rankingData) {
            rankingData = JSON.parse(rankingData);
        } else {
            rankingData = {};
        }

        return rankingData;
    };

    p.get_player_ranking = function (playerName) {
        var rankingsData = this.get_rankings();
        return rankingsData[playerName];
    };

    p.save_move_data = function (creation_date, move_one, move_two, score, complete, tiles_found) {
        var gameData = this.get_game_slots();

        if (gameData && gameData[creation_date]) {
            gameData[creation_date].score = score;
            gameData[creation_date].move_record.push(move_one, move_two);
            gameData[creation_date].complete = complete;
            gameData[creation_date].tiles_found = tiles_found;
        }

        localStorage.setItem('game', JSON.stringify(gameData));
    };

    p.save_game_slot = function (gameToSave) {
        var gameData = this.get_game_slots();

        gameData[gameToSave.creation_date] = gameToSave;

        localStorage.setItem('game', JSON.stringify(gameData));
    };

    p.get_game_slots = function () {
        var gameData = localStorage.getItem('game');

        if (gameData) {
            gameData = JSON.parse(gameData);
        } else {
            gameData = {};
        }
        return gameData;
    };

    p.create_game = function (level, playerName) {
        function get_random_tiles(level) {
            var sequence = [];
            var found = [];
            var limit = null;

            switch (level) {
                case 'easy':
                    limit = 5;
                    break;

                case 'medium':
                    limit = 8;
                    break;

                case 'hard':
                    limit = 12;
                    break;

                default:
                    limit = 5;
                    level = 'easy';
                    break;
            }

            for (var i = 0; i < limit; i++) {
                sequence.push(i.toString(), i.toString());
                found.push("-1", "-1");
            }

            sequence = nmm.utils.shuffleArray(sequence);

            return {
                'level': level,
                'sequence': sequence,
                'found': found
            };

        }

        level = level || 'easy';
        playerName = playerName || 'JOGADOR 1';

        var random = get_random_tiles(level);
        var creation_date = +new Date();

        var result = {
            complete: false,
            creation_date: creation_date,
            level: level,
            score: 0,
            tile_number: 10,
            tiles_found: random['found'],
            sequence: random['sequence'],
            move_record: [],
            user_name: playerName,
            web_safe_key: creation_date
        };

        this.save_game_slot(result);
        this.create_player_ranking(playerName);

        return result;
    };

    p.get_existing_game = function (web_safe_key) {
        var gameData = this.get_game_slots();
        if (gameData[web_safe_key]) {
            return gameData[web_safe_key];
        }
    };

    p.get_games_list = function (complete) {
        var gameData = this.get_game_slots();

        var items = [];
        for (var key in gameData) {
            if (gameData.hasOwnProperty(key) && gameData[key].complete === complete) {
                items.push(gameData[key]);
            }
        }

        return {
            'result': {
                'items': items.length > 0 ? items : null
            }
        };
    };

    p.make_move = function (move_one, move_two, data) {
        var move_one_key = "-1";
        var move_two_key = "-1";

        if (move_one !== undefined) {
            move_one_key = data.sequence[move_one];
        }

        if (move_two !== undefined) {
            move_two_key = data.sequence[move_two];
        }

        var guessed = false;

        if (move_one_key !== "-1" && move_two_key !== "-1") {
            var complete = null;

            var ranking = this.get_player_ranking(data.user_name);
            ranking['total_moves'] = ranking['total_moves'] + 1;

            if (move_one_key === move_two_key) {
                guessed = true;
                data.score += 3;
                data.tiles_found[move_one] = move_one_key;
                data.tiles_found[move_two] = move_two_key;

                complete = true;

                var cardsNum = data.tiles_found.length;
                for (var i = 0; i < cardsNum; i++) {
                    if (data.tiles_found[i] === "-1") {
                        complete = false;
                        break;
                    }
                }

                data.complete = complete;
                ranking['guessed_moves'] = ranking['guessed_moves'] + 1;
            } else {
                data.score -= 1;
                if (data.score < 0) {
                    data.score = 0;
                }
            }

            this.save_move_data(data.creation_date, move_one, move_two, data.score, data.complete, data.tiles_found);

            ranking['ranking'] = ranking['guessed_moves'] / ranking['total_moves'];
            this.update_player_ranking(data.user_name, ranking);
        }

        return {
            'move_one_key': move_one_key,
            'move_two_key': move_two_key,
            'complete': complete,
            'guessed': guessed,
            'score': data.score
        }
    };

    p.score = function () {

        var gameData = this.get_game_slots();

        var items = [];
        for (var key in gameData) {
            if (gameData.hasOwnProperty(key)) {
                if (gameData[key].complete) {
                    items.push(gameData[key]);
                }
            }
        }

        items = this.sort_data('score', items);

        return {
            'result': {
                'items': items
            }
        };
    };

    p.rankings = function () {
        var rankingsData = this.get_rankings();

        var items = [];
        for (var key in rankingsData) {
            if (rankingsData.hasOwnProperty(key)) {
                items.push(rankingsData[key]);
            }
        }

        items = this.sort_data('ranking', items);

        return {
            'result': {
                'items': items
            }
        };
    };

    p.history = function (web_safe_key) {

        function get_history (sequence, move_record) {
            var move = null,
                m0,
                m1,
                length = move_record.length / 2,
                result = [];

            for (var i = 0; i < length; i++) {
                m0 = move_record[i * 2];
                m1 = move_record[i * 2 + 1];
                move = {
                    'move_one': m0,
                    'move_two': m1,
                    'move_one_key': sequence[m0],
                    'move_two_key': sequence[m1],
                    'guessed': sequence[m0] === sequence[m1]
                };
                result.push(move);
            }
            return result;
        }

        var game = this.get_existing_game(web_safe_key);
        if (game) {
            return {
                'level': game.level,
                'score': game.score,
                'history': get_history(game.sequence, game.move_record)
            };
        }
    };

    p.cancel = function (web_safe_key) {
        var gameData = this.get_game_slots();
        if (gameData[web_safe_key]) {
            delete gameData[web_safe_key];
        }

        localStorage.setItem('game', JSON.stringify(gameData));
    };

    return Logic;
})();