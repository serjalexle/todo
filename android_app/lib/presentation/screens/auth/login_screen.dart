import 'package:android_app/presentation/widgets/email_input.dart';
import 'package:android_app/presentation/widgets/password_input.dart';
import 'package:android_app/presentation/widgets/login_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/presentation/widgets/custom_app_bar.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final emailController = TextEditingController();
    final passwordController = TextEditingController();

    return Scaffold(
      appBar: const CustomAppBar(title: 'Вхід'),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Ласкаво просимо!',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const Text('Увійдіть у свій акаунт, щоб продовжити.'),
              const Divider(height: 30),

              Form(
                child: Column(
                  children: [
                    EmailInput(controller: emailController),
                    const SizedBox(height: 16),
                    PasswordInput(controller: passwordController),
                  ],
                ),
              ),

              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => context.push('/forgot-password'),
                  child: const Text('Забув пароль?'),
                ),
              ),

              const Divider(height: 20),
              LoginButton(
                emailController: emailController,
                passwordController: passwordController,
              ),

              const SizedBox(height: 20),
              Center(
                child: TextButton(
                  onPressed: () => context.push('/register'),
                  child: const Text('Немає акаунта? Зареєструватися'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
