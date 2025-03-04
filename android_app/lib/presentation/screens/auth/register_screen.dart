import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/presentation/widgets/custom_app_bar.dart';
import 'package:android_app/presentation/widgets/email_input.dart';
import 'package:android_app/presentation/widgets/password_input.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;

  Future<void> _register() async {
    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Паролі не співпадають')));
      return;
    }

    setState(() => _isLoading = true);

    // Імітація реєстрації (можеш замінити на реальний API)
    // http://127.0.0.1:8000/
    await Future.delayed(const Duration(seconds: 2));

    setState(() => _isLoading = false);

    // Навігація після успішної реєстрації
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Успішна реєстрація!')));
    context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Реєстрація'),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Створіть акаунт!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text('Заповніть дані для створення акаунта.'),
            const SizedBox(height: 30),

            // 🔹 Email Input
            EmailInput(controller: _emailController),

            const SizedBox(height: 20),

            // 🔹 Password Input
            PasswordInput(controller: _passwordController),
            const SizedBox(height: 20),

            // 🔹 Confirm Password Input
            PasswordInput(
              controller: _confirmPasswordController,
              label: 'Підтвердьте пароль',
            ),
            const SizedBox(height: 20),

            // 🔹 Register Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _register,
                child:
                    _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Зареєструватися'),
              ),
            ),
            const SizedBox(height: 10),

            // 🔹 "Вже є акаунт? Увійти"
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text("Вже маєте акаунт?"),
                TextButton(
                  onPressed: () => context.go('/login'),
                  child: const Text('Увійти'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}
