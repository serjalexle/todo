import 'package:android_app/controllers/login_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/services/api_service.dart';
import 'package:go_router/go_router.dart';

class EditTaskScreen extends ConsumerStatefulWidget {
  final String taskId;
  const EditTaskScreen({super.key, required this.taskId});

  @override
  _EditTaskScreenState createState() => _EditTaskScreenState();
}

class _EditTaskScreenState extends ConsumerState<EditTaskScreen> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  bool _isLoading = false;

  Future<void> _updateTask() async {
    setState(() => _isLoading = true);

    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.updateTask(
        widget.taskId,
        _titleController.text,
        _descriptionController.text,
      );
      if (context.mounted) {
        context.pop(); // Повертаємось після редагування
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Помилка оновлення задачі: $e")));
    }

    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Редагувати задачу")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(labelText: "Назва задачі"),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(labelText: "Опис"),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isLoading ? null : _updateTask,
              child:
                  _isLoading
                      ? const CircularProgressIndicator()
                      : const Text("Оновити"),
            ),
          ],
        ),
      ),
    );
  }
}
