import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final obscurePasswordProvider = StateProvider<bool>((ref) => true);
final passwordErrorProvider = StateProvider<String?>((ref) => null);

class PasswordInput extends ConsumerWidget {
  final TextEditingController controller;
  final String label; // Новий параметр для лейблу

  const PasswordInput({
    super.key,
    required this.controller,
    this.label = 'Пароль', // Значення за замовчуванням
  });

  bool _isValidPassword(String password) {
    if (password.length < 8) {
      return false;
    }
    final hasNumber = RegExp(r'[0-9]').hasMatch(password);
    final hasUpperCase = RegExp(r'[A-Z]').hasMatch(password);
    final hasLowerCase = RegExp(r'[a-z]').hasMatch(password);
    final hasSpecialCharacter = RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(password);

    return hasNumber && hasUpperCase && hasLowerCase && hasSpecialCharacter;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final obscurePassword = ref.watch(obscurePasswordProvider);
    final passwordError = ref.watch(passwordErrorProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: controller,
          obscureText: obscurePassword,
          decoration: InputDecoration(
            labelText: label, // Використовуємо кастомний або дефолтний лейбл
            border: const OutlineInputBorder(),
            prefixIcon: const Icon(Icons.lock),
            suffixIcon: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (passwordError != null)
                  const Icon(Icons.error, color: Colors.red),
                IconButton(
                  icon: Icon(
                    obscurePassword ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () {
                    ref.read(obscurePasswordProvider.notifier).state =
                        !obscurePassword;
                  },
                ),
              ],
            ),
          ),
          onChanged: (value) {
            if (value.isEmpty) {
              ref.read(passwordErrorProvider.notifier).state =
                  "Пароль не може бути пустим";
            } else if (!_isValidPassword(value)) {
              ref.read(passwordErrorProvider.notifier).state =
                  "Пароль має містити 8+ символів, великі/малі букви, цифру та спецсимвол";
            } else {
              ref.read(passwordErrorProvider.notifier).state = null;
            }
          },
        ),
        if (passwordError != null) ...[
          const SizedBox(height: 5),
          Text(
            passwordError,
            style: const TextStyle(color: Colors.red, fontSize: 12),
          ),
        ],
      ],
    );
  }
}
