import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class TaskCard extends StatefulWidget {
  final Map<String, dynamic> task;

  const TaskCard({required this.task});

  @override
  State<TaskCard> createState() => _TaskCardState();
}

class _TaskCardState extends State<TaskCard> {
  bool showFullDescription = false;

  @override
  Widget build(BuildContext context) {
    final task = widget.task;

    final statusColors = {
      'TODO': Colors.grey,
      'IN_PROGRESS': Colors.blue,
      'DONE': Colors.green,
      'CANCELED': Colors.red,
      'BLOCKED': Colors.orange,
      'OVERDUE': Colors.purple,
    };

    final priorityIcons = {
      'LOW': Icons.flag_outlined,
      'MIDDLE': Icons.flag,
      'HIGH': Icons.flag_rounded,
      'URGENT': Icons.outlined_flag,
    };

    final priorityColors = {
      'LOW': Colors.green,
      'MIDDLE': Colors.orange,
      'HIGH': Colors.deepOrange,
      'URGENT': Colors.red,
    };

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🟩 Верхній рядок: чекбокс + заголовок + статус
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Checkbox(
                  value: task['status'] == 'DONE',
                  onChanged: (value) {
                    // TODO: оновлення статусу через API
                  },
                ),
                Expanded(
                  child: Text(
                    task['title'],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color:
                        statusColors[task['status']]?.withOpacity(0.2) ??
                        Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    task['status'] ?? 'TODO',
                    style: TextStyle(
                      fontSize: 12,
                      color: statusColors[task['status']] ?? Colors.black,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 8),

            // 🟨 Опис з обрізанням
            if (task['description'] != null &&
                task['description'].toString().isNotEmpty)
              GestureDetector(
                onTap:
                    () => setState(
                      () => showFullDescription = !showFullDescription,
                    ),
                child: Text(
                  showFullDescription
                      ? task['description']
                      : task['description']
                              .toString()
                              .split(' ')
                              .take(5)
                              .join(' ') +
                          (task['description'].toString().split(' ').length > 5
                              ? '... Показати все'
                              : ''),
                  style: TextStyle(color: Colors.grey.shade700),
                ),
              ),

            const SizedBox(height: 8),

            // 🟥 Пріоритет + дедлайн + регулярність
            Row(
              children: [
                PopupMenuButton<String>(
                  padding: EdgeInsets.zero,
                  tooltip: 'Змінити пріоритет',
                  onSelected: (value) {
                    // TODO: оновити пріоритет через API
                  },
                  itemBuilder:
                      (context) => [
                        for (final level in ['LOW', 'MIDDLE', 'HIGH', 'URGENT'])
                          PopupMenuItem(value: level, child: Text(level)),
                      ],
                  child: Row(
                    children: [
                      Icon(
                        priorityIcons[task['priority']] ?? Icons.flag,
                        size: 16,
                        color:
                            priorityColors[task['priority']] ?? Colors.orange,
                      ),
                      const SizedBox(width: 4),
                      Text(task['priority'] ?? 'MIDDLE'),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                if (task['deadline'] != null)
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 16, color: Colors.teal),
                      const SizedBox(width: 4),
                      Text(task['deadline'].toString().split('T').first),
                    ],
                  ),
                const Spacer(),
                if (task['is_recurring'] == true)
                  Row(
                    children: const [
                      Icon(Icons.repeat, color: Colors.deepPurple, size: 18),
                      SizedBox(width: 4),
                      Text('Регулярна', style: TextStyle(fontSize: 12)),
                    ],
                  ),
              ],
            ),

            const SizedBox(height: 8),

            Align(
              alignment: Alignment.centerRight,
              child: IconButton(
                icon: const Icon(Icons.edit),
                onPressed: () => context.push('/edit-task/${task['_id']}'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
