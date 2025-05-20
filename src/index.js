import { initSwipers } from './utils/globalFunctions';

function globalAnims() {
  // Counters
  $('[data-counter-wrapper]').each(function () {
    let element = $(this);
    let counterElement = $(this).find('[data-counter-el]');
    let progressBar = $(this).find('[data-counter-progress]');
    let scoreText = counterElement.text();

    let score = parseFloat(scoreText);
    let counter = { val: 0 };

    progressBar.css('width', '0%');
    counterElement.css('opacity', '0');

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: 'center bottom',
      },
    });

    tl.to(counter, {
      val: score,
      duration: 1,
      onStart: () => {
        gsap.set(counterElement, { opacity: 1 });
      },
      onUpdate: function () {
        let formatted = counter.val.toFixed(3).replace('.', ',');
        counterElement.text(formatted);
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
  const pixelsPerSecond = 25; // Set the marquee speed (pixels per second)
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
window.initFormValid = function (form) {
  $(form).each(function () {
    const $form = $(this);
    const $emailInput = $form.find('input[type="email"]');
    let $formBlock = $form.closest('.w-form');

    if ($formBlock.length === 0) {
      $formBlock = $form.closest('form');
    }

    let hasBlurred = false;

    if ($emailInput.length === 0) return;

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function setErrorState(isError) {
      if (isError) {
        $emailInput.addClass('error');
        $formBlock.addClass('is-error');
      } else {
        $emailInput.removeClass('error');
        $formBlock.removeClass('is-error');
      }
    }

    $emailInput.on('focus', function () {
      $form.addClass('is-focus');
    });

    $emailInput.on('blur', function () {
      $form.removeClass('is-focus');
      hasBlurred = true;

      const emailValue = $(this).val().trim();
      if (emailValue === '') {
        setErrorState(false);
        return;
      }

      setErrorState(!isValidEmail(emailValue));
    });

    $emailInput.on('input', function () {
      if (!hasBlurred) return;

      const emailValue = $(this).val().trim();
      if (emailValue === '') {
        setErrorState(false);
        return;
      }

      setErrorState(!isValidEmail(emailValue));
    });

    $form.on('submit', function (e) {
      const emailValue = $emailInput.val().trim();

      if (!isValidEmail(emailValue)) {
        e.preventDefault();
        setErrorState(true);
        hasBlurred = true;
        return false;
      }
    });
  });
};
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
            function updateDropdownLabel(entries, labelSelector) {
              let label = $(labelSelector);
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
              // Update first label with filtersData[1]
              if (filterInstance.filtersData[1]) {
                let entries1 = [...filterInstance.filtersData[1].values];
                updateDropdownLabel(entries1, '[data-category-label="1"]');
              }

              // Update second label with filtersData[2]
              if (filterInstance.filtersData[2]) {
                let entries2 = [...filterInstance.filtersData[2].values];
                updateDropdownLabel(entries2, '[data-category-label="2"]');
              }
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
function initCopyUrl() {
  $(document).ready(function () {
    $('[data-copy]').on('click', function () {
      let type = $(this).attr('data-copy');

      if (type === 'url') {
        copyClipboard($(this), $(location).attr('href'));
      } else {
        copyClipboard($(this), type);
      }
    });

    function copyClipboard(el, val) {
      // Paste here
      var $temp = $('<input>');
      var ogIcon = $(el).find('.w-embed:first-child');
      var label = $(el).find('.w-embed:last-child');
      let timeOut;

      // Click
      $('body').append($temp);
      $temp.val(val).select();
      document.execCommand('copy');
      $temp.remove();

      clearTimeout(timeOut); // Corrected the function name and variable consistency
      label.hide();
      ogIcon.hide();
      label.css('display', 'flex');
      timeOut = setTimeout(() => {
        label.hide();
        ogIcon.css('display', 'flex');
      }, 2000);
    }
  });
}
function initCustomTabs() {
  // Base
  const tabItems = document.querySelectorAll('.partner-tabs_item');
  const lastWidth = window.innerWidth;
  const activeClass = 'is-active';

  // Els
  const tabBodies = '.partner-tabs_body';
  const tabImages = '.partner-tabs_image';
  const tabSubtitles = '[data-subtitle]';
  const tabVlines = '.dd_toggle-line-v';

  tabItems.forEach((item) => {
    item.addEventListener('click', function () {
      animateTabs(item);
    });
  });

  // Init
  resetTabs();
  activateFirstTab();

  window.addEventListener('resize', () => {
    if (lastWidth !== window.innerWidth) {
      // Fix for mobile to desktop transition
      if (window.innerWidth > 991) {
        // Find all active tabs and keep only the first one
        const activeTabs = Array.from(tabItems).filter((tab) =>
          tab.classList.contains(activeClass)
        );
        if (activeTabs.length > 1) {
          // Keep first active tab, reset others
          for (let i = 1; i < activeTabs.length; i++) {
            activeTabs[i].classList.remove(activeClass);
          }
        }
      }
      resetTabs();
    }
  });

  function resetTabs() {
    tabItems.forEach((item) => {
      if (item.classList.contains(activeClass)) return;
      // Els
      const tabBody = item.querySelector(tabBodies);
      const tabImage = item.querySelector(tabImages);
      const tabSubtitle = item.querySelector(tabSubtitles);
      const tabVline = item.querySelector(tabVlines);

      if (window.innerWidth <= 991) {
        gsap.to(tabBody, { duration: 0, display: 'none', height: 0 });
        gsap.to(tabImage, { opacity: 1, duration: 0 });
        gsap.to(tabSubtitle, { opacity: 1, y: 0, duration: 0 });
        gsap.to(tabVline, { duration: 0, rotateZ: '-90deg' });
      } else {
        gsap.to(tabBody, { duration: 0, height: 0, display: 'none' });
        gsap.to(tabImage, { opacity: 0, duration: 0 });
        gsap.to(tabSubtitle, { opacity: 0, y: 15, duration: 0 });
        gsap.to(tabVline, { duration: 0, rotateZ: '-90deg' });
      }
      // Remove the 'is-active' class
      item.classList.remove(activeClass);
    });
    // Activate the first tab on page load
    activateFirstTab();
  }

  function activateFirstTab() {
    const firstTab = tabItems[0];

    // Fix for first-time page load to ensure vline is rotated properly
    if (firstTab) {
      if (!firstTab.classList.contains(activeClass)) {
        animateTabs(firstTab);
      } else {
        // If it's already active, just make sure the vline is correctly positioned
        const isMobile = window.innerWidth <= 991;
        if (isMobile) {
          // For mobile, force reset the vline to correct position
          gsap.set(firstTab.querySelector(tabVlines), { rotateZ: '0deg' });
          gsap.set(firstTab.querySelector(tabBodies), { display: 'flex', height: 'auto' });
        }
      }
    }
  }

  function animateTabs(activeItem) {
    const isMobile = window.innerWidth <= 991;
    const isClosing = activeItem.classList.contains(activeClass);
    const tl = gsap.timeline({ ease: 'power1.inOut' });

    // For desktop only: close any currently open tab that's not the clicked one
    if (!isMobile) {
      const currentActiveTab = Array.from(tabItems).find(
        (tab) => tab.classList.contains(activeClass) && tab !== activeItem
      );

      if (currentActiveTab) {
        currentActiveTab.classList.remove(activeClass);

        tl.to(currentActiveTab.querySelector(tabBodies), { duration: 0.3, height: 0 })
          .to(currentActiveTab.querySelector(tabSubtitles), { opacity: 0, y: 15, duration: 0.3 }, 0)
          .to(currentActiveTab.querySelector(tabImages), { opacity: 0, duration: 0.3 }, 0)
          .set(currentActiveTab.querySelector(tabBodies), { display: 'none' });
      }
    }

    // Mobile toggle behavior
    if (isMobile) {
      if (isClosing) {
        // Close clicked tab on mobile
        tl.to(activeItem.querySelector(tabBodies), { duration: 0.5, height: 0 })
          .to(activeItem.querySelector(tabVlines), { duration: 0.5, rotateZ: '-90deg' }, 0)
          .set(activeItem.querySelector(tabBodies), { display: 'none' });
        activeItem.classList.remove(activeClass);
      } else {
        // Open clicked tab on mobile
        tl.set(activeItem.querySelector(tabBodies), { display: 'flex', height: 0 })
          .set(activeItem.querySelector(tabImages), { opacity: 1 })
          .set(activeItem.querySelector(tabSubtitles), { opacity: 1, y: 0 })
          .to(activeItem.querySelector(tabBodies), { duration: 0.7, height: 'auto' })
          .to(activeItem.querySelector(tabVlines), { duration: 0.5, rotateZ: '0deg' }, 0);
        activeItem.classList.add(activeClass);
      }
    }
    // Desktop open behavior
    else if (!isClosing) {
      tl.set(activeItem.querySelector(tabBodies), { display: 'block', height: 0 })
        .to(activeItem.querySelector(tabBodies), { duration: 0.5, height: 'auto' })
        .to(activeItem.querySelector(tabSubtitles), { opacity: 1, y: 0, duration: 0.5 })
        .to(activeItem.querySelector(tabImages), { opacity: 1, duration: 0.5 }, '<');
      activeItem.classList.add(activeClass);
    }

    return tl;
  }
}
function loadSplines() {
  setTimeout(() => {
    $('[data-spline-iframe]').css('opacity', '1');
  }, 1500);
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
    '.section_team',
    '.team_list-wrap',
    'team',
    {
      slidesPerView: 'auto',
      loop: true,
      autoplay: {
        delay: 1500,
      },
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
  window.initFormValid('form[data-validate="email"]');
  initFS();
  initSwipers(swiperInstances);
  animateHPproducts();
  initCopyUrl();
  initCustomTabs();
  loadSplines();
});
