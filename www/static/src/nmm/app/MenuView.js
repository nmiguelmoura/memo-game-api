nmm.app.MenuView = (function(){
    'use strict';

    var LOGIN = 0,
        NEW = 1,
        LOAD = 2,
        HISTORY = 3;

    function MenuView(controller, name){
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._btns = [];
        this._init();
    }

    MenuView.prototype = Object.create(nmm.app.ViewProto.prototype);
    MenuView.prototype.constructor = MenuView;

    var p = MenuView.prototype;

    p._click = function (key) {
        switch(key) {
            case LOGIN:
                break;

            case NEW:
                break;

            case LOAD:
                break;

            case HISTORY:
                break;
        }
        console.log(key);
    };

    p.viewIn = function () {

    };

    p._addOptions = function () {
        this._optionsContainer = new PIXI.Container();

        var btns = this._controller.getInfo('menu').btns,
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
            this._optionsContainer.addChild(btn);
            this._btns.push(btn);
        }, this);

        this.addChild(this._optionsContainer);
    };

    p._addLoginBtn = function () {
        this._loginBtn = new nmm.uiPIXI.TexturedBtn({
            fillTexture: PIXI.Texture.fromFrame('btn-log'),
            shadowTexture: PIXI.Texture.fromFrame('btn-log-shadow'),
            x: 512,
            y: 638,
            scale: 1,
            shadowOffsetX: -0.3,
            shadowOffsetY: 2,
            key: LOGIN,
            autoHide: true,
            callback: this._clickBound
        });
        this.addChild(this._loginBtn);
    };

    p._addTitle = function () {
        var title = new PIXI.Container();

        var t0 = new PIXI.Sprite.fromFrame('title-0');
        t0.position.set(67, 72);
        title.addChild(t0);

        var t1 = new PIXI.Sprite.fromFrame('title-1');
        t1.position.set(404, 321);
        title.addChild(t1);

        this.addChild(title);
    };

    p._init = function () {
        this._addTitle();

        this._clickBound = this._click.bind(this);
        this._addLoginBtn();
        this._addOptions();
    };

    return MenuView;
})();