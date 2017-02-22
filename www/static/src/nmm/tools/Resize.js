nmm.tools.Resize=(function(){
  'use strict';

  function Resize(renderer,stage, width, height){
    this._default = {
      w: width,
      h: height
    };
    this._renderer=renderer;
    this._stage=stage;
    this._scale=null;
    this._size={};
    this._margin={};
    this._init();
  }

  Resize.prototype._canvasResize=function(){
    this._size.windowWidth=window.innerWidth;
    this._size.windowHeight=window.innerHeight;

    var scaleX = this._size.windowWidth / this._default.w,
        scaleY = this._size.windowHeight / this._default.h;

    //a menor escala e escolhida
    this._scale=Math.min(scaleX,scaleY);

    //e necessario arredondar os valores, caso contrario o firefox e o chrome ficam ligeiramente desfocados
    this._size.width=Math.floor(this._default.w*this._scale);
    this._size.height=Math.floor(this._default.h*this._scale);

    //definir o tamanho do renderer
    this._renderer.resize(this._size.width,this._size.height);

    //escalar o stage
    this._stage.scale.x=this._scale;
    this._stage.scale.y=this._scale;

    //calcular o tamanho da app para guardar


  };

  Resize.prototype._canvasAlignment=function(){
    //alinhar ao centro do ecra
    var center;
    this._margin={x:0,y:0};
    if(this._size.width>this._size.height){
      if(this._size.width<this._size.windowWidth){
        center='horizontal';
      }
      else{
        center='vertical';
      }
    }
    else{
      if(this._size.height<this._size.windowHeight){
        center='vertical';
      }
      else{
        center='horizontal';
      }
    }

    if(center==='horizontal'){
      this._margin.x=(this._size.windowWidth-this._size.width)/2;
    }
    else{
      this._margin.y=(this._size.windowHeight-this._size.height)/2;
    }

    this._renderer.view.style.marginLeft=this._margin.x+'px';
    this._renderer.view.style.marginTop=this._margin.y+'px';
  };

  Resize.prototype._storeValues=function(){
    //guardar o tamanho da janela do dispositivo
    nmm.runtime.dimensions = nmm.runtime.dimensions || {};
    nmm.runtime.dimensions.windowWidth=this._size.windowWidth;
    nmm.runtime.dimensions.windowHeight=this._size.windowHeight;

    //gaurdar o tamanho da aplicacao
    nmm.runtime.dimensions.scaledWidth=this._size.width;
    nmm.runtime.dimensions.scaledHeight=this._size.height;

    //guardar as margens
    nmm.runtime.dimensions.marginLeft=this._margin.x;
    nmm.runtime.dimensions.marginTop=this._margin.y;

    //guardar o valor de escala
    nmm.runtime.dimensions.scale=this._scale;
  };

  Resize.prototype.resize=function(){
    //escalar o stage e o renderer
    this._canvasResize();

    //alinhar o canvas
    this._canvasAlignment();

    //guardar valores
    this._storeValues();

    this._renderer.render(this._stage);
  };

  Resize.prototype._init=function(){
    this._resizeBound = this.resize.bind(this);
    window.addEventListener('resize',this._resizeBound);
    this.resize();
  };

  return Resize;
})();