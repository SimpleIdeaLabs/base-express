const request2fa = async (payload) => {
  const res = await $.ajax({
    url: `${window.apiUrl}/account/request2FA`,
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(payload)
  });
  return res;
};

const verify2fa = async (payload) => {
  const res = await $.ajax({
    url: `${window.apiUrl}/account/verify2FA`,
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(payload)
  });
  return res;
};

const getRoles = async () => {
  const token = localStorage.getItem('token');
  const res = await $.ajax({
    url: `${window.apiUrl}/provider/role`,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
  });
  return res.value;
};

const changeLoginRole = async (payload) => {
  const token = localStorage.getItem('token');
  const res = await $.ajax({
    url: `${window.apiUrl}/account/changeLoginRole`,
    headers: {
      'session-token': `${token}`
    },
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(payload)
  });
  return res.value;
};

const getCurrentSession = async () => {
  const token = localStorage.getItem('token');
  const res = await $.ajax({
    url: `${window.apiUrl}/account/getCurrentSession`,
    headers: {
      'session-token': `${token}`
    },
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
  });

  if (res.value) {
    setCurrentUser(res.value);
  }

  return res.value;
};

