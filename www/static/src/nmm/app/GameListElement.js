nmm.app.GameListElement = (function(){
    'use strict';

    var LOAD = 0,
        DELETE = 1,
        PLAY = 2;

    function GameListElement(controller, data){
        PIXI.Container.call(this);
        this._controller = controller;
        this._dataInfo = data.info;
        this._dataBtns = data.btns;
        this._valueTexts = [];
        this._btns = [];
        this._init();
    }

    GameListElement.prototype = Object.create(PIXI.Container.prototype);
    GameListElement.prototype.constructor = GameListElement;

    var p = GameListElement.prototype;

    p.update = function (data) {

    };

    p._click = function (key) {

    };

    p._addBtns = function () {
        var i,
            length = this._dataBtns.length,
            data,
            btn;

        for(i = 0; i < length; i++) {
            data = this._dataBtns[i];
            btn = new nmm.uiPIXI.TexturedBtn({
                fillTexture: data.texture,
                x: data.x,
                y: data.y,
                scale: 1,
                key: data.key,
                autoHide: false,
                callback: this._clickBound
            });
            btn.hide();
            this.addChild(btn);
            this._btns.push(btn);
        }
    };

    p._addSecondaryTexts = function () {
        var i,
            length = this._dataInfo.length,
            style = {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'right'
        },
            data,
            text;

        for(i = 0; i < length; i++) {
            data = this._dataInfo[i];
            text = new PIXI.Text(data.text, style);
            text.position.set(data.x, data.y);
            text.anchor.set(1, 0);
            this.addChild(text);

            text = new PIXI.Text('0', style);
            text.position.set(data.x + 30, data.y);
            text.anchor.set(1, 0);
            this.addChild(text);
            this._valueTexts.push(text);
        }
    };

    p._addMainText = function () {
        var style = {
            fontFamily: 'Arial',
            fontSize: '30px',
            fill: "#FFFFFF"
        };
        this._mainText = new PIXI.Text('main text', style);
        this.addChild(this._mainText);
    };

    p._addGraph = function () {
        var graph = new PIXI.Graphics();
        graph.lineStyle(1, 0xFFFFFF, 1)
            .moveTo(0, 0)
            .lineTo(708, 0);

        graph.position.set(0, 40);
        this.addChild(graph);
    };

    p._init = function () {
        this._clickBound = this._click.bind(this);

        this._addGraph();
        this._addMainText();
        this._addSecondaryTexts();
        this._addBtns();
    };

    return GameListElement;
})();