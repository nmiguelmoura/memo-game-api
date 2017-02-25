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

    p.scoreReady = function () {
        TweenLite.delayedCall(4, function () {
            this._viewManager.changeActiveView('menu');
            this._menuView.checkStatus();
        }, [], this);
    };

    p.rankingLoaded = function (data) {
        this._scoreView.updateRanking(data.result.items);
    };

    p.scoreLoaded = function (data) {
        this._scoreView.updateScore(data.result.items);
    };

    p.gameOver = function () {
        this._model.getTopScore();
        this._model.getRankings();
        this._viewManager.changeActiveView('score');
    };

    p.gameHistoryLoaded = function (level, score, history) {
        this._gameView.playMode(score, history, this._model.game[level]);
    };

    p.watchGame = function (web_safe_key) {
        this._model.getGameHistory(web_safe_key);
        this._viewManager.changeActiveView('game');
    };

    p.deleteGame = function (web_safe_key) {
        this._gameSelectionView.clear();
        this._model.deleteGame(web_safe_key);
    };

    p.gameDataLoaded = function (data) {
        this._gameView.update(data, this._model.game[data.level]);
    };

    p.loadGame = function (web_safe_key) {
        this._model.loadGame(web_safe_key);
        this._viewManager.changeActiveView('game')
    };

    p.gameListReady = function (data) {
        this._gameSelectionView.update(data.result.items);
        if(!data.result.items) {
            TweenLite.delayedCall(2, function () {
                this._viewManager.changeActiveView('menu');
                this._menuView.checkStatus();
            }, [], this);
        }
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
            this._gameView.updateValues(data.score, this._model.game.current.move_record.length / 2);

            //check if guessed
            if (data.guessed) {
                nmm.runtime.audio.playSound('audioSprite', 'correct');
                this._gameView.markMoveCardsAsGuessed();

                //check if complete
                if (data.complete) {
                    TweenLite.delayedCall(1, function () {
                        this._gameView.gameOver();
                    }, [], this);
                    TweenLite.delayedCall(3, function () {
                        this.gameOver();
                    }, [], this);
                } else {
                    this.enableRemainingCards(0.5);
                }
            } else {
                nmm.runtime.audio.playSound('audioSprite', 'wrong');
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

        nmm.runtime.audio.playBgSound('audioSprite', 'music');
    };

    return SceneController;
})();