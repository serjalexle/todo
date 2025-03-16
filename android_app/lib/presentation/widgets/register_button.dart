import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/controllers/register_controller.dart';

class RegisterButton extends ConsumerWidget {
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;

  const RegisterButton({
    super.key,
    required this.emailController,
    required this.passwordController,
    required this.confirmPasswordController,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isLoading = ref.watch(isLoadingProvider);

    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: isLoading
            ? null
            : () => register(
                  context,
                  ref,
                  emailController.text,
                  passwordController.text,
                  confirmPasswordController.text,
                ),
        child: isLoading
            ? const CircularProgressIndicator(color: Colors.white)
            : const Text('Зареєструватися'),
      ),
    );
  }
}
