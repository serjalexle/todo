import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeNotifier extends StateNotifier<ThemeData> {
  ThemeNotifier() : super(_lightTheme) {
    _loadTheme();
  }

  static const Color _goldAccent = Color(0xFFFFD700); // Золотий колір

  // Світла тема
  static final ThemeData _lightTheme = ThemeData(
    brightness: Brightness.light,
    primaryColor: _goldAccent,
    scaffoldBackgroundColor: Colors.white,
    appBarTheme: AppBarTheme(
      backgroundColor: _goldAccent,
      foregroundColor: Colors.black,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: _goldAccent,
        foregroundColor: Colors.black,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(foregroundColor: _goldAccent),
    ),
    iconTheme: const IconThemeData(color: _goldAccent),
  );

  // Темна тема
  static final ThemeData _darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: _goldAccent,
    scaffoldBackgroundColor: Colors.black,
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.black,
      foregroundColor: _goldAccent,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: _goldAccent,
        foregroundColor: Colors.black,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(foregroundColor: _goldAccent),
    ),
    iconTheme: const IconThemeData(color: _goldAccent),
  );

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isDarkMode = prefs.getBool('isDarkMode') ?? false;
    state = isDarkMode ? _darkTheme : _lightTheme;
  }

  Future<void> toggleTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isDarkMode = state.brightness == Brightness.light;
    state = isDarkMode ? _darkTheme : _lightTheme;
    await prefs.setBool('isDarkMode', isDarkMode);
  }
}

// Провайдер теми
final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeData>((ref) {
  return ThemeNotifier();
});
