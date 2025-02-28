import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:android_app/services/secure_storage_service.dart';

class AuthNotifier extends StateNotifier<bool> {
  AuthNotifier() : super(false) {
    _checkLoginStatus(); // Перевіряємо, чи користувач залогінений при старті
  }

  final Dio _dio = Dio();

  Future<void> _checkLoginStatus() async {
    final token = await SecureStorageService.getAccessToken();
    state = token != null; // Якщо токен є – користувач залогінений
  }

  Future<void> login(String email, String password) async {
    try {
      final response = await _dio.post(
        'https://api.example.com/login',
        data: {'email': email, 'password': password},
      );

      final accessToken = response.data['accessToken'];
      final refreshToken = response.data['refreshToken'];

      await SecureStorageService.saveTokens(accessToken, refreshToken);

      state = true; // Користувач залогінений
    } catch (e) {
      throw Exception('Помилка входу');
    }
  }

  Future<void> logout() async {
    await SecureStorageService.deleteTokens();
    state = false; // Користувач розлогінений
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, bool>((ref) {
  return AuthNotifier();
});
