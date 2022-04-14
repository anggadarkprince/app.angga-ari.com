import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import {Injectable} from "@nestjs/common";

@Injectable()
@ValidatorConstraint({name: 'MatchField'})
export class MatchFieldRule implements ValidatorConstraintInterface {
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Does not match with ${validationArguments.constraints[0]} field`;
    }

    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        const [relatedPropertyName] = validationArguments.constraints;
        const relatedValue = (validationArguments.object as any)[relatedPropertyName];
        return value === relatedValue;
    }
}

export function MatchField(property: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'MatchField',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchFieldRule,
        });
    };
}
