from fastapi import HTTPException, status
from typing import Literal


class AppErrors:
    # ? DO NOT FORGET!!! When adding a new error, make sure to add it to the raise_error method in Literal type
    ERRORS = {
        "authentication_required": {
            "status_code": status.HTTP_401_UNAUTHORIZED,
            "detail": "This route requires authentication",
        },
        "user_not_found": {
            "status_code": status.HTTP_404_NOT_FOUND,
            "detail": "User not found",
        },
        "forbidden": {
            "status_code": status.HTTP_403_FORBIDDEN,
            "detail": "Access forbidden",
        },
        "invalid_credentials": {
            "status_code": status.HTTP_401_UNAUTHORIZED,
            "detail": "Invalid credentials provided",
        },
        "refresh_token_missing": {
            "status_code": status.HTTP_404_NOT_FOUND,
            "detail": "Refresh token is missing",
        },
    }

    @classmethod
    def raise_error(
        cls,
        error_key: Literal[
            "authentication_required",
            "invalid_credentials",
            "user_not_found",
            "forbidden",
            "refresh_token_missing",
        ],
    ):
        if error_key not in cls.ERRORS:
            raise ValueError(f"Error key '{error_key}' is not defined in AppErrors")
        raise HTTPException(**cls.ERRORS[error_key])
