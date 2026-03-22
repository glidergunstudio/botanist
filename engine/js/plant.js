// plant.js — メイン描画・プリセット・UI制御
// ===== MAIN DRAW =====
function drawPlant(){
  const svg=document.getElementById('svg');
  // defs以外をクリア
  Array.from(svg.children).forEach(c=>{if(c.tagName!=='defs')c.remove();});
  const W=420,H=520;
  const cx=W/2,groundY=H-62;
  const stage=parseInt(g('stage'));
  const habit=s('habit');
  const height=g('height');
  const stemWv=g('stemW');
  const branch=g('branch');
  const sway=g('sway');
  const leafSz=g('leafSz');
  const leafN=g('leafN');
  const leafA=g('leafA');
  const leafR=g('leafR');
  const leafShape=s('leafShape');
  const inflo=s('inflo');
  const petalN=g('petalN');
  const flowerSz=g('flowerSz');
  const petalShape=s('petalShape');
  const fR=g('fR'),fB=g('fB'),fY=g('fY');
  const fruitType=s('fruit');
  const fruitSz=g('fruitSz');
  const fruitN=g('fruitN');
  const frR=g('frR'),frY=g('frY');

  const fc=flowerRGB(fR,fB,fY);
  const lColor=leafHSL(stage,leafR);
  const maxH=lerp(60,400,height);
  const stageH=stage<=1?maxH*0.12:stage<=2?maxH*0.32:stage<=3?maxH*0.72:maxH;
  const plantH=stageH;
  const topY=groundY-plantH;
  const stemTh=lerp(2,14,stemWv);
  const woody=habit==='woody';
  const sc=stemHSL(woody,stage);

  drawGround(svg,W,H);
  if(stage===0){
    // 種子
    el('ellipse',{cx,cy:groundY-8,rx:woody?10:5,ry:7,fill:'#3a2010',stroke:'#1a1004','stroke-width':1},svg);
    return;
  }

  const stemData=[];// 葉の位置を記録（果実配置に使用）

  if(habit==='rosette'){
    // ロゼット型
    const rStem=lerp(5,20,stemWv);
    el('line',{x1:cx,y1:groundY,x2:cx,y2:groundY-rStem,stroke:sc[0],'stroke-width':stemTh*0.5},svg);
    if(stage>=2) drawRosette(svg,cx,groundY,lerp(20,80,leafSz),leafN,leafShape,lColor);
    if(stage>=4) drawInflorescence(svg,cx,groundY-rStem-plantH*0.4,inflo,flowerSz,petalN,petalShape,fc,fR,fB,fY,stage,plantH);
  }
  else if(habit==='cactus'){
    // 多肉型（サボテン）
    const bW=stemTh*2,bH=plantH;
    // 本体
    el('path',{d:`M${cx-bW},${groundY} Q${cx-bW*1.1},${groundY-bH*0.5} ${cx-bW*0.8},${topY} Q${cx},${topY-bW*0.3} ${cx+bW*0.8},${topY} Q${cx+bW*1.1},${groundY-bH*0.5} ${cx+bW},${groundY} Z`,fill:'#2e5c18',stroke:'#1a3a08','stroke-width':1},svg);
    // 稜線
    for(let i=-1;i<=1;i++){
      el('path',{d:`M${cx+i*bW*0.4},${groundY} Q${cx+i*bW*0.35},${groundY-bH*0.5} ${cx+i*bW*0.28},${topY}`,stroke:'#1e4210','stroke-width':1,fill:'none',opacity:0.5},svg);
    }
    // 棘
    for(let r=0;r<7;r++){
      const ry=groundY-bH*(r+1)/8;
      for(let side=-1;side<=1;side+=2){
        const sx=cx+side*(bW*0.85);
        el('line',{x1:sx,y1:ry,x2:sx+side*9,y2:ry-5,stroke:'#d8c878','stroke-width':1},svg);
        el('line',{x1:sx,y1:ry,x2:sx+side*7,y2:ry+3,stroke:'#d8c878','stroke-width':0.8},svg);
      }
    }
    // 腕
    const armN=Math.round(lerp(0,4,branch));
    for(let i=0;i<armN;i++){
      const side=i%2===0?1:-1;
      const t=0.35+i*0.15;
      const ay=groundY-bH*t;
      const aLen=bH*0.3;
      el('path',{d:`M${cx+side*bW*0.8},${ay} Q${cx+side*(bW+aLen)*0.6},${ay-aLen*0.25} ${cx+side*(bW+aLen)},${ay-aLen*0.55} Q${cx+side*(bW+aLen*1.1)},${ay-aLen} ${cx+side*(bW+aLen*0.9)},${ay-aLen*1.15}`,stroke:'#2e5c18','stroke-width':bW*0.75,fill:'none','stroke-linecap':'round'},svg);
    }
    if(stage>=4) drawFlower(svg,cx,topY-8,flowerSz*0.5,petalN,petalShape,fc,stage);
  }
  else if(habit==='creep'||habit==='vine'){
    // 匍匐型・つる性
    const spread=plantH*1.3;
    for(let side=-1;side<=1;side+=2){
      const ex=cx+side*spread,ey=groundY-12;
      el('path',{d:`M${cx},${groundY} Q${cx+side*spread*0.45},${groundY-18} ${ex},${ey}`,stroke:sc[0],'stroke-width':stemTh*0.7,fill:'none','stroke-linecap':'round'},svg);
      if(stage>=2){
        const lN=Math.round(lerp(3,7,leafN));
        for(let i=0;i<lN;i++){
          const t=(i+1)/(lN+1);
          const lx=cx+side*spread*t;
          const ly=groundY-10-t*10;
          drawLeafShape(svg,lx,ly,side,lerp(12,45,leafSz),leafShape,lColor,lerp(50,80,leafA));
          stemData.push({x:lx,y:ly});
        }
      }
      if(stage>=4){
        const fx=cx+side*spread*0.55;
        drawInflorescence(svg,fx,groundY-35,inflo,flowerSz*0.75,petalN,petalShape,fc,fR,fB,fY,stage,plantH*0.5);
      }
    }
    // つる先端
    if(habit==='vine'){
      for(let i=0;i<3;i++){
        const a=((i/3)*120-60)*Math.PI/180;
        el('path',{d:`M${cx},${groundY-plantH*0.3} Q${cx+Math.cos(a)*40},${groundY-plantH*0.3-20} ${cx+Math.cos(a)*25},${groundY-plantH*0.3-35}`,stroke:sc[0],'stroke-width':0.8,fill:'none'},svg);
      }
    }
  }
  else{
    // 直立型 / 木本型
    drawStem(svg,cx,groundY,topY,stemTh,woody,sway,stage,sc);

    if(stage>=2){
      // 枝と葉の配置
      const lN=Math.round(lerp(2,9,leafN));
      for(let i=0;i<lN;i++){
        const t=(i+1)/(lN+1);
        const lx=cx;
        const ly=groundY-plantH*t*0.88+sway*10*Math.sin(t*Math.PI);
        const side=i%2===0?1:-1;
        const lSz=lerp(12,55,leafSz)*(0.7+t*0.5);
        const angle=lerp(25,70,leafA);

        if(woody&&branch>0.3){
          // 木本：枝を描いてから葉
          const bLen=plantH*lerp(0.08,0.22,branch);
          const bx=cx+side*bLen*0.9;
          const by=ly-bLen*0.4;
          el('path',{d:`M${cx},${ly} Q${cx+side*bLen*0.5},${ly-bLen*0.2} ${bx},${by}`,stroke:sc[0],'stroke-width':stemTh*0.35,fill:'none','stroke-linecap':'round'},svg);
          drawLeafShape(svg,bx,by,side,lSz*0.85,leafShape,lColor,angle);
          stemData.push({x:bx,y:by});
        } else {
          drawLeafShape(svg,lx,ly,side,lSz,leafShape,lColor,angle);
          stemData.push({x:lx+side*20,y:ly});
        }
      }
    }

    if(stage>=4){
      drawInflorescence(svg,cx,topY,inflo,flowerSz,petalN,petalShape,fc,fR,fB,fY,stage,plantH);
    }
  }

  // 果実
  if(stage>=6){
    drawFruit(svg,cx,groundY,plantH,fruitType,fruitSz,fruitN,frR,frY,stage,sc,stemData);
  }
}

