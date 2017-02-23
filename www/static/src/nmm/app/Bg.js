nmm.app.Bg = (function(){
    'use strict';

    function Bg(pool, numDifferentCards){
        PIXI.Container.call(this);
        this._pool = pool;
        this._numDifferentCards = numDifferentCards;
        this._lines = {
            line0: [],
            line1: [],
            line2: [],
            line3: [],
            line4: []
        };
        this._init();
    }

    Bg.prototype = Object.create(PIXI.Container.prototype);
    Bg.prototype.constructor = Bg;

    var p = Bg.prototype;

    p._onFrameUpdate = function () {

    };

    p._addCards = function () {
        var cards = new PIXI.Container();
        var i,
            j,
            lengthI = 5,
            lengthJ = 4,
            card;

        for(i = 0; i < lengthI; i++) {
            for(j = 0; j < lengthJ; j++) {
                card = this._pool.borrowFromPool();
                card.position.set(108 + i * 202, 10 + j * 273 - i % 2 * 136.5);
                card.alpha = 0.2;
                card.gotoAndStop(Math.round(Math.random() * (this._numDifferentCards - 1)));
                cards.addChild(card);
                this._lines['line' + i].push(card);
            }
        }

        this.addChild(cards);
    };

    p._addBgImage = function () {
        var bg = new PIXI.Sprite(PIXI.Texture.fromImage('/assets/images/bg.jpg'));
        this.addChild(bg);
    };

    p._init = function () {
        this._addBgImage();
        this._addCards();

        this._onFrameUpdateBound = this._onFrameUpdate.bind(this);
        nmm.runtime.appSetup.app.ticker.add(this._onFrameUpdateBound);
    };

    return Bg;
})();