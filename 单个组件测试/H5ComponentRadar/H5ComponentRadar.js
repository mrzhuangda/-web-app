/* 折线图组件对象 */

var H5ComponentRadar =function ( name, cfg ) {
   
     var component=new H5ComponentBase(name,cfg);

     // 绘制网格
     var w=cfg.width;
     var h=cfg.height;
 
  
   // 创建画布
   var canvas=document.createElement('canvas');
   var ctx=canvas.getContext("2d");
   ctx.width=canvas.width=w;
   ctx.height=canvas.height=h;
   component.append(canvas);
   
   var step=cfg.data.length;
   var r=w/2;


   //  ctx.beginPath();
   // ctx.arc(r, r, r, 0, 2*Math.PI);
   // ctx.stroke();
   // 绘制网格背景 （分面绘制，分为10份）
  var isBlue=false;
  for(var s=10; s>0;s--){
     isBlue = !isBlue;

    ctx.beginPath();
    for(var i=0;i<step;i++){ 
      var rad=(2*Math.PI)/360*(360/step)*i;
      var x=r+Math.sin(rad)*r*(s/10);
      var y=r+Math.cos(rad)*r*(s/10);
      // ctx.arc(x, y, 5, 0, 2*Math.PI);
      ctx.lineTo(x, y);
    }    
    ctx.closePath();
    ctx.fillStyle= isBlue? '#99c0ff' :'#f1f9ff';
    ctx.fill();
  };
    
   // 绘制伞骨
   for(var i=0;i<step;i++){ 
      var rad=(2*Math.PI)/360*(360/step)*i;
      var x=r+Math.sin(rad)*r;
      var y=r+Math.cos(rad)*r;
      ctx.moveTo(r, r);
      ctx.lineTo(x, y);

      //输出项目文字
           var text=$('<div class="text" style="transition: all .5s '+i*.1+'s">');  
      text.text( cfg.data[i][0] );

      if(x>w/2){ 
        text.css('left',x/2+5);              //因为text是新增的DOM对象，它的高宽对应于cfg的高宽所以它要除2。
                                                         // 如果想让文字顺时针出现 只需要  把left改为right即可
      }else{
        text.css('right',(w-x)/2+5);
      }
    
     if(y>h/2){
        text.css('top',y/2+5);
      }else{
        text.css('bottom',(h-y)/2+5);
      }
      
      if(cfg.data[i][2]){
            text.css('color',cfg.data[i][2]);

      }

      component.append(text);
    }    
    ctx.strokeStyle='#e0e0e0';
   ctx.stroke();

   // 加入画布 --数据层
   var canvas=document.createElement('canvas');
   var ctx=canvas.getContext("2d");
   ctx.width=canvas.width=w;
   ctx.height=canvas.height=h;
   component.append(canvas);

   var draw=function(per){

    if(per>=1){
      component.find('.text').css('opacity',1);
    }
    if(per<=0){
      component.find('.text').css('opacity',0);
    }
    //清空画布
    ctx.clearRect(0, 0, w, h);


// 绘制数据的点
    for(var i=0;i<step;i++){ 
      var rate=cfg.data[i][1]*per;
      var rad=(2*Math.PI)/360*(360/step)*i;
      var x=r+Math.sin(rad)*r*rate;
      var y=r+Math.cos(rad)*r*rate;
       ctx.beginPath();
       ctx.arc(x, y, 5, 0, 2*Math.PI);
       ctx.fillStyle='#ff7676';
       ctx.fill();
       ctx.closePath();

    }
   // 连线 
 for(var i=0;i<step;i++){ 
      var rate=cfg.data[i][1]*per;
      var rad=(2*Math.PI)/360*(360/step)*i;
      var x=r+Math.sin(rad)*r*rate;
      var y=r+Math.cos(rad)*r*rate;
       ctx.lineTo(x, y)
    }
    ctx.closePath();
    ctx.strokeStyle='#f00';
    ctx.stroke();

 
     }

   
    component.on('onLoad',function(){
           var s=0;
           for(var i=0;i<100;i++){
            setTimeout(function(){
              s+=.01;
            draw(s);
          }, i*10+500)
            
           }
         
    })

     component.on('onLeave',function(){
           var s=1;
           for(var i=0;i<100;i++){
            setTimeout(function(){
              s-=.01;
            draw(s);
          }, i*10)
            
           }
         
    })
  return component;
}