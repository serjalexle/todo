import * as yup from "yup";

export const adminLoginSchema = yup.object({
  email: yup.string().email("Невірний email").required("Обовʼязково"),
  password: yup.string().min(4, "Мінімум 4 символи").required("Обовʼязково"),
});
