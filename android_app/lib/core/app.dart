import 'package:android_app/l10n/app_localizations.dart';
import 'package:android_app/presentation/screens/home_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  bool _isDarkMode = false;
  Locale _currentLocale = const Locale('en');

  void _toggleTheme() {
    setState(() {
      _isDarkMode = !_isDarkMode;
    });
  }

  void _changeLanguage() {
    setState(() {
      _currentLocale =
          _currentLocale.languageCode == 'en'
              ? const Locale('uk')
              : const Locale('en');
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
      locale: _currentLocale,
      supportedLocales: L10n.supportedLocales,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: HomePage(
        isDarkMode: _isDarkMode,
        onToggleTheme: _toggleTheme,
        onChangeLanguage: _changeLanguage,
      ),
    );
  }
}
