nmm.app.Bg = (function(){
    'use strict';

    function Bg(){
        PIXI.Container.call(this);

        this._init();
    }

    Bg.prototype = Object.create(PIXI.Container.prototype);
    Bg.prototype.constructor = Bg;

    var p = Bg.prototype;

    p._addCards = function () {

    };

    p._addBgImage = function () {
        var bg = new PIXI.Sprite(PIXI.Texture.fromImage('/assets/images/bg.jpg'));
        this.addChild(bg);
    };

    p._init = function () {
        this._addBgImage();
        this._addCards();
    };

    return Bg;
})();