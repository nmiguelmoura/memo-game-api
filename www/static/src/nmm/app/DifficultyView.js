nmm.app.DifficultyView = (function(){
    'use strict';

    function DifficultyView(controller, name){
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._init();
    }

    DifficultyView.prototype = Object.create(nmm.app.ViewProto.prototype);
    DifficultyView.prototype.constructor = DifficultyView;

    var p = DifficultyView.prototype;

    p.viewIn = function () {

    };

    p._addBg = function () {

    };

    p._init = function () {
        this._addBg();
    };

    return DifficultyView;
})();