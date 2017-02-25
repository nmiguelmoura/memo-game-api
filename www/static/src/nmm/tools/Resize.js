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

    // Choose minor scale value.
    this._scale=Math.min(scaleX,scaleY);

    this._scale = this._scale <= 1 ? this._scale : 1;

    // Round values, or firefox and chrome render blurred images.
    this._size.width=Math.floor(this._default.w*this._scale);
    this._size.height=Math.floor(this._default.h*this._scale);

    // Set render size.
    this._renderer.resize(this._size.width,this._size.height);

    // Scale scene stage.
    this._stage.scale.x=this._scale;
    this._stage.scale.y=this._scale;
  };

  Resize.prototype._canvasAlignment=function(){
    // Align app on the centre of scree.
    this._margin={};
    this._margin.x=(this._size.windowWidth-this._size.width)/2;
    this._margin.y=(this._size.windowHeight-this._size.height)/2;
    this._renderer.view.style.marginLeft=this._margin.x+'px';
    this._renderer.view.style.marginTop=this._margin.y+'px';
  };

  Resize.prototype._storeValues=function(){
    // Store window dimensions.
    nmm.runtime.dimensions = nmm.runtime.dimensions || {};
    nmm.runtime.dimensions.windowWidth=this._size.windowWidth;
    nmm.runtime.dimensions.windowHeight=this._size.windowHeight;

    // Store app dimensions.
    nmm.runtime.dimensions.scaledWidth=this._size.width;
    nmm.runtime.dimensions.scaledHeight=this._size.height;

    // Store margin values.
    nmm.runtime.dimensions.marginLeft=this._margin.x;
    nmm.runtime.dimensions.marginTop=this._margin.y;

    // Store scale value.
    nmm.runtime.dimensions.scale=this._scale;
  };

  Resize.prototype.resize=function(){
    // Render and stage scale.
    this._canvasResize();

    // Align app to the center of the scree.
    this._canvasAlignment();

    // store values.
    this._storeValues();

    this._renderer.render(this._stage);
  };

  Resize.prototype._init=function(){
    this._resizeBound = this.resize.bind(this);

    // Add event to resize app everytime the window is resized.
    window.addEventListener('resize',this._resizeBound);
    this.resize();
  };

  return Resize;
})();