import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

@ValidatorConstraint({ name: "equalsToProperty", async: false })
class EqualsToPropertyConstraint implements ValidatorConstraintInterface {
  public validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as string[];
    const relatedValue = (args.object as { [key: string]: unknown })[
      relatedPropertyName
    ];

    return value === relatedValue;
  }

  public defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as string[];
    return `${args.property} must be equal to ${relatedPropertyName}`;
  }
}

export function EqualsToProperty(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "equalsToProperty",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: EqualsToPropertyConstraint,
    });
  };
}
