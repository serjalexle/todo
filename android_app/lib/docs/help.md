lib/
├── core/               # Загальні утиліти, налаштування, теми
├── data/               # Дані (моделі, API-запити, БД)
├── domain/             # Бізнес-логіка (менеджер стану)
├── presentation/       # UI-дизайн (екрани, віджети)
├── main.dart           # Головний файл додатка




clear
flutter clean
flutter pub get
flutter run



lib/
├── main.dart               # Точка входу (аналог index.tsx)
├── core/                   # Глобальні утиліти, API, теми
│   ├── theme.dart          # Глобальні стилі
│   ├── constants.dart      # Константи
│   ├── api.dart            # Робота з API
│   ├── router.dart         # Роутинг (аналог react-router)
│   ├── providers.dart      # Riverpod-провайдери (глобальний стан)
│   ├── storage.dart        # SharedPreferences (локальне сховище)
│
├── features/               # Фічі додатку (аналог папки "components")
│   ├── home/               # Фіча "Головна сторінка"
│   │   ├── home_screen.dart # Віджет головної сторінки
│   │   ├── home_controller.dart # Логіка бізнесу (аналог useState)
│   │   ├── home_service.dart # API-запити (аналог axios)
│   │   ├── home_widget.dart # UI-компоненти (аналог окремих компонентів у React)
│   │
│   ├── notifications/       # Фіча "Сповіщення"
│   │   ├── notification_service.dart  # Робота зі сповіщеннями
│
├── widgets/                # Загальні UI-компоненти (аналог "UI-контролів")
│   ├── button.dart         # Кастомні кнопки
│   ├── card.dart           # Карточки
│
├── data/                   # Робота з даними (аналог Redux store)
│   ├── models/             # Моделі даних
│   ├── repositories/        # Запити до API
│
├── presentation/           # UI-частина (аналог "pages" в Next.js)
│   ├── screens/            # Екрани (аналог "pages")
│   │   ├── home_screen.dart
│   │   ├── settings_screen.dart
│   │
│   ├── widgets/            # Повторювані UI-елементи
│
├── domain/                 # Бізнес-логіка (аналог "services" в React)
│   ├── usecases/           # Юзкейси (дії користувача)
│   ├── entities/           # Чисті об'єкти (аналог "DTOs")
│
├── app.dart                # Головний віджет програми (аналог _app.tsx)
├── generated_plugin_registrant.dart  # Flutter-генерований код
├── pubspec.yaml            # Аналог package.json (залежності)
├── android/                # Налаштування Android
├── ios/                    # Налаштування iOS
