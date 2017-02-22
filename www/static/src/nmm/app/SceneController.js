/**
 * Created by Nuno Machado on 10/11/15.
 */

nmm.app.SceneController=(function(){
    'use strict';

    function SceneController(){
        PIXI.Container.call(this);

        this._init();
    }

    SceneController.prototype=Object.create(PIXI.Container.prototype);
    SceneController.prototype.constructor=SceneController;

    p._init = function () {

    };

    return SceneController;
})();