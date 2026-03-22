// flower.js — 花の描画
// ===== FLOWER DRAWING =====
function drawFlower(svg,cx,cy,sz,petalN,petalShape,fc,stage,isSmall=false){
  // sz は 0〜1 の遺伝子値 → ピクセルサイズに変換
  const baseSz = lerp(18, 60, sz);
  const fSz = isSmall ? baseSz * 0.48 : baseSz;
  const petals = Math.round(lerp(4, 12, petalN));
  const petalLen = fSz * 0.85; // 花弁の長さ
  const petalW  = fSz * 0.32; // 花弁の幅

  if(stage===4){
    // 蕾
    const budG = el('g',{class:'part',
      'data-name':`蕾`,
      'data-vars':`flowerSz=${sz.toFixed(2)} petalN=${petalN.toFixed(2)}`},svg);
    el('ellipse',{cx,cy,rx:fSz*0.28,ry:fSz*0.48,fill:fc.dark,stroke:'#0e2208','stroke-width':1},budG);
    for(let i=0;i<5;i++){
      const a=(i/5)*Math.PI*2-Math.PI/2;
      el('path',{d:`M${cx},${cy+fSz*0.38} L${cx+Math.cos(a)*fSz*0.22},${cy+fSz*0.56} L${cx},${cy+fSz*0.28}`,fill:'#1a4010',stroke:'#0e2208','stroke-width':0.5},budG);
    }
    addHoverBehavior(budG);
    return;
  }

  // がく片（花弁の下に描く）
  const sepalG = el('g',{class:'part',
    'data-name':'がく片（萼片）',
    'data-vars':`petalN=${petals}枚 色:緑`},svg);
  for(let i=0;i<petals;i++){
    const a=(i/petals)*Math.PI*2+(Math.PI/petals); // 花弁の間に配置
    const sx=cx+Math.cos(a)*fSz*0.55;
    const sy=cy+Math.sin(a)*fSz*0.55;
    el('path',{d:`M${cx},${cy} Q${cx+Math.cos(a)*fSz*0.35},${cy+Math.sin(a)*fSz*0.35} ${sx},${sy} Q${cx+Math.cos(a)*fSz*0.3},${cy+Math.sin(a)*fSz*0.3} ${cx},${cy}`,
      fill:'#1e4010',stroke:'#0e2808','stroke-width':0.3,opacity:0.8},sepalG);
  }
  addHoverBehavior(sepalG);

  // 花弁
  for(let i=0;i<petals;i++){
    const a=(i/petals)*Math.PI*2;
    const tip_x=cx+Math.cos(a)*petalLen;
    const tip_y=cy+Math.sin(a)*petalLen;
    // 花弁の左右のベース点
    const lb_a=a+Math.PI/2;
    const rb_a=a-Math.PI/2;
    const lb_x=cx+Math.cos(lb_a)*petalW*0.45;
    const lb_y=cy+Math.sin(lb_a)*petalW*0.45;
    const rb_x=cx+Math.cos(rb_a)*petalW*0.45;
    const rb_y=cy+Math.sin(rb_a)*petalW*0.45;

    const petalG = el('g',{class:'part',
      'data-name':`花弁（${i+1}/${petals}枚目）`,
      'data-vars':`petalShape=${petalShape} 花色:${fc.css} 幅:${petalW.toFixed(1)}px 長さ:${petalLen.toFixed(1)}px`},svg);

    let d;
    switch(petalShape){
      case 'round':{
        // 丸弁：中心幅広、先端丸く
        const mid_x=cx+Math.cos(a)*petalLen*0.55;
        const mid_y=cy+Math.sin(a)*petalLen*0.55;
        const wl_x=mid_x+Math.cos(lb_a)*petalW*0.5;
        const wl_y=mid_y+Math.sin(lb_a)*petalW*0.5;
        const wr_x=mid_x+Math.cos(rb_a)*petalW*0.5;
        const wr_y=mid_y+Math.sin(rb_a)*petalW*0.5;
        d=`M${lb_x},${lb_y} Q${wl_x},${wl_y} ${tip_x},${tip_y} Q${wr_x},${wr_y} ${rb_x},${rb_y} Q${cx+Math.cos(a)*petalW*0.3},${cy+Math.sin(a)*petalW*0.3} ${lb_x},${lb_y}`;
        break;
      }
      case 'sword':{
        // 剣弁：細長く尖る
        const mid_x=cx+Math.cos(a)*petalLen*0.45;
        const mid_y=cy+Math.sin(a)*petalLen*0.45;
        const ml_x=mid_x+Math.cos(lb_a)*petalW*0.38;
        const ml_y=mid_y+Math.sin(lb_a)*petalW*0.38;
        const mr_x=mid_x+Math.cos(rb_a)*petalW*0.38;
        const mr_y=mid_y+Math.sin(rb_a)*petalW*0.38;
        d=`M${lb_x},${lb_y} Q${ml_x},${ml_y} ${tip_x},${tip_y} Q${mr_x},${mr_y} ${rb_x},${rb_y} Q${cx+Math.cos(a)*petalW*0.25},${cy+Math.sin(a)*petalW*0.25} ${lb_x},${lb_y}`;
        break;
      }
      case 'frill':{
        // フリル弁：波打つ縁
        const p1x=cx+Math.cos(a)*petalLen*0.3+Math.cos(lb_a)*petalW*0.55;
        const p1y=cy+Math.sin(a)*petalLen*0.3+Math.sin(lb_a)*petalW*0.55;
        const p2x=cx+Math.cos(a)*petalLen*0.6+Math.cos(lb_a)*petalW*0.4;
        const p2y=cy+Math.sin(a)*petalLen*0.6+Math.sin(lb_a)*petalW*0.4;
        const p3x=cx+Math.cos(a)*petalLen*0.8+Math.cos(rb_a)*petalW*0.25;
        const p3y=cy+Math.sin(a)*petalLen*0.8+Math.sin(rb_a)*petalW*0.25;
        const p4x=cx+Math.cos(a)*petalLen*0.5+Math.cos(rb_a)*petalW*0.5;
        const p4y=cy+Math.sin(a)*petalLen*0.5+Math.sin(rb_a)*petalW*0.5;
        const p5x=cx+Math.cos(a)*petalLen*0.25+Math.cos(rb_a)*petalW*0.55;
        const p5y=cy+Math.sin(a)*petalLen*0.25+Math.sin(rb_a)*petalW*0.55;
        d=`M${lb_x},${lb_y} Q${p1x},${p1y} ${p2x},${p2y} Q${tip_x},${tip_y} ${p3x},${p3y} Q${p4x},${p4y} ${p5x},${p5y} Q${rb_x},${rb_y} ${lb_x},${lb_y}`;
        break;
      }
      case 'tubular':{
        // 筒状花弁
        const tw=petalW*0.35;
        const tl_x=lb_x*0.7+cx*0.3;const tl_y=lb_y*0.7+cy*0.3;
        const tr_x=rb_x*0.7+cx*0.3;const tr_y=rb_y*0.7+cy*0.3;
        d=`M${lb_x},${lb_y} L${tip_x+Math.cos(lb_a)*tw},${tip_y+Math.sin(lb_a)*tw} Q${tip_x},${tip_y} ${tip_x+Math.cos(rb_a)*tw},${tip_y+Math.sin(rb_a)*tw} L${rb_x},${rb_y} Q${tl_x},${tl_y} ${lb_x},${lb_y}`;
        break;
      }
      default:{
        d=`M${lb_x},${lb_y} Q${cx+Math.cos(a)*petalLen*0.5+Math.cos(lb_a)*petalW*0.5},${cy+Math.sin(a)*petalLen*0.5+Math.sin(lb_a)*petalW*0.5} ${tip_x},${tip_y} Q${cx+Math.cos(a)*petalLen*0.5+Math.cos(rb_a)*petalW*0.5},${cy+Math.sin(a)*petalLen*0.5+Math.sin(rb_a)*petalW*0.5} ${rb_x},${rb_y} Q${cx},${cy} ${lb_x},${lb_y}`;
      }
    }
    el('path',{d:d,fill:fc.css,stroke:fc.dark,'stroke-width':0.5,opacity:0.93},petalG);
    addHoverBehavior(petalG);
  }

  // 雌しべ（めしべ）
  const pistilG = el('g',{class:'part',
    'data-name':'雌しべ（めしべ）',
    'data-vars':`花芯径:${(fSz*0.18).toFixed(1)}px`},svg);
  el('circle',{cx,cy,r:fSz*0.18,fill:'#2a6010',stroke:'#1a4008','stroke-width':0.8},pistilG);
  addHoverBehavior(pistilG);

  // 雄しべ（おしべ）
  const stamenG = el('g',{class:'part',
    'data-name':'雄しべ（おしべ）・花粉',
    'data-vars':`数:${petals}本 花粉色:#d8b040`},svg);
  el('circle',{cx,cy,r:fSz*0.26,fill:'#c8a030',stroke:'#8a6c10','stroke-width':0.8},stamenG);
  for(let i=0;i<Math.min(petals*2,16);i++){
    const a=(i/(Math.min(petals*2,16)))*Math.PI*2;
    const sr=fSz*0.2;
    el('circle',{cx:cx+Math.cos(a)*sr,cy:cy+Math.sin(a)*sr,r:1.8,fill:'#e8c050'},stamenG);
  }
  // 花柱
  el('circle',{cx,cy,r:fSz*0.1,fill:'#3a7018',stroke:'#1a4008','stroke-width':0.5},stamenG);
  addHoverBehavior(stamenG);
}