// ===== PRESETS =====
const PRESETS={
  tulip:{habit:'erect',height:0.42,stemW:0.28,branch:0.05,sway:0.15,leafShape:'oval',leafSz:0.55,leafN:0.22,leafA:0.32,leafR:0,inflo:'solitary',petalN:0.35,flowerSz:0.62,petalShape:'round',fR:0.88,fB:0.08,fY:0.05,fruit:'none',fruitSz:0.3,fruitN:0.3,frR:0,frY:0,stage:5,name:'チューリップ'},
  sunflower:{habit:'erect',height:0.92,stemW:0.42,branch:0.08,sway:0.08,leafShape:'heart',leafSz:0.7,leafN:0.45,leafA:0.5,leafR:0,inflo:'capitulum',petalN:0.75,flowerSz:0.88,petalShape:'sword',fR:0.12,fB:0.02,fY:0.98,fruit:'none',fruitSz:0.2,fruitN:0.8,frR:0,frY:0.4,stage:5,name:'ヒマワリ'},
  rose:{habit:'woody',height:0.62,stemW:0.38,branch:0.72,sway:0.12,leafShape:'compound',leafSz:0.42,leafN:0.62,leafA:0.52,leafR:0,inflo:'corymb',petalN:0.88,flowerSz:0.55,petalShape:'round',fR:0.92,fB:0.12,fY:0.04,fruit:'berry',fruitSz:0.25,fruitN:0.55,frR:0.85,frY:0.1,stage:5,name:'バラ'},
  cactus:{habit:'cactus',height:0.55,stemW:0.55,branch:0.5,sway:0,leafShape:'needle',leafSz:0.1,leafN:0.1,leafA:0.5,leafR:0,inflo:'solitary',petalN:0.55,flowerSz:0.38,petalShape:'frill',fR:0.92,fB:0.08,fY:0.28,fruit:'none',fruitSz:0.3,fruitN:0.3,frR:0.9,frY:0.1,stage:5,name:'サボテン'},
  tomato:{habit:'erect',height:0.55,stemW:0.35,branch:0.55,sway:0.2,leafShape:'compound',leafSz:0.52,leafN:0.55,leafA:0.5,leafR:0,inflo:'corymb',petalN:0.4,flowerSz:0.3,petalShape:'sword',fR:0.1,fB:0.05,fY:0.95,fruit:'berry',fruitSz:0.5,fruitN:0.7,frR:0.92,frY:0.18,stage:6,name:'トマト'},
  carrot:{habit:'rosette',height:0.38,stemW:0.18,branch:0.22,sway:0.1,leafShape:'compound',leafSz:0.48,leafN:0.6,leafA:0.6,leafR:0,inflo:'umbel',petalN:0.3,flowerSz:0.28,petalShape:'round',fR:0.05,fB:0.02,fY:0.08,fruit:'root_vis',fruitSz:0.55,fruitN:0.3,frR:0.92,frY:0.35,stage:6,name:'ニンジン'},
  wisteria:{habit:'vine',height:0.65,stemW:0.3,branch:0.5,sway:0.25,leafShape:'compound',leafSz:0.5,leafN:0.65,leafA:0.5,leafR:0,inflo:'raceme',petalN:0.45,flowerSz:0.65,petalShape:'round',fR:0.45,fB:0.72,fY:0.05,fruit:'legume',fruitSz:0.45,fruitN:0.5,frR:0.2,frY:0.6,stage:6,name:'フジ'},
  dandelion:{habit:'rosette',height:0.28,stemW:0.2,branch:0.05,sway:0.05,leafShape:'narrow',leafSz:0.52,leafN:0.75,leafA:0.5,leafR:0,inflo:'capitulum',petalN:0.85,flowerSz:0.55,petalShape:'sword',fR:0.2,fB:0.02,fY:0.95,fruit:'capsule',fruitSz:0.22,fruitN:0.7,frR:0.3,frY:0.8,stage:6,name:'タンポポ'},
};

