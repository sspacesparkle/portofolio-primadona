
gsap.registerPlugin(ScrollTrigger,TextPlugin),$(document).ready(()=>{
 if(void 0!==Webflow.env("editor")||isSafari())return;
 mm.add('(min-width: 992px)',()=>{
  lenisActive=true;lenis=new Lenis;
  const tick=time=>lenis.raf(time*1000);
  gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);
  return()=>{gsap.ticker.remove(tick);lenis.destroy();lenis=undefined;lenisActive=false;};
 });
}),(()=>{const e=document.querySelector('[data-wf--nav--variant="loader"]'),t=document.querySelector('[data-wf--nav--variant="base"]');if(!e||!t)return;if(window.matchMedia("(max-width: 991px)").matches){const loader=document.querySelector(".loader");if(loader)loader.style.display="none";return;}document.body.style.overflow="hidden",setTimeout(()=>{void 0!==lenis&&lenis.stop()},100);const o=e.querySelector(".is-ref-glitch"),n=e.querySelector(".is-ref-grit"),i=e.querySelector(".nav-logo-txt.is-glitch"),r=e.querySelector(".nav-logo-txt.is-grit"),s=e.querySelector(".nav-centered-logo"),a=e.querySelectorAll(".nav-logo-txt"),c=document.querySelector(".loader-bk.is-left"),l=document.querySelector(".loader-bk.is-right"),d=t.querySelector(".is-ref-glitch"),p=t.querySelector(".is-ref-grit"),g=document.querySelectorAll(".home-project-visual-wrap"),u=([...g].filter((e,t)=>t%2==0),[...g].filter((e,t)=>t%2!=0),getComputedStyle(document.documentElement).getPropertyValue("--_typography---font-size--text-main").trim()),f=i?.getBoundingClientRect(),m=r?.getBoundingClientRect(),h=t.getBoundingClientRect();gsap.set(t,{opacity:0}),gsap.set(e,{opacity:1}),gsap.set([i,r],{opacity:0}),d&&(d.textContent="DEDHARYA"),p&&(p.textContent="IMMANUELLA");const y=gsap.timeline({delay:.3});o&&y.to(o,{duration:.8,text:{value:"DEDHARYA",delimiter:""},ease:"none"},0),n&&y.to(n,{duration:.8,text:{value:"IMMANUELLA",delimiter:""},ease:"none"},0),s&&y.to(s,{marginLeft:"-1.25rem",duration:1.2,ease:"power3.inOut"},0),y.add(()=>{if(o&&f){const e=o.getBoundingClientRect();gsap.to(o,{x:f.left-e.left,y:f.top-e.top,duration:.95,ease:"expo.inOut",onComplete:()=>{gsap.set(o,{opacity:0}),gsap.set(i,{opacity:1})}})}if(n&&m){const e=n.getBoundingClientRect();gsap.to(n,{x:m.left-e.left,y:m.top-e.top,duration:.95,ease:"expo.inOut",onComplete:()=>{gsap.set(n,{opacity:0}),gsap.set(r,{opacity:1})}})}},"-=0.1"),a.length&&y.to(a,{fontSize:u,duration:.9,ease:"expo.inOut"},"+=0.8"),y.add(()=>{const t=e.getBoundingClientRect();gsap.to(e,{x:h.left-t.left,y:h.top-t.top,duration:1,ease:"expo.inOut"}),c&&gsap.to(c,{yPercent:-100,duration:1,ease:"expo.inOut"}),l&&gsap.to(l,{yPercent:100,duration:1,ease:"expo.inOut"})},"-=0.2"),y.to(t,{opacity:1,duration:.4,ease:"power2.inOut"},"+=0.9"),y.to(e,{opacity:0,duration:.4,ease:"power2.inOut",onComplete:()=>{e.style.pointerEvents="none";const t=document.querySelector(".loader");t&&(t.style.pointerEvents="none"),document.body.style.overflow="",void 0!==lenis&&lenis.start()}},"<")})();const mm=gsap.matchMedia();let lenis,lenisActive=!1,homeLoopHandler=null,homeLooping=!1;function isSafari(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}function initYear(){$(".current-year").text((new Date).getFullYear())}function initMobileMenu(){let e=!1;const t=gsap.timeline({paused:!0,defaults:{duration:.4,ease:"power4.inOut"}}).to(".burger-line.middle",{marginTop:"calc(0rem - 1px)",marginBottom:"calc(0rem - 1px)"}).set(".burger-line.middle",{opacity:0},"<0.2").to(".burger-line.top",{rotate:"45deg"},"<").to(".burger-line.bottom",{rotate:"-45deg"},"<").set(".menu-mobile-wrap",{display:"flex"},"<").from(".menu-mobile-wrap",{opacity:0,duration:.2},"<0.1");$(".burger-wrap").on("click",function(){e?t.reverse():t.play(),e=!e})}function setVideoActive(video, active) {
  if (active && !document.hidden) {
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    if (video.paused) video.play().catch(() => {});
  } else video.pause();
}
function setHomeVideoActive(video, active) {
  setVideoActive(video, active);
  if ((!active || document.hidden) && video.getAttribute('src')) {
    video.removeAttribute('src');
    video.load();
  }
}
function activateHomeProject(item, active) {
  item.querySelectorAll('.g_visual_video').forEach(video => setHomeVideoActive(video, active));
}
function initHomeProjects(){
  document.querySelectorAll('.home-projects-item .g_visual_video').forEach(video => {
    video.preload = 'none';
    video.removeAttribute('autoplay');
    video.pause();
  });
}
function initCurrentLinks(){$("a").on("click",function(e){$(this).attr("href")===window.location.pathname&&(e.preventDefault(),e.stopPropagation(),lenisActive?lenis.scrollTo(0,{duration:.5}):window.scrollTo({top:0,behavior:"smooth"}))})}function initDrawers(){$('[class*="drawer-top"], [drawer-top]').on("click",function(){const e=$(this).closest(".drawer-item, [drawer-parent]"),t=e.hasClass("open");e.siblings().removeClass("open"),t?e.removeClass("open"):e.addClass("open"),setTimeout(()=>ScrollTrigger.refresh(),600)})}function initSocialsHover(){const e={LI:"LinkedIn",IG:"Instagram",YT:"YouTube"};$(".socials-flex a").each(function(){const t=$(this),o=t.find(".social-txt"),n=(o.text()||"").trim(),i=e[n];if(!i)return;const r={p:0};let s;function a(){const e=Math.round(n.length+(i.length-n.length)*r.p);o.text(i.slice(0,e))}o.text(n),t.on("mouseenter",()=>{s?.kill(),s=gsap.to(r,{p:1,duration:.25,ease:"none",overwrite:"auto",onUpdate:a})}).on("mouseleave",()=>{s?.kill(),s=gsap.to(r,{p:0,duration:.15,ease:"none",overwrite:"auto",onUpdate:a,onComplete:()=>o.text(n)})})})}function initScrollAnimations(){$(".footer").each(function(){const e=$(this);gsap.timeline({scrollTrigger:{trigger:e,start:"top bottom",end:"bottom bottom",scrub:!0}}).to($('[data-wf--nav--variant="base"]'),{yPercent:100}).to($(".bottom-footer-fixed .section-contain"),{yPercent:-100},"<")}),$(".about-split-grid").each(function(){mm.add("(min-width: 992px)",()=>{const e=$(this),t=e.attr("split-section");gsap.timeline({scrollTrigger:{trigger:e,start:"top bottom",end:"bottom top",scrub:!0}}).fromTo(e.find(".about-txt-flex"),{y:"02"===t?"15rem":"-25rem"},{y:"0rem"})})}),$(".centere-big-txt").each(function(){mm.add("(min-width: 992px)",()=>{const e=$(this),t=e.attr("big-txt");gsap.timeline({scrollTrigger:{trigger:e.closest("section"),start:"02"===t?"top bottom":"top top",end:"bottom top",scrub:!0}}).fromTo(e,{y:"0rem"},{y:"10rem",ease:"none"})})}),$(".line-divider").each(function(){gsap.timeline({scrollTrigger:{trigger:this,start:"top 90%",toggleActions:"play none none none"}}).from(this,{width:"0%",duration:1.25,ease:"power3.inOut"})}),$(".featured-video-ratio").each(function(){gsap.timeline({scrollTrigger:{trigger:this,start:"top bottom",end:"top 40%",scrub:!0}}).from(this,{opacity:0,ease:"none"})}),$(".featured-video-ratio").each(function(){gsap.timeline({scrollTrigger:{trigger:this,start:"top 20%",end:"top -100%",scrub:!0}}).to(this,{opacity:0,ease:"none"})})}function updateWorkCount(){document.querySelectorAll('.work-grid-coll-item:not([style*="display: none"]) [work-count]').forEach((e,t)=>{e.textContent=String(t+1).padStart(2,"0")})}function initHomeScroll(){
 const items=document.querySelectorAll('.home-projects-item');
 if(!items.length)return;
 mm.add('(max-width: 991px)',()=>{
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
   activateHomeProject(target,isIntersecting);
  }),{threshold:0.25});
  items.forEach(item=>observer.observe(item));
  return()=>{observer.disconnect();items.forEach(item=>activateHomeProject(item,false));};
 });
 mm.add('(min-width: 992px)',()=>initDesktopHomeScroll());
}
function initDesktopHomeScroll(){
const e=$(".page_scroll");if(!e.length)return;const t=e.find(".home-projects-list"),o=e.find(".home-triggers-wrap"),n=t.find(".home-projects-item");if(!n.length)return;const originalTriggers=o.html();const i=n.length+1,r=i+1;let s=o.find(".home-trigger");const a=r-s.length;if(a>0)for(let e=0;e<a;e++)o.append('<div class="home-trigger"></div>');else a<0&&s.slice(r).remove();s=o.find(".home-trigger"),o.css("height",100*i+75+"vh"),s.last().css("height","75vh"),t.append(n.first().clone(!1));const c=[];t.find(".home-projects-item").each(function(e){const t=$(this),o=t.find(".home-project-visual-wrap");c.push({$screen:t,el:this,$first:o.eq(0),$second:o.eq(1),$firstInner:o.eq(0).find(".g_visual_wrap"),$secondInner:o.eq(1).find(".g_visual_wrap"),$contentLeft:t.find(".home-project-item-content.is-left").first(),$contentRight:t.find(".home-project-item-content.is-right").first(),$blocksLeft:t.find(".home-project-item-content.is-left .home-content-block"),$blocksRight:t.find(".home-project-item-content.is-right .home-content-block")}),gsap.set(t,{zIndex:e,pointerEvents:"none"})}),c.forEach((e,t)=>{0===t?(gsap.set([e.$first,e.$second],{clipPath:"inset(0% 0% 0% 0%)"}),gsap.set(e.$firstInner,{scaleY:1,transformOrigin:"50% 50%"}),gsap.set(e.$secondInner,{scaleY:1,transformOrigin:"50% 50%"})):(gsap.set(e.$first,{clipPath:"inset(100% 0% 0% 0%)"}),gsap.set(e.$second,{clipPath:"inset(0% 0% 100% 0%)"}),gsap.set(e.$firstInner,{scaleY:0,transformOrigin:"50% 100%"}),gsap.set(e.$secondInner,{scaleY:0,transformOrigin:"50% 0%"}),e.$contentLeft.length&&gsap.set(e.$contentLeft,{clipPath:"inset(100% 50% 0% 0%)"}),e.$contentRight.length&&gsap.set(e.$contentRight,{clipPath:"inset(0% 0% 100% 50%)"})),e.$blocksLeft.length&&gsap.set(e.$blocksLeft,{y:0}),e.$blocksRight.length&&gsap.set(e.$blocksRight,{y:0})});let l=-1;function d(e){if(e!==l){l=e;for(let t=0;t<c.length;t++){const o=c[t],n=Math.abs(t-e)<=1,i=t===e?"auto":"none",r=n?"visible":"hidden";if(o._events!==i&&(o.el.style.pointerEvents=i,o._events=i),o._vis!==r&&(o.el.style.visibility=r,o._vis=r),o._active!==(t===e)){o._active=t===e;activateHomeProject(o.el,o._active)}}}}d(0);const p=[];s.each(function(e){const t=c[e],o=c[e-1];if(!t||!o||0===e)return;const n=()=>({trigger:this,start:"top center",end:"bottom center",scrub:!0}),i=($("body").hasClass("no-scale"),gsap.timeline({scrollTrigger:n()}).fromTo(o.$firstInner,{scaleY:1,yPercent:0,transformOrigin:"50% 0%"},{scaleY:1,yPercent:-20,transformOrigin:"50% 0%",ease:"none",immediateRender:!1},0).fromTo(o.$secondInner,{scaleY:1,yPercent:0,transformOrigin:"50% 100%"},{scaleY:1,yPercent:20,transformOrigin:"50% 100%",ease:"none",immediateRender:!1},0).fromTo(t.$firstInner,{scaleY:1,yPercent:20,transformOrigin:"50% 100%"},{scaleY:1,yPercent:0,transformOrigin:"50% 100%",ease:"none"},0).fromTo(t.$secondInner,{scaleY:1,yPercent:-20,transformOrigin:"50% 0%"},{scaleY:1,yPercent:0,transformOrigin:"50% 0%",ease:"none"},0).fromTo(t.$first,{clipPath:"inset(100% 0% 0% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",ease:"none"},0).fromTo(t.$second,{clipPath:"inset(0% 0% 100% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",ease:"none"},0).fromTo(o.$contentLeft,{clipPath:"inset(0% 50% 0% 0%)"},{clipPath:"inset(0% 50% 100% 0%)",ease:"none",immediateRender:!1},0).fromTo(o.$contentRight,{clipPath:"inset(0% 0% 0% 50%)"},{clipPath:"inset(100% 0% 0% 50%)",ease:"none",immediateRender:!1},0).fromTo(t.$contentLeft,{clipPath:"inset(100% 50% 0% 0%)"},{clipPath:"inset(0% 50% 0% 0%)",ease:"none"},0).fromTo(t.$contentRight,{clipPath:"inset(0% 0% 100% 50%)"},{clipPath:"inset(0% 0% 0% 50%)",ease:"none"},0));p[e]=i.scrollTrigger,gsap.timeline({scrollTrigger:n()}).fromTo(t.$blocksLeft,{y:"30vh"},{y:"0vh",ease:"power2.out"},0).fromTo(t.$blocksRight,{y:"-30vh"},{y:"0vh",ease:"power2.out"},0).fromTo(o.$blocksLeft,{y:"0vh"},{y:"-30vh",ease:"power2.in",immediateRender:!1},0).fromTo(o.$blocksRight,{y:"0vh"},{y:"30vh",ease:"power2.in",immediateRender:!1},0)}),s.each(function(e){c[e]&&ScrollTrigger.create({trigger:this,start:"top top",end:"bottom top",onEnter:()=>d(e),onEnterBack:()=>d(e),onLeave(t){1===t.direction&&c[e+1]&&d(e+1)},onLeaveBack(t){-1===t.direction&&c[e-1]&&d(e-1)}})}),homeLoopHandler&&gsap.ticker.remove(homeLoopHandler);const g=ScrollTrigger.getScrollFunc(window);homeLoopHandler=()=>{if(homeLooping)return;const e=p[1],t=p[i-1];if(!e||!t)return;const o=e.start,n=t.end,r=n-o,s=g();if(r<=0||s<=n)return;const a=s-r;homeLooping=!0,lenis?lenis.scrollTo(a,{immediate:!0,force:!0}):window.scrollTo(0,a),ScrollTrigger.update();let c=0;for(let e=1;e<i;e++)p[e]&&a>=p[e].end&&(c=e);d(c),homeLooping=!1},gsap.ticker.add(homeLoopHandler);
return()=>{
 gsap.ticker.remove(homeLoopHandler);homeLoopHandler=null;homeLooping=false;
 t.children('.home-projects-item').last().remove();
 o.html(originalTriggers).removeAttr('style');
 n.each(function(){
  this.style.removeProperty('visibility');this.style.removeProperty('pointer-events');
  activateHomeProject(this,false);
 });
};
}const initBodyBg=()=>{const e=$(".page_main").css("background-color");gsap.set("body",{backgroundColor:e})};initBodyBg();function initFilters(){
  const list=document.querySelector('.work-grid-coll-list');
  const buttons=Array.from(document.querySelectorAll('.filter-btn'));
  if(!list||!buttons.length)return;
  const cards=Array.from(list.children).filter(card=>card.classList.contains('work-grid-coll-item'));
  function apply(button){
    const category=button.querySelector('[fs-cmsfilter-field="category"]').textContent.trim();
    buttons.forEach(item=>{
      item.classList.toggle('is-active',item===button);
      const input=item.querySelector('input');
      if(input)input.checked=item===button;
    });
    let count=0;
    cards.forEach(card=>{
      const categories=Array.from(card.querySelectorAll('.hide [fs-cmsfilter-field="category"]')).map(tag=>tag.textContent.trim());
      const visible=category==='All Work'||categories.includes(category);
      card.hidden=!visible;
      card.style.display=visible?'':'none';
      card.style.opacity='1';
      const number=card.querySelector('[work-count]');
      if(visible&&number)number.textContent=String(++count).padStart(2,'0');
    });
    if(typeof ScrollTrigger!=='undefined')ScrollTrigger.refresh();
  }
  buttons.forEach(button=>button.addEventListener('click',()=>apply(button)));
  apply(buttons[0]);
}
function initWorkVideoHover(){document.querySelectorAll('.work-grid-coll-item').forEach(card=>{
 const video=card.querySelector('.g_visual_video');if(!video||!video.dataset.src)return;
 video.preload='none';video.removeAttribute('autoplay');video.pause();
 const hasImage=!!card.querySelector('img');if(hasImage)gsap.set(video,{opacity:0});
 card.addEventListener('mouseenter',()=>{setHomeVideoActive(video,true);gsap.to(video,{opacity:1,duration:.3});});
 card.addEventListener('mouseleave',()=>{setHomeVideoActive(video,false);});
});}function initCasestudyVideos(){
 const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
  target._inViewport=isIntersecting;
  setVideoActive(target,isIntersecting);
 }),{threshold:0.01});
 document.querySelectorAll('.cs-section .g_visual_video, [data-visible-video]').forEach(video=>{
  if(!video.dataset.src)return;
  video.preload='none';video.muted=true;video.controls=!!video.closest('.cs-section');
  observer.observe(video);
 });
}function initProjectInfosPosition(){const e=document.querySelector(".project-infos");e&&e.classList.toggle("is-relative",e.offsetHeight>window.innerHeight)}function allpages(){initYear(),initMobileMenu(),initCurrentLinks(),initDrawers(),initSocialsHover(),initScrollAnimations(),initHomeProjects(),initHomeScroll(),initFilters(),updateWorkCount(),initWorkVideoHover(),initCasestudyVideos(),initProjectInfosPosition()}window.addEventListener("resize",initProjectInfosPosition),$(".about-top-section").addClass("is-diff"),allpages();

function updateVisibleMedia() {
  document.querySelectorAll('.home-projects-item').forEach(item => {
    const rect = item.getBoundingClientRect();
    const active = window.matchMedia('(max-width: 991px)').matches
      ? rect.top < innerHeight * 0.75 && rect.bottom > innerHeight * 0.25
      : item.style.pointerEvents === 'auto';
    activateHomeProject(item, active);
  });
  document.querySelectorAll('.cs-section .g_visual_video, [data-visible-video]').forEach(video => {
    setVideoActive(video, video._inViewport === true);
  });
  if (document.hidden) document.querySelectorAll('video').forEach(video => video.pause());
}
document.addEventListener('visibilitychange', updateVisibleMedia);
window.addEventListener('pageshow', updateVisibleMedia);
window.addEventListener('pagehide', () => document.querySelectorAll('video').forEach(video => video.pause()));
