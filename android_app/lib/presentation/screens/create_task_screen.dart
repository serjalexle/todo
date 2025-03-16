import 'package:android_app/controllers/login_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:android_app/services/api_service.dart';
import 'package:go_router/go_router.dart';

class CreateTaskScreen extends ConsumerStatefulWidget {
  const CreateTaskScreen({super.key});

  @override
  _CreateTaskScreenState createState() => _CreateTaskScreenState();
}

class _CreateTaskScreenState extends ConsumerState<CreateTaskScreen> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  bool _isLoading = false;

  Future<void> _createTask() async {
    setState(() => _isLoading = true);

    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.createTask(_titleController.text, _descriptionController.text);
      if (context.mounted) {
        context.pop(); // Повертаємось на головний екран після створення
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Помилка створення задачі: $e")),
      );
    }

    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Створити задачу")),
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
              onPressed: _isLoading ? null : _createTask,
              child: _isLoading ? const CircularProgressIndicator() : const Text("Створити"),
            ),
          ],
        ),
      ),
    );
  }
}
