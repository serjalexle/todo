import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/presentation/widgets/custom_app_bar.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  _ForgotPasswordScreenState createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _isLoading = false;

  Future<void> _resetPassword() async {
    setState(() => _isLoading = true);

    // Імітація запиту на сервер (замініть на реальний API)
    await Future.delayed(const Duration(seconds: 2));

    setState(() => _isLoading = false);

    // Показуємо повідомлення про успішне відновлення
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Посилання на відновлення паролю надіслано на email')),
    );

    // Перенаправлення на сторінку логіну
    context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Відновлення паролю'),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Забули пароль?',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text('Введіть ваш email, і ми надішлемо посилання для відновлення паролю.'),
            const SizedBox(height: 30),

            // 🔹 Email Input
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(),
                prefixIcon: const Icon(Icons.email),
              ),
            ),
            const SizedBox(height: 20),

            // 🔹 Reset Password Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _resetPassword,
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Відновити пароль'),
              ),
            ),
            const SizedBox(height: 10),

            // 🔹 "Згадали пароль? Увійти"
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text("Згадали пароль?"),
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
    super.dispose();
  }
}
