/**
 * Created by Nuno Machado on 07/04/16.
 */

nmm.engine.AssetsLoader = (function () {

    'use strict';

    var self,
        BG = '/assets/images/bg.jpg',
        SPRITESHEETS = {
            ss1: ['/assets/images/atlas00@1x.json'],
            ss2: ['assets/images/atlas00@2x.json', 'assets/images/atlas01@2x.json']
        },
        AUDIOSPRITE = 'assets/sounds/audiosprite.mp3';

    function AssetsLoader(callback) {
        self = this;
        this._assetsLoaded = {
            sound: false,
            atlas: false
        };
        this._loader = null;
        this._callback = callback;
        this._init();
    }

    AssetsLoader.prototype._checkFirstSoundsAndAtlas = function () {
        if (this._assetsLoaded.sound && this._assetsLoaded.atlas) {
            this._callback();
        }
    };

    AssetsLoader.prototype._loadGraphics = function () {
        this._loader = PIXI.loader;
        nmm.runtime.appSetup.loader = this._loader;

        SPRITESHEETS['ss' + nmm.runtime.dimensions.resolution].forEach(function (sprite) {
            self._loader.add(sprite);
        });

        self._loader.add(BG);

        this._loader.load(function (loader, resources) {
            self._assetsLoaded.atlas = true;
            self._checkFirstSoundsAndAtlas();
        });
    };

    AssetsLoader.prototype._loadAudioSprite = function () {
        createjs.Sound.on('fileload', function () {
            self._assetsLoaded.sound = true;
            self._checkFirstSoundsAndAtlas();
        });
        createjs.Sound.registerSound(AUDIOSPRITE, 'audioSprite');
    };

    AssetsLoader.prototype._init = function () {
        this._loadAudioSprite();
        this._loadGraphics();
    };

    return AssetsLoader;
})();
