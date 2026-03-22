// tooltip.js — マウスオーバー・ツールチップ
// ===== HOVER TOOLTIP =====
function addHoverBehavior(g){
  const name=g.getAttribute('data-name')||'';
  const vars=g.getAttribute('data-vars')||'';
  g.style.cursor='pointer';
  g.addEventListener('mouseenter',(e)=>{
    const tip=document.getElementById('tooltip');
    tip.style.display='block';
    document.getElementById('tip-name').textContent=name;
    document.getElementById('tip-vars').textContent=vars;
    // ハイライト
    g.querySelectorAll('path,circle,ellipse').forEach(el=>{
      el.setAttribute('filter','url(#highlight)');
    });
  });
  g.addEventListener('mouseleave',()=>{
    document.getElementById('tooltip').style.display='none';
    g.querySelectorAll('path,circle,ellipse').forEach(el=>{
      el.removeAttribute('filter');
    });
  });
  g.addEventListener('mousemove',(e)=>{
    const tip=document.getElementById('tooltip');
    const rect=document.getElementById('svg').getBoundingClientRect();
    tip.style.left=(e.clientX-rect.left+12)+'px';
    tip.style.top=(e.clientY-rect.top-8)+'px';
  });
}
