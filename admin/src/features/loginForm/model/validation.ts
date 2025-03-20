import { ILoginFormData } from "./type";

import { validate } from "@/shared/utils/validation/validation";

export const validateLogin = (values: ILoginFormData) => {
  const isValidEmail = validate(values.email, {
    required: true,
    isEmail: true,
  });

  const isValidPassword = validate(values.password, { required: true });

  return isValidEmail.isValid && isValidPassword.isValid;
};
