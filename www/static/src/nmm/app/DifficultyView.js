nmm.app.DifficultyView = (function(){
    'use strict';

    function DifficultyView(controller, name){
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._btns = [];
        this._init();
    }

    DifficultyView.prototype = Object.create(nmm.app.ViewProto.prototype);
    DifficultyView.prototype.constructor = DifficultyView;

    var p = DifficultyView.prototype;

    p.viewIn = function () {

    };

    p.animateOut = function (callback) {
        //do stuff
        this._btns.forEach(function (btn) {
            btn.hide();
        });

        nmm.app.ViewProto.prototype.animateOut.call(this, callback);
    };

    p.animateIn = function () {
        this._btns.forEach(function (btn) {
            btn.show();
        });
        nmm.app.ViewProto.prototype.animateIn.call(this);
    };

    p._click = function (key) {
        this._controller.createGame(key);
    };

    p._addOptions = function () {
        var btns = this._controller.getInfo(this.name).btns,
            btn,
            style = {
                fontFamily: 'Arial',
                fontSize: '120px',
                fill: '#FFFFFF'
            },
            graph = new PIXI.Graphics(),
            text = new PIXI.Text('', style),
            texture;

        graph.addChild(text);

        btns.forEach(function (b, i) {
            text.setText(b.text);
            texture = graph.generateTexture();
            btn = new nmm.uiPIXI.TexturedBtn({
                fillTexture: texture,
                x: b.x,
                y: b.y,
                key: b.key,
                scale: 0.5,
                autoHide: false,
                callback: this._clickBound
            });
            btn.hide();
            this.addChild(btn);
            this._btns.push(btn);
        }, this);
    };

    p._init = function () {
        this._clickBound = this._click.bind(this);
        this._addOptions();
    };

    return DifficultyView;
})();