nmm.app.Pool = (function(){
    'use strict';

    function Pool(maxElements, numTotalCards){
        this._pool = [];
        this._maxElements = maxElements;
        this._init(numTotalCards);
    }

    var p = Pool.prototype;

    p.returnToPool = function (object) {
        object.reset();
        object.alpha = 1;
        object.scale.set(1);
        object.btn.hide();
        object.key = null;
        object.callback = null;
        object.guessed = false;
        this._pool.push(object);
    };

    p.borrowFromPool = function () {
        if(this._pool.length > 0) {
            return this._pool.pop();
        } else {
            // There is no need to auto create new cards in this case.
            console.info('No more cards in pool!');
        }
    };

    p._init = function (numTotalCards) {
        var i,
            animSprite;

        for(i = 0; i < this._maxElements; i++) {
            animSprite = new nmm.app.Card(numTotalCards);
            animSprite.anchor.set(0.5);
            this._pool.push(animSprite);
        }

    };

    return Pool;
})();