import { ValidationError } from "class-validator";

function validationErrorsToStringArray(errors: ValidationError[]): string[] {
  const errorStrings: string[] = [];
  errors.forEach((e) => {
    if (!e.constraints) {
      return;
    }

    Object.values(e.constraints).forEach((message) => {
      errorStrings.push(message);
    });

    if (e.children?.length) {
      errorStrings.push(...validationErrorsToStringArray(e.children));
    }
  });

  return errorStrings;
}

export function validationErrorsToString(errors: ValidationError[]): string {
  return validationErrorsToStringArray(errors).join("; ");
}
