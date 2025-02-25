plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.android_app"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = "27.0.12077973" // Виправлено для коректної роботи NDK

    compileOptions {
        isCoreLibraryDesugaringEnabled = true // Оновлений синтаксис
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.example.android_app"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            isMinifyEnabled = false // Вимикаємо обфускацію коду
            isShrinkResources = false // Вимикаємо видалення ресурсів
            signingConfig = signingConfigs.getByName("debug") // Підпис поки не потрібен
        }
    }
}

flutter {
    source = "../.."
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.8.22")
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.0.3") // Оновлено
}
