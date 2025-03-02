import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final emailErrorProvider = StateProvider<String?>((ref) => null);

class EmailInput extends ConsumerWidget {
  final TextEditingController controller;

  const EmailInput({super.key, required this.controller});

  bool _isValidEmail(String email) {
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    return emailRegex.hasMatch(email);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final emailError = ref.watch(emailErrorProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: controller,
          keyboardType: TextInputType.emailAddress,
          decoration: InputDecoration(
            labelText: 'Email',
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.email),
            suffixIcon:
                emailError == null
                    ? null
                    : const Icon(Icons.error, color: Colors.red),
          ),
          onChanged: (value) {
            if (value.isEmpty) {
              ref.read(emailErrorProvider.notifier).state =
                  "Email не може бути пустим";
            } else if (!_isValidEmail(value)) {
              ref.read(emailErrorProvider.notifier).state = "Некоректний email";
            } else {
              ref.read(emailErrorProvider.notifier).state = null;
            }
          },
        ),
        if (emailError != null) ...[
          const SizedBox(height: 5),
          Text(
            emailError,
            style: const TextStyle(color: Colors.red, fontSize: 12),
          ),
        ],
      ],
    );
  }
}
