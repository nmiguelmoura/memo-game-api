nmm.app.Model = (function(){
    'use strict';

    function Model(){
        this.menu = {
            btns: [
                {
                    x: 512,
                    y: 582,
                    key: 1,
                    text: 'New Game'
                },
                {
                    x: 264,
                    y: 689,
                    key: 2,
                    text: 'Load Game'
                },
                {
                    x: 772,
                    y: 689,
                    key: 3,
                    text: 'View History'
                },
            ]

        };
    }

    var p = Model.prototype;

    return Model;
})();