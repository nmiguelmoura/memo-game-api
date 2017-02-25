nmm.app.GameSelectionView = (function () {
    'use strict';

    function GameSelectionView(controller, name) {
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._genericData = this._controller.getInfo(this.name);
        this._elements = [];
        this._init();
    }

    GameSelectionView.prototype = Object.create(nmm.app.ViewProto.prototype);
    GameSelectionView.prototype.constructor = GameSelectionView;

    var p = GameSelectionView.prototype;

    p.clear = function () {
        // Clear all elements from view.
        this._elements.forEach(function (element) {
            this.removeChild(element);
            element.disable();
        }, this);
    };

    p.update = function (data) {
        // Update list with data passed.
        if (!data) {
            this._infoText.setText('There are no games stored.');
        } else {
            this._infoText.setText('');

            // Consider only first 5 results.
            if (data.length > 5) {
                data.splice(5, data.length - 1);
            }

            var i,
                length = data.length,
                element,
                elementsLimit = this._elements.length - 1;

            for (i = 0; i < length; i++) {
                if (i > elementsLimit) {
                    // Create new element object.
                    element = this._createElement();
                    this._elements.push(element);
                } else {
                    element = this._elements[i];
                }
                element.update(data[i], i + 1);
                element.position.set(158, 87 + i * 129);
                this.addChild(element);
            }
        }
    };

    p.viewIn = function () {

    };

    p.viewOut = function () {
        this._infoText.setText('');
        this._elements.forEach(function (element) {
            this.removeChild(element);
        }, this);
    };

    p.animateOut = function (callback) {
        //do stuff
        this._elements.forEach(function (element) {
            element.disable();
        }, this);
        nmm.app.ViewProto.prototype.animateOut.call(this, callback);
    };

    p._createElement = function () {
        return new nmm.app.GameListElement(this._controller, this._genericData);
    };

    p._addInfoText = function () {
        // Add text to inform the user no games are available.
        var style = {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: '#FFFFFF'
        };
        this._infoText = new PIXI.Text('', style);
        this._infoText.position.set(158, 87);
        this.addChild(this._infoText);
    };

    p._init = function () {
        this._addInfoText();
    };

    return GameSelectionView;
})();