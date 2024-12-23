import { ValidationError } from "class-validator";

function validationErrorsToStringArray(errors: ValidationError[]): string[] {
  const errorStrings: string[] = [];
  errors.forEach((e) => {
    if (!e.constraints) {
      return;
    }
    Object.keys(e.constraints).forEach((key) => {
      errorStrings.push(e.constraints![key]); // eslint-disable-line @typescript-eslint/no-non-null-assertion
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
