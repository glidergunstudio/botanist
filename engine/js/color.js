// color.js — 色計算関数
// ===== COLOR =====
function flowerRGB(r,b,y) {
  const R=clamp(r,0,1),B=clamp(b,0,1),Y=clamp(y,0,1);
  let h,sat,l;
  if(R>0.6&&B>0.4){h=285;sat=65;l=45;}
  else if(R>0.6&&Y>0.4){h=18;sat=80;l=55;}
  else if(R>0.6){h=348;sat=72;l=50;}
  else if(B>0.5){h=240;sat=58;l=55;}
  else if(Y>0.65){h=48;sat=88;l=55;}
  else if(R>0.3){h=340;sat=58;l=65;}
  else{h=0;sat=0;l=93;}
  return{h,s:sat,l,css:`hsl(${h},${sat}%,${l}%)`,dark:`hsl(${h},${sat}%,${l-14}%)`,light:`hsl(${h},${sat}%,${l+12}%)`};
}
function fruitRGB(r,y) {
  const R=clamp(r,0,1),Y=clamp(y,0,1);
  if(R>0.7&&Y<0.3)  return{css:'hsl(4,72%,48%)',dark:'hsl(4,72%,34%)'};
  if(R>0.5&&Y>0.4)  return{css:'hsl(28,80%,50%)',dark:'hsl(28,80%,36%)'};
  if(Y>0.7)          return{css:'hsl(52,85%,55%)',dark:'hsl(52,85%,41%)'};
  if(R>0.3)          return{css:'hsl(340,58%,60%)',dark:'hsl(340,58%,46%)'};
  return{css:'hsl(130,50%,38%)',dark:'hsl(130,50%,24%)'};
}
function leafHSL(stage,redness){
  if(stage>=7) return `hsl(35,45%,32%)`;
  const g=lerp(100,130,0.5);
  const s=lerp(45,65,0.6)-redness*20;
  const l=lerp(22,38,0.5)-redness*5;
  if(redness>0.3) return `hsl(${lerp(g,340,redness)},${s+10}%,${l+5}%)`;
  return `hsl(${g},${s}%,${l}%)`;
}
function stemHSL(woody,stage){
  if(woody) return['hsl(28,52%,28%)','hsl(28,52%,20%)','hsl(28,40%,22%)'];
  if(stage>=7) return['hsl(40,30%,22%)','hsl(40,30%,16%)','hsl(40,25%,20%)'];
  return['hsl(110,50%,24%)','hsl(110,50%,18%)','hsl(100,42%,20%)'];
}
