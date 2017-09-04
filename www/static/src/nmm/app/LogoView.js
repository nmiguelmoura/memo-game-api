nmm.app.LogoView = (function () {
    'use strict';

    function LogoView(controller, name, data) {
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._data = data;
        this._texts = [];
        this._init();
    }

    LogoView.prototype = Object.create(nmm.app.ViewProto.prototype);
    LogoView.prototype.constructor = LogoView;

    var p = LogoView.prototype;

    p.animateOut = function (callback) {

        nmm.app.ViewProto.prototype.animateOut.call(this, callback);
    };

    p.viewOut = function () {
        this.removeChild(this._logo);
        this._logo.destroy({
            children: true,
            texture: true
        });
        this._logo = null;

        this._texts.forEach(function (t) {
            this.removeChild(t);
            t.destroy({
                children: true,
                texture: true
            });
            t = null;
        }, this);
        this._texts = null;
    };

    p.viewIn = function () {
        TweenLite.delayedCall(1.5, function () {
            this._controller.startNameInputView();
        }, [], this);
    };

    p._addTexts = function () {
        var d = this._data.texts,
            style = {
                fontFamily: 'Arial',
                fill: '#ffffff'
            },
            text;

        d.forEach(function (t) {
            style.fontSize = t.fontSize;
            text = new PIXI.Text(t.text, style);
            text.anchor.set(t.anchor);
            text.position.set(t.x, t.y);
            text.scale.set(t.scale);
            this.addChild(text);
            this._texts.push(text);
        }, this);
    };

    p._addLogo = function () {
        var d = this._data.image;
        this._logo = new PIXI.Sprite(PIXI.Texture.fromFrame(d.frame));
        this._logo.anchor.set(0.5);
        this._logo.position.set(d.x, d.y);
        this.addChild(this._logo);
    };

    p._init = function () {
        this._addLogo();
        this._addTexts();
    };

    return LogoView;
})();