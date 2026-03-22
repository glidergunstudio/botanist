// fruit.js — 果実の描画
// ===== FRUIT DRAWING =====
function drawFruit(svg,cx,groundY,plantH,type,fruitSz,fruitN,frR,frY,stage,sc,stemData){
  if(stage<6||type==='none') return;
  const fc=fruitRGB(frR,frY);
  const fSz=lerp(6,28,fruitSz);
  const fCount=Math.round(lerp(2,12,fruitN));

  switch(type){
    case 'berry':
    case 'drupe':
    case 'pome':{
      // 液果・核果・仁果：枝先や葉腋に付く
      const positions=stemData||[];
      const useN=Math.min(fCount,positions.length||8);
      for(let i=0;i<useN;i++){
        const idx=Math.floor(i*(positions.length/useN));
        const pos=positions[idx]||{x:cx+(i%2===0?30:-30),y:groundY-plantH*(0.3+i*0.08)};
        // 果柄
        el('line',{x1:pos.x,y1:pos.y,x2:pos.x,y2:pos.y-fSz*0.8,stroke:sc[0],'stroke-width':0.8},svg);
        // 果実
        el('circle',{cx:pos.x,cy:pos.y-fSz,r:fSz,fill:fc.css,stroke:fc.dark,'stroke-width':0.8},svg);
        // ハイライト
        el('circle',{cx:pos.x-fSz*0.28,cy:pos.y-fSz-fSz*0.28,r:fSz*0.22,fill:'white',opacity:0.28},svg);
        // ヘタ
        if(type==='pome'||type==='drupe'){
          for(let j=0;j<5;j++){
            const a=(j/5)*Math.PI*2;
            el('line',{x1:pos.x,y1:pos.y-fSz*2,x2:pos.x+Math.cos(a)*3,y2:pos.y-fSz*2+Math.sin(a)*3,stroke:'#1a3010','stroke-width':0.7},svg);
          }
        }
      }
      break;
    }

    case 'cluster':{
      // 房状（ブドウ）
      const clusterX=cx,clusterY=groundY-plantH*0.7;
      const cols=4,rows=Math.round(lerp(3,6,fruitN));
      // 軸
      el('path',{d:`M${cx},${groundY-plantH*0.85} L${clusterX},${clusterY}`,stroke:sc[0],'stroke-width':1.2,fill:'none'},svg);
      for(let r=0;r<rows;r++){
        const rowN=Math.max(2,cols-Math.floor(r/2));
        const ry=clusterY+r*fSz*2.2;
        for(let c=0;c<rowN;c++){
          const rx=clusterX+(c-(rowN-1)/2)*fSz*2;
          el('circle',{cx:rx,cy:ry,r:fSz,fill:fc.css,stroke:fc.dark,'stroke-width':0.6},svg);
          el('circle',{cx:rx-fSz*0.25,cy:ry-fSz*0.25,r:fSz*0.2,fill:'white',opacity:0.22},svg);
        }
      }
      break;
    }

    case 'aggregate':{
      // 集合果（イチゴ型）
      const ax=cx,ay=groundY-plantH*0.25;
      // 花柄
      el('path',{d:`M${cx},${groundY-plantH*0.4} L${ax},${ay}`,stroke:sc[0],'stroke-width':1,fill:'none'},svg);
      // 本体（楕円）
      el('ellipse',{cx:ax,cy:ay+fSz,rx:fSz*0.8,ry:fSz,fill:fc.css,stroke:fc.dark,'stroke-width':0.8},svg);
      // 種の粒
      for(let i=0;i<12;i++){
        const a=Math.random()*Math.PI*2,r=Math.random()*fSz*0.6;
        el('ellipse',{cx:ax+Math.cos(a)*r,cy:ay+fSz+Math.sin(a)*r,rx:1.5,ry:1,fill:'#c8a030',opacity:0.8},svg);
      }
      // ガク
      for(let i=0;i<5;i++){
        const a=((i/5)*360-90)*Math.PI/180;
        el('path',{d:`M${ax},${ay} L${ax+Math.cos(a)*fSz*0.8},${ay+Math.sin(a)*fSz*0.5}`,stroke:'#1a4010','stroke-width':1.2},svg);
      }
      break;
    }

    case 'legume':{
      // 豆果（さや）：茎に沿って複数
      for(let i=0;i<Math.min(fCount,5);i++){
        const t=0.3+i*0.12;
        const lx=cx+(i%2===0?20:-20);
        const ly=groundY-plantH*t;
        const len=fSz*2.2;
        const a=i%2===0?-20:20;
        const rad=a*Math.PI/180;
        // さやの形
        el('path',{d:`M${lx},${ly} Q${lx+Math.cos(rad)*len*0.5+Math.sin(rad)*fSz*0.5},${ly-Math.sin(rad)*len*0.5} ${lx+Math.cos(rad)*len},${ly-Math.sin(rad)*len} Q${lx+Math.cos(rad)*len*0.5-Math.sin(rad)*fSz*0.5},${ly-Math.sin(rad)*len*0.5+fSz} ${lx},${ly}`,fill:fc.css,stroke:fc.dark,'stroke-width':0.8},svg);
        // 豆の膨らみ
        const bCount=Math.round(lerp(2,5,fruitN));
        for(let j=0;j<bCount;j++){
          const bt=(j+1)/(bCount+1);
          el('ellipse',{cx:lx+Math.cos(rad)*len*bt,cy:ly-Math.sin(rad)*len*bt,rx:fSz*0.35,ry:fSz*0.28,fill:fc.dark,opacity:0.4},svg);
        }
      }
      break;
    }

    case 'capsule':{
      // 蒴果（弾けた状態）
      const cap=Math.min(fCount,6);
      for(let i=0;i<cap;i++){
        const t=0.35+i*0.1;
        const lx=cx+(i%2===0?25:-25);
        const ly=groundY-plantH*t;
        // 蒴果の本体
        el('ellipse',{cx:lx,cy:ly,rx:fSz*0.5,ry:fSz*0.7,fill:fc.dark,stroke:fc.css,'stroke-width':0.8},svg);
        // 弾けた裂け目
        if(stage>=6){
          for(let j=0;j<3;j++){
            const a=(j/3)*Math.PI*2;
            el('line',{x1:lx,y1:ly,x2:lx+Math.cos(a)*fSz,y2:ly+Math.sin(a)*fSz,stroke:fc.css,'stroke-width':0.8,opacity:0.7},svg);
          }
        }
      }
      break;
    }

    case 'root_vis':{
      // 根菜（地上に少し見える）
      const rW=fSz*0.8,rH=fSz*2;
      el('ellipse',{cx,cy:groundY+rH*0.3,rx:rW,ry:rH*0.7,fill:fc.css,stroke:fc.dark,'stroke-width':1},svg);
      // 根の線
      for(let i=0;i<3;i++){
        el('path',{d:`M${cx+(i-1)*rW*0.5},${groundY+rH*0.8} Q${cx+(i-1)*rW},${groundY+rH*1.2} ${cx+(i-1)*rW*1.2},${groundY+rH*1.5}`,stroke:fc.dark,'stroke-width':0.6,fill:'none'},svg);
      }
      break;
    }
  }
}
