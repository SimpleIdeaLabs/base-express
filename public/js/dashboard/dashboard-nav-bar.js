(async () => {
  const user = await getCurrentUser();
  const role = await getUserRole();

  // user displays
  const setUserDisplays = () => {
    const txtRoleTitle = $('.txtRoleTitle');
    const txtUserName = $('#txtUserName');
    txtRoleTitle.html(`${role.role} - ${role.organization.name}`);
    txtUserName.html(`${user.demographics.firstName} ${user.demographics.lastName}`);
  };

  /**
   * sidebar links
   * depends on roles
   */
  const setSidebarLinks = () => {
    const sidebarLinks = $('#sidebarLinks');
    const sidebarLinkOptionTemplate = (title, path) => {
      return (`
          <li class="nav-item">
            <a class="nav-link" href="${path}">${title}</a>
          </li>
        `);
    };

    if (role.role === 'SUPERADMIN') {
      sidebarLinks.append(sidebarLinkOptionTemplate('Organization', 'organization'));
      sidebarLinks.append(sidebarLinkOptionTemplate('Charge Code', 'charge-code'));
      sidebarLinks.append(sidebarLinkOptionTemplate('Inventory', 'inventory'));
      sidebarLinks.append(sidebarLinkOptionTemplate('Invoice', 'Invoice'));
      sidebarLinks.append(sidebarLinkOptionTemplate('Feedback', 'Feedback'));
    }

    /**
     * Links to show
     * Regardless of rows
     */

    // Logout
    (() => {
      sidebarLinks.append(`
        <li class="nav-item">
          <a class="nav-link" href="#" id='btnLogout'>Logout</a>
        </li>
      `);
      const btnLogout = $('#btnLogout');
      btnLogout.on('click', () => {
        Swal.fire({
          title: 'Are you sure you want to logout?',
          showDenyButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem('token');
            window.location.href = '/accounts/login';
          }
        });
      });
    })();

  };

  setUserDisplays();
  setSidebarLinks();

})();
