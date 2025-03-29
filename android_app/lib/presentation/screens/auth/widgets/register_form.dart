// Імпортуємо основні компоненти Flutter для UI
import 'package:flutter/material.dart';

// Кастомне текстове поле для email (ймовірно, з валідацією)
import 'package:android_app/presentation/widgets/email_input.dart';

// Кастомне текстове поле для пароля (з приховуванням і показом)
import 'package:android_app/presentation/widgets/password_input.dart';

// Кнопка реєстрації, яка приймає контролери і відправляє запит
import 'package:android_app/presentation/screens/auth/widgets/register_button.dart';

// RegisterForm — це StatefulWidget, бо потрібно зберігати стан контролерів
class RegisterForm extends StatefulWidget {
  const RegisterForm({super.key}); // Конструктор з key

  @override
  State<RegisterForm> createState() => _RegisterFormState(); // Створюємо стан
}

class _RegisterFormState extends State<RegisterForm> {
  // * Контролери для кожного поля вводу
  final TextEditingController emailController =
      TextEditingController(); // Email
  final TextEditingController passwordController =
      TextEditingController(); // Пароль
  final TextEditingController confirmPasswordController =
      TextEditingController(); // Повтор пароля

  // * Ключ для форми — дозволяє виконати валідацію (.validate()) або доступ до стану
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    // * Звільняємо памʼять при видаленні віджета (важливо!)
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey, // * Привʼязуємо ключ до форми, щоб мати доступ до її стану
      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start, // * Вирівнювання дочірніх елементів вліво
        children: [
          // * Заголовок
          const Text(
            'Створіть акаунт!',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const Text('Заповніть дані для створення акаунта.'), // Підзаголовок
          const Divider(height: 30), // Відступ і розділювач
          // * Поле для email
          EmailInput(controller: emailController),

          const SizedBox(height: 16), // Відступ
          // * Поле для введення пароля
          PasswordInput(controller: passwordController),

          const SizedBox(height: 16), // Відступ
          // * Повторне поле пароля (з кастомним label)
          PasswordInput(
            controller: confirmPasswordController,
            label: 'Підтвердьте пароль',
          ),

          const Divider(height: 20), // Роздільник перед кнопкою
          // TODO: В майбутньому підключити валідацію форми тут:
          //       _formKey.currentState!.validate() — перевірить усі поля
          RegisterButton(
            emailController: emailController,
            passwordController: passwordController,
            confirmPasswordController: confirmPasswordController,
          ),
        ],
      ),
    );
  }
}
