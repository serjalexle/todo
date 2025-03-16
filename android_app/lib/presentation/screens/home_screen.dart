import 'package:android_app/controllers/login_controller.dart';
import 'package:android_app/presentation/widgets/custom_app_bar.dart';
import 'package:android_app/services/api_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// Провайдер для отримання списку задач
final tasksProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final apiService = ref.read(apiServiceProvider);
  final response = await apiService.getTasks();
  return List<Map<String, dynamic>>.from(response.data['result']['tasks']);
});

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tasksAsync = ref.watch(tasksProvider);

    return Scaffold(
      appBar: const CustomAppBar(title: 'Задачі'),
      body: tasksAsync.when(
        data: (tasks) => tasks.isEmpty
            ? const Center(child: Text("Немає задач"))
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: tasks.length,
                itemBuilder: (context, index) {
                  final task = tasks[index];
                  return Card(
                    child: ListTile(
                      title: Text(task['title']),
                      subtitle: Text(task['description'] ?? 'Без опису'),
                      trailing: IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => context.push('/edit-task/${task['_id']}'),
                      ),
                    ),
                  );
                },
              ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text("Помилка: $error")),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/create-task'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
