"use strict";(()=>{var m=window.innerWidth,u={};var y=(a,e,t,i,o)=>{let s=$(a);s.length!==0&&(u[t]=0,u[t]=u[t]||0,s.each(function(){let r=`${t}_${u[t]}`;_(this,e,r,[".swiper-arrow",".swiper-pag",".swiper-drag-wrapper"]);let n=E(i,r);I(this,e,r,t,n,o),u[t]++}))},_=(a,e,t,i)=>{i.forEach(o=>{$(a).find(o).addClass(t)}),$(a).find(e).addClass(t)},E=(a,e)=>Object.assign({},a,{speed:1e3,navigation:{prevEl:`.swiper-arrow.is-prev.${e}`,nextEl:`.swiper-arrow.is-next.${e}`},pagination:{el:`.swiper-pag.${e}`,type:"bullets",bulletActiveClass:"cc-active",bulletClass:"swiper-pag-item",clickable:!0}}),I=(a,e,t,i,o,s)=>{swipers[i]=swipers[i]||{},swipers[i][t]=swipers[i][t]||{};let r=swipers[i][t],n=r.swiperInstance,c=s==="desktop"&&window.matchMedia("(min-width: 992px)").matches,d=s==="mobile"&&window.matchMedia("(min-width: 0px) and (max-width: 991px)").matches,p=s==="all",l=()=>{r.observer&&(r.observer.disconnect(),delete r.observer),n&&(n.destroy(!0,!0),delete swipers[i][t],console.log("Swiper destroyed for",e,"with uniqueKey",t))};!c&&s==="desktop"||!d&&s==="mobile"||!p&&s==="all"?l():(c||d||p)&&!n&&(()=>{r.observer&&r.observer.disconnect();let g=$(`${e}.${t}`)[0],f=new IntersectionObserver(v=>{v.forEach(b=>{if(b.isIntersecting&&(c||d||p)&&!n){let x=new Swiper(`${e}.${t}`,o);swipers[i][t]={swiperInstance:x,mode:c?"desktop":d?"mobile":"all",initialized:!0},f.disconnect(),console.log("Swiper initialized for",e,"with uniqueKey",t)}})},{});swipers[i][t].observer=f,f.observe(g)})()},h=a=>{a.forEach(e=>{y(...e)})},w=(a,e)=>{h(a),window.addEventListener("resize",function(){window.innerWidth!==m&&(m=window.innerWidth,h(a))})};function k(){$("[data-counter-wrapper]").each(function(){let a=$(this),e=$(this).find("[data-counter-el]"),t=$(this).find("[data-counter-progress]"),i=e.text(),o=parseFloat(i),s={val:0};t.css("width","0%"),e.css("opacity","0");let r=gsap.timeline({scrollTrigger:{trigger:$(this),start:"center bottom"}});r.to(s,{val:o,duration:1,onStart:()=>{gsap.set(e,{opacity:1})},onUpdate:function(){e.text(s.val.toFixed(3))},ease:"power2.out"}),t.length&&r.to(t,{width:"70%",duration:1,ease:"power2.out"},"<")}),$("[data-parallax-wrapper]").each(function(){let a=$(this),e=a.find('[data-parallax-el="1"]'),t=a.find('[data-parallax-el="2"]'),i=gsap.timeline({scrollTrigger:{trigger:a,start:"top bottom",end:"bottom top",scrub:1,ease:"none"},ease:"none"});i.fromTo(e,{y:"10vh"},{y:"0vh"}),i.fromTo(t,{y:"5vh"},{y:"0vh"},"<")})}function C(){let e=document.querySelectorAll("[data-css-marquee]");e.forEach(i=>{i.querySelectorAll("[data-css-marquee-list]").forEach(o=>{for(let s=0;s<2;s++){let r=o.cloneNode(!0);i.appendChild(r)}})});let t=new IntersectionObserver(i=>{i.forEach(o=>{o.target.querySelectorAll("[data-css-marquee-list]").forEach(s=>s.style.animationPlayState=o.isIntersecting?"running":"paused")})},{threshold:0});e.forEach(i=>{i.querySelectorAll("[data-css-marquee-list]").forEach(o=>{o.style.animationDuration=o.offsetWidth/75+"s",o.style.animationPlayState="paused"}),t.observe(i)})}function O(){$('form[data-validate="email"]').each(function(){let a=$(this),e=a.find('input[type="email"]'),t=a.closest(".w-form"),i=!1;if(e.length===0)return;function o(r){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)}function s(r){r?(e.addClass("error"),t.addClass("is-error")):(e.removeClass("error"),t.removeClass("is-error"))}e.on("focus",function(){a.addClass("is-focus")}),e.on("blur",function(){a.removeClass("is-focus"),i=!0;let r=$(this).val().trim();if(r===""){s(!1);return}s(!o(r))}),e.on("input",function(){if(!i)return;let r=$(this).val().trim();if(r===""){s(!1);return}s(!o(r))}),a.on("submit",function(r){let n=e.val().trim();if(!o(n))return r.preventDefault(),s(!0),i=!0,!1})})}function T(){let a=()=>{let t=$(".hp-products_visual-1"),i=$(".hp-products_visual-card"),o=$(".hp-products_card-stats-1"),s=gsap.timeline({scrollTrigger:{trigger:t,start:"top center"}});s.from(i,{y:"100%",opacity:0,duration:1.5,stagger:.2,ease:"back.out(1)"}),s.from(o,{y:"100%",duration:1.5,stagger:.2,ease:"back.out(1)"},"<")},e=()=>{let t=$(".hp-products_visual-2"),i=$(".hp-products_visual-2_card"),o=$(".hp-products_visual-2_base"),s=gsap.timeline({scrollTrigger:{trigger:t,start:"top center"}});s.from(o,{y:"100%",opacity:0,duration:1.5,stagger:.2,ease:"back.out(1)"}),s.from(i,{y:"100%",duration:1.5,stagger:.2,ease:"back.out(1)"},"<");let r=$('[data-visual2-card="item"]');s.from(r,{y:"1eem",opacity:0,stagger:.1,ease:"power3.inOut"},"<0.2");let n=$('[data-visual2-base="item"]'),c=$('[data-visual2-base="row"]'),d=$('[data-visual2-base="icon"]');s.from(n,{y:"1eem",opacity:0,stagger:.1,ease:"power3.inOut"},"<"),s.from(c,{scaleX:"0",stagger:.1,ease:"power3.inOut"},"<0.2"),s.from(d,{scale:.5,opacity:0,stagger:.1,ease:"power3.inOut"},"<0.4"),$(".hp-products_visual-2_card-check-item").on("click",function(){$(this).find(".hp-products_visual2_card-check").toggleClass("is-active")}),$(".hp-products_visual-2_card-button").on("click",function(){let p=$(".hp-products_visual-2_card-check-item").add($(this)).add(".hp-products_visual-2_card-button"),l=$(".hp-products_visual-2_card-success");l.trigger("click"),setTimeout(()=>{p.css("visibility","hidden"),l.show()},200),setTimeout(()=>{p.css("visibility","visible"),l.hide()},1e4)})};a(),e()}var A=[[".section_testimonials",".testimonials_slider","testimonials",{slidesPerView:"auto"},"all"]];$(document).ready(function(){k(),C(),O(),w(A),T()});})();
