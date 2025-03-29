import 'package:android_app/config/api_config.dart';
import 'package:android_app/services/api_service.dart';
import 'package:dio/dio.dart';
import 'package:android_app/services/storage_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

class AuthInterceptor extends Interceptor {
  final Dio dio;
  final Ref ref;
  final BuildContext? context; // ✅ Контекст тепер опціональний

  AuthInterceptor(
    this.dio,
    this.ref, [
    this.context,
  ]); // ✅ `BuildContext` необов’язковий

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final storageService = ref.read(storageServiceProvider);
    final token = await storageService.getAccessToken();

    debugPrint('🔹 Токен перед запитом: $token');

    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    debugPrint('🔹 Заголовки перед відправкою: ${options.headers}');
    super.onRequest(options, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final storageService = ref.read(storageServiceProvider);
      final refreshToken = await storageService.getRefreshToken();

      if (refreshToken != null) {
        try {
          final response = await ApiService(ref).refresh();
          if (response.statusCode != 200) {
            throw Exception('Не вдалося оновити токен');
          }

          final newAccessToken = response.data['access_token'];
          await storageService.saveTokens(newAccessToken, refreshToken);

          // 🔄 Повторний запит з оновленим `access_token`
          final retryRequest = await dio.fetch(err.requestOptions);
          return handler.resolve(retryRequest);
        } catch (e) {
          await storageService.clearTokens();
          _redirectToLogin();
        }
      } else {
        await storageService.clearTokens();
        _redirectToLogin();
      }
    }
    super.onError(err, handler);
  }

  void _redirectToLogin() {
    if (context?.mounted == true) {
      final currentLocation =
          GoRouter.of(context!).routeInformationProvider.value.location;
      if (currentLocation != '/login') {
        GoRouter.of(context!).go('/login');
      }
    }
  }
}
