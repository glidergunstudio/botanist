// leaf.js — 葉の描画
// ===== LEAF SHAPES =====
function drawLeafShape(svg,x,y,side,size,shape,lColor,angle){
  const rad=(angle)*Math.PI/180;
  const lx=x+side*Math.cos(rad)*size;
  const ly=y-Math.sin(rad)*size;
  const stroke='#0e2208';
  const leafG=el('g',{'data-name':`葉（${shape}）`,'data-vars':`形状:${shape} 大きさ:${size.toFixed(1)}px`},svg);

  switch(shape){
    case 'oval':{
      const cpx=x+side*Math.cos(rad)*size*0.5;
      const cpy=y-Math.sin(rad)*size*0.5-size*0.4;
      const d=`M${x},${y} Q${cpx+side*size*0.38},${cpy} ${lx},${ly} Q${cpx-side*size*0.15},${cpy+size*0.28} ${x},${y}`;
      el('path',{d:d,fill:lColor,stroke:stroke,'stroke-width':0.5},svg);
      el('line',{x1:x,y1:y,x2:lx,y2:ly,stroke:stroke,'stroke-width':0.4,opacity:0.45},svg);
      break;
    }
    case 'narrow':{
      const cpx=x+side*Math.cos(rad)*size*0.5;
      const cpy=y-Math.sin(rad)*size*0.5;
      const d=`M${x},${y} Q${cpx+side*size*0.12},${cpy} ${lx},${ly} Q${cpx-side*size*0.06},${cpy} ${x},${y}`;
      el('path',{d:d,fill:lColor,stroke:stroke,'stroke-width':0.5},svg);
      break;
    }
    case 'heart':{
      const mx=x+side*Math.cos(rad)*size*0.5;
      const my=y-Math.sin(rad)*size*0.5;
      const d=`M${x},${y} Q${mx-side*size*0.5},${my-size*0.3} ${lx},${ly} Q${mx+side*size*0.5},${my-size*0.3} ${x},${y}`;
      el('path',{d:d,fill:lColor,stroke:stroke,'stroke-width':0.5},svg);
      // ハート切り込み
      el('path',{d:`M${lx},${ly} Q${mx},${my+size*0.15} ${x},${y}`,stroke:stroke,'stroke-width':0.4,fill:'none',opacity:0.3},svg);
      break;
    }
    case 'round':{
      const r=size*0.45;
      const ccx=x+side*Math.cos(rad)*size*0.5;
      const ccy=y-Math.sin(rad)*size*0.5;
      el('circle',{cx:ccx,cy:ccy,r:r,fill:lColor,stroke:stroke,'stroke-width':0.5},svg);
      break;
    }
    case 'compound':{
      // 羽状複葉：rachis + leaflets
      const n=5;
      for(let i=0;i<n;i++){
        const t=(i+1)/(n+1);
        const rx=x+side*Math.cos(rad)*size*t;
        const ry=y-Math.sin(rad)*size*t;
        const ls=size*0.28*(1-Math.abs(t-0.5)*0.6);
        const lside2=i%2===0?1:-1;
        drawLeafShape(leafG,rx,ry,lside2,ls,'oval',lColor,55);
      }
      // rachis
      el('line',{x1:x,y1:y,x2:lx,y2:ly,stroke:stroke,'stroke-width':0.6,opacity:0.5},svg);
      break;
    }
    case 'palmate':{
      // 掌状複葉：中心から複数の葉
      const n=5;
      for(let i=0;i<n;i++){
        const a=((i-(n-1)/2)/(n-1))*90+angle;
        const r2=a*Math.PI/180;
        const lx2=x+side*Math.cos(r2)*size*0.85;
        const ly2=y-Math.sin(r2)*size*0.85;
        const cpx2=x+side*Math.cos(r2)*size*0.45;
        const cpy2=y-Math.sin(r2)*size*0.45-size*0.18;
        const d=`M${x},${y} Q${cpx2+side*size*0.18},${cpy2} ${lx2},${ly2} Q${cpx2-side*size*0.1},${cpy2} ${x},${y}`;
        el('path',{d:d,fill:lColor,stroke:stroke,'stroke-width':0.4},svg);
      }
      break;
    }
    case 'needle':{
      // 針状葉：細い線
      for(let i=-2;i<=2;i++){
        const a=(angle+i*8)*Math.PI/180;
        const nlx=x+side*Math.cos(a)*size;
        const nly=y-Math.sin(a)*size;
        el('line',{x1:x,y1:y,x2:nlx,y2:nly,stroke:lColor,'stroke-width':1.2},svg);
      }
      break;
    }
    default:
      drawLeafShape(leafG,x,y,side,size,'oval',lColor,angle);
      return;
  }
  addHoverBehavior(leafG);
}

// ===== ROSETTE LEAVES =====
function drawRosette(svg,cx,groundY,leafSz,leafN,leafShape,lColor){
  const n=Math.round(lerp(6,16,leafN));
  const r=leafSz*0.6;
  for(let i=0;i<n;i++){
    const a=(i/n)*360;
    const rad=a*Math.PI/180;
    const lx=cx+Math.cos(rad)*r*0.3;
    const ly=groundY-Math.sin(rad)*r*0.3;
    const side=Math.cos(rad)>0?1:-1;
    drawLeafShape(svg,lx,ly,side,leafSz*0.8,leafShape,lColor,Math.abs(Math.sin(rad))*60+20);
  }
}
