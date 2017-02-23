nmm.app.GameView = (function(){
    'use strict';

    function GameView(controller, name, pool){
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._pool = pool;
        this._data = this._controller.getInfo(this.name);
        this._values = {};
        this._init();
    }

    GameView.prototype = Object.create(nmm.app.ViewProto.prototype);
    GameView.prototype.constructor = GameView;

    var p = GameView.prototype;

    p._click = function (key) {

    };

    p.animateOut = function (callback) {
        //do stuff


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

            text = new PIXI.Text('00', style);
            text.anchor.set(1, 0);
            text.position.set(d.x + 177, d.y);
            stats.addChild(text);

            this._values[d.text] = text;
        }

        this.addChild(stats);
    };

    p._init = function () {
        this._clickBound = this._click.bind(this);

        this._addStats();
    };

    return GameView;
})();