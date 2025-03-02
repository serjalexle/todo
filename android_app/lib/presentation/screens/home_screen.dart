import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
// import 'package:android_app/providers/auth_provider.dart';

class HomeScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // final isAuthenticated = ref.watch();

    // if (!isAuthenticated) {
    //   Future.microtask(() => context.go('/login'));
    //   return const Scaffold(body: Center(child: CircularProgressIndicator()));
    // }

    return Scaffold(
      appBar: AppBar(title: const Text("Головна")),
      // body: Center(
      //   child: ElevatedButton(
      //     onPressed: () => ref.read(authProvider.notifier).logout(),
      //     child: const Text("Вийти"),
      //   ),
      // ),
    );
  }
}
