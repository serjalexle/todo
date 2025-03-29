// Імпортуємо основні компоненти Flutter для UI
import 'package:flutter/material.dart';

// Імпортуємо Riverpod — бібліотеку для менеджменту стану
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Імпортуємо контролер для реєстрації, де міститься логіка реєстрації та провайдер isLoadingProvider
import 'package:android_app/controllers/register_controller.dart';

// Створюємо кастомну кнопку реєстрації як ConsumerWidget — 
// це дозволяє слухати провайдери за допомогою WidgetRef
class RegisterButton extends ConsumerWidget {
  // Контролери для полів email, password, confirmPassword
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;

  // Конструктор, в якому всі контролери є обов'язковими (required)
  const RegisterButton({
    super.key, // Унікальний ключ для виджетів, якщо потрібно
    required this.emailController,
    required this.passwordController,
    required this.confirmPasswordController,
  });

  // Метод build — повертає сам UI кнопки
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Підписка на стан завантаження з провайдера — true або false
    final isLoading = ref.watch(isLoadingProvider);

    return SizedBox(
      width: double.infinity, // Кнопка на всю ширину контейнера
      child: ElevatedButton(
        // Якщо isLoading true — кнопку вимикаємо (null), щоб не клікали кілька разів
        onPressed: isLoading
            ? null
            : () => register(
                  context, // Контекст потрібен для навігації або показу SnackBar'ів
                  ref,     // Передаємо ref у register, щоб мати доступ до провайдерів
                  emailController.text,              // Текст з поля email
                  passwordController.text,           // Текст з поля пароля
                  confirmPasswordController.text,    // Текст з поля підтвердження пароля
                ),
        // Контент кнопки залежить від isLoading
        child: isLoading
            // Якщо йде завантаження — показуємо крутилку
            ? const CircularProgressIndicator(color: Colors.white)
            // Інакше — текст кнопки
            : const Text('Зареєструватися'),
      ),
    );
  }
}
