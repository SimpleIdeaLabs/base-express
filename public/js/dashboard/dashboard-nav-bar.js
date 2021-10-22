(() => {
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
