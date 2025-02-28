import 'package:flutter/material.dart';

class LanguageSwitcher extends StatelessWidget {
  final VoidCallback onTap;

  const LanguageSwitcher({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    // Отримуємо поточну мову
    String currentLocale =
        Localizations.localeOf(context).languageCode.toUpperCase();

    return TextButton(
      onPressed: onTap,
      child: Text(
        currentLocale, // Використання перекладу Показує "EN" або "UK"
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
    );
  }
}
