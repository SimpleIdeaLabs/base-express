import { ValidationError } from 'class-validator';

export const loginError = new ValidationError();
loginError.property = 'email';
loginError.constraints = {
  'isLoginValid': 'Login failed.'
};

export const roleError = new ValidationError();
loginError.property = 'role';
loginError.constraints = {
  'isRoleValid': 'Role not found'
};

export const authError = new ValidationError();
loginError.property = 'email';
loginError.constraints = {
  'isAuthAccountValid': 'Auth not found'
};
