// Get Nested Filters
function loadNestedFilters() {
  const promises = [];

  $('.solutions-filter_row-checkbox').each(function () {
    let $this = $(this);
    let slug = $this.attr('data-slug');

    if (!slug) {
      console.warn('Missing slug for element:', $this);
      return;
    }

    const promise = new Promise((resolve) => {
      $this
        .siblings('.solutions-filter_nest')
        .load(`/global-tags/${slug} .solutions-filter_row-inner`, function () {
          resolve();
        });
    });

    promises.push(promise);
  });

  return Promise.all(promises);
}

// Get nested tags for both initial and filtered items
function getNestedTags(container) {
  const promises = [];

  container.find('.index_card').each(function () {
    let $this = $(this);
    let slug = $this.attr('data-slug');

    if (!slug) return;

    const promise = new Promise((resolve) => {
      $this
        .find('[data-nested-wrap]')
        .load(`/solutions-internal/${slug} [data-nested-filters]`, function () {
          resolve();
        });
    });

    promises.push(promise);
  });

  return Promise.all(promises);
}

// Initialize FSAttributes in sequence
window.fsAttributes = window.fsAttributes || [];
-window.fsAttributes.cmsload.init();

// 1. Initialize CMS Load first
window.fsAttributes.push([
  'cmsload',
  async (listInstances) => {
    console.log('1. CMS Load initialized');
    const [listInstance] = listInstances;

    // 2. Load all nested content
    try {
      console.log('2. Loading nested content...');
      await loadNestedFilters();

      if (listInstance && listInstance.items) {
        const containers = $(listInstance.items)
          .map(function () {
            return $(this.element);
          })
          .get();

        await Promise.all(containers.map(getNestedTags));
      }

      console.log('3. All nested content loaded, initializing CMS Filter');
      // 3. Initialize CMS Filter after all content is loaded
      await window.fsAttributes.cmsfilter.init();

      $('.solutions-filter_meta').css('visibility', 'visible');

      // Set up filter change handler
      const [filterInstance] = await window.fsAttributes.cmsfilter.getInstancePromise();
      if (filterInstance) {
        filterInstance.on('renderitems', async (renderedItems) => {
          const containers = $(renderedItems)
            .map(function () {
              return $(this.element);
            })
            .get();

          await Promise.all(containers.map(getNestedTags));
          await window.fsAttributes.cmsfilter.init();
        });
      }
    } catch (error) {
      console.error('Error during loading sequence:', error);
    }
  },
]);

// Clear Filters
$('[data-clear-button]').on('click', function () {
  document.querySelector('[fs-cmsfilter-element="clear"]').click();
});

// Checkbox change handler
$(document).on(
  'change',
  '.solutions-filter_row-checkbox:not(.cc-small) input[type="checkbox"]',
  function () {
    if (!this.checked) {
      $(this)
        .closest('.solutions-filter_row-checkbox')
        .siblings('.solutions-filter_nest')
        .find('input[type="checkbox"]:checked')
        .trigger('click');
    }

    const checkboxes = $(this)
      .closest('.solutions-filter_row-checkbox')
      .closest('.w-dyn-item')
      .siblings()
      .find('input[type="checkbox"]:checked')
      .not(this);

    const withCCSmall = checkboxes.filter(function () {
      return $(this).closest('.solutions-filter_row-checkbox').hasClass('cc-small');
    });

    const withoutCCSmall = checkboxes.filter(function () {
      return !$(this).closest('.solutions-filter_row-checkbox').hasClass('cc-small');
    });

    withCCSmall.trigger('click');
    withoutCCSmall.trigger('click');
  }
);
