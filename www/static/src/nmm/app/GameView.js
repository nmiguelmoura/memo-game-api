nmm.app.GameView = (function () {
    'use strict';

    function GameView(controller, name, pool) {
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._pool = pool;
        this._data = this._controller.getInfo(this.name);
        this._values = {};
        this._cards = [];
        this._cardsTurned = [];
        this._init();
    }

    GameView.prototype = Object.create(nmm.app.ViewProto.prototype);
    GameView.prototype.constructor = GameView;

    var p = GameView.prototype;

    p.gameOver = function () {
        this._greatSign.alpha = 0;
        this._greatSign.rotation = 0;
        this._greatSign.scale.set(2);
        this.addChild(this._greatSign);

        TweenLite.to(this._greatSign, 0.5, {alpha: 1, rotation: -0.2});
        TweenLite.to(this._greatSign.scale, 0.5, {x: 1, y: 1, ease: Back.easeOut.config(2)});
    };

    p.enableRemainingCards = function () {
        this._cards.forEach(function (card) {
            if (!card.guessed) {
                card.btn.show();
            }
        });
    };

    p.markMoveCardsAsGuessed = function () {
        var cardOneKey = this._cardsTurned[0],
            cardTwoKey = this._cardsTurned[1];

        this._cards[cardOneKey].guessed = true;
        this._cards[cardTwoKey].guessed = true;
        this._cardsTurned = [];
    };

    p.resetLastMove = function () {
        var cardOneKey = this._cardsTurned[0],
            cardTwoKey = this._cardsTurned[1];

        this._cards[cardOneKey].reset(true);
        this._cards[cardTwoKey].reset(true);
        this._cardsTurned = [];
    };

    p.turnCard = function (card, key) {
        var cardKey = this._cardsTurned[card];
        this._cards[cardKey].turnCard(key);
    };

    p.disableAllCards = function () {
        this._cards.forEach(function (card) {
            card.btn.hide();
        });
    };

    p._click = function (key) {
        this._cardsTurned.push(key);
        this._controller.cardTurned(this._cardsTurned);
    };

    p._distributeCards = function (tiles_found, cardDistribution, playMode) {
        var i,
            length = cardDistribution.numCards,
            card,
            tile,
            pos;

        for (i = 0; i < length; i++) {
            if (playMode) {
                tile = "-1";
            } else {
                tile = tiles_found[i];
            }
            pos = cardDistribution.disposal[i];
            card = this._pool.borrowFromPool();
            if (tile === "-1") {
                card.reset();
                card.btn.show();
            } else {
                card.gotoAndStop(tile);
                card.guessed = true;
            }
            card.key = i;
            card.callback = this._clickBound;
            card.scale.set(cardDistribution.scale);
            card.position.set(512, 900);
            TweenLite.to(card, 1, {x: pos.x, y: pos.y, delay: i * 0.05});
            this._cards.push(card);
            this.addChild(card);
        }
    };

    p.updateValues = function (score, moves) {
        this._values.score.setText(score);
        this._values.moves.setText(moves);
    };

    p.update = function (data, cardDistribution) {
        this.updateValues(data.score, data.move_record ? data.move_record.length / 2 : 0);
        this._distributeCards(data.tiles_found, cardDistribution);
        this._cardsTurned = [];
    };

    p.playMoves = function (history) {
        console.log(history);
        var i,
            length = history.length,
            h,
            delay;

        for (i = 0; i < length; i++) {
            h = history[i];
            delay = 1.5 + i * 2;
            TweenLite.delayedCall(delay, function (h) {
                this._cards[h.move_one].turnCard(h.move_one_key);
                this._cards[h.move_two].turnCard(h.move_two_key);

                if (!h.guessed) {
                    TweenLite.delayedCall(1, function (h) {
                        this._cards[h.move_one].reset(true);
                        this._cards[h.move_two].reset(true);
                    }, [h], this);
                }
            }, [h], this);
        }

        delay = 2 + history.length * 2;
        TweenLite.delayedCall(delay, function () {
            this._controller.gameOver();
        }, [], this);
    };

    p.playMode = function (score, history, cardDistribution) {
        this.updateValues(score, history.length);
        this._distributeCards([], cardDistribution, true);
        this.playMoves(history);
    };

    p.animateOut = function (callback) {
        //do stuff

        this._cards.forEach(function (card) {
            this.removeChild(card);
            this._pool.returnToPool(card);
        }, this);
        this._cards.splice(0);
        nmm.app.ViewProto.prototype.animateOut.call(this, callback);
    };

    p.viewOut = function () {
        this.removeChild(this._greatSign);
    };

    p.viewIn = function () {

    };

    p._addGreatSign = function () {
        this._greatSign = new PIXI.Sprite(PIXI.Texture.fromFrame('great'));
        this._greatSign.anchor.set(0.5);
        this._greatSign.position.set(512, 384);
    };

    p._addStats = function () {
        var stats = new PIXI.Container();

        var info = this._data.info,
            i,
            length = info.length,
            d,
            text,
            style = {
                fontFamily: 'Arial',
                fontSize: '40px',
                fill: '#FFFFFF'
            };

        for (i = 0; i < length; i++) {
            d = info[i];
            style.align = 'left';
            text = new PIXI.Text(d.text, style);
            text.position.set(d.x, d.y);
            stats.addChild(text);

            style.align = 'right';
            text = new PIXI.Text('', style);
            text.anchor.set(1, 0);
            text.position.set(d.x + 177, d.y);
            stats.addChild(text);

            this._values[d.text.toLowerCase()] = text;
        }

        this.addChild(stats);
    };

    p._init = function () {
        this._clickBound = this._click.bind(this);

        this._addStats();
        this._addGreatSign();
    };

    return GameView;
})();