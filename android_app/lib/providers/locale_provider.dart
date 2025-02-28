import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleNotifier extends StateNotifier<Locale> {
  LocaleNotifier() : super(const Locale('en')) {
    _loadLocale(); // Завантаження мови при старті додатка
  }

  Future<void> _loadLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final languageCode = prefs.getString('locale') ?? 'en';
    state = Locale(languageCode);
  }

  Future<void> toggleLanguage() async {
    state =
        (state.languageCode == 'en') ? const Locale('uk') : const Locale('en');
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'locale',
      state.languageCode,
    ); // Збереження вибраної мови
  }
}

// Провайдер мови
final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>((ref) {
  return LocaleNotifier();
});
