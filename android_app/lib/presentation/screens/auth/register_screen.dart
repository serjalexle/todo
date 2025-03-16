import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/presentation/widgets/custom_app_bar.dart';
import 'package:android_app/presentation/widgets/email_input.dart';
import 'package:android_app/presentation/widgets/password_input.dart';
import 'package:android_app/presentation/widgets/register_button.dart';

class RegisterScreen extends ConsumerWidget {
  const RegisterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    final confirmPasswordController = TextEditingController();

    return Scaffold(
      appBar: const CustomAppBar(title: 'Реєстрація'),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Створіть акаунт!',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const Text('Заповніть дані для створення акаунта.'),
              const Divider(height: 30),

              Form(
                child: Column(
                  children: [
                    EmailInput(controller: emailController),
                    const SizedBox(height: 16),
                    PasswordInput(controller: passwordController),
                    const SizedBox(height: 16),
                    PasswordInput(
                      controller: confirmPasswordController,
                      label: 'Підтвердьте пароль',
                    ),
                  ],
                ),
              ),

              const Divider(height: 20),
              RegisterButton(
                emailController: emailController,
                passwordController: passwordController,
                confirmPasswordController: confirmPasswordController,
              ),

              const SizedBox(height: 20),
              Center(
                child: TextButton(
                  onPressed: () => context.push('/login'),
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
