nmm.app.ScoreView = (function () {
    'use strict';

    function ScoreView(controller, name) {
        nmm.app.ViewProto.call(this, name);
        this._controller = controller;
        this._topTexts = {};
        this._rankingTexts = {};
        this._tablesReady = 0;
        this._init();
    }

    ScoreView.prototype = Object.create(nmm.app.ViewProto.prototype);
    ScoreView.prototype.constructor = ScoreView;

    var p = ScoreView.prototype;

    p._incrementTableReady = function () {
        this._tablesReady ++;

        // Check  if both tables have loaded.
        if(this._tablesReady === 2) {
            this._controller.scoreReady();
        }
    };

    p._fillTable = function (textObj, data, ranking) {
        // Fill table (score or ranking) width data passed.
        var i,
            length = data.length,
            name = '',
            value = '',
            d;

        for(i = 0; i < length; i++) {
            d = data[i];
            name += d.user_name + '\n';

            if(ranking) {
                value += Math.round(parseFloat(d.ranking) * 100) + '\n';
            } else {
                value += d.score + '\n';
            }
        }

        textObj.playerName.setText(name);
        textObj.score.setText(value);
    };

    p.updateRanking = function (data) {
        // Update ranking values.

        // Consider only first 15 values.
        if(data.length > 15) {
            data.splice(15, data.length - 1);
        }
        this._incrementTableReady();
        this._fillTable(this._rankingTexts, data, true);
    };

    p.updateScore = function (data) {
        // Update score values.
        this._incrementTableReady();
        this._fillTable(this._topTexts, data);
    };

    p.viewOut = function () {
        // Clear all texts on out.
        this._topTexts.playerName.setText('');
        this._topTexts.score.setText('');
        this._rankingTexts.playerName.setText('');
        this._rankingTexts.score.setText('');
        this._tablesReady = 0;
    };

    p._addColumn = function (width, data, obj) {
        var column = new PIXI.Container();

        var style = {
            fontFamily: 'Arial',
            fontSize: '40px',
            fill: '#FFFFFF'
        };

        var title = new PIXI.Text(data.title, style);
        title.position.set(0, 0);
        column.addChild(title);

        style.fontSize = '20px';
        var subTitle = new PIXI.Text(data.subTitle, style);
        subTitle.anchor.set(1, 0);
        subTitle.position.set(width, 18);
        column.addChild(subTitle);

        var graph = new PIXI.Graphics();
        graph.lineStyle(1, 0xFFFFFF, 1)
            .moveTo(0, 0)
            .lineTo(width, 0);
        graph.position.set(0, 55);
        column.addChild(graph);

        style.lineHeight = 40;
        var player = new PIXI.Text('', style);
        player.position.y = 75;
        column.addChild(player);
        obj.playerName = player;

        style.align = 'right';
        var score = new PIXI.Text('', style);
        score.position.set(width, 75);
        score.anchor.set(1, 0);
        column.addChild(score);
        obj.score = score;

        column.position.set(data.x, data.y);
        this.addChild(column);
    };

    p._init = function () {
        var data = this._controller.getInfo(this.name).info;

        // Add score column.
        this._addColumn(data.width, data.column0, this._topTexts);

        // Add ranking column.
        this._addColumn(data.width, data.column1, this._rankingTexts);
    };

    return ScoreView;
})();