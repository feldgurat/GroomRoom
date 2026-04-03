import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


_CYRILLIC_RE = re.compile(r"^[А-ЯЁа-яё\s]+$")
_LOGIN_RE = re.compile(r"^[A-Za-z\-]+$")


class RegisterPayload(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str = Field(min_length=1, max_length=255)
    login: str = Field(min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)
    password_repeat: str = Field(min_length=1, max_length=128)
    consent: bool

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not _CYRILLIC_RE.match(v):
            raise ValueError("ФИО должно содержать только кириллические буквы и пробелы")
        return v

    @field_validator("login")
    @classmethod
    def validate_login(cls, v: str) -> str:
        if not _LOGIN_RE.match(v):
            raise ValueError("Логин должен содержать только латиницу и дефис")
        return v

    @model_validator(mode="after")
    def validate_register(self) -> "RegisterPayload":
        if self.password != self.password_repeat:
            raise ValueError("Пароли не совпадают")
        if not self.consent:
            raise ValueError("Необходимо дать согласие на обработку персональных данных")
        return self


class LoginPayload(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    login: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=1, max_length=128)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
