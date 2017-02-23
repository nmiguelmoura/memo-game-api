/**
 * Created by casaDasCiencias on 09/02/17.
 */
nmm.app.ViewProto = (function(){
    'use strict';

    function ViewProto(name){
        PIXI.Container.call(this);
        this.name = name;
        this.alpha = 0;
    }

    ViewProto.prototype = Object.create(PIXI.Container.prototype);
    ViewProto.constructor = ViewProto;

    var p = ViewProto.prototype;

    p.viewOut = function (callback) {
        callback(this.name);
    };

    p.viewIn = function () {

    };

    p.destroy = function () {
        this.removeChildren();
        PIXI.Container.prototype.destroy.call(this, {
            children: true,
            texture: true
        })
    };

    p.animateOut = function (callback) {
        TweenLite.to(this, 0.5, {alpha: 0});
        TweenLite.delayedCall(0.5, function () {
            this.viewOut(callback);
        }, [], this);
    };

    p.animateIn = function () {
        TweenLite.to(this, 0.5, {alpha: 1});
        TweenLite.delayedCall(0.5, function () {
            this.viewIn();
        }, [], this);
    };



    return ViewProto;
})();