function load(name){
  const p=PRESETS[name];
  if(!p)return;
  setS('habit',p.habit);setS('leafShape',p.leafShape);setS('inflo',p.inflo);setS('petalShape',p.petalShape);setS('fruit',p.fruit);
  const nums=['height','stemW','branch','sway','leafSz','leafN','leafA','leafR','petalN','flowerSz','fR','fB','fY','fruitSz','fruitN','frR','frY','stage'];
  nums.forEach(k=>{if(p[k]!==undefined)setG(k,p[k]);});
  document.getElementById('nameLabel').textContent=p.name;
  document.getElementById('descLabel').textContent='プリセットから読み込み';
  update();
}

function rnd(){
  const habits=['erect','woody','creep','rosette','cactus','vine'];
  const leafShapes=['oval','narrow','heart','round','compound','palmate','needle'];
  const inflos=['solitary','capitulum','raceme','spike','umbel','corymb'];
  const petalShapes=['round','sword','frill','tubular'];
  const fruits=['none','none','berry','drupe','legume','cluster','aggregate','capsule'];
  setS('habit',habits[Math.floor(Math.random()*habits.length)]);
  setS('leafShape',leafShapes[Math.floor(Math.random()*leafShapes.length)]);
  setS('inflo',inflos[Math.floor(Math.random()*inflos.length)]);
  setS('petalShape',petalShapes[Math.floor(Math.random()*petalShapes.length)]);
  setS('fruit',fruits[Math.floor(Math.random()*fruits.length)]);
  ['height','stemW','branch','sway','leafSz','leafN','leafA','leafR','petalN','flowerSz'].forEach(k=>setG(k,Math.random().toFixed(2)));
  setG('fR',Math.random().toFixed(2));setG('fB',Math.random().toFixed(2));setG('fY',Math.random().toFixed(2));
  setG('fruitSz',Math.random().toFixed(2));setG('fruitN',Math.random().toFixed(2));
  setG('frR',Math.random().toFixed(2));setG('frY',Math.random().toFixed(2));
  setG('stage',Math.floor(Math.random()*8));
  document.getElementById('nameLabel').textContent='未知の植物';
  update();
}

