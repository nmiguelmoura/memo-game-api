nmm.tools.Preloader = (function(){
    'use strict';

    function Preloader(){
        PIXI.Container.call(this);
        this._init();
    }

    Preloader.prototype = Object.create(PIXI.Container.prototype);
    Preloader.prototype.constructor = Preloader;

    var p = Preloader.prototype;

    p.destroy = function () {
        // Destroy preloader after use.
        nmm.runtime.appSetup.app.ticker.remove(this._onFrameUpdateBound);
        this.removeChildren();

        this._icon.destroy({
            children: true,
            texture: true
        });

        this._text.destroy({
            children: true,
            texture: true
        });

        PIXI.Container.prototype.destroy.call(this, {
            children: true
        });
    };

    p._onFrameUpdate = function () {
        // Rotate graph in every tick.
        this._icon.rotation += 0.02;
    };

    p._addText = function () {
        // Add preloader text.
        var style = {
            font:'28px Arial',
            fill: '#FFFFFF'
        };
        this._text = new PIXI.Text('Loading...', style);
        this._text.anchor.set(0.5);
        this._text.scale.set(0.5);
        this._text.position.set(nmm.runtime.dimensions.width / 2, nmm.runtime.dimensions.height / 2 + 45);
        this.addChild(this._text);
    };

    p._addGraph = function () {
        // Add preloader graphics.
        this._icon = new PIXI.Graphics ();
        this._icon.beginFill(0xFFFFFF, 1)
            .drawCircle(0, -40, 5)
            .beginFill(0xFFFFFF, 0.9)
            .drawCircle(-28, -28, 5)
            .beginFill(0xFFFFFF, 0.8)
            .drawCircle(-40, 0, 5)
            .beginFill(0xFFFFFF, 0.7)
            .drawCircle(-28, 28, 5)
            .beginFill(0xFFFFFF, 0.6)
            .drawCircle(0, 40, 5)
            .beginFill(0xFFFFFF, 0.5)
            .drawCircle(28, 28, 5)
            .beginFill(0xFFFFFF, 0.4)
            .drawCircle(40, 0, 5)
            .beginFill(0xFFFFFF, 0.3)
            .drawCircle(28, -28, 5)
            .endFill();

        this._icon.position.set(nmm.runtime.dimensions.width / 2, nmm.runtime.dimensions.height / 2);
        this._icon.scale.set(0.5);
        this.addChild(this._icon);
    };

    p._init = function () {
        this._addGraph();
        this._addText();

        // Add update function to ticker.
        this._onFrameUpdateBound = this._onFrameUpdate.bind(this);
        nmm.runtime.appSetup.app.ticker.add(this._onFrameUpdateBound);
    };

    return Preloader;
})();