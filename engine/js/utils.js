// utils.js — SVG生成・ユーティリティ関数

// ===== UTILS =====
const NS = 'http://www.w3.org/2000/svg';
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for(const [k,v] of Object.entries(attrs)) e.setAttribute(k, v);
  if(parent) parent.appendChild(e);
  return e;
}
function lerp(a,b,t){return a+(b-a)*t;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function g(id){return parseFloat(document.getElementById('g_'+id).value);}
function s(id){return document.getElementById('s_'+id).value;}
function setG(id,v){const e=document.getElementById('g_'+id);if(e){e.value=v;const ve=document.getElementById('v_'+id);if(ve)ve.textContent=parseFloat(v).toFixed(id==='stage'?0:2);}}
function setS(id,v){const e=document.getElementById('s_'+id);if(e)e.value=v;}
