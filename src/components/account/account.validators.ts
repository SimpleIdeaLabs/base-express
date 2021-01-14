import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { getManager, Not } from 'typeorm';
import { Account } from './account.entity';

export function IsMatch(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
}

@ValidatorConstraint({ async: true })
export class IsAccountEmailUniqueConstraint implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    const params = args.object as any;
    const where = {
      email
    } as any;

    if (params.id) {
      where.id = Not(params.id);
    }

    return getManager().findOne(Account, {
      where
    }).then(account => {
      if (account) { return false; }
      return true;
    });
  }
}

export const IsAccountEmailUnique = (validationOptions?: ValidationOptions) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAccountEmailUniqueConstraint,
    });
  };
};
