import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/presentation/screens/home_screen.dart';
import 'package:android_app/presentation/screens/auth/login_screen.dart';
import 'package:android_app/presentation/screens/auth/register_screen.dart';
import 'package:android_app/presentation/screens/auth/forgot_password_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      // final isAuthenticated = ref.watch(authProvider);
      final isAuthenticated = false; // ❌ Видалено `ref.watch(authProvider)`
      if (!isAuthenticated) {
        return '/register';
      }
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => HomeScreen(),
      ), // ❌ Видалено `const`
      GoRoute(path: '/login', builder: (context, state) => LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => RegisterScreen()),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => ForgotPasswordScreen(),
      ),
    ],
  );
});
