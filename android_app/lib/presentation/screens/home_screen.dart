import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/data/services/notifications_service.dart';

/// Головний екран
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('I am Player')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => NotificationsService.showNotification(),
          child: const Text('Надіслати сповіщення'),
        ),
      ),
    );
  }
}
