import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  static String get baseUrl {
    if (kReleaseMode) {
      return const String.fromEnvironment('API_BASE_URL');
    }
    return dotenv.env['API_BASE_URL'] ?? '';
  }
}
