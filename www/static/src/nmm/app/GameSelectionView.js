nmm.app.GameSelectionView = (function(){
    'use strict';

    function GameSelectionView(controller, name){
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._btns = [];
        this._init();
    }

    GameSelectionView.prototype = Object.create(nmm.app.ViewProto.prototype);
    GameSelectionView.prototype.constructor = GameSelectionView;

    var p = GameSelectionView.prototype;

    p.viewIn = function () {

    };

    p.animateOut = function (callback) {
        //do stuff


        nmm.app.ViewProto.prototype.animateOut.call(this, callback);
    };

    p._createElement = function () {
        //TODO para apagar criar lista na chamada
        var data = this._controller.getInfo(this.name);
        var element = new nmm.app.GameListElement(this._controller, data);
        this.addChild(element);
    };

    p._init = function () {
        this._createElement();
    };

    return GameSelectionView;
})();