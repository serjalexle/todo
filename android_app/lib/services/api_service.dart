import 'package:android_app/services/dio_interceptor.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService {
  late final Dio _dio;

  ApiService(Ref ref) {
    _dio = Dio(
      BaseOptions(
        baseUrl: (dotenv.env['API_BASE_URL'] ?? '') + '/api/',
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 5),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    _dio.interceptors.add(AuthInterceptor(_dio, ref)); // ✅ Додаємо інтерсептор
  }

  Future<Response> login(String email, String password) async {
    return await _dio.post(
      'auth/login',
      data: {'email': email, 'password': password},
    );
  }

  Future<Response> register(String email, String password) async {
    return await _dio.post(
      'auth/register',
      data: {'email': email, 'password': password},
    );
  }

  Future<Response> logout() async {
    return await _dio.get('auth/logout'); // ✅ Тепер інтерсептор додасть токен
  }

  Future<Response> refresh() async {
    return await _dio.get('auth/refresh');
  }

  Future<Response> getTasks() async {
    return await _dio.get('tasks');
  }

  Future<Response> createTask(String title, String description) async {
    return await _dio.post('tasks', data: {
      'title': title,
      'description': description,
    });
  }

  Future<Response> updateTask(String taskId, String title, String description) async {
    return await _dio.patch('tasks/$taskId', data: {
      'title': title,
      'description': description,
    });
  }
}
