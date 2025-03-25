//_________ Global Image Wipe on Scroll
export function imageReveal() {
  let trigger = $("[image-wipe='trigger']");
  let image = $("[image-wipe='image']");
  let mask = $("[image-wipe='mask']");

  trigger.each(function () {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: 'top bottom',
        end: 'top, 60%',
        toggleActions: 'none play none reset',
      },
    });

    tl.from($(this).find(mask), {
      x: '0%',
      duration: 1.25,
      ease: 'power3.inOut',
    });

    tl.to(
      $(this).find(image),
      {
        scale: 1.15,
        duration: 1.5,
        ease: 'power3.inout',
      },
      '<'
    );
  });
}

// ____________ Stagger Fade Items within Grid
// Trigger = [stagger-fade='trigger']
// Item = [stagger-fade='item']
// Star =  [stagger-fade='star']
export function gridFade() {
  $("[stagger-fade='trigger']").each(function (index) {
    let triggerElement = $(this);
    let targetElement = $("[stagger-fade='item']");

    let gridFade = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top bottom',
        end: 'top, 50%',
        toggleActions: 'none play none reset',
      },
    });
    gridFade.from($(this).find(targetElement), {
      y: '2rem',
      opacity: 0,
      duration: 0.5,
      ease: 'power1.out',
      stagger: { amount: 0.5 },
    });

    // Stars
    let star = triggerElement.find("[stagger-fade='star']");
    let starLine = star.find('.star_line');
    let starVertical = starLine.hasClass('top');

    if (star.length) {
      gridFade.from(
        star,
        {
          opacity: 0,
          ...(starVertical ? { y: '-4rem' } : { x: '-4rem' }),
        },
        '<'
      );

      // Vertical or Horizontal Line
      gridFade.from(
        star.find('.star_line'),
        {
          ...(starVertical ? { height: '1rem' } : { width: '1rem' }),
        },
        '<0.1'
      );
    }
  });
}
