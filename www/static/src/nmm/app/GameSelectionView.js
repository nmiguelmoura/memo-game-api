nmm.app.GameSelectionView = (function(){
    'use strict';

    function GameSelectionView(controller, name){
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._genericData = this._controller.getInfo(this.name);
        this._elements = [];
    }

    GameSelectionView.prototype = Object.create(nmm.app.ViewProto.prototype);
    GameSelectionView.prototype.constructor = GameSelectionView;

    var p = GameSelectionView.prototype;

    p.update = function (data) {
        if(data.length > 5) {
            data.splice(5, data.length - 1);
        }

        var i,
            length = data.length,
            element,
            elementsLimit = this._elements.length - 1;

        for (i = 0; i < length; i++) {
            if(i > elementsLimit) {
                element = this._createElement();
                this._elements.push(element);
            } else {
                element = this._elements[i];
            }
            element.update(data[i], i + 1);
            element.position.set(158, 87 + i * 129);
            this.addChild(element);
        }
    };

    p.viewIn = function () {

    };

    p.animateOut = function (callback) {
        //do stuff

        this._elements.forEach(function (element) {
            this.removeChild(element);
            element.disable();
        });
        nmm.app.ViewProto.prototype.animateOut.call(this, callback);
    };

    p._createElement = function () {
        return new nmm.app.GameListElement(this._controller, this._genericData);
    };

    return GameSelectionView;
})();