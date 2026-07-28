document.documentElement.classList.add('js');
const menuButton=document.querySelector('.menu-button');
const menu=document.querySelector('.mobile-panel');
const closeButton=document.querySelector('.menu-close');
let previousFocus=null;
const menuFocus=()=>[...menu.querySelectorAll('button,a[href]')];
function openMenu(){previousFocus=document.activeElement;menu.hidden=false;menuButton.setAttribute('aria-expanded','true');document.querySelector('main').inert=true;document.querySelector('footer').inert=true;closeButton.focus()}
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');document.querySelector('main').inert=false;document.querySelector('footer').inert=false;(previousFocus||menuButton).focus()}
menuButton?.addEventListener('click',openMenu);closeButton?.addEventListener('click',closeMenu);
menu?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(menu.hidden)return;if(e.key==='Escape'){closeMenu();return}if(e.key==='Tab'){const f=menuFocus(),first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-seen');io.unobserve(entry.target)}}),{threshold:.18});document.querySelectorAll('[data-reveal],[data-rule]').forEach(el=>io.observe(el))}
const method=document.querySelector('.method');let ticking=false;
function progress(){if(!method||reduced)return;const r=method.getBoundingClientRect();const value=Math.max(0,Math.min(1,(innerHeight-r.top)/(r.height+innerHeight)));method.style.setProperty('--scroll-progress',value.toFixed(3));ticking=false}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true}},{passive:true});progress();
