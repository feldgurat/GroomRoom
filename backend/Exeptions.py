from typing import Any

from fastapi import HTTPException


class ApiError(HTTPException):
    def __init__(self, status_code: int, message: str, field: str | None = None):
        detail: dict[str, Any] = {"message": message}
        if field:
            detail["field"] = field
        super().__init__(status_code=status_code, detail=detail)