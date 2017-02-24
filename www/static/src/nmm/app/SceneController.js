/**
 * Created by Nuno Machado on 10/11/15.
 */

nmm.app.SceneController = (function () {
    'use strict';

    function SceneController() {
        PIXI.Container.call(this);

        this._init();
    }

    SceneController.prototype = Object.create(PIXI.Container.prototype);
    SceneController.prototype.constructor = SceneController;

    var p = SceneController.prototype;

    p.watchGame = function (web_safe_key) {

    };

    p.deleteGame = function (web_safe_key) {

    };

    p.loadGame = function (web_safe_key) {
        
    };

    p.gameListReady = function (data) {
        this._gameSelectionView.update(data.result.items);
    };

    p.showStoredGames = function (complete) {
        if(complete) {
            this._model.getFinishedGames();
        } else {
            this._model.getUnfinishedGames();
        }
        this._viewManager.changeActiveView('gameSelection');
    };

    p.enableRemainingCards = function (delay) {
        TweenLite.delayedCall(delay, function () {
            this._gameView.enableRemainingCards();
        }, [], this)
    };

    p.movePosted = function (data) {
        console.log(data.result);
        //update card
        if (data.move_two_key === "-1") {
            //only one card turned
            this._gameView.turnCard(0, parseInt(data.move_one_key));
        } else {
            //two cards turned
            this._gameView.turnCard(1, parseInt(data.move_two_key));
            this._gameView.updateValues(data.score, this._model.game.current.move_record);

            //check if guessed
            if (data.guessed) {
                //play guessed sound
                this._gameView.markMoveCardsAsGuessed();

                //check if complete
                if (data.complete) {

                } else {
                    this.enableRemainingCards(0.5);
                }
            } else {
                //play error sound
                TweenLite.delayedCall(1, function () {
                    this._gameView.resetLastMove();
                    this.enableRemainingCards(0.5);
                }, [], this);
            }
        }


    };

    p.cardTurned = function (cardsTurned) {
        this._model.makeMove(cardsTurned);
        if (cardsTurned.length === 2) {
            this._gameView.disableAllCards();
        }
    };

    p.gameCreated = function (data) {
        this._gameView.update(data, this._model.game[data.level]);
    };

    p.createGame = function (key) {
        this._model.createGame(key);
        this._viewManager.changeActiveView('game');
    };

    p.allowDifficultySelect = function () {
        this._viewManager.changeActiveView('difficulty');
    };

    p.loginSuccessfull = function () {
        this._menuView.checkStatus();
    };

    p.attemptLogin = function () {
        this._model.auth();
    };

    p.apiReady = function () {
        this._menuView.checkStatus();
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

        var bg = new nmm.app.Bg(this._pool, this._model.bg, this._model.game.numTotalCards);
        this.addChild(bg);
        this._registerViews();

        this._model.setupGoogleAPI();
    };

    return SceneController;
})();