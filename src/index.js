import { initSwipers } from './utils/globalFunctions';

function globalAnims() {
  // Counters
  $('[data-counter-wrapper]').each(function () {
    let element = $(this);
    let counterElement = $(this).find('[data-counter-el]');
    let progressBar = $(this).find('[data-counter-progress]');
    let scoreText = counterElement.text();

    // Continue with normal animation for numeric scores
    let score = parseFloat(scoreText);
    let counter = { val: 0 };

    // Set initial width to 0
    progressBar.css('width', '0%');
    counterElement.css('opacity', '0');

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: 'center bottom',
      },
    });

    // Animate both width and counter
    tl.to(counter, {
      val: score,
      duration: 1,
      onStart: () => {
        gsap.set(counterElement, { opacity: 1 });
      },
      onUpdate: function () {
        counterElement.text(counter.val.toFixed(3));
      },
      ease: 'power2.out',
    });

    if (progressBar.length) {
      tl.to(
        progressBar,
        {
          width: '70%',
          duration: 1,
          ease: 'power2.out',
        },
        '<'
      );
    }
  });

  // Parallax
  $('[data-parallax-wrapper]').each(function () {
    let parallaxWrapper = $(this);
    let parallax1 = parallaxWrapper.find('[data-parallax-el="1"]');
    let parallax2 = parallaxWrapper.find('[data-parallax-el="2"]');

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: parallaxWrapper,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        ease: 'none',
      },
      ease: 'none',
    });

    tl.fromTo(parallax1, { y: '10vh' }, { y: '0vh' });
    tl.fromTo(parallax2, { y: '5vh' }, { y: '0vh' }, '<');
  });
}
function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  const marquees = document.querySelectorAll('[data-css-marquee]');

  // Duplicate each [data-css-marquee-list] element inside its container
  marquees.forEach((marquee) => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach((list) => {
      // Create two duplicates at once
      for (let i = 0; i < 2; i++) {
        const duplicate = list.cloneNode(true);
        marquee.appendChild(duplicate);
      }
    });
  });

  // Create an IntersectionObserver to check if the marquee container is in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target
          .querySelectorAll('[data-css-marquee-list]')
          .forEach(
            (list) => (list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused')
          );
      });
    },
    { threshold: 0 }
  );

  // Calculate the width and set the animation duration accordingly
  marquees.forEach((marquee) => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach((list) => {
      list.style.animationDuration = list.offsetWidth / pixelsPerSecond + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}
function initFormValid() {
  // Target all forms with custom validation attribute
  $('form[data-validate="email"]').each(function () {
    const $form = $(this);
    const $emailInput = $form.find('input[type="email"]');
    const $formBlock = $form.closest('.w-form');
    let hasBlurred = false; // Track if the field has been blurred at least once

    // Skip if no email input exists
    if ($emailInput.length === 0) return;

    // Function to validate email format
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Function to set error state
    function setErrorState(isError) {
      if (isError) {
        $emailInput.addClass('error');
        $formBlock.addClass('is-error');
      } else {
        $emailInput.removeClass('error');
        $formBlock.removeClass('is-error');
      }
    }

    // Add focus class when input is focused
    $emailInput.on('focus', function () {
      $form.addClass('is-focus');
    });

    // Remove focus class when input is blurred and validate
    $emailInput.on('blur', function () {
      $form.removeClass('is-focus');

      // Mark as blurred so we can start validating on input
      hasBlurred = true;

      // Validate on first blur
      const emailValue = $(this).val().trim();

      // Skip validation if field is empty
      if (emailValue === '') {
        setErrorState(false);
        return;
      }

      // Set error state based on validation result
      setErrorState(!isValidEmail(emailValue));
    });

    // Validate email as user types, but only after first blur
    $emailInput.on('input', function () {
      // Only validate on input if the field has been blurred at least once
      if (!hasBlurred) return;

      const emailValue = $(this).val().trim();

      // Skip validation if field is empty
      if (emailValue === '') {
        setErrorState(false);
        return;
      }

      // Set error state based on validation result
      setErrorState(!isValidEmail(emailValue));
    });

    // Handle form submission
    $form.on('submit', function (e) {
      const emailValue = $emailInput.val().trim();

      // Always validate on submit regardless of blur state
      if (!isValidEmail(emailValue)) {
        e.preventDefault();
        setErrorState(true);
        hasBlurred = true; // Enable ongoing validation after submit attempt
        return false;
      }
    });
  });
}
function mirrorFilterReset() {
  // Empty State Clear Button
  $('[data-empty-clear]').on('click', function () {
    let resetButton = $(this).closest('section').find("[fs-cmsfilter-element='clear']");
    resetButton.trigger('click');
  });
}
function initFS() {
  //Filter Reset Button
  window.fsAttributes = window.fsAttributes || [];
  // Filter
  window.fsAttributes.push([
    'cmsfilter',
    (filterInstances) => {
      // Ensure filterInstances is defined and not empty
      if (filterInstances && filterInstances.length > 0) {
        const [filterInstance] = filterInstances;

        // Check if filterInstance exists and resetButtonsData has keys
        if (filterInstance) {
          // Check if filtersData exists and has the necessary data
          if (filterInstance.filtersData && filterInstance.filtersData[0]) {
            function updateDropdownLabel(entries) {
              let label = $('[data-category-label]');
              if (entries.length >= 1) {
                label.text(entries[0]);
              } else {
                let defaultText = label
                  .closest('.w-dropdown')
                  .find('.w-dropdown-list a:first-child')
                  .text();
                label.text(defaultText);
              }
            }

            filterInstance.listInstance.on('renderitems', function () {
              let entries = [...filterInstance.filtersData[1].values];
              console.log(entries);
              updateDropdownLabel(entries);
            });
          }
        }
      }
    },
  ]);

  mirrorFilterReset();
}
function animateHPproducts() {
  const hp1 = () => {
    // els
    let wrap = $('.hp-products_visual-1');
    let card1 = $('.hp-products_visual-card');
    let card2 = $('.hp-products_card-stats-1');

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top center',
      },
    });

    tl.from(card1, {
      y: '100%',
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'back.out(1)',
    });
    tl.from(
      card2,
      {
        y: '100%',
        duration: 1.5,
        stagger: 0.2,
        ease: 'back.out(1)',
      },
      '<'
    );
  };
  const hp2 = () => {
    // els
    let wrap = $('.hp-products_visual-2');
    let card1 = $('.hp-products_visual-2_card');
    let card2 = $('.hp-products_visual-2_base');

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top center',
      },
    });

    tl.from(card2, {
      y: '100%',
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'back.out(1)',
    });
    tl.from(
      card1,
      {
        y: '100%',
        duration: 1.5,
        stagger: 0.2,
        ease: 'back.out(1)',
      },
      '<'
    );

    // -- Card 1
    // els
    let items1 = $('[data-visual2-card="item"]');

    tl.from(
      items1,
      {
        y: '1eem',
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.inOut',
      },
      '<0.2'
    );

    // -- Card 2
    let items2 = $('[data-visual2-base="item"]');
    let row2 = $('[data-visual2-base="row"]');
    let icon2 = $('[data-visual2-base="icon"]');

    tl.from(
      items2,
      {
        y: '1eem',
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.inOut',
      },
      '<'
    );
    tl.from(
      row2,
      {
        scaleX: '0',
        stagger: 0.1,
        ease: 'power3.inOut',
      },
      '<0.2'
    );
    tl.from(
      icon2,
      {
        scale: 0.5,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.inOut',
      },
      '<0.4'
    );

    // -- Checkbox Click
    $('.hp-products_visual-2_card-check-item').on('click', function () {
      $(this).find('.hp-products_visual2_card-check').toggleClass('is-active');
    });

    // -- Button Click
    $('.hp-products_visual-2_card-button').on('click', function () {
      let items = $('.hp-products_visual-2_card-check-item')
        .add($(this))
        .add('.hp-products_visual-2_card-button');
      let lottie = $('.hp-products_visual-2_card-success');

      // Init lottie
      lottie.trigger('click');

      // Show after a moment as there is a small delay in the lottie
      setTimeout(() => {
        items.css('visibility', 'hidden');
        lottie.show();
      }, 200);

      setTimeout(() => {
        items.css('visibility', 'visible');
        lottie.hide();
      }, 10000);
    });
  };

  // init
  hp1();
  hp2();
}

let swiperInstances = [
  [
    '.section_testimonials',
    '.testimonials_slider',
    'testimonials',
    {
      slidesPerView: 'auto',
    },
    'all',
  ],
  [
    '.section_hero-carousel',
    '.hero-carousel_slider',
    'hero-slider',
    {
      slidesPerView: 'auto',
      spaceBetween: 32,
    },
    'all',
  ],
];

$(document).ready(function () {
  globalAnims();
  initCSSMarquee();
  initFormValid();
  initFS();
  initSwipers(swiperInstances);
  animateHPproducts();
});
