import 'package:android_app/presentation/screens/home_screen.dart';
import 'package:android_app/providers/user_provider.dart';
import 'package:android_app/services/api_service.dart';
import 'package:android_app/services/storage_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final isLoadingProvider = StateProvider<bool>((ref) => false);
final apiServiceProvider = Provider<ApiService>((ref) => ApiService(ref));
final storageServiceProvider = Provider<StorageService>(
  (ref) => StorageService(),
);

void login(
  BuildContext context,
  WidgetRef ref,
  String email,
  String password,
) async {
  if (email.isEmpty || password.isEmpty) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text("Введіть email і пароль")));
    return;
  }

  ref.read(isLoadingProvider.notifier).state = true;

  try {
    final apiService = ref.read(apiServiceProvider);
    final storageService = ref.read(storageServiceProvider);
    final response = await apiService.login(email.trim(), password.trim());

    final accessToken = response.data['access_token'];
    final refreshToken = response.data['refresh_token'];
    final user = UserModel.fromJson(response.data['result']);

    // 🔹 Зберігаємо токени у `flutter_secure_storage`
    await storageService.saveTokens(accessToken, refreshToken);

    // 🔹 Зберігаємо користувача в `userProvider`
    ref.read(userProvider.notifier).setUser(user);

    debugPrint("Успішний вхід: ${response.data}");
    if (context.mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Вхід успішний!")));

      // 🔹 Перекидаємо користувача на головну (автоматичний вхід)
      ref.invalidate(tasksProvider); // <– Очищає старий кеш і змушує перезапитати
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
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(errorMessage)));
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
