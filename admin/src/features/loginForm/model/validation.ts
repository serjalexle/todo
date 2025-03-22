import { validate } from "@/shared/utils/validation/validation";
import { ILoginFormData } from "./type";

export const validateLoginForm = (values: Partial<ILoginFormData>) => {
  const { isValid: isValidEmail, error: emailError } = validate(
    values.email || "",
    {
      required: true,
      isEmail: true,
    }
  );

  return {
    email: emailError,
    password: "",
    isValid: isValidEmail,
  };
};
