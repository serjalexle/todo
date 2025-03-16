import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/services/storage_service.dart';

/// Модель користувача
class UserModel {
  final String id;
  final String email;

  UserModel({required this.id, required this.email});

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(id: json['_id'], email: json['email']);
  }

  Map<String, dynamic> toJson() {
    return {"_id": id, "email": email};
  }
}

/// Контролер стану користувача
class UserNotifier extends StateNotifier<UserModel?> {
  final StorageService storageService;

  UserNotifier(this.storageService) : super(null);

  /// Завантаження користувача з `SecureStorage`
  Future<void> loadUser() async {
    final userData = await storageService.getUserData();
    if (userData != null) {
      state = UserModel.fromJson(userData);
    }
  }

  /// Оновлення користувача при логіні або реєстрації
  void setUser(UserModel user) {
    state = user;
    storageService.saveUserData(user.toJson());
  }

  /// Очищення користувача при `logout`
  void clearUser() {
    state = null;
    storageService.clearUserData();
  }

  Future<void> checkAuthState(WidgetRef ref) async {
    final storageService = ref.read(storageServiceProvider);
    final userData = await storageService.getUserData();
    if (userData != null) {
      ref.read(userProvider.notifier).setUser(UserModel.fromJson(userData));
    }
  }
}

/// Провайдер `UserNotifier`
final userProvider = StateNotifierProvider<UserNotifier, UserModel?>((ref) {
  final storageService = ref.read(storageServiceProvider);
  return UserNotifier(storageService);
});
