/**
 * Depends on common service
 */
(() => {

  // common
  const selectCountryCode = $('#selectCountryCode');

  // login country codes
  (async () => {
    try {
      const countryCodes = await getCountryCodes();
      countryCodes.map((option) => {
        selectCountryCode.append(new Option(option.countryCode, option.countryCode));
      });
    } catch (err) {
      Swal.fire({
        title: 'Oops!',
        text: 'Fetching country codes failed.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  })();


  // button
  (async () => {
    const btnLogin = $('#btnLogin');
    const txtLoginId = $('#txtLoginId');
    const txtPassword = $('#txtPassword');

    btnLogin.on('click', async () => {
      const cipherText = CryptoJS.AES.encrypt(txtPassword.val(), window.secretKey);
      const payload = {
        loginId: `${selectCountryCode.val()} ${txtLoginId.val()}`,
        password: cipherText.toString()
      };

      try {
        const res = await request2fa(payload);

        if (res.code === 1) {
          const res = await request2fa(payload);
          window.location.href = `/accounts/verify-otp?token=${res.value.token}`;
        }

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
