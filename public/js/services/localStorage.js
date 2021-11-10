const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const getCurrentUser = () => {
  const rawUser = localStorage.getItem('user');
  return JSON.parse(rawUser);
};

const setUserToken = (token) => localStorage.setItem('token', token);

const getUserToken = () => localStorage.getUserToken('token');

const setUserRole = (role) => localStorage.setItem('role', JSON.stringify(role));

const getUserRole = () => JSON.parse(localStorage.getItem('role'));
