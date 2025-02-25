import 'package:flutter/material.dart';
import 'package:android_app/presentation/screens/home_screen.dart';

/// Головний віджет програми
class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const HomeScreen(),
    );
  }
}
