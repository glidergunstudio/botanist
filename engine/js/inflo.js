// inflo.js — 花序の描画
// ===== INFLORESCENCE =====
function drawInflorescence(svg,cx,topY,type,flowerSz,petalN,petalShape,fc,fR,fB,fY,stage,plantH){
  switch(type){
    case 'solitary':
      drawFlower(svg,cx,topY-8,flowerSz,petalN,petalShape,fc,stage);
      break;

    case 'capitulum':{
      // 頭状花序
      const disk=lerp(18,52,flowerSz);
      const rays=Math.round(lerp(12,24,flowerSz));
      if(stage===4){el('circle',{cx,cy:topY,r:disk*0.5,fill:'#1a3010',stroke:'#0e2208','stroke-width':1},svg);break;}
      for(let i=0;i<rays;i++){
        const a=(i/rays)*Math.PI*2;
        const rx1=cx+Math.cos(a)*(disk+1);
        const ry1=topY+Math.sin(a)*(disk+1);
        const rx2=cx+Math.cos(a)*(disk+disk*0.9);
        const ry2=topY+Math.sin(a)*(disk+disk*0.9);
        const w=4.5;
        el('path',{d:`M${rx1-Math.sin(a)*w},${ry1+Math.cos(a)*w} Q${rx2},${ry2} ${rx2},${ry2} Q${rx2},${ry2} ${rx1+Math.sin(a)*w},${ry1-Math.cos(a)*w} Z`,fill:fc.css,stroke:fc.dark,'stroke-width':0.3},svg);
      }
      el('circle',{cx,cy:topY,r:disk,fill:'#2e1a04',stroke:'#1a0e02','stroke-width':1},svg);
      for(let i=0;i<25;i++){
        const a=Math.random()*Math.PI*2,r=Math.random()*disk*0.85;
        el('circle',{cx:cx+Math.cos(a)*r,cy:topY+Math.sin(a)*r,r:1.8,fill:'#4a2e08',opacity:0.7},svg);
      }
      break;
    }

    case 'raceme':{
      // 総状花序：茎から等間隔に花が垂れ下がる（フジ型）
      const racemeLen=plantH*0.35;
      const flCount=Math.round(lerp(5,12,flowerSz));
      // 総状の軸
      el('path',{d:`M${cx},${topY} Q${cx+15},${topY+racemeLen*0.5} ${cx},${topY+racemeLen}`,stroke:'#2a4814','stroke-width':1.5,fill:'none'},svg);
      for(let i=0;i<flCount;i++){
        const t=(i+1)/(flCount+1);
        const ax=bezier3(cx,cx+15,cx+8,cx,t);
        const ay=topY+racemeLen*t;
        // 小花柄
        el('line',{x1:ax,y1:ay,x2:ax+8,y2:ay+10,stroke:'#2a4814','stroke-width':0.8},svg);
        drawFlower(svg,ax+8,ay+14,flowerSz*0.45,petalN,petalShape,fc,stage,true);
      }
      break;
    }

    case 'spike':{
      // 穂状花序：ラベンダー型
      const spikeLen=plantH*0.28;
      const flCount=Math.round(lerp(8,18,flowerSz));
      el('path',{d:`M${cx},${topY} L${cx},${topY+spikeLen}`,stroke:'#2a4814','stroke-width':1.8,fill:'none'},svg);
      for(let i=0;i<flCount;i++){
        const t=i/(flCount-1);
        const ay=topY+spikeLen*t;
        const side=i%2===0?-1:1;
        const fsz=flowerSz*(0.3+t*0.1);
        drawFlower(svg,cx+side*6,ay,fsz*0.5,petalN,petalShape,fc,stage,true);
      }
      break;
    }

    case 'umbel':{
      // 散形花序：中心から放射状（ニンジン・コリアンダー型）
      const spokes=Math.round(lerp(5,10,flowerSz));
      const spokeLen=plantH*0.18;
      const fSz=flowerSz*0.38;
      // 一次散形
      for(let i=0;i<spokes;i++){
        const a=((i/spokes)*360-90)*Math.PI/180;
        const ex=cx+Math.cos(a)*spokeLen;
        const ey=topY+Math.sin(a)*spokeLen;
        el('line',{x1:cx,y1:topY,x2:ex,y2:ey,stroke:'#3a5820','stroke-width':0.8},svg);
        // 二次散形
        const sub=Math.round(lerp(3,6,flowerSz));
        for(let j=0;j<sub;j++){
          const a2=((j/sub)*360)*Math.PI/180;
          const sl=spokeLen*0.35;
          const sx=ex+Math.cos(a2)*sl;
          const sy=ey+Math.sin(a2)*sl;
          el('line',{x1:ex,y1:ey,x2:sx,y2:sy,stroke:'#3a5820','stroke-width':0.5},svg);
          drawFlower(svg,sx,sy,fSz,petalN,petalShape,fc,stage,true);
        }
      }
      break;
    }

    case 'corymb':{
      // 散房花序：桜型（外側が長い花柄）
      const n=Math.round(lerp(4,10,flowerSz));
      const spread=plantH*0.25;
      for(let i=0;i<n;i++){
        const t=i/(n-1)-0.5;
        const fx=cx+t*spread*2;
        const stemLen=lerp(20,5,Math.abs(t)*2);
        el('line',{x1:cx+t*spread,y1:topY,x2:fx,y2:topY-stemLen,stroke:'#2a4814','stroke-width':0.8},svg);
        drawFlower(svg,fx,topY-stemLen-4,flowerSz*0.5,petalN,petalShape,fc,stage,true);
      }
      break;
    }
  }
}
