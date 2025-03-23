type ValidationRule = {
  validate: (value: any) => boolean;
  message: string;
};

type ValidatorConfig = {
  [key: string]: ValidationRule[];
};

const validators: ValidatorConfig = {
  email: [
    {
      validate: (value: string) =>
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value),
      message: "Invalid email format.",
    },
  ],
  phone: [
    {
      validate: (value: string) =>
        /^\+?[0-9]{1,4}?[-\s]?[0-9]+[-\s]?[0-9]+$/.test(value),
      message: "Invalid phone number format.",
    },
  ],
  password: [
    {
      validate: (value: string) => value.length >= 8,
      message: "Password must be at least 8 characters long.",
    },
    {
      validate: (value: string) => /[A-Z]/.test(value),
      message: "Password must contain at least one uppercase letter.",
    },
    {
      validate: (value: string) => /[a-z]/.test(value),
      message: "Password must contain at least one lowercase letter.",
    },
    {
      validate: (value: string) => /[0-9]/.test(value),
      message: "Password must contain at least one number.",
    },
  ],
};

export const validateField = (field: string, value: any): string => {
  let errors: string = "";
  const rules = validators[field] || [];

  for (const rule of rules) {
    if (!rule.validate(value)) {
      errors = rule.message;
    }
  }

  return errors;
};
