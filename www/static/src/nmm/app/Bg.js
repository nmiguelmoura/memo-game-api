nmm.app.Bg = (function(){
    'use strict';

    function Bg(pool, bgData, numDifferentCards){
        PIXI.Container.call(this);
        this._pool = pool;
        this._data = bgData;
        this._numDifferentCards = numDifferentCards;
        this._lines = {};
        this._init();
    }

    Bg.prototype = Object.create(PIXI.Container.prototype);
    Bg.prototype.constructor = Bg;

    var p = Bg.prototype;

    p._onFrameUpdate = function () {
        var i,
            j,
            lengthI = this._data.numLines,
            lengthJ = this._data.numCardsPerLine,
            // Each line has a different speed.
            speeds = this._data.speeds,
            card;

        for(i = 0; i < lengthI; i++) {
            for (j = 0; j < lengthJ; j++) {
                card = this._lines['line' + i][j];
                // Increment cards position.
                card.position.y -= speeds[i];

                // If card out of bounds, reposition in.
                if(card.position.y < -137) {
                    card.position.y = 954;
                }
            }
        }
    };

    p._addCards = function () {
        // Add cards to background.
        var cards = new PIXI.Container();
        var i,
            j,
            lengthI = this._data.numLines,
            lengthJ = this._data.numCardsPerLine,
            card;

        // Cards are grouped in lines.
        for(i = 0; i < lengthI; i++) {
            this._lines['line' + i] = [];
            for(j = 0; j < lengthJ; j++) {
                // Borrow card from pool.
                card = this._pool.borrowFromPool();
                card.position.set(108 + i * 202, 10 + j * 273 - i % 2 * 136.5);
                card.alpha = 0.2;

                // Random card figure.
                card.gotoAndStop(Math.round(Math.random() * (this._numDifferentCards - 1)));
                cards.addChild(card);
                this._lines['line' + i].push(card);
            }
        }

        this.addChild(cards);
    };

    p._addBgImage = function () {
        // Bg sprite.
        var bg = new PIXI.Sprite(PIXI.Texture.fromImage('/assets/images/bg.jpg'));
        this.addChild(bg);
    };

    p._init = function () {
        // Add bg image.
        this._addBgImage();

        // Add moving cards.
        this._addCards();

        // Add function to ticker to allow moving cards.
        this._onFrameUpdateBound = this._onFrameUpdate.bind(this);
        nmm.runtime.appSetup.app.ticker.add(this._onFrameUpdateBound);
    };

    return Bg;
})();