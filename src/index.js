import { initSwipers } from './utils/globalFunctions';

$(document).ready(() => {
  const isMobile = () => {
    return $(window).width() < 992;
  };
  function isTriggerEvent(e) {
    return (e.type === 'mouseenter' && !isMobile()) || (e.type === 'click' && isMobile());
  }

  // #region Nav
  let hamOpen = false;

  let nav = $('.nav');
  let navLogo = $('.nav_logo');
  let dropdownCards = $('.nav_dropdown-content-inner');
  let smallDropdowns = $('.nav_dropdown-small');
  let navMenu = $('.nav_inner');
  let backBtn = $('.nav_back');
  let navBrand = $('.nav_brand');
  let navHam = $('.nav_ham');

  // Functions
  function showBigDropdown(index) {
    hideDropdownCards();
    dropdownCards.eq(index).addClass('is-open');
    if (isMobile()) {
      backBtn.css('display', 'flex');
      navBrand.hide();
    }
    navOverlay(true);
  }
  function showSmallDropdown(el) {
    nav.addClass('nav-open');
    hideDropdownCards();
    $(el).siblings(smallDropdowns).addClass('is-open');
    if (isMobile()) {
      backBtn.css('display', 'flex');
      navBrand.hide();
    }
    navOverlay(true);
  }
  function hideDropdownCards() {
    dropdownCards.removeClass('is-open');
    smallDropdowns.removeClass('is-open');
    backBtn.hide();
    navBrand.show();
    navOverlay(false);
  }
  function navOverlay(state) {
    let overlay = $('.nav_bg');
    if (state) {
      overlay.stop().fadeIn();
    } else {
      overlay.stop().fadeOut();
    }
  }
  function showMenu() {
    hamOpen = true;
    navMenu.css('display', 'flex');
    navHam.addClass('cc-open');
  }
  function hideMenu() {
    hamOpen = false;
    navMenu.hide();
    navHam.removeClass('cc-open');
    hideDropdownCards();
  }

  // Scroll Disabler
  var $body = $(document.body);
  var scrollPosition = 0;

  let logoTimeout;
  function disableScroll() {
    nav.addClass('nav-open');
    var oldWidth = $body.innerWidth();
    scrollPosition = window.pageYOffset;
    $body.css({
      overflow: 'hidden',
      position: 'fixed',
      top: `-${scrollPosition}px`,
      width: oldWidth,
    });
  }
  function enableScroll() {
    $body.css({
      overflow: '',
      position: '',
      top: '',
      width: '',
    });
    $(window).scrollTop(scrollPosition);
    clearTimeout(logoTimeout);
    nav.removeClass('nav-open');
  }
  function toggleScroll(state) {
    if (state) {
      disableScroll();
    } else {
      enableScroll();
    }
  }

  // Run on resize
  const breakpoints = [991, 767, 479];
  let lastWidth = window.innerWidth;

  function handleBreakpoint() {
    if (hamOpen) {
      enableScroll();
    }
  }

  // Function to check breakpoints on window resize
  function checkBreakpoints() {
    const currentWidth = window.innerWidth;

    breakpoints.forEach((breakpoint) => {
      if (
        (lastWidth <= breakpoint && currentWidth > breakpoint) ||
        (lastWidth >= breakpoint && currentWidth < breakpoint)
      ) {
        handleBreakpoint(breakpoint);
      }
    });

    // Update lastWidth for the next call
    lastWidth = currentWidth;
  }

  // Event listener for window resize
  window.addEventListener('resize', checkBreakpoints);

  // Large Dropdowns
  $('.nav_dropdowns-large .nav_dropdown-trigger').on('mouseenter click', function (e) {
    let index = $(this).index();
    if (isTriggerEvent(e)) {
      nav.addClass('nav-open');
      showBigDropdown(index);
    }
  });
  // Small Dropdowns
  $('.nav_dropdowns-small .nav_dropdown-trigger').on('mouseenter click', function (e) {
    if (isTriggerEvent(e)) {
      showSmallDropdown($(this));
    }
  });
  // Sub Nav
  $('.tel_nav-menu').on('mouseenter click', function (e) {
    if (isTriggerEvent(e)) {
      $('.tel_nav-dropdown').show();
      navHam.filter('.sub').addClass('cc-open');
    }
  });
  // Sub Nav Leave
  $('.tel_nav-menu').on('mouseleave', function (e) {
    $('.tel_nav-dropdown').hide();
    navHam.filter('.sub').removeClass('cc-open');
  });

  // Leaving Nav
  $('.nav').on('mouseleave', function (event) {
    if (!$(event.relatedTarget).closest('.nav').length && !isMobile()) {
      nav.removeClass('nav-open');
      hideDropdownCards();
    }
  });

  // Clicking outside of Nav
  $(document).on('click', function (event) {
    if (!$(event.target).closest('.nav').length) {
      hideDropdownCards();
    }
    if (!$(event.target).closest('.tel_nav-menu').length) {
      $('.tel_nav-dropdown').hide();
      navHam.filter('.sub').removeClass('cc-open');
    }
  });

  // Ham Button
  navHam.on('click', function () {
    if (!hamOpen) {
      showMenu();
    } else {
      hideMenu();
    }
    toggleScroll(hamOpen);
  });

  // Back Button
  $('.nav_back').on('click', function () {
    hideDropdownCards();
  });

  // Logo scroll
  function navAnimation(type) {
    let isDesktop = !isMobile;

    let width = isDesktop ? '43rem' : '18.5rem';
    let distance = isDesktop ? '7.2rem' : '2.4rem';

    if (type === 'set') {
      navLogo.addClass('large');
    } else if (type === 'large') {
      navLogo.removeClass('no-transition');
      navLogo.addClass('large');
    } else {
      navLogo.removeClass('no-transition');
      navLogo.removeClass('large');
    }
  }
  function isTop() {
    return $(window).scrollTop() < 20;
  }

  // Custom scroll handler for mobile
  let scrollTriggerPoint = 20; // Set scroll point for trigger
  let isNavSmall = false; // Track nav state to avoid redundant calls

  function checkScroll() {
    let scrollTop = $(window).scrollTop();

    if (scrollTop >= scrollTriggerPoint && !isNavSmall) {
      navAnimation();
      isNavSmall = true;
    } else if (scrollTop < scrollTriggerPoint && isNavSmall) {
      navAnimation('large');
      isNavSmall = false;
    }
  }

  // Attach scroll event
  $(window).on('scroll', function () {
    checkScroll();
  });

  // Resize handler remains the same
  let resizeTimeout;
  $(window).on('resize', function () {
    if (isTop()) {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        navAnimation('set');
      }, 50);
    }
    if (!isMobile()) {
      navMenu.attr('style', '');
    }
  });

  // Init Part
  if (isTop()) {
    navAnimation('set');
  }

  // #endregion

  // #region Videos
  // Function to pause all players except the current one
  function pauseAllPlayers(currentPlayer) {
    // Show all covers
    $('[data-plyr="cover"]').show();

    // Pause all players except the current one
    players.forEach(function (player) {
      if (player.media !== currentPlayer) {
        player.pause();
      }
    });
  }
  function initVideos() {
    // Ensure any promises or async loading are caught
    $('.plyr_video').each(function () {
      let playerOptions = {
        controls: ['play', 'progress', 'mute'],
        clickToPlay: true,
      };

      try {
        // Get the video src from the parent attribute
        const videoSrc = $(this).parent().attr('data-video-src');

        // Set the source for the current video element
        if (videoSrc) {
          $(this).attr('src', videoSrc);
        }

        // Initialize the player
        const player = new Plyr($(this), playerOptions);
        players.push(player);
      } catch (e) {
        console.error('Error initializing Plyr:', e);
      }
    });

    // Thumb Click
    $('[data-plyr="component"]').on('click', function () {
      const currentPlayer = $(this).find('.plyr_video')[0]; // Assume video element has [data-plyr="video"]
      pauseAllPlayers(currentPlayer);
      $(this).find('[data-plyr="cover"]').hide();
    });

    // Pause Click
    $('[data-plyr="pause"]').on('click', function () {
      pauseAllPlayers();
    });
  }
  // Init
  initVideos();

  // #endregion

  // #region Swipers

  // Base Swiper
  const swiperInstances = [
    [
      '.impact_slider',
      '.swiper-slider-wrap',
      'hear-testimonials',
      {
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        },
        on: {
          slideChange: pauseAllPlayers,
        },
      },
      'all',
    ],
    [
      '.pills_wrap',
      '.swiper-slider-wrap',
      'pills-homepage',
      {
        slidesPerView: 'auto',
        spaceBetween: 24,
      },
      'mobile',
    ],
    [
      '.solutions_slider',
      '.swiper-slider-wrap',
      'solutions-homepage',
      {
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        },
      },
      'all',
    ],
    [
      '.section.cc-testimonials',
      '.swiper-slider-wrap',
      'testimonials-homepage',
      {
        slidesPerView: 1,
        centeredSlides: true,
        loop: true,
        effect: 'fade',
        fadeEffect: {
          crossFade: true,
        },
        spaceBetween: 12,
        on: {
          init: (swiper) => {
            let index = swiper.realIndex + 1;
            let slides = swiper.slides.length;
            $(swiper.el).find('[data-counter]').text(`${index}/${slides}`);
          },
          slideChange: (swiper) => {
            let index = swiper.realIndex + 1;
            let slides = swiper.slides.length;
            $(swiper.el).find('[data-counter]').text(`${index}/${slides}`);
          },
        },
      },
      'all',
    ],
    [
      '.events_slider',
      '.swiper-slider-wrap',
      'featured-events',
      {
        slidesPerView: 1,
        spaceBetween: 240,
      },
      'all',
    ],
    [
      '.connect_slider',
      '.swiper-slider-wrap',
      'events-gallery',
      {
        breakpoints: {
          0: {
            slidesPerView: 1.1,
            spaceBetween: 16,
          },
          489: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          992: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
        },
      },
      'all',
    ],
    [
      '.founders_slider',
      '.swiper-slider-wrap',
      'founders-stats',
      {
        slidesPerView: 'auto',
        spaceBetween: 24,
      },
      'all',
    ],
    [
      '.gallery_slider',
      '.swiper-slider-wrap',
      'gallery',
      {
        breakpoints: {
          0: {
            slidesPerView: 1.1,
            spaceBetween: 16,
          },
          489: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        },
      },
      'all',
    ],
    [
      '.speaker_slider',
      '.swiper-slider-wrap',
      'speakers',
      {
        breakpoints: {
          0: {
            slidesPerView: 1.1,
            spaceBetween: 16,
          },
          489: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        },
      },
      'all',
    ],
    [
      '.solutions-top_slider',
      '.swiper-slider-wrap',
      'services',
      {
        slidesPerView: 1,
        spaceBetween: 24,
      },
      'all',
    ],
    [
      '.hear-videos_wrap',
      '.swiper-slider-wrap',
      'hear-videos',
      {
        slidesPerView: 'auto',
        spaceBetween: 24,
      },
      'mobile',
    ],
    [
      '.info-session_slider',
      '.swiper-slider-wrap',
      'info-session',
      {
        breakpoints: {
          0: {
            slidesPerView: 1.1,
            spaceBetween: 16,
          },
          489: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        },
      },
      'all',
    ],
  ];

  initSwipers(swiperInstances);

  // #endregion

  // #region Winner Modals
  function initModals() {
    let modal = $('.winners-modal');
    let modalBoxes = $('.winners_item');

    if (!modal.length) {
      return;
    }

    $('[data-modal="trigger"]').on('click', function () {
      let index = $(this).index();

      // Reveal
      modalBoxes.hide();
      modalBoxes.eq(index).css('display', 'flex');
      modal.fadeIn();
    });

    // // Close modals
    $('[data-modal="close"]').on('click', function () {
      modal.hide();
    });

    /// Hide Empty links
    $('.winners-modal_box-head_item').each(function () {
      const href = $(this).attr('href');
      console.log(href);
      if (!href || href === '#') {
        $(this).hide();
      }
    });
  }
  initModals();
  // #endregion

  // #region FS Attributes
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
        if (
          filterInstance &&
          filterInstance.resetButtonsData &&
          filterInstance.resetButtonsData.size > 0
        ) {
          const resetBtn = [...filterInstance.resetButtonsData.keys()][0];

          // Check if filtersData exists and has the necessary data
          if (filterInstance.filtersData && filterInstance.filtersData[0]) {
            function updateResetBtn(entries) {
              if (entries >= 1) {
                if (resetBtn) {
                  $(resetBtn).removeClass('fs-cmsfilter_active');
                }
              } else {
                if (resetBtn) {
                  $(resetBtn).addClass('fs-cmsfilter_active');
                }
              }
            }

            // Init
            updateResetBtn(0);

            filterInstance.listInstance.on('renderitems', function () {
              highlightWords();
              let entries = filterInstance.filtersData[0].values.size;
              updateResetBtn(entries);
            });
          }
        }
      }
    },
  ]);
  // Load
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    (listInstances) => {
      if (listInstances && listInstances.length > 0) {
        // The callback passes a `listInstances` array with all the `CMSList` instances on the page.
        const [listInstance] = listInstances;
        highlightWords();

        // The `renderitems` event runs whenever the list renders items after switching pages.
        listInstance.on('renderitems', (renderedItems) => {
          updateExternalLinks();
          highlightWords();
          initModals();
          if ($('.plyr_video').length) {
            initVideos();
          }
        });
      }
    },
  ]);

  // Combine
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmscombine',
    (listInstances) => {
      listInstances.forEach((element) => {
        document.querySelector('[fs-cmssort-element="trigger"]').click();
      });
    },
  ]);

  // Founders Weekend Filters
  $('[data-filters="founders"]').each(function () {
    let activeClass = 'fs-cmsfilter_active';
    const filters = $(this).find('.filter-tag');
    const items = $('[data-items="founders"]').find('.schedule_list-item').toArray();

    filters.on('click', function () {
      let filterText = $(this).text();

      filters.removeClass(activeClass);
      $(this).addClass(activeClass);

      // Hide all items initially
      $(items).hide();

      if (filterText !== 'All') {
        // Filter and show matching items
        items.forEach(function (item) {
          let text = $(item).find('[fs-cmsfilter-field="category"]').text();

          if (text === filterText) {
            $(item).show(); // Show only matching items
          }
        });
      } else {
        $(items).show();
      }
    });
  });

  // #endregion

  // #region CMS
  $('[data-hide-empty]').each(function () {
    let self = $(this);

    if (self.find('.w-dyn-item').length <= 0) {
      self.hide();
    }
  });
  // #endregion

  // #region Article

  // Heading Highlights
  function highlightWords() {
    $('[data-highlight]').each(function () {
      let highlight = $(this).attr('data-highlight');
      if (!highlight) return;

      // Replace matching text with a span wrapping it
      $(this).html(function (_, html) {
        return html.split(highlight).join(`<span class="highlighted">${highlight}</span>`);
      });
    });
  }

  // Breadcrumps
  function updatesTagsLinks() {
    $('[data-link-tag]').each(function () {
      let href = $(this).attr('href');
      const query = encodeURIComponent($(this).text()).replace(/%20/g, '+');
      $(this).attr('href', `${href}?category=${query}`);
    });
  }
  // init
  $('[data-link-category]').each(function () {
    let category = $(this).attr('data-link-category');
    if (!category) {
      updatesTagsLinks();
      return;
    }

    let href;
    if (category === 'Entreprenista') {
      href = 'podcast-entreprenista';
    } else if (category === 'Startups in Stilettos') {
      href = 'podcast-startups-in-stilettos';
    }

    // Links
    $(this).attr('href', `/${href}`);
    $('[data-link-tag]').attr('href', `/${href}`);
    updatesTagsLinks();
  });

  // Display HostsNames
  function displayHostsNames() {
    let avatars = $('.article-d_avatar');
    if (!avatars.length) {
      return;
    }
    let names = [];
    avatars.each(function () {
      names.push($(this).attr('data-name'));
    });
    const text = names.length > 1 ? names.join(' & ') : names[0] || '';
    $('[data-hosts-name]').text(text);
  }
  displayHostsNames();

  // Copy URL
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

  // Klaviyo Popup
  $('[klaviyo-popup-trigger]').on('click', function () {
    let formID = $(this).attr('klaviyo-popup-trigger');
    window._klOnsite = window._klOnsite || [];
    window._klOnsite.push(['openForm', formID]);
  });

  // External links to new tab
  function updateExternalLinks() {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) return;

      const isInternal = href.startsWith('/') || href.includes(window.location.hostname);

      if (!isInternal) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
  updateExternalLinks();

  // #endregion

  // #region Animations

  // Homepage Hero
  $('.hp-hero_featured-wrap').each(function () {
    let mask = $(this).find('.hp-hero_mask');
    let label = $(this).find('.hp-hero_visual-label').find('p');
    let texts = $(this).find('.hp-hero_content').find('p');

    let tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 1.5 } });
    tl.to(mask, { scaleX: 0 });
    tl.fromTo(label, { x: '-3rem', opacity: 0 }, { x: '0rem', opacity: 1 }, '<');
    tl.fromTo(texts, { y: '2rem', opacity: 0 }, { y: '0rem', opacity: 1, stagger: 0.2 }, '<0.2');
    tl.fromTo(
      $('.hp-hero_featured-list .hp-hero_featured-item'),
      {
        opacity: 0,
        yPercent: 50,
      },
      {
        opacity: 1,
        yPercent: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power2.inOut',
      },
      '<'
    );
  });

  // Circle
  let circleTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.info-session_circle',
      start: 'bottom 90%',
      endTrigger: '.section.cc-testimonials',
      end: 'top bottom',
      invalidateOnRefresh: true,
      scrub: 1,
    },
  });

  circleTl.to('.info-session_circle-bg', {
    width: () => {
      return (window.innerWidth * 2) / 10 + 'rem';
    },
  });

  // Stores for revering
  let splitLetters = {};
  let scrollTriggers = [];

  // Functions
  function initTitles() {
    let linesTargets = document.querySelectorAll('[data-title-lines]');

    // Create a new SplitType instance
    splitLetters = new SplitType(linesTargets, {
      types: 'lines',
    });

    linesTargets.forEach((wrap) => {
      let lines = wrap.querySelectorAll('.line');
      lines.forEach((line, index) => {
        // Store each ScrollTrigger in the array
        scrollTriggers.push(
          gsap.to(line, {
            x: () => (index % 2 === 0 ? '1em' : '-1em'),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }).scrollTrigger
        );
      });
    });
  }
  function resetTitles() {
    // Kill each stored ScrollTrigger
    scrollTriggers.forEach((trigger) => trigger.kill());
    scrollTriggers = []; // Clear the array for the next initialization

    if (splitLetters.revert) splitLetters.revert(); // Revert SplitType instance
  }

  // Init
  initTitles();

  let tilesLastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    if (currentWidth !== tilesLastWidth) {
      resetTitles();
      initTitles();
      tilesLastWidth = currentWidth;
    }
  });

  // #endregion

  // #region Klavyio Membership
  const klaviyoForms = document.querySelectorAll('[data-klaviyo-list-id]');

  if (klaviyoForms) {
    klaviyoForms.forEach((form) => {
      form.addEventListener('submit', function (event) {
        // Always prevent the default form submission
        event.preventDefault();

        // Form Data Extraction
        const formData = new FormData(form);
        const attributes = {};
        const standardAttributes = ['email', 'phone_number', 'first_name', 'last_name'];
        const nestedObjects = {
          location: ['address1', 'address2', 'city', 'country', 'region', 'zip', 'timezone', 'ip'],
        };

        for (let [key, value] of formData.entries()) {
          if (standardAttributes.includes(key)) {
            attributes[key] = value;
          } else {
            let addedToNested = false;
            for (const [objectName, fields] of Object.entries(nestedObjects)) {
              if (fields.includes(key)) {
                if (!attributes[objectName]) attributes[objectName] = {};
                attributes[objectName][key] = value;
                addedToNested = true;
                break;
              }
            }
            if (!addedToNested) {
              if (!attributes.properties) attributes.properties = {};
              attributes.properties[key] = value;
            }
          }
        }

        console.log(attributes);

        // Klaviyo API Configuration
        const klaviyoListId = form.getAttribute('data-klaviyo-list-id');
        const options = {
          method: 'POST',
          headers: {
            revision: '2023-08-15',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              type: 'subscription',
              attributes: {
                custom_source: form.getAttribute('data-name'),
                profile: {
                  data: {
                    type: 'profile',
                    attributes: attributes,
                  },
                },
              },
              relationships: { list: { data: { type: 'list', id: klaviyoListId } } },
            },
          }),
        };

        // Flow Configuration
        // Get the form field values
        const firstName = attributes.first_name;
        const lastName = attributes.last_name;
        const { email } = attributes;
        const checkoutUrl =
          'https://connect.entreprenista.com/checkout/join-the-entreprenista-league';

        // Construct the checkout URL
        const redirectURL = `${checkoutUrl}?name=${encodeURIComponent(
          firstName
        )}%20${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}`;

        // Klaviyo API Call
        fetch('https://a.klaviyo.com/client/subscriptions/?company_id=XptCwV', options)
          .then((response) => {
            if (!response.ok) {
              return response.json().then((err) => Promise.reject(err));
            }
            // Display the success message on successful submission
            let customSuccessElement = form.closest('.w-form').querySelector('.w-form-done');
            if (customSuccessElement) {
              form.style.display = 'none';
              customSuccessElement.style.display = 'block';
            }
            window.location.href = redirectURL;
          })
          .catch((err) => {
            console.error('Error sending data to Klaviyo:', err);

            // Display the error message on error
            let customErrorElement = form.closest('.w-form').querySelector('.w-form-fail');
            if (customErrorElement) customErrorElement.style.display = 'block';
          });
      });
    });
  }
});
