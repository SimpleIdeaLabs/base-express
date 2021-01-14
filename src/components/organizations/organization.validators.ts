import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { Not, getManager, In } from 'typeorm';
import { OrganizationRole } from '../organizationRoles/organizationRole.entity';
import Organization from './organization.entity';

@ValidatorConstraint({ async: true })
export class IsOrganizationNameUniqueConstraint implements ValidatorConstraintInterface {
  validate(name: any, args: ValidationArguments) {
    const params = args.object as any;
    const where = {
      name
    } as any;

    if (params.id) {
      where.id = Not(params.id);
    }

    return getManager().findOne(Organization, {
      where
    }).then(org => {
      if (org) { return false; }
      return true;
    });
  }
}

export const IsOrganizationNameUnique = (validationOptions?: ValidationOptions) => {
  // tslint:disable-next-line: ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOrganizationNameUniqueConstraint,
    });
  };
};


@ValidatorConstraint({ async: true })
export class IsOrganizationRolesExistsConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(roles: any, args: ValidationArguments) {
    return getManager().find(OrganizationRole, {
      where: {
        id: In(roles)
      }
    }).then(orgRoles => {
      if (orgRoles.length !== roles.length) { return false; }
      return true;
    });
  }
}

export const IsOrganizationRolesExists = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOrganizationRolesExistsConstraint,
    });
  };
};
