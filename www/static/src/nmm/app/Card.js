nmm.app.Card = (function () {
    'use strict';

    var textures;

    function Card(numTotalCards) {
        this._numTotalCards = numTotalCards;
        if (!textures) {
            this._getTextures();
        }
        PIXI.extras.AnimatedSprite.call(this, textures);
        this.gotoAndStop(this._numTotalCards - 1);
    }

    Card.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);
    Card.prototype.constructor = Card;

    var p = Card.prototype;

    p.reset = function (animated) {
        var key = this._numTotalCards - 1;
        if(animated) {
            this.turnCard(key);
        } else {
            this.gotoAndStop(key);
        }
    };

    p.showFrame = function (key) {
        this.turnCard(key);
    };

    p.turnCard = function (key) {
        TweenLite.to(this.scale, 0.2, {x: 0});
        TweenLite.delayedCall(function () {
            this.gotoAndStop(key);
        });
        TweenLite.to(this.scale, 0.2, {x: 1, delay: 0.25});
    };

    p._getTextures = function () {
        var i;

        textures = [];

        for (i = 0; i < this._numTotalCards; i++) {
            textures.push(PIXI.Texture.fromFrame('card-' + i));
        }
        textures.push(PIXI.Texture.fromFrame('card-secret'));
    };

    return Card;
})();