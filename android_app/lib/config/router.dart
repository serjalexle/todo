import 'package:android_app/presentation/screens/create_task_screen.dart';
import 'package:android_app/presentation/screens/edit_task_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/providers/user_provider.dart';
import 'package:android_app/presentation/screens/home_screen.dart';
import 'package:android_app/presentation/screens/auth/login_screen.dart';
import 'package:android_app/presentation/screens/auth/register_screen.dart';
import 'package:android_app/presentation/screens/auth/forgot_password_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: '/', builder: (context, state) => HomeScreen()),
      GoRoute(
        path: '/create-task',
        builder: (context, state) => const CreateTaskScreen(),
      ),
      GoRoute(
        path: '/edit-task/:id',
        builder: (context, state) {
          final taskId = state.pathParameters['id']!;
          return EditTaskScreen(taskId: taskId);
        },
      ),
      GoRoute(path: '/login', builder: (context, state) => LoginScreen()),
      GoRoute(path: '/register', builder: (context, state) => RegisterScreen()),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => ForgotPasswordScreen(),
      ),
    ],
    redirect: (context, state) {
      final user = ref.read(userProvider); // Перевіряємо, чи є користувач
      final isLoggingIn = state.fullPath == '/login';
      final isRegistering = state.fullPath == '/register';
      final isResettingPassword = state.fullPath == '/forgot-password';

      // ✅ Якщо користувач авторизований, не пускати на `/register` або `/login`
      if (user != null && (isLoggingIn || isRegistering)) {
        return '/';
      }

      // ✅ Якщо користувач не авторизований, не пускати на `/`
      if (user == null && state.fullPath == '/') {
        return '/register';
      }

      return null; // ❌ Уникнення нескінченних редіректів
    },
  );
});
