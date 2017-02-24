nmm.app.GameView = (function(){
    'use strict';

    function GameView(controller, name, pool){
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

    p.enableRemainingCards = function () {
        this._cards.forEach(function (card) {
            if(!card.guessed) {
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

    p._distributeCards = function (tiles_found, cardDistribution) {
        var i,
            length = cardDistribution.numCards,
            card,
            tile,
            pos;

        for (i = 0; i < length; i++) {
            tile = tiles_found[i];
            pos = cardDistribution.disposal[i];
            card = this._pool.borrowFromPool();
            if(tile === -1) {
                card.reset();
            } else {
                card.gotoAndStop(tile);
            }
            card.key = i;
            card.callback = this._clickBound;
            card.scale.set(cardDistribution.scale);
            card.position.set(512, 900);
            card.btn.show();
            TweenLite.to(card, 1, {x: pos.x, y: pos.y, delay: i * 0.05});
            this._cards.push(card);
            this.addChild(card);
        }
    };

    p.updateValues = function (score, move_record) {
        this._values.score.setText(score);
        this._values.moves.setText(move_record ? move_record.length / 2 : 0);
    };

    p.update = function (data, cardDistribution) {
        this.updateValues(data.score, data.move_record);
        this._distributeCards(data.tiles_found, cardDistribution);
        this._cardsTurned = [];
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

    };

    p.viewIn = function () {

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

        for(i = 0; i < length; i++) {
            d = info[i];
            text = new PIXI.Text(d.text, style);
            text.position.set(d.x, d.y);
            stats.addChild(text);

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
    };

    return GameView;
})();