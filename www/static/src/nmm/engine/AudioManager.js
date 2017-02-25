nmm.engine.AudioManager=(function(){
    'use strict';

    var self;

    function AudioManager(audioSpriteData){
        self=this;
        //guardar o id do som de fundo
        this._soundBg=null;

        //guardar o id do som fx
        this._soundFX=null;

        //guardar o objeto Sound do createjs
        this._sound=null;
        this._audioSpriteData=audioSpriteData;
    }

    AudioManager.prototype._searchForSound=function(sound){
        var i,length=this._audioSpriteData.length;

        //procurar o id no array
        for(i=0;i<length;i++){
            //Se encontrar o ID, devolver o frame
            if(sound===this._audioSpriteData[i].id){
                return this._audioSpriteData[i];
            }
        }
        return null;
    };

    AudioManager.prototype.stopSound=function(){
        if(this._soundFX){
            this._sound.stop();
        }
    };

    AudioManager.prototype.playSound=function(sprite,sound,callback){
        //protecao contra o esquecimento do callback
        callback=callback||function(){};

        //procurar o som
        var frame=this._searchForSound(sound);
        //iniciar playback se o som existir
        if(frame){
            //se o som esta em playback, tem que ser desligado para evitar sobreposicao
            if(this._soundFX){
                this._sound.stop();
            }

            //tocar o novo som
            this._soundFX=sound;
            this._sound=createjs.Sound.play(sprite,frame);
            this._sound.on('complete',function(){
                //quando o som termina, limpar a variavel _soundFX para se saber que nada esta em playback
                self._soundFX=null;
                //chamar o objeto que originou o som
                callback();
            })
        }
    };

    AudioManager.prototype.playBgSound=function(sprite, sound){
        var frame=this._searchForSound(sound);
        if(frame) {
            this._bgSound=createjs.Sound.play(sprite,frame);
            this._bgSound.volume = 0.5;
            this._bgSound.loop = 10000;
        }
        
    };

    return AudioManager;
})();