nmm.app.MenuView = (function () {
    'use strict';

    var LOGIN = 0,
        NEW = 1,
        LOAD = 2,
        HISTORY = 3;

    function MenuView(controller, name) {
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._btns = [];
        this._init();
    }

    MenuView.prototype = Object.create(nmm.app.ViewProto.prototype);
    MenuView.prototype.constructor = MenuView;

    var p = MenuView.prototype;

    p.animateOut = function (callback) {
        //do stuff
        this._btns.forEach(function (btn) {
            btn.hide();
        });

        nmm.app.ViewProto.prototype.animateOut.call(this, callback);
    };

    p._click = function (key) {
        switch (key) {
            case LOGIN:
                this._controller.attemptLogin();
                break;

            case NEW:
                this._controller.allowDifficultySelect();
                break;

            case LOAD:
                this._controller.showStoredGames(false);
                break;

            case HISTORY:
                this._controller.showStoredGames(true);
                break;
        }
    };

    p.viewIn = function () {

    };

    p.checkStatus = function () {
        var isUserLogged = this._controller.isUserLogged();

        if (isUserLogged) {
            this._loginBtn.hide();
            this._btns.forEach(function (btn) {
                btn.show();
            }, this);
        } else {
            this._loginBtn.show();
            this._btns.forEach(function (btn) {
                btn.hide();
            }, this);

            nmm.runtime.appSetup.app.ticker.remove(this._loaderUpdateBound);
            this.removeChild(this._loader);
            this._loader.destroy({
                children: true,
                texture: true
            });
        }
    };

    p._addOptions = function () {
        this._optionsContainer = new PIXI.Container();

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
        this._loginBtn.hide();
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

    p._loaderUpdate = function () {
        this._loader.rotation += 0.02;
    };

    p._addLoader = function () {
        this._loader = new PIXI.Sprite(PIXI.Texture.fromFrame('loader'));
        this._loader.anchor.set(0.5);
        this._loader.position.set(512, 638);
        this.addChild(this._loader);
    };

    p._init = function () {
        this._addTitle();

        this._clickBound = this._click.bind(this);
        this._addLoader();
        this._addLoginBtn();
        this._addOptions();

        this._loaderUpdateBound = this._loaderUpdate.bind(this);
        nmm.runtime.appSetup.app.ticker.add(this._loaderUpdateBound);
    };

    return MenuView;
})();