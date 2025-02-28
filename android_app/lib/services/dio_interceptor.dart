import 'package:dio/dio.dart';
import 'secure_storage_service.dart';

class AuthInterceptor extends Interceptor {
  final Dio dio;
  AuthInterceptor(this.dio);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await SecureStorageService.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    super.onRequest(options, handler);
  }

  @override
  void onError(DioError err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final refreshToken = await SecureStorageService.getRefreshToken();
      if (refreshToken != null) {
        try {
          final response = await dio.post(
            'https://api.example.com/refresh',
            data: {'refreshToken': refreshToken},
          );

          final newAccessToken = response.data['accessToken'];
          await SecureStorageService.saveTokens(newAccessToken, refreshToken);

          final retryRequest = await dio.fetch(err.requestOptions);
          return handler.resolve(retryRequest);
        } catch (e) {
          await SecureStorageService.deleteTokens();
        }
      }
    }
    super.onError(err, handler);
  }
}
