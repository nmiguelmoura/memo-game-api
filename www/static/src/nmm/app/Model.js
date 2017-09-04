nmm.app.Model = (function () {
    'use strict';

    var self,
        MAX_NAME_LENGTH = 15,
        tempName = '';

    function Model(controller) {
        self = this;
        this._controller = controller;
        this._logic = new nmm.app.Logic();
        this.isUserLogged = false;

        this.poolMaxElements = 48;

        this.playerName = null;

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

        this.logo = {
            image: {
                frame: 'logo-cdc',
                x: 512,
                y: 315
            },
            texts: [
                {
                    text: 'Casa das Ciências',
                    fontSize: '116px',
                    x: 512,
                    y: 560,
                    anchor: 0.5,
                    scale: 0.5
                },
                {
                    text: 'RECURSOS EDUCATIVOS PARA PROFESSORES',
                    fontSize: '40px',
                    x: 512,
                    y: 625,
                    anchor: 0.5,
                    scale: 0.5
                }
            ]
        };

        this.nameInput = {
            title: {
                fontSize: '112px',
                text: 'Como te chamas?',
                anchor: 0.5,
                scale: 0.5,
                x: 512,
                y: 142
            },
            rectangle: {
                x: 173,
                y: 216,
                width: 680,
                height: 72,
                borderColor: 0xDD5C5C,
                fillColor: 0xFFFFFF,
                fillAlpha: 0.1,
                stroke: 2
            },
            nameText: {
                fontSize: '80px',
                fontStyle: 'italic',
                x: 186,
                y: 230,
                scale: 0.5
            },
            keyboard: {
                frame: 'keyboard',
                anchor: 0.5,
                x: 512,
                y: 469,
                width: 680,
                height: 273
            },
            btn: {
                text: 'Continuar',
                fontSize: '40px',
                anchor: 0.5,
                scale: 0.5,
                x: 512,
                y: 652,
                width: 100,
                height: 60
            }
        };

        this.menu = {
            btns: [
                {
                    x: 512,
                    y: 582,
                    key: 1,
                    text: 'Novo jogo'
                },
                {
                    x: 264,
                    y: 689,
                    key: 2,
                    text: 'Abrir jogo'
                },
                {
                    x: 772,
                    y: 689,
                    key: 3,
                    text: 'Ver histórico'
                }
            ]

        };

        this.difficulty = {
            btns: [
                {
                    x: 512,
                    y: 220,
                    key: 0,
                    text: 'Fácil'
                },
                {
                    x: 512,
                    y: 384,
                    key: 1,
                    text: 'Médio'
                },
                {
                    x: 512,
                    y: 547,
                    key: 2,
                    text: 'Difícil'
                }
            ],
            selected: null
        };

        this.gameSelection = {
            listMaxLength: 5,
            info: [
                {
                    text: 'Pontos:',
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
                    name: 'score',
                    text: 'Pontos',
                    x: 40,
                    y: 26,
                    offset: 177
                },
                {
                    name: 'moves',
                    text: 'Jogadas',
                    x: 780,
                    y: 26,
                    offset: 200
                }
            ],
            current: {}
        };

        this.score = {
            info: {
                width: 405,
                column0: {
                    title: 'Pontuação',
                    subTitle: 'pts.',
                    x: 57,
                    y: 57
                },
                column1: {
                    title: 'Ranking',
                    subTitle: '% certas',
                    x: 562,
                    y: 57
                }
            }
        };

        this._keyboardGrid = {
            originX: 174,
            originY: 334,
            lines: 4,
            columns: 10,
            width: 68,
            height: 68,
            order: [
                ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
                ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
                ['U', 'V', 'W', 'X', 'Y', 'Z', 'SPACE', 'SPACE', 'SPACE', 'DELETE']
            ]
        };
    }

    var p = Model.prototype;

    // Get rankings.
    p.getRankings = function () {
        this._controller.rankingLoaded(this._logic.rankings());
    };

    // Get top score.
    p.getTopScore = function () {
        this._controller.scoreLoaded(this._logic.score());
    };

    // Get game history.
    p.getGameHistory = function (web_safe_key) {
        var result = this._logic.history(web_safe_key);
        if (result) {
            self._controller.gameHistoryLoaded(result.level, result.score, result.history);
        }
    };

    // Delete game.
    p.deleteGame = function (web_safe_key) {
        this._logic.cancel(web_safe_key);
        this.getUnfinishedGames();
    };

    // Load game.
    p.loadGame = function (web_safe_key) {
        var result = this._logic.get_existing_game(web_safe_key);
        this.game.current = result;
        this._controller.gameDataLoaded(result);
    };

    // Get finished games.
    p.getFinishedGames = function () {
        this._controller.gameListReady(this._logic.get_games_list(true));
    };

    // Get unfinished games.
    p.getUnfinishedGames = function () {
        this._controller.gameListReady(this._logic.get_games_list(false));
    };

    // Make a move.
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

        var result = this._logic.make_move(move_one, move_two, this.game.current);

        if (result) {
            self._controller.movePosted(result);
        }
    };

    // Create a new game.
    p.createGame = function (level) {
        var levels = ['easy', 'medium', 'hard'];
        level = levels[level];

        self.game.current = this._logic.create_game(level, this._playerName);
        self._controller.gameCreated(self.game.current);
    };

    p.keyboardClicked = function (point) {
        var x = point.x - this._keyboardGrid.originX,
            y = point.y - this._keyboardGrid.originY,
            line = Math.floor(y / this._keyboardGrid.height),
            column = Math.floor(x / this._keyboardGrid.width),
            key = this._keyboardGrid.order[line][column];

        switch (key) {
            case 'SPACE':
                if (tempName.length < MAX_NAME_LENGTH) {
                    if (tempName !== '') {
                        tempName += ' ';
                    }
                }
                break;

            case 'DELETE':
                tempName = tempName.substring(0, tempName.length - 1);
                break;

            default:
                if (tempName.length < MAX_NAME_LENGTH) {
                    tempName += key;
                }
                break;

        }

        return tempName;
    };

    p.storePlayerName = function () {
        if (tempName !== '') {
            this._playerName = tempName;
        } else {
            this._playerName = 'JOGADOR 1'
        }
        localStorage.setItem('playerName', this._playerName);
    };

    p.getPlayerName = function () {
        var playerName = localStorage.getItem('playerName');
        if (playerName) {
            tempName = playerName;
            return playerName;
        }

        return null;
    };

    return Model;
})();