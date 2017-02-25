nmm.uiPIXI.TexturedBtn=(function(){
    'use strict';

    function TexturedBtn(args){
        PIXI.Container.call(this);
        // Shadow to show / hide on button click.
        this._shadowTexture=args.shadowTexture||null;
        // Primary fill texture.
        this._fillTexture=args.fillTexture||null;

        // Secondary fill texture (if needed).
        this._secondaryFillTexture = args.secondaryFillTexture||null;

        // Store active texture (primary and secondary).
        this._activeTexture = 'primary';

        this._x=args.x||0;
        this._y=args.y||0;

        this._defaultCursor=args.defaultCursor;

        // Shadow offset, if needed.
        this._shadowOffsetX=args.shadowOffsetX||0;
        this._shadowOffsetY=args.shadowOffsetY||0;

        this._key=args.key||0;

        // Hide button after click.
        this._autoHide=args.autoHide;
        if(this._autoHide===undefined){
            this._autoHide=true;
        }

        this._trackMouseDown=args.trackMouseDown===true;

        this._callback=args.callback||function(){};

        // Add events on button initialization.
        this._startInteractive=args.startInteractive===undefined?true:args.startInteractive;

        // Texture scale.
        this._scale=args.scale||0.5;
        this.scale.set(this._scale);


        this.position.set(this._x,this._y);
        this._init();
    }

    TexturedBtn.prototype=Object.create(PIXI.Container.prototype);
    TexturedBtn.prototype.constructor=TexturedBtn;

    TexturedBtn.prototype.destroyBtn=function(destroyTexture){
        destroyTexture=destroyTexture===true;
        this.removeListeners();

        // Try to remove button from stage.
        try{
            this.parent.removeChild(this);
        }catch(error){
            // Do nothing.
        }

        this._x=null;
        this._y=null;
        this._shadowOffsetX=null;
        this._shadowOffsetY=null;
        this._key=null;
        this._callback=null;
        this._scale=null;
        this._fillSprite.destroy({texture: destroyTexture});
        if(this._shadowSprite){
            this._shadowSprite.destroy({texture: destroyTexture});
        }
        this._fillTexture=null;
        this._shadowTexture=null;
        this.destroy();
    };

    TexturedBtn.prototype.tintBtn=function(color){
        // Tint button.
        this._fillSprite.tint=color;
    };

    TexturedBtn.prototype.show=function(){
        // Show btn and add listeners.
        if(!this.visible){
            this.visible=true;
            this.addListeners();
        }
    };

    TexturedBtn.prototype.hide=function(){
        // Hide btn and remove listeners.
        if(this.visible){
            this.visible=false;
            this.buttonMode=false;
            this.removeListeners();
        }
    };

    TexturedBtn.prototype._touchEndOutside=function(){
        // If shadow has been provided, show it.
        // Shadow as been hidden in _downHandler.
        if(this._shadowSprite){
            this._shadowSprite.visible=true;
        }

        // Remove up end touchEndoutside events.
        this.off('mouseup',this._upHandler);
        this.off('touchend',this._upHandler);
        this.off('touchendoutside',this._touchEndOutside);
        this.off('mouseupoutside',this._touchEndOutside);
    };

    TexturedBtn.prototype._upHandler=function(event){
        // If shadow has been provided, show it.
        // Shadow as been hidden in _downHandler.
        if(this._shadowSprite){
            this._shadowSprite.visible=true;
        }

        // Check if button has to be hidden after click.
        if(this._autoHide){
            this.hide();
        }

        // Callback function.
        this._callback(this._key,'up', event);

        // Remove up end touchEndoutside events.
        this.off('mouseup',this._upHandler);
        this.off('touchend',this._upHandler);
        this.off('touchendoutside',this._touchEndOutside);
        this.off('mouseupoutside',this._touchEndOutside);
    };

    TexturedBtn.prototype._downHandler=function(event){
        // If shadow has been provided, hide it.
        if(this._shadowSprite){
            this._shadowSprite.visible=false;
        }

        this.on('mouseup',this._upHandler,false);
        this.on('touchend',this._upHandler,false);
        // Touchendoutside to avoid down event and remove finger to the side.
        // No event up launched in those cases
        // Avoid shadow hidden and up event continuously being listened.
        this.on('touchendoutside',this._touchEndOutside,false);
        this.on('mouseupoutside',this._touchEndOutside,false);

        // Report callback for mouse down events.
        if(this._trackMouseDown){
            this._callback(this._key,'down');
        }
    };

    TexturedBtn.prototype.addListeners=function(){
        if(!this.buttonMode) {
            this.on('mousedown',this._downHandler,false);
            this.on('touchstart',this._downHandler,false);
            this.buttonMode=true;
        }
    };

    TexturedBtn.prototype.removeListeners=function(){
        this.off('touchstart',this._downHandler);
        this.off('touchend',this._upHandler);
        this.off('mousedown',this._downHandler);
        this.off('mouseup',this._downHandler);
        this.off('touchendoutside',this._touchEndOutside);
        this.off('mouseupoutside',this._touchEndOutside);
        this.buttonMode=false;
    };

    TexturedBtn.prototype._startInteractivity=function(){
        this.interactive=true;

        if(this._defaultCursor){
            this.defaultCursor=this._defaultCursor;
        }

        // Add listeners on initialization.
        if(this._startInteractive){
            this.addListeners();
        }
    };

    TexturedBtn.prototype.setKey=function(key){
        this._key=key;
    };

    TexturedBtn.prototype.switchTexture = function (type) {
        // Switch texture from primary to secondary and vice-versa.
        if(type === 'primary') {
            this._fillSprite.texture = this._fillTexture;
            this._activeTexture = 'primary';
        } else if(type === 'secondary') {
            this._fillSprite.texture = this._secondaryFillTexture;
            this._activeTexture = 'secondary';
        } else {
            this._fillSprite.texture = this._activeTexture === 'primary' ? this._secondaryFillTexture : this._fillTexture;
            this._activeTexture = this._activeTexture === 'primary' ? 'secondary' : 'primary';
        }
    };

    TexturedBtn.prototype.updateFillTexture=function(texture){
        // Get new texture.
        this._fillTexture=this._getFillTexture(texture);

        // Apply texture to sprite.
        this._fillSprite.texture=this._fillTexture;
    };

    TexturedBtn.prototype.updateSecondaryFillTexture=function(texture){
        // Get new texture.
        this._secondaryFillTexture=this._getFillTexture(texture);
    };

    TexturedBtn.prototype._getFillTexture=function(texture){
        // Run only if texture is not null.
        if(texture!==null){
            // Return texture.
            return texture;
        }
        else{
            // No texture has been provided.
            throw new Error('No texture has been provided.');
        }
    };

    TexturedBtn.prototype._buildBtn=function(){
        if(this._fillTexture!==null){
            // APply texture to sprite.
            this._fillSprite=new PIXI.Sprite(this._fillTexture);
            this._fillSprite.anchor.set(0.5);
            this.addChild(this._fillSprite);
        }
        else{
            // No texture has been provided.
            throw new Error('No texture has been provided.');
        }
    };

    TexturedBtn.prototype._buildShadow=function(){
        // Apply shadow to sprite.
        this._shadowSprite=new PIXI.Sprite(this._shadowTexture);
        this._shadowSprite.anchor.set(0.5);
        this._shadowSprite.position.set(this._shadowOffsetX, this._shadowOffsetY);
        this.addChild(this._shadowSprite);
    };

    TexturedBtn.prototype._init=function(){
        // Run if shadow has been provided.
        if(this._shadowTexture){
            this._buildShadow();
        }

        // Build sprite btn.
        this._buildBtn();

        // Make interactive.
        this._startInteractivity();
    };

    return TexturedBtn;
})();