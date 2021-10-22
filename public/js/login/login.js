(() => {
  const btnLogin = $('#btnLogin');
  const txtEmail = $('#txtEmail');
  const txtPassword = $('#txtPassword');

  btnLogin.on('click', async () => {
    const payload = {
      email: txtEmail.val(),
      password: txtPassword.val()
    };

    try {
      const res = await $.ajax({
        url: `${window.apiUrl}/accounts/login`,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(payload)
      });

      const { data: { token } } = res;
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } catch (err) {
      Swal.fire({
        title: 'Oops!',
        text: 'Login Failed',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }

  });
})();
