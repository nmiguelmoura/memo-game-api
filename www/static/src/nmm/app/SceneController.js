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

    p.allowDifficultySelect = function () {
        this._viewManager.changeActiveView('difficulty');
    };

    p.loginSuccessfull = function () {
        this._menuView.checkStatus();
    };

    p.attemptLogin = function () {
        this._model.auth();
    };

    p.isUserLogged = function () {
        return this._model.isUserLogged;
    };

    p.getInfo = function (viewName) {
        return this._model[viewName];
    };

    p._registerViews = function () {
        //view manager
        this._viewManager = new nmm.app.ViewManager(this);
        //menu
        this._menuView = new nmm.app.MenuView(this, 'menu');
        this._viewManager.registerView(this._menuView, true);

        this._difficultyView = new nmm.app.DifficultyView(this, 'difficulty');
        this._viewManager.registerView(this._difficultyView);

        this._gameSelectionView = new nmm.app.GameSelectionView(this, 'gameSelection');
        this._viewManager.registerView(this._gameSelectionView);

        this._gameView = new nmm.app.GameView(this, 'game', this._pool);
        this._viewManager.registerView(this._gameView);

        this._scoreView = new nmm.app.ScoreView(this, 'score');
        this._viewManager.registerView(this._scoreView);
    };

    p._init = function () {
        this._model = new nmm.app.Model(this);

        this._pool = new nmm.app.Pool(this._model.poolMaxElements, this._model.game.numTotalCards);

        var bg = new nmm.app.Bg(this._pool,this._model.bg, this._model.game.numTotalCards);
        this.addChild(bg);
        this._registerViews();

        this._model.setupGoogleAPI();
    };

    return SceneController;
})();