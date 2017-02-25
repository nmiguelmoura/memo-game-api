nmm.engine.AudioManager=(function(){
    'use strict';

    var self;

    function AudioManager(audioSpriteData){
        self=this;
        // var to store background sound.
        this._soundBg=null;

        // var to store fx sound.
        this._soundFX=null;

        // store sound object.
        this._sound=null;

        // Data from audiosprite.
        this._audioSpriteData=audioSpriteData;
    }

    AudioManager.prototype._searchForSound=function(sound){
        var i,length=this._audioSpriteData.length;

        // Check if frame id exists.
        for(i=0;i<length;i++){
            // If frame exists, return data.
            if(sound===this._audioSpriteData[i].id){
                return this._audioSpriteData[i];
            }
        }
        return null;
    };

    AudioManager.prototype.stopSound=function(){
        // Stop all fx sounds.
        if(this._soundFX){
            this._sound.stop();
        }
    };

    AudioManager.prototype.playSound=function(sprite,sound,callback){
        // Callback after sound play finishes.
        callback=callback||function(){};

        // Search for sound data.
        var frame=this._searchForSound(sound);

        // Play sound if data exists in audio sprite sheet.
        if(frame){
            // Stop sound if already playing.
            if(this._soundFX){
                this._sound.stop();
            }

            // Play new sound.
            this._soundFX=sound;
            this._sound=createjs.Sound.play(sprite,frame);
            this._sound.on('complete',function(){
                // Clear var _soundFX after playback is finished.
                self._soundFX=null;
                // Callback function after playback is finished.
                callback();
            })
        }
    };

    AudioManager.prototype.playBgSound=function(sprite, sound){
        // Play background sound.

        // Check if frame exists in sprite and play it.
        var frame=this._searchForSound(sound);
        if(frame) {
            this._bgSound=createjs.Sound.play(sprite,frame);
            this._bgSound.volume = 0.5;
            this._bgSound.loop = 10000;
        }
        
    };

    return AudioManager;
})();