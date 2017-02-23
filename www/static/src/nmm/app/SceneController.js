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

    var p = SceneController.prototype;

    p.getInfo = function (viewName) {
        return this._model[viewName];
    };

    p._registerViews = function () {
        //view manager
        this._viewManager = new nmm.app.ViewManager(this);
        //menu
        var menuView = new nmm.app.MenuView(this, 'menu');
        this._viewManager.registerView(menuView, true);

        var dificultyView = new nmm.app.DifficultyView(this, 'difficulty');
        this._viewManager.registerView(dificultyView);
    };

    p._init = function () {
        this._model = new nmm.app.Model();

        var bg = new nmm.app.Bg();
        this.addChild(bg);
        this._registerViews();
    };

    return SceneController;
})();