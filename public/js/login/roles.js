(async () => {
  const userData = await getCurrentUser();
  const roles = userData.profiles;

  // populate roles select
  (async () => {
    try {
      const selectRoles = $('#selectRoles');
      roles.map((option) => {
        selectRoles.append(new Option(`${option.organization.name} - ${option.role}`, option.id));
      });
    } catch (error) {
      Swal.fire({
        title: 'Oops!',
        text: 'Getting Roles Failed',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  })();

  // button
  (async () => {
    const btnSelectRole = $('#btnSelectRole');
    btnSelectRole.on('click', async () => {
      try {
        const selectedRoleId = $('#selectRoles option:selected').val();
        const selectedRole = _.find(roles, { id: +selectedRoleId });
        await changeLoginRole({
          orgId: selectedRole.organization.id,
          role: selectedRole.role
        });
        await getCurrentSession();
        await setUserRole(selectedRole);
        redirect('/dashboard');
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: 'Oops!',
          text: 'Login Failed',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  })();

})();
