import 'package:android_app/services/api_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final isLoadingProvider = StateProvider<bool>((ref) => false);
final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

void login(BuildContext context, WidgetRef ref, String email, String password) async {
  if (email.isEmpty || password.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Введіть email і пароль")),
    );
    return;
  }

  ref.read(isLoadingProvider.notifier).state = true;

  try {
    final apiService = ref.read(apiServiceProvider);
    final response = await apiService.login(email.trim(), password.trim());

    debugPrint("Успішний вхід: ${response.data}");
    if (context.mounted) {
      context.go('/');
    }
  } on DioException catch (e) {
    String errorMessage = "Помилка входу. Спробуйте ще раз.";

    if (e.response?.data is Map<String, dynamic>) {
      final errorData = e.response!.data as Map<String, dynamic>;
      errorMessage = errorData["detail"] ?? errorMessage;
    } else {
      errorMessage = "Помилка з'єднання або некоректні дані.";
    }

    debugPrint("Login Error: $errorMessage");
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(errorMessage)));
    }
  } catch (e) {
    debugPrint("Невідома помилка: $e");
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Невідома помилка. Спробуйте пізніше.")),
      );
    }
  }

  ref.read(isLoadingProvider.notifier).state = false;
}
