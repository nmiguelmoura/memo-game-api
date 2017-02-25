nmm.app.Model = (function () {
    'use strict';

    var CLIENT_ID = '111248907577-db9pioih0u8s8e9u626r0i8cf2lk7kr9.apps.googleusercontent.com';
    var SCOPES = 'https://www.googleapis.com/auth/userinfo.email';
    var self;

    function Model(controller) {
        self = this;
        this._controller = controller;
        this.isUserLogged = false;

        this.poolMaxElements = 48;

        this.bg = {
            numLines: 5,
            numCardsPerLine: 4,
            speeds: [
                0.15,
                0.25,
                0.20,
                0.15,
                0.20
            ]
        };

        this.menu = {
            btns: [
                {
                    x: 512,
                    y: 582,
                    key: 1,
                    text: 'New Game'
                },
                {
                    x: 264,
                    y: 689,
                    key: 2,
                    text: 'Load Game'
                },
                {
                    x: 772,
                    y: 689,
                    key: 3,
                    text: 'View History'
                }
            ]

        };

        this.difficulty = {
            btns: [
                {
                    x: 512,
                    y: 220,
                    key: 0,
                    text: 'Easy'
                },
                {
                    x: 512,
                    y: 384,
                    key: 1,
                    text: 'Medium'
                },
                {
                    x: 512,
                    y: 547,
                    key: 2,
                    text: 'Hard'
                }
            ],
            selected: null
        };

        this.gameSelection = {
            listMaxLength: 5,
            info: [
                {
                    text: 'Score:',
                    x: 680,
                    y: 50
                }
            ],
            btns: [
                {
                    texture: PIXI.Texture.fromFrame('load'),
                    x: 636,
                    y: 15,
                    key: 0
                },
                {
                    texture: PIXI.Texture.fromFrame('delete'),
                    x: 687,
                    y: 15,
                    key: 1
                },

                {
                    texture: PIXI.Texture.fromFrame('play'),
                    x: 683,
                    y: 15,
                    key: 2
                }
            ]
        };

        this.game = {
            numTotalCards: 12,
            easy: {
                numCards: 10,
                disposal: [
                    {x: 116, y: 249}, {x: 314, y: 249}, {x: 512, y: 249},
                    {x: 710, y: 249}, {x: 910, y: 249}, {x: 116, y: 519},
                    {x: 314, y: 519}, {x: 512, y: 519}, {x: 710, y: 519},
                    {x: 910, y: 519}
                ],
                scale: 1
            },
            medium: {
                numCards: 16,
                disposal: [
                    {x: 136, y: 208}, {x: 287, y: 208}, {x: 437, y: 208},
                    {x: 588, y: 208}, {x: 738, y: 208}, {x: 889, y: 208},
                    {x: 136, y: 413}, {x: 287, y: 413}, {x: 437, y: 413},
                    {x: 588, y: 413}, {x: 738, y: 413}, {x: 889, y: 413},
                    {x: 287, y: 618}, {x: 437, y: 618}, {x: 588, y: 618},
                    {x: 738, y: 618}
                ],
                scale: 0.76
            },
            hard: {
                numCards: 24,
                disposal: [
                    {x: 79, y: 225}, {x: 202, y: 225}, {x: 325, y: 225},
                    {x: 448, y: 225}, {x: 570, y: 225}, {x: 694, y: 225},
                    {x: 817, y: 225}, {x: 941, y: 225}, {x: 79, y: 393},
                    {x: 202, y: 393}, {x: 325, y: 393}, {x: 448, y: 393},
                    {x: 570, y: 393}, {x: 694, y: 393}, {x: 817, y: 393},
                    {x: 941, y: 393}, {x: 79, y: 562}, {x: 202, y: 562},
                    {x: 325, y: 562}, {x: 448, y: 562}, {x: 570, y: 562},
                    {x: 694, y: 562}, {x: 817, y: 562}, {x: 941, y: 562}
                ],
                scale: 0.62
            },
            info: [
                {
                    text: 'Score',
                    x: 40,
                    y: 26
                },
                {
                    text: 'Moves',
                    x: 800,
                    y: 26
                }
            ],
            current: {}
        };

        this.score = {
            info: {
                width: 405,
                column0: {
                    title: 'Top Score',
                    subTitle: 'pts.',
                    x: 57,
                    y: 57
                },
                column1: {
                    title: 'Player Ranking',
                    subTitle: '% guesses',
                    x: 562,
                    y: 57
                }
            }

        };
    }

    var p = Model.prototype;

    //get rankings
    p.getRankings = function () {
        gapi.client.memo_game.get_user_ranking()
            .execute(function (resp) {
                console.log(resp);
                self._controller.rankingLoaded(resp);
            });
    };

    //get top score
    p.getTopScore = function () {
        gapi.client.memo_game.get_high_scores({
            'list_length': 15
        }).execute(function (resp) {
            console.log(resp);
            self._controller.scoreLoaded(resp);
        });
    };

    //get game history
    p.getGameHistory = function (web_safe_key) {
        gapi.client.memo_game.get_game_history({
            'web_safe_key': web_safe_key
        }).execute(function (resp) {
            console.log(resp);
            var level = resp.result.level;
            var score = resp.result.score;
            var json = atob(resp.result.history);
            var history = JSON.parse(json);
            self._controller.gameHistoryLoaded(level, score, history);
        });
    };

    //delete game
    p.deleteGame = function (web_safe_key) {
        gapi.client.memo_game.cancel_game({
            'web_safe_key': web_safe_key
        }).execute(function (resp) {
            console.log(resp);
            self.getUnfinishedGames();
        });
    };

    //load game
    p.loadGame = function (web_safe_key) {
        gapi.client.memo_game.get_game({
            'web_safe_key': web_safe_key
        }).execute(function (resp) {
            console.log(resp);
            self.game.current = resp.result;
            self._controller.gameDataLoaded(resp);
        });
    };

    //get finished games
    p.getFinishedGames = function () {
        gapi.client.memo_game.get_user_complete_games()
            .execute(function (resp) {
                console.log(resp);
                self._controller.gameListReady(resp);
            });
    };

    //get unfinished games
    p.getUnfinishedGames = function () {
        gapi.client.memo_game.get_user_games()
            .execute(function (resp) {
                console.log(resp);
                self._controller.gameListReady(resp);
            });
    };

    //make a move

    p.updateMoveRecord = function (move_one, move_two) {
        if (!this.game.current.move_record) {
            this.game.current.move_record = [];
        }
        this.game.current.move_record.push(move_one, move_two);
    };

    p.makeMove = function (cardsTurned) {
        var move_one = cardsTurned[0],
            move_two;

        if (cardsTurned.length === 2) {
            move_two = cardsTurned[1];
            this.updateMoveRecord(move_one, move_two);
        }
        gapi.client.memo_game.move({
            'web_safe_key': this.game.current.web_safe_key,
            'move_one': move_one,
            'move_two': move_two
        }).execute(function (resp) {
            console.log(resp);
            self._controller.movePosted(resp);
        });
    };

    //create a new game

    p.createGame = function (level) {
        var levels = ['easy', 'medium', 'hard'];
        level = levels[level];
        gapi.client.memo_game.create_game({
            'level': level
        }).execute(function (resp) {
            console.log(resp);
            self.game.current = resp.result;
            self._controller.gameCreated(self.game.current);
        });
    };

    //oauth2

    p.retrieveProfileCallback = function () {
        gapi.client.memo_game.create_user().execute(function (resp) {
                console.log(resp);
                self._controller.loginSuccessfull();
            }
        );
    };

    p.userAuthed = function () {
        var request = gapi.client.oauth2.userinfo.get().execute(function (resp) {
            if (!resp.code) {
                self.isUserLogged = true;
                //s_btn.innerHTML = 'Sign out';
                self.retrieveProfileCallback(self);
            }
        });
    };

    p.signin = function (mode, callback) {
        gapi.auth.authorize({
                client_id: CLIENT_ID,
                scope: SCOPES, immediate: mode
            },
            callback);
    };

    p.auth = function () {
        if (!this.isUserLogged) {
            this.signin(false, this.userAuthed.bind(self));
        } else {
            this.isUserLogged = false;
        }
    };

    p.setupGoogleAPI = function () {
        var apiRoot = '//' + window.location.host + '/_ah/api',
            apisToLoad = 2,
            apisLoaded = 0; // must match number of calls to gapi.client.load();

        function callback() {
            apisLoaded++;
            if (apisLoaded === apisToLoad) {
                self._controller.apiReady();
            }
        }

        gapi.client.load('memo_game', 'v1', callback, apiRoot);
        gapi.client.load('oauth2', 'v2', callback);
    };

    return Model;
})();