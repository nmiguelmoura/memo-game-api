nmm.app.Card = (function () {
    'use strict';

    var btnTexture,
        textures;

    function Card(numTotalCards) {
        // Create card object.

        // Load textures.
        this._numTotalCards = numTotalCards;
        if (!textures) {
            this._getTextures();
        }
        // Extend AnimatedSprite class.
        PIXI.extras.AnimatedSprite.call(this, textures);
        this.gotoAndStop(this._numTotalCards - 1);
        this.btn = null;
        this.key = null;
        this.callback = null;
        this.guessed = false;
        this._init();
    }

    Card.prototype = Object.create(PIXI.extras.AnimatedSprite.prototype);
    Card.prototype.constructor = Card;

    var p = Card.prototype;

    p._click = function () {
        this.callback(this.key);
    };

    p.reset = function (animated) {
        // Turn card so it hides figure.
        var key = this._numTotalCards;
        if(animated) {
            this.turnCard(key);
        } else {
            this.gotoAndStop(key);
        }
    };

    p.showFrame = function (key) {
        // Show figure.
        this.turnCard(key);
    };

    p.turnCard = function (key) {
        // Animate card turn.
        var cardScale = this.scale.x;
        TweenLite.to(this.scale, 0.25, {x: 0});
        TweenLite.delayedCall(0.25, function () {
            // Swap texture when scale is 0.
            this.gotoAndStop(key);
        }, [], this);
        TweenLite.to(this.scale, 0.25, {x: cardScale, delay: 0.25});
    };

    p._getTextures = function () {
        var i;
        textures = [];

        // Get all available texture.
        // Figures plus question mark.
        for (i = 0; i < this._numTotalCards; i++) {
            textures.push(PIXI.Texture.fromFrame('card-' + i));
        }
        textures.push(PIXI.Texture.fromFrame('card-secret'));
    };

    p._addBtn = function () {
        // Add button to AnimatedSprite.
        if(!btnTexture) {
         var graph = new PIXI.Graphics();
            graph.beginFill(0xFF0000, 0)
                .drawRect(0, 0, 10, 10)
                .endFill();

            btnTexture = graph.generateTexture();
        }

        this._clickBound = this._click.bind(this);

        this.btn = new nmm.uiPIXI.TexturedBtn({
            fillTexture: btnTexture,
            x: 0,
            y: 0,
            scale: 1,
            autoHide: true,
            callback: this._clickBound
        });
        this.btn.width = 192;
        this.btn.height = 263;
        this.btn.hide();
        this.addChild(this.btn);
    };

    p._init = function () {
        this._addBtn();
    };

    return Card;
})();