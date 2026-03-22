// stem.js — 茎・幹の描画
// ===== DRAW HELPERS =====
function drawGround(svg,W,H){
  const gy=H-60;
  const groundG=el('g',{'data-name':'地面・土壌','data-vars':'土壌環境が植物の成長に影響'},svg);
  el('rect',{x:0,y:gy,width:W,height:H-gy,fill:'#0e0a04'},groundG);
  el('line',{x1:0,y1:gy,x2:W,y2:gy,stroke:'#1e1408','stroke-width':2},groundG);
  for(let i=0;i<18;i++){
    const rx=20+Math.random()*(W-40),ry=gy+5+Math.random()*25;
    el('circle',{cx:rx,cy:ry,r:1+Math.random()*2,fill:'#2a1a0a',opacity:0.5},groundG);
  }
  addHoverBehavior(groundG);
}

// 改善版幹描画：テーパー・樹皮テクスチャ付き
function drawStem(svg,cx,groundY,topY,thickness,woody,sway,stage,sc){
  const H=groundY-topY;
  const swayAmt=sway*30;
  const cp1x=cx+swayAmt*0.6,cp1y=lerp(groundY,topY,0.4);
  const cp2x=cx-swayAmt*0.3,cp2y=lerp(groundY,topY,0.7);
  const stemG=el('g',{'data-name': woody?'幹（木化した茎）':'茎',
    'data-vars':`stemW=${thickness.toFixed(1)}px woody=${woody?'はい':'いいえ'} sway=${sway.toFixed(2)}`},svg);

  if(woody){
    const baseW=thickness*1.8,topW=thickness*0.5;
    const lPath=`M${cx-baseW},${groundY} C${cp1x-baseW*0.7},${cp1y} ${cp2x-topW},${cp2y} ${cx-topW*0.5},${topY}`;
    const rPath=`M${cx+baseW},${groundY} C${cp1x+baseW*0.7},${cp1y} ${cp2x+topW},${cp2y} ${cx+topW*0.5},${topY}`;
    el('path',{d:`${lPath} L${cx+topW*0.5},${topY} C${cp2x+topW},${cp2y} ${cp1x+baseW*0.7},${cp1y} ${cx+baseW},${groundY} Z`,fill:sc[0],stroke:sc[1],'stroke-width':0.5},stemG);
    for(let i=0;i<6;i++){
      const t=(i+1)/7;
      const bx=lerp(cx,cx+swayAmt*0.3,t);
      const by=lerp(groundY,topY,t);
      const bw=lerp(baseW,topW,t)*0.6;
      el('path',{d:`M${bx-bw},${by} Q${bx},${by-8} ${bx+bw},${by}`,stroke:sc[2],'stroke-width':0.8,fill:'none',opacity:0.5},stemG);
    }
  } else {
    const pts=[];
    const segs=8;
    for(let i=0;i<=segs;i++){
      const t=i/segs;
      const x=bezier3(cx,cp1x,cp2x,cx+swayAmt*0.2,t);
      const y=bezier3(groundY,cp1y,cp2y,topY,t);
      const w=lerp(thickness*0.9,thickness*0.3,t);
      pts.push({x,y,w});
    }
    const left=pts.map(p=>`${p.x-p.w},${p.y}`).join(' ');
    const right=pts.slice().reverse().map(p=>`${p.x+p.w},${p.y}`).join(' ');
    el('path',{d:`M${left} L${right} Z`,fill:sc[0],stroke:sc[1],'stroke-width':0.4},stemG);
  }
  addHoverBehavior(stemG);
}

function bezier3(p0,p1,p2,p3,t){
  const mt=1-t;
  return mt*mt*mt*p0+3*mt*mt*t*p1+3*mt*t*t*p2+t*t*t*p3;
}
