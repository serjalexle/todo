// Імпортуємо стандартні UI-компоненти Flutter (Scaffold, Text, Column тощо)
import 'package:flutter/material.dart';

// Riverpod для менеджменту стану. ConsumerWidget дозволяє слухати провайдери.
import 'package:flutter_riverpod/flutter_riverpod.dart';

// GoRouter — бібліотека для навігації між екранами (push, pop, etc)
import 'package:go_router/go_router.dart';

// Кастомний AppBar, ймовірно, наш власний компонент із заголовком
import 'package:android_app/presentation/widgets/custom_app_bar.dart';

// Форма реєстрації, винесена в окремий файл/віджет для зручності
import 'package:android_app/presentation/screens/auth/widgets/register_form.dart';

// * Основний екран реєстрації. Використовує ConsumerWidget для доступу до провайдерів.
class RegisterScreen extends ConsumerWidget {
  const RegisterScreen({super.key}); // Конструктор з ключем (для Flutter оптимізацій)

  // Метод build будує UI екрану
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      // Верхня панель з заголовком — кастомна (може мати власний стиль)
      appBar: const CustomAppBar(title: 'Реєстрація'),

      // Основне тіло сторінки по центру
      body: Center(
        // Дає змогу прокручувати вміст, якщо клавіатура закриє форму
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20), // Відступи зліва і справа
          child: Column(
            mainAxisSize: MainAxisSize.min, // Висота колонки підлаштовується під контент
            children: [
              // Форма для реєстрації (email, password, confirmPassword, кнопка)
              const RegisterForm(),

              // Відступ після форми
              const SizedBox(height: 20),

              // Текстова кнопка з переходом на екран логіну
              Center(
                child: TextButton(
                  onPressed: () => context.push('/login'), // Навігація до маршруту логіну
                  child: const Text('Вже маєте акаунт? Увійти'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
