let url = 'https://api.lever.co/v0/postings/gynger?mode=json';

if (window.location.pathname === '/careers') {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      let roles = data;
      console.log(data);

      // Arrays to store unique values
      let uniqueWorkplaceTypes = [];
      let uniqueCommitments = [];
      let uniqueTeams = [];
      let uniqueLocations = [];

      // Object to store jobs by team
      let jobsByTeam = {};

      // Collect unique values for each field and organize jobs by team
      roles.forEach(function (role) {
        // Add workplaceType if unique
        if (role.workplaceType && !uniqueWorkplaceTypes.includes(role.workplaceType)) {
          uniqueWorkplaceTypes.push(role.workplaceType);
        }

        // Add commitment if unique
        if (role.categories.commitment && !uniqueCommitments.includes(role.categories.commitment)) {
          uniqueCommitments.push(role.categories.commitment);
        }

        // Add team if unique and organize jobs by team
        if (role.categories.team) {
          const { team } = role.categories;

          if (!uniqueTeams.includes(team)) {
            uniqueTeams.push(team);
          }

          // Add job to the team's array
          if (!jobsByTeam[team]) {
            jobsByTeam[team] = [];
          }
          jobsByTeam[team].push(role);
        }

        // Add locations if unique
        if (role.categories.allLocations && role.categories.allLocations.length) {
          role.categories.allLocations.forEach(function (location) {
            if (!uniqueLocations.includes(location)) {
              uniqueLocations.push(location);
            }
          });
        }
      });

      // Log the unique values and jobs by team
      console.log('Unique Workplace Types:', uniqueWorkplaceTypes);
      console.log('Unique Commitments:', uniqueCommitments);
      console.log('Unique Teams:', uniqueTeams);
      console.log('Unique Locations:', uniqueLocations);
      console.log('Jobs By Team:', jobsByTeam);

      // Update the dropdowns with unique values
      updateDropdown('[data-dropdown-location-type]', uniqueWorkplaceTypes, 'All');
      updateDropdown('[data-dropdown-location]', uniqueLocations, 'All');
      updateDropdown('[data-dropdown-team]', uniqueTeams, 'All');
      updateDropdown('[data-dropdown-worktype]', uniqueCommitments, 'All');

      // Function to update dropdown content
      function updateDropdown(selector, options, allText) {
        const dropdown = $(selector);
        if (dropdown.length) {
          const listInner = dropdown.find('.filter-dropdown_list-inner');

          // Clear existing options
          listInner.empty();

          // Add "All" option with active class by default
          listInner.append(
            `<a href="#" class="filter-dropdown_list-link w-inline-block active" data-value="all"><div>${allText}</div></a>`
          );

          // Add each unique option
          options.forEach(function (option) {
            listInner.append(
              `<a href="#" class="filter-dropdown_list-link w-inline-block" data-value="${option}"><div>${option}</div></a>`
            );
          });

          // Add click handlers for filtering
          listInner.find('.filter-dropdown_list-link').on('click', function (e) {
            e.preventDefault();

            // Remove active class from all links in this dropdown
            $(this)
              .closest('.filter-dropdown_list-inner')
              .find('.filter-dropdown_list-link')
              .removeClass('active');

            // Add active class to clicked link
            $(this).addClass('active');

            // Apply filters
            applyFilters();
          });
        }
      }

      // Filter Manager - handles the current filter state
      const filterManager = {
        // Get active filters from the UI
        getActiveFilters: function () {
          return {
            workplaceType: $(
              '[data-dropdown-location-type] .filter-dropdown_list-link.active'
            ).data('value'),
            location: $('[data-dropdown-location] .filter-dropdown_list-link.active').data('value'),
            team: $('[data-dropdown-team] .filter-dropdown_list-link.active').data('value'),
            commitment: $('[data-dropdown-worktype] .filter-dropdown_list-link.active').data(
              'value'
            ),
          };
        },

        // Check if job item matches the filters
        matchesFilters: function (item, filters) {
          // Check workplace type
          if (filters.workplaceType !== 'all') {
            if ($(item).attr('data-workplace-type') !== filters.workplaceType) {
              return false;
            }
          }

          // Check location
          if (filters.location !== 'all') {
            if (!$(item).attr('data-location').includes(filters.location)) {
              return false;
            }
          }

          // Check team
          if (filters.team !== 'all') {
            if ($(item).attr('data-team') !== filters.team) {
              return false;
            }
          }

          // Check commitment
          if (filters.commitment !== 'all') {
            if ($(item).attr('data-commitment') !== filters.commitment) {
              return false;
            }
          }

          return true;
        },
      };

      // Apply filters to the job items
      function applyFilters() {
        const filters = filterManager.getActiveFilters();
        let visibleJobsCount = 0;

        // Get all job items
        const jobItems = $('[data-roles="item"]');

        // Reset all items visibility first
        jobItems.show();

        // Apply filters to each item
        jobItems.each(function () {
          if (filterManager.matchesFilters(this, filters)) {
            $(this).show();
            visibleJobsCount++;
          } else {
            $(this).hide();
          }
        });

        // Handle team sections visibility
        $('[data-roles="part"]').each(function () {
          const teamSection = $(this);
          const visibleItems = teamSection.find('[data-roles="item"]:visible').length;

          // Hide team section if it has no visible jobs
          if (visibleItems === 0) {
            teamSection.hide();
          } else {
            teamSection.show();
          }
        });

        // Update counter
        $('[roles-counter]').text(visibleJobsCount);

        // If all filters are set to 'all', make sure everything is shown
        if (
          filters.workplaceType === 'all' &&
          filters.location === 'all' &&
          filters.team === 'all' &&
          filters.commitment === 'all'
        ) {
          jobItems.show();
          $('[data-roles="part"]').show();
          $('[roles-counter]').text(jobItems.length);
        }
      }

      // Get container to append team sections
      const rolesContainer = $('.careers-roles_list');

      // Clone template elements (should be hidden in the HTML)
      const teamPartTemplate = $('[data-roles="part"]:first').clone();
      const roleItemTemplate = $('[data-roles="item"]:first').clone();

      // Clear existing content
      rolesContainer.empty();

      // Create sections for each team
      uniqueTeams.forEach(function (team) {
        // Skip if team doesn't have any jobs
        if (!jobsByTeam[team] || jobsByTeam[team].length === 0) return;

        // Clone team section template
        const teamSection = teamPartTemplate.clone();

        // Set team title
        teamSection.find('[data-roles="team-title"]').text(team);

        // Get the list container for jobs
        const teamList = teamSection.find('[data-roles="team-list"]');
        teamList.empty();

        // Add jobs for this team
        jobsByTeam[team].forEach(function (job) {
          // Clone job item template
          const jobItem = roleItemTemplate.clone();

          // Populate job item
          jobItem.find('[data-roles="item-title"]').text(job.text);
          jobItem.find('[data-roles="item-location"]').text(job.categories.allLocations.join(', '));
          jobItem.find('[data-roles="item-location-type"]').text(job.workplaceType || '');
          jobItem.find('[data-roles="item-commitment"]').text(job.categories.commitment || '');

          // Set link
          jobItem
            .find('[data-roles="item-link"]')
            .attr('href', job.hostedUrl || `/careers/role?=${job.id}`);

          // Add data attributes for filtering
          jobItem.attr('data-workplace-type', job.workplaceType || '');
          jobItem.attr('data-commitment', job.categories.commitment || '');
          jobItem.attr('data-team', team);
          jobItem.attr('data-location', job.categories.allLocations.join(', '));

          // Add to team list
          teamList.append(jobItem);
        });

        // Add team section to container
        rolesContainer.append(teamSection);
      });

      // Init
      $('.careers-roles_loading').hide();
      $('.careers-roles_part').show();
    })
    .catch((error) => console.error('Error fetching data:', error));
}
