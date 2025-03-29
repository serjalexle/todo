import 'package:android_app/controllers/login_controller.dart';
import 'package:android_app/presentation/widgets/custom_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/presentation/widgets/task_card.dart';

// * Провайдер для отримання списку задач з бекенду
final tasksProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final apiService = ref.read(apiServiceProvider);
  final response = await apiService.getTasks(page: 1, count: 10);
  return List<Map<String, dynamic>>.from(response.data['result']['tasks']);
});

// * Основний екран зі списком задач
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tasksAsync = ref.watch(tasksProvider);

    return Scaffold(
      appBar: const CustomAppBar(title: 'Задачі'),

      body: tasksAsync.when(
        data:
            (tasks) => RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(tasksProvider);
                await ref.refresh(tasksProvider.future);
              },
              child:
                  tasks.isEmpty
                      ? ListView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        children: const [
                          Padding(
                            padding: EdgeInsets.all(32),
                            child: Center(child: Text('Немає задач')),
                          ),
                        ],
                      )
                      : ListView.builder(
                        physics: const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.all(16),
                        itemCount: tasks.length,
                        itemBuilder: (context, index) {
                          final task = tasks[index];

                          return TaskCard(task: task);
                        },
                      ),
            ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Помилка: $error')),
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/create-task'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
