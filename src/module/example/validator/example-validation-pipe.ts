import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Type } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ExampleValidationPipe implements PipeTransform<any> {
  public async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Array<Type<any>> = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
