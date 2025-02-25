import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/core/app.dart';
import 'package:android_app/data/services/notifications_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await NotificationsService.init(); // Ініціалізуємо сповіщення
  runApp(const ProviderScope(child: App()));
}
