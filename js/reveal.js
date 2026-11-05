// reveal.js — curtain wipe antar section via IntersectionObserver.
export function init(){
  const els = [...document.querySelectorAll('.curtain')];
  if (!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('in')); return () => {};
  }
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
  return () => io.disconnect();
}
