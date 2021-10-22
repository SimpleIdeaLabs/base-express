(async () => {
  const token = localStorage.getItem('token');
  const redirect = () => {
    window.location.href = '/accounts/login';
  };

  try {

    if (!token) {
      return redirect();
    }

    const response = await $.ajax({
      method: 'get',
      url: `${window.apiUrl}/accounts/get-current-session`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

  } catch (error) {
    return redirect();
  }

})();
