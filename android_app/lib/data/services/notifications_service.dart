import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'dart:io';

class NotificationsService {
  static final FlutterLocalNotificationsPlugin _notificationsPlugin =
  FlutterLocalNotificationsPlugin();

  static Future<void> init() async {
    const initializationSettings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );

    await _notificationsPlugin.initialize(initializationSettings);

    // Створюємо канал для Android 8+ (API 26+)
    const channel = AndroidNotificationChannel(
      'main_channel',
      'Основні сповіщення',
      description: 'Канал для основних сповіщень',
      importance: Importance.high,
    );

    final androidPlugin = _notificationsPlugin
        .resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    await androidPlugin?.createNotificationChannel(channel);

    // Запитуємо дозвіл для Android 13+ (API 33+)
    if (Platform.isAndroid) {
      final granted = await androidPlugin?.requestNotificationsPermission();
      print("Дозвіл на сповіщення: $granted");
    }
  }

  static Future<void> showNotification() async {
    const androidDetails = AndroidNotificationDetails(
      'main_channel',
      'Основні сповіщення',
      channelDescription: 'Канал для основних сповіщень',
      importance: Importance.high,
      priority: Priority.high,
    );

    const details = NotificationDetails(android: androidDetails);

    await _notificationsPlugin.show(
      0,
      'Привіт!',
      'Це тестове сповіщення 📢',
      details,
    );
  }
}
