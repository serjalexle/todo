import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final storageServiceProvider = Provider<StorageService>((ref) => StorageService());

class StorageService {
  final _storage = const FlutterSecureStorage();

  Future<void> saveTokens(String accessToken, String refreshToken) async {
    await _storage.write(key: "access_token", value: accessToken);
    await _storage.write(key: "refresh_token", value: refreshToken);
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: "access_token");
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: "refresh_token");
  }

  Future<void> clearTokens() async {
    await _storage.delete(key: "access_token");
    await _storage.delete(key: "refresh_token");
  }

  Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _storage.write(key: "user_data", value: jsonEncode(userData));
  }

  Future<Map<String, dynamic>?> getUserData() async {
    final userData = await _storage.read(key: "user_data");
    if (userData != null) {
      return jsonDecode(userData);
    }
    return null;
  }

  Future<void> clearUserData() async {
    await _storage.delete(key: "user_data");
  }
}
