/* 折线图组件对象 */

var H5ComponentPolyline =function ( name, cfg ) {
   
     var component=new H5ComponentBase(name,cfg);

     // 绘制网格
     var w=cfg.width;         //component的高宽只有它的一半，这样硬塞进去，让图片更清晰了。
     var h=cfg.height;
 

  
   // 创建画布
   var canvas=document.createElement('canvas');
   var ctx=canvas.getContext("2d");
   ctx.width=canvas.width=w;
   ctx.height=canvas.height=h;
   component.append(canvas);
   
   // 水平网格线 100份 -> 10份
   var step=10;
   ctx.beginPath();
   ctx.lineWidth=2;
   ctx.strokeStyle='#ccc';
    for(var i=0;i<step+1;i++){ 
      var y=(h/step)*i;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
          
        // 垂直网格线
    step=cfg.data.length+1;   //因为前面已经定义了 所以这个不用加var
   
     var text_w=w/step >> 0;

    for(var i=0;i<step+1;i++){ 
      var x=(w/step)*i
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      
      if(cfg.data[i]){
      // var sec=1.5+0.1*i;
      var text=$('<div class="text" style="transition:all .3s '+i*.05+'s">');  
      // var text=$('<div class="text">');
      // text.css('transition','all .5s'+i*.5+'s');
      text.text(cfg.data[i][0]);
      text.css('width',text_w/2).css('left',x/2+text_w/4)  //因为text是新增的DOM对象，它的高宽对应于cfg的高宽所以它要除2。
     
      component.append(text);
      }

    }

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
   // 绘制折线数据  
   ctx.beginPath();
   ctx.lineWidth=3;
   ctx.strokeStyle='#F1584D';
    
   var row_w=(w/(cfg.data.length+1));
   //画点
    for(i in cfg.data){
      var item=cfg.data[i];
      x=row_w*i+row_w;
      y=h-h*item[1]*per;              //画布的x,y 计算和 left,top是一样的 ，但是从左上角0,0开始算
      ctx.moveTo(x, y);                  
      ctx.arc(x, y, 5, 0, 2*Math.PI);
    }
     

    // 连线
    // 移动画笔到第一个数据的点位置
    ctx.moveTo(row_w, h-h*cfg.data[0][1]*per);
    for(i in cfg.data){
      var item=cfg.data[i];
      x=row_w*i+row_w;
      y=h-h*item[1]*per;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    //阴影效果
    ctx.strokeStyle='rgba(0, 0, 0, 0)';
    ctx.lineTo(row_w*4+row_w, h);
    ctx.lineTo(row_w, h);
    ctx.lineTo(row_w, h-h*cfg.data[0][1]);
    ctx.fillStyle='rgba(255, 136, 120, 0.2)';
    ctx.fill();
  // 写数据
  for(i in cfg.data){
      var item=cfg.data[i];
      x=row_w*i+row_w;
      y=h-h*item[1]*per;
      ctx.font='20px 微软雅黑';
      ctx.fillStyle=item[2]? item[2]: '#595959';
      ctx.fillText( ( (item[1]*100)>>0)+'%', x-10, y-15);
    }
};
 
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