import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: (dotenv.env['API_BASE_URL'] ?? '') + '/api/',
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 5),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  Future<Response> login(String email, String password) async {
    try {
      final response = await _dio.post(
        'auth/login',
        data: {'email': email, 'password': password},
      );
      return response;
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> register(String email, String password) async {
    try {
      final response = await _dio.post(
        'auth/register',
        data: {'email': email, 'password': password},
      );
      return response;
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> logout() async {
    try {
      final response = await _dio.get('auth/logout');
      return response;
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> refresh() async {
    try {
      final response = await _dio.get('auth/refresh');
      return response;
    } catch (e) {
      rethrow;
    }
  }

  // 🛠 ОБРОБКА ПОМИЛОК
  Exception _handleDioError(DioException e) {
    if (e.response != null) {
      switch (e.response!.statusCode) {
        case 400:
          return Exception("Некоректний запит: ${e.response!.data['detail']}");
        case 401:
          return Exception("Невірний email або пароль.");
        case 403:
          return Exception("Доступ заборонено.");
        case 404:
          return Exception("Ресурс не знайдено.");
        case 500:
          return Exception("Помилка сервера.");
        default:
          return Exception("Невідома помилка: ${e.response!.data}");
      }
    } else {
      return Exception("Проблема з мережею або сервером.");
    }
  }
}
