import 'package:android_app/presentation/widgets/language_switcher.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class HomePage extends StatelessWidget {
  final bool isDarkMode;
  final VoidCallback onToggleTheme;
  final VoidCallback onChangeLanguage;

  const HomePage({
    super.key,
    required this.isDarkMode,
    required this.onToggleTheme,
    required this.onChangeLanguage,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          AppLocalizations.of(context)?.appTitle ?? 'Завантаження...',
        ),
        centerTitle: true,
        backgroundColor: Colors.deepOrange,
        actions: [
          IconButton(
            icon: Icon(isDarkMode ? Icons.dark_mode : Icons.light_mode),
            onPressed: onToggleTheme,
          ),
          LanguageSwitcher(onTap: onChangeLanguage),
        ],
      ),
      body: Center(
        child: Text(
          AppLocalizations.of(context)?.greeting ?? 'Завантаження...',
          style: const TextStyle(fontSize: 24),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }
}
