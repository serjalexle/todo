import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/providers/auth_provider.dart';
import 'package:android_app/presentation/screens/home_screen.dart';
import 'package:android_app/presentation/screens/auth/login_screen.dart';
import 'package:android_app/presentation/screens/auth/register_screen.dart';
import 'package:android_app/presentation/screens/auth/forgot_password_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isLoggedIn = ref.read(authProvider); // Отримуємо статус авторизації
      final currentLocation = state.uri.toString(); // ✅ НОВИЙ API

      final isGoingToAuth = currentLocation == '/login' || currentLocation == '/register' || currentLocation == '/forgot-password';

      if (!isLoggedIn && !isGoingToAuth) {
        return '/login'; // Якщо користувач не залогінений, відправляємо його на логін
      }

      if (isLoggedIn && isGoingToAuth) {
        return '/'; // Якщо вже залогінений, не даємо зайти на логін/реєстрацію
      }

      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => const RegisterScreen()),
      GoRoute(path: '/forgot-password', builder: (context, state) => const ForgotPasswordScreen()),
    ],
  );
});
