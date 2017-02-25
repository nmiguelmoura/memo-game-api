nmm.app.ViewManager = (function(){
    'use strict';

    function ViewManager(controller){
        // Manage registered views.
        this._controller = controller;
        this.views = {};
        this.activeView = null;
        this._callOutBound = this._callOut.bind(this);
    }

    var p = ViewManager.prototype;

    p._callOut = function (viewName) {
        // Remove old view from stack.
        this._controller.removeChild(this.getView(viewName));
    };

    p.changeActiveView = function (newView) {
        // Change active view.
        if(this.activeView) {
            this.activeView.animateOut(this._callOutBound);
        }

        this.activeView = this.views[newView];

        if(this.activeView) {
            this._controller.addChild(this.activeView);
            this.activeView.animateIn();
            return this.activeView;
        } else {
            console.info('There is no view available with that name (--> ' + name + ' <--).' );
        }
    };

    p.getView = function (name) {
        // Get view by name.
        if(this.views[name]) {
            return this.views[name];
        } else {
            console.info('There is no view available with that name (--> ' + name + ' <--).' );
        }
    };

    p.registerView = function (view, setActive) {
        // Register a view.
        var name = view.name;
        if(!this.views[name]) {
            this.views[name] = view;

            if(setActive) {
                this.changeActiveView(name);
            }
        } else {
            console.info('There is already a view with that name (--> ' + name + ' <--)' +
                ' registered! Please choose another name' +
                ' or use method getView(name) with chosen name as argument.');
        }
    };

    return ViewManager;
})();