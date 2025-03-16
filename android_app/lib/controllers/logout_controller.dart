import 'package:android_app/providers/user_provider.dart';
import 'package:android_app/services/api_service.dart';
import 'package:android_app/services/storage_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

void logout(BuildContext context, WidgetRef ref) async {
  final apiServiceProvider = Provider<ApiService>((ref) => ApiService(ref));
  final storageService = ref.read(storageServiceProvider);
  final apiService = ref.read(apiServiceProvider);

  try {
    await apiService.logout(); // 🔹 Запит на бекенд для логауту (необов'язково)

    // 🔹 Очищаємо токени і користувача
    await storageService.clearTokens();
    ref.read(userProvider.notifier).clearUser();

    debugPrint("Користувач вийшов з системи.");

    if (context.mounted) {
      // 🔹 Перенаправлення на сторінку логіну
      context.go('/login');
    }
  } on DioException catch (e) {
    debugPrint("Logout Error: ${e.response?.data ?? e.message}");
  } catch (e) {
    debugPrint("Невідома помилка під час виходу: $e");
  }
}
