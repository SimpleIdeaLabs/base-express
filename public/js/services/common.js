const getCountryCodes = async () => {
  const res = await $.ajax({
    url: `${window.apiUrl}/common/loginCountryCodes?global=false`,
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8'
  });
  return res.value;
};

const getQueryStrings = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params;
};

const redirect = (path) => window.location.href = path;
