import 'package:android_app/controllers/login_controller.dart';
import 'package:android_app/providers/user_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authInitProvider = FutureProvider<void>((ref) async {
  final storage = ref.read(storageServiceProvider);
  final api = ref.read(apiServiceProvider);

  final refreshToken = await storage.getRefreshToken();

  if (refreshToken != null) {
    try {
      final response = await api.refresh(); // GET auth/refresh
      final newAccessToken = response.data['access_token'];
      final user = UserModel.fromJson(response.data['result']);

      await storage.saveTokens(newAccessToken, refreshToken);
      ref.read(userProvider.notifier).setUser(user);
    } catch (e) {
      // refresh failed → не авторизований
      await storage.clearTokens();
    }
  }
});