function update(){
  ['height','stemW','branch','sway','leafSz','leafN','leafA','leafR','petalN','flowerSz','fR','fB','fY','fruitSz','fruitN','frR','frY','stage'].forEach(k=>{
    const v=document.getElementById('v_'+k);
    const i=document.getElementById('g_'+k);
    if(v&&i)v.textContent=parseFloat(i.value).toFixed(k==='stage'?0:2);
  });
  drawPlant();
  updateStageIndicator();
  updatePanels();
}

function updateStageIndicator(){
  const stage=parseInt(g('stage'));
  const names=['🌰','🌱','🌿','🪴','🌾','🌸','🍎','🍂'];
  document.getElementById('si').innerHTML=names.map((n,i)=>
    `<div class="sdot ${i<stage?'done':i===stage?'active':''}" title="${n}"></div>`
  ).join('');
}

function updatePanels(){
  const stage=parseInt(g('stage'));
  const fc=flowerRGB(g('fR'),g('fB'),g('fY'));
  const frc=fruitRGB(g('frR'),g('frY'));
  const lc=leafHSL(stage,g('leafR'));
  const sc=stemHSL(s('habit')==='woody',stage);

  const habitNames={erect:'直立型',woody:'木本型',creep:'匍匐型',rosette:'ロゼット型',cactus:'多肉型',vine:'つる性'};
  const infloNames={solitary:'単頂花',capitulum:'頭状花序',raceme:'総状花序',spike:'穂状花序',umbel:'散形花序',corymb:'散房花序'};
  const fruitNames={none:'なし',berry:'液果',drupe:'核果',pome:'仁果',legume:'豆果',cluster:'房状',aggregate:'集合果',capsule:'蒴果',root_vis:'根菜'};

  document.getElementById('traitPanel').innerHTML=[
    ['草姿',habitNames[s('habit')]||s('habit')],
    ['草丈',`${Math.round(lerp(20,400,g('height')))}cm相当`],
    ['葉の形',s('leafShape')],
    ['花序',infloNames[s('inflo')]||s('inflo')],
    ['花弁数',`${Math.round(lerp(4,12,g('petalN')))}枚`],
    ['果実',fruitNames[s('fruit')]||s('fruit')],
    ['成長段階',`Stage ${stage} / 7`],
  ].map(([k,v])=>`<div class="ti"><div class="tk">${k}</div><div class="tv">${v}</div></div>`).join('');

  document.getElementById('colorPanel').innerHTML=[
    ['茎色',sc[0]],['葉色',lc],['花色',fc.css],['花色（暗）',fc.dark],['果実色',frc.css],
  ].map(([k,v])=>`<div class="ti"><div class="tk">${k}</div><div class="tv"><span class="sw" style="background:${v}"></span>${v}</div></div>`).join('');
}

function animGrow(){
  let st=0;setG('stage',0);update();
  const iv=setInterval(()=>{st++;setG('stage',st);update();if(st>=7)clearInterval(iv);},650);
}

load('tulip');
