import { z } from "zod";

export const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      if (error.expected === "string") {
        return { message: `This ain't a string!` };
      }
      break;
    case z.ZodIssueCode.custom:
      const params = error.params || {};
      if (params.myField) {
        return { message: `Bad input: ${params.myField}` };
      }
      break;
  }

  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
