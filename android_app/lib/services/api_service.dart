import 'package:android_app/services/dio_interceptor.dart';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/config/api_config.dart';

class ApiService {
  late final Dio _dio;

  ApiService(Ref ref) {
    _dio = Dio(
      BaseOptions(
        baseUrl: '${ApiConfig.baseUrl}/api/',
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

  Future<Response> getTasks({int page = 1, int count = 10}) async {
    return await _dio.get(
      'tasks',
      queryParameters: {'page': page, 'count': count},
    );
  }

  Future<void> createTaskFromJson(Map<String, dynamic> data) async {
    await _dio.post('/tasks', data: data);
  }

  Future<Response> updateTask(
    String taskId,
    String title,
    String description,
  ) async {
    return await _dio.patch(
      'tasks/$taskId',
      data: {'title': title, 'description': description},
    );
  }
}
