nmm.app.Model = (function () {
    'use strict';

    function Model() {
        this.poolMaxElements = 48;

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
                    x: 400,
                    y: 50
                },
                {
                    text: 'Found:',
                    x: 550,
                    y: 50
                },
                {
                    text: 'Moves:',
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
            ],
            games: [
                {
                    //TODO apagar isto
                    name: '',
                    score: 0,
                    moves: 0,
                    complete: false
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
            ]
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

    return Model;
})();