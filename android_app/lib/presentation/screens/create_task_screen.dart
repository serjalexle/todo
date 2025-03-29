import 'package:android_app/controllers/login_controller.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:android_app/services/api_service.dart';

class CreateTaskScreen extends ConsumerStatefulWidget {
  const CreateTaskScreen({super.key});

  @override
  _CreateTaskScreenState createState() => _CreateTaskScreenState();
}

class _CreateTaskScreenState extends ConsumerState<CreateTaskScreen> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _assignedToController = TextEditingController();
  final TextEditingController _recurrenceIntervalController =
      TextEditingController();

  bool _isLoading = false;
  DateTime? _deadline;

  String _selectedPriority = 'MIDDLE';
  String _selectedStatus = 'TODO';
  String _selectedRecurrenceUnit = 'DAY';
  bool _isRecurring = false;
  final Set<int> _selectedWeekdays = {};

  Future<void> _createTask() async {
    setState(() => _isLoading = true);

    try {
      final apiService = ref.read(apiServiceProvider);

      final payload = {
        'title': _titleController.text.trim(),
        'description': _descriptionController.text.trim(),
        'assigned_to':
            _assignedToController.text.trim().isEmpty
                ? null
                : _assignedToController.text.trim(),
        'priority': _selectedPriority,
        'status': _selectedStatus,
        'deadline': _deadline?.toUtc().toIso8601String(),
        'is_recurring': _isRecurring,
        'recurrence_interval':
            _isRecurring
                ? int.tryParse(_recurrenceIntervalController.text)
                : null,
        'recurrence_unit': _isRecurring ? _selectedRecurrenceUnit : null,
        'recurrence_weekdays': _isRecurring ? _selectedWeekdays.toList() : null,
      };

      await apiService.createTaskFromJson(payload);

      if (context.mounted) context.pop();
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Помилка створення задачі: $e")));
    }

    setState(() => _isLoading = false);
  }

  Future<void> _selectDeadline() async {
    final now = DateTime.now();
    final selectedDate = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: now,
      lastDate: DateTime(now.year + 5),
    );

    if (selectedDate != null) {
      setState(() => _deadline = selectedDate);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Створити задачу")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(labelText: "Назва задачі"),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(labelText: "Опис"),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _assignedToController,
              decoration: const InputDecoration(
                labelText: "ID виконавця (опціонально)",
              ),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _selectedPriority,
              items:
                  ['LOW', 'MIDDLE', 'HIGH', 'URGENT']
                      .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                      .toList(),
              onChanged: (value) => setState(() => _selectedPriority = value!),
              decoration: const InputDecoration(labelText: "Пріоритет"),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _selectedStatus,
              items:
                  [
                        'TODO',
                        'IN_PROGRESS',
                        'DONE',
                        'CANCELED',
                        'BLOCKED',
                        'OVERDUE',
                      ]
                      .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                      .toList(),
              onChanged: (value) => setState(() => _selectedStatus = value!),
              decoration: const InputDecoration(labelText: "Статус"),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Text(
                    _deadline == null
                        ? 'Дедлайн не вибрано'
                        : 'Дедлайн: ${_deadline!.toLocal().toString().split(' ')[0]}',
                  ),
                ),
                TextButton(
                  onPressed: _selectDeadline,
                  child: const Text("Обрати дату"),
                ),
              ],
            ),
            const Divider(height: 32),
            SwitchListTile(
              value: _isRecurring,
              onChanged: (val) => setState(() => _isRecurring = val),
              title: const Text("Зробити задачу регулярною"),
            ),
            if (_isRecurring) ...[
              TextField(
                controller: _recurrenceIntervalController,
                decoration: const InputDecoration(
                  labelText: "Інтервал повторення (наприклад, 1)",
                ),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _selectedRecurrenceUnit,
                items:
                    ['MINUTE', 'HOUR', 'DAY', 'WEEK']
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                onChanged:
                    (value) => setState(() => _selectedRecurrenceUnit = value!),
                decoration: const InputDecoration(
                  labelText: "Одиниця інтервалу",
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: List.generate(7, (index) {
                  final weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
                  return FilterChip(
                    label: Text(weekdays[index]),
                    selected: _selectedWeekdays.contains(index),
                    onSelected: (val) {
                      setState(() {
                        if (val) {
                          _selectedWeekdays.add(index);
                        } else {
                          _selectedWeekdays.remove(index);
                        }
                      });
                    },
                  );
                }),
              ),
            ],
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _createTask,
              child:
                  _isLoading
                      ? const CircularProgressIndicator()
                      : const Text("Створити задачу"),
            ),
          ],
        ),
      ),
    );
  }
}
