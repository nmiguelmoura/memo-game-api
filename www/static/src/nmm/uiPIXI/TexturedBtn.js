nmm.uiPIXI.TexturedBtn=(function(){
    'use strict';

    function TexturedBtn(args){
        PIXI.Container.call(this);
        //sombra para desaparecer/aparecer quando o botao e clicado
        this._shadowTexture=args.shadowTexture||null;
        //textura principal do botao
        this._fillTexture=args.fillTexture||null;

        //textura secundaria para o botao
        this._secondaryFillTexture = args.secondaryFillTexture||null;
        
        

        //controlo de textura ativa
        this._activeTexture = 'primary';

        this._x=args.x||0;
        this._y=args.y||0;

        this._defaultCursor=args.defaultCursor;

        //offset para a sombra, caso exista
        this._shadowOffsetX=args.shadowOffsetX||0;
        this._shadowOffsetY=args.shadowOffsetY||0;

        this._key=args.key||0;

        //esconder o botao apos clique
        this._autoHide=args.autoHide;
        if(this._autoHide===undefined){
            this._autoHide=true;
        }

        this._trackMouseDown=args.trackMouseDown===true;

        this._callback=args.callback||function(){};

        //os botoes inicializam ja com eventos ou nao
        this._startInteractive=args.startInteractive===undefined?true:args.startInteractive;

        //escala da sprite
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

        //tentar remover o botao do stage
        try{
            this.parent.removeChild(this);
        }catch(error){
            //nao fazer nada
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
        this._fillSprite.tint=color;
    };

    TexturedBtn.prototype.show=function(){
        if(!this.visible){
            this.visible=true;
            this.addListeners();
        }
    };

    TexturedBtn.prototype.hide=function(){
        if(this.visible){
            this.visible=false;
            this.buttonMode=false;
            this.removeListeners();
        }
    };

    TexturedBtn.prototype._touchEndOutside=function(){
        //se tiver sido fornecida textura de sombra, voltar a mostrar aqui
        //a sombra tinha sido escondida no _downHandler
        if(this._shadowSprite){
            this._shadowSprite.visible=true;
        }

        this.off('mouseup',this._upHandler);
        this.off('touchend',this._upHandler);
        this.off('touchendoutside',this._touchEndOutside);
        this.off('mouseupoutside',this._touchEndOutside);
    };

    TexturedBtn.prototype._upHandler=function(event){
        //se tiver sido fornecida textura de sombra, voltar a mostrar aqui
        //a sombra tinha sido escondida no _downHandler
        if(this._shadowSprite){
            this._shadowSprite.visible=true;
        }

        //caso o botao deva desaparecer apos a interaçao, esconde-lo
        if(this._autoHide){
            this.hide();
        }

        this._callback(this._key,'up', event);
        this.off('mouseup',this._upHandler);
        this.off('touchend',this._upHandler);
        this.off('touchendoutside',this._touchEndOutside);
        this.off('mouseupoutside',this._touchEndOutside);
    };

    TexturedBtn.prototype._downHandler=function(event){
        //se houver sombra, esconder
        if(this._shadowSprite){
            this._shadowSprite.visible=false;
        }

        this.on('mouseup',this._upHandler,false);
        this.on('touchend',this._upHandler,false);
        //touchendoutside para evitar que o utilizador faca down e depois retire o dedo para o lado
        //nesses casos nao ha evento up
        //evita-se que a sombra continue escondida e que o evento up continue on
        this.on('touchendoutside',this._touchEndOutside,false);
        this.on('mouseupoutside',this._touchEndOutside,false);

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

        //so adicionar os listeners se a variavel _startInteractive for true
        if(this._startInteractive){
            this.addListeners();
        }
    };

    TexturedBtn.prototype.setKey=function(key){
        this._key=key;
    };

    TexturedBtn.prototype.switchTexture = function (type) {
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
        //obter nova textura
        this._fillTexture=this._getFillTexture(texture);

        //aplicar textura ao sprite existente
        this._fillSprite.texture=this._fillTexture;
    };

    TexturedBtn.prototype.updateSecondaryFillTexture=function(texture){
        //obter nova textura
        this._secondaryFillTexture=this._getFillTexture(texture);
    };

    TexturedBtn.prototype._getFillTexture=function(texture){
        //apenas correr se a textura nao for nula
        if(texture!==null){
            //se for passado apenas o nome do frame, converter para textura
            if(typeof texture==='string'){
                texture=nmm.observer.spriteSheetDealer.getTexture(texture);
                //texture=PIXI.Texture.fromFrame(texture);
            }

            //devolver o valor da textura
            return texture;
        }
        else{
            //nao foi indicada textura ERRO
            throw new Error('Não foi indicada textura para o botão.');
        }
    };

    TexturedBtn.prototype._buildBtn=function(){
        if(this._fillTexture!==null){
            //verificar a textura - se existe, se é apenas o nome do frame ou se já e a texture
            if(typeof this._fillTexture==='string'){
                this._fillTexture=nmm.observer.spriteSheetDealer.getTexture(this._fillTexture);
            }

            //aplicar a textura a sprite
            this._fillSprite=new PIXI.Sprite(this._fillTexture);
            this._fillSprite.anchor.set(0.5);
            this.addChild(this._fillSprite);
        }
        else{
            //nao foi indicada textura ERRO
            throw new Error('Não foi indicada textura para o botão.');
        }
    };

    TexturedBtn.prototype._buildSecondaryFillTexture = function () {
        //se for passado apenas o nome do frame, converter para textura
        if(typeof this._secondaryFillTexture==='string'){
            this._secondaryFillTexture=nmm.observer.spriteSheetDealer.getTexture(this._secondaryFillTexture);
        }
    };

    TexturedBtn.prototype._buildShadow=function(){
        //se for passado apenas o nome do frame, converter para textura
        if(typeof this._shadowTexture==='string'){
            this._shadowTexture=nmm.observer.spriteSheetDealer.getTexture(this._shadowTexture);
        }

        //aplicar a textura a sprite -> esta e para ser utilizada apenas se houver sombra no botao
        this._shadowSprite=new PIXI.Sprite(this._shadowTexture);
        this._shadowSprite.anchor.set(0.5);
        this._shadowSprite.position.set(this._shadowOffsetX, this._shadowOffsetY);
        this.addChild(this._shadowSprite);
    };

    TexturedBtn.prototype._init=function(){
        //se existir textura para a sombra, construir o sprite
        if(this._shadowTexture){
            this._buildShadow();
        }

        //se existir textura secundaria
        if(this._secondaryFillTexture) {
            this._buildSecondaryFillTexture();
        }

        //construir o sprite do botao
        this._buildBtn();

        //tornar o botao interativo
        this._startInteractivity();
    };

    return TexturedBtn;
})();