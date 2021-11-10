(() => {

  // button
  (async () => {
    const btnVerifyOtp = $('#btnVerifyOtp');
    const txtOtp = $('#txtOtp');

    btnVerifyOtp.on('click', async () => {
      const queryStrings = getQueryStrings();
      const payload = {
        code: txtOtp.val(),
        token: queryStrings.token
      };

      try {
        const res = await verify2fa(payload);

        if (res.code === 1) {
          const userData = res.value;
          setUserToken(userData.sessionId);
          setCurrentUser(userData);
          window.location.href = '/accounts/select-role';
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'OTP Verification Failed',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }

      } catch (err) {
        console.log(error);
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
