nmm.engine.Application = (function () {
    'use strict';

    var WIDTH = 1024,
        HEIGHT = 768;

    function Application() {
        this._init();
    }

    var p = Application.prototype;



    p._assetsLoaded = function () {
        nmm.runtime.appSetup.stage.removeChild(this._preloader);
        this._preloader.destroy();

        nmm.runtime.audio = new nmm.engine.AudioManager(nmm.app.audioSprite);

        nmm.runtime.scene = new nmm.app.SceneController();
        nmm.runtime.appSetup.stage.addChild(nmm.runtime.scene);
    };

    p._loadAssets = function () {
        var _assetsLoadedBound = this._assetsLoaded.bind(this);
        this._loader = new nmm.engine.AssetsLoader(_assetsLoadedBound);
    };

    p._addPreloader = function () {
        this._preloader = new nmm.tools.Preloader();
        nmm.runtime.appSetup.stage.addChild(this._preloader);
    };

    p._resizeApp = function () {
        var resize = new nmm.tools.Resize(nmm.runtime.appSetup.renderer, nmm.runtime.appSetup.stage, WIDTH, HEIGHT);
    };

    p._setupApp = function () {
        var resolution = window.devicePixelRatio;
        var app = new PIXI.Application(WIDTH, HEIGHT, {
            resolution: window.devicePixelRatio,
            autoResize: true
        });

        var renderer = app.renderer;
        var view = app.view;
        var stage = app.stage;

        document.body.appendChild(view);

        nmm.runtime.appSetup = {
            app: app,
            renderer: renderer,
            view: view,
            stage: stage
        };

        nmm.runtime.dimensions = {};
        nmm.runtime.dimensions.resolution = resolution;
        nmm.runtime.dimensions.width = WIDTH;
        nmm.runtime.dimensions.height = HEIGHT;
    };

    p._init = function () {
        this._setupApp();
        this._resizeApp();
        this._addPreloader();
        this._loadAssets();
    };

    return Application;
})();