export const validate = (
    value: string, 
    rules: { required?: boolean, minLength?: number, maxLength?: number, isEmail?: boolean }
) => {
  let isValid = true;
  let error = "";
  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
    if (!isValid) {
      error = "This field is required";
    }
  }
  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
    if (!isValid) {
      error = "Minimum length is " + rules.minLength;
    }
  }
  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
    if (!isValid) {
      error = "Maximum length is " + rules.maxLength;
    }
  }
  if (rules.isEmail) {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    isValid = pattern.test(value) && isValid;
    if (!isValid) {
      error = "Invalid email address";
    }
  }
  return { isValid, error };
};
