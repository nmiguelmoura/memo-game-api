nmm.app.NameInputView = (function () {
    'use strict';

    function NameInputView(controller, name, data) {
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._data = data;
        this._init();
    }

    NameInputView.prototype = Object.create(nmm.app.ViewProto.prototype);
    NameInputView.prototype.constructor = NameInputView;

    var p = NameInputView.prototype;

    p.animateOut = function (callback) {
        nmm.app.ViewProto.prototype.animateOut.call(this, callback);
    };

    p.viewOut = function () {
        this.removeChild(this._title);
        this._title.destroy({
            children: true,
            texture: true
        });
        this._title = null;

        this.removeChild(this._rectangle);
        this._rectangle.clear();
        this._rectangle.destroy();
        this._rectangle = null;

        this.removeChild(this._nameField);
        this._nameField.destroy({
            children: true,
            texture: true
        });
        this._nameField = null;

        this.removeChild(this._keyboard);
        this._keyboard.destroy({
            children: true,
            texture: true
        });
        this._keyboard = null;

        this._keyboardBtn.hide();
        this.removeChild(this._keyboardBtn);
        this._keyboardBtn.destroyBtn();
        this._keyboardBtn = null;

        this.removeChild(this._btnText);
        this._btnText.destroy({
            children: true,
            texture: true
        });
        this._btnText = null;

        this._btn.hide();
        this.removeChild(this._btn);
        this._btn.destroyBtn();
        this._btn = null;
    };

    p.viewIn = function () {
        this._keyboardBtn.show();
    };

    p.updateName = function (name) {
        this._nameField.text = name;
    };

    p._clickContinue = function () {
        this._controller.nameReady();
    };

    p.clickKeyboard = function (key, type, event) {
        var point = event.data.getLocalPosition(nmm.runtime.scene);
        this._controller.keyboardClicked(point);
    };

    p._addBtn = function () {
        var d = this._data.btn,
        style = {
            fontFamily: 'Arial',
            fontSize: d.fontSize,
            fill: '#FFFFFF'
        };

        this._btnText = new PIXI.Text(d.text, style);
        this._btnText.anchor.set(0.5);
        this._btnText.scale.set(0.5);
        this._btnText.position.set(d.x, d.y);
        this.addChild(this._btnText);

        var graph = new PIXI.Graphics()
            .beginFill(0xFF0000, 0)
            .drawRect(0, 0, d.width, d.height)
            .endFill();

        this._clickContinueBound = this._clickContinue.bind(this);
        this._btn = new nmm.uiPIXI.TexturedBtn({
            fillTexture: graph.generateTexture(),
            x: d.x,
            y: d.y,
            callback: this._clickContinueBound
        });

        this._btn.width = d.width;
        this._btn.height = d.height;
        this.addChild(this._btn);
    };

    p._addKeyboard = function () {
        var d = this._data.keyboard;
        this._keyboard = new PIXI.Sprite(PIXI.Texture.fromFrame(d.frame));
        this._keyboard.anchor.set(d.anchor);
        this._keyboard.position.set(d.x, d.y);
        this.addChild(this._keyboard);

        var graph = new PIXI.Graphics()
            .beginFill(0xFF0000, 0)
            .drawRect(0, 0, 10, 10)
            .endFill();

        this._clickKeyboardBound = this.clickKeyboard.bind(this);
        this._keyboardBtn = new nmm.uiPIXI.TexturedBtn({
            fillTexture: graph.generateTexture(),
            x: d.x,
            y: d.y,
            autoHide: false,
            callback: this._clickKeyboardBound
        });
        this._keyboardBtn.width = d.width;
        this._keyboardBtn.height = d.height;
        this._keyboardBtn.hide();
        this.addChild(this._keyboardBtn);
    };

    p._addNameField = function () {
        var d = this._data.nameText,
            style = {
                fontFamily: 'Arial',
                fontSize: d.fontSize,
                fontStyle: d.fontStyle,
                fill: '#FFFFFF'
            },
            name = this._controller.getPlayerName() || '';

        this._nameField = new PIXI.Text(name, style);
        this._nameField.scale.set(d.scale);
        this._nameField.position.set(d.x, d.y);
        this.addChild(this._nameField);
    };

    p._addRectangle = function () {
        var d = this._data.rectangle;
        this._rectangle = new PIXI.Graphics()
            .lineStyle(d.stroke, d.borderColor, 1)
            .beginFill(d.fill, d.fillAlpha)
            .drawRect(d.x, d.y, d.width, d.height)
            .endFill();
        this.addChild(this._rectangle);
    };

    p._addText = function () {
        var d = this._data.title,
            style = {
                fontFamily: 'Arial',
                fill: '#ffffff',
                fontSize: d.fontSize
            };

        this._title = new PIXI.Text(d.text, style);
        this._title.anchor.set(0.5);
        this._title.scale.set(0.5);
        this._title.position.set(d.x, d.y);
        this.addChild(this._title);

    };

    p._init = function () {
        this._addText();
        this._addRectangle();
        this._addNameField();
        this._addKeyboard();
        this._addBtn();
    };

    return NameInputView;
})();