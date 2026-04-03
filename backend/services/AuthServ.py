from datetime import datetime, timedelta, timezone
import os
from typing import Annotated

import jwt
from fastapi import Depends
from pwdlib import PasswordHash
from sqlmodel.ext.asyncio.session import AsyncSession

from data.db import SessionDep
from data.models.User import User
from data.repos.UserRepo import UserRepository

SECRET_KEY = os.getenv("JWT_SECRET", "NE CHITAI ETO TAINA")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

password_hasher = PasswordHash.recommended()


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.usersRepo = UserRepository(session)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Синхронная проверка пароля (pwdlib.verify — не корутина)."""
        return password_hasher.verify(plain_password, hashed_password)

    async def authenticate_user(self, username: str, password: str) -> User | None:
        user = await self.usersRepo.get_by_login(username)
        if not user:
            return None
        if not self.verify_password(password, user.password_hash):
            return None
        return user

    async def create_access_token(
        self,
        data: dict,
        expires_delta: timedelta | None = None,
    ) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (
            expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        to_encode["exp"] = expire
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    async def inc_token_version(self, user: User) -> None:
        user.token_version += 1
        await self.usersRepo.update(user)


def get_auth_service(session: SessionDep) -> AuthService:
    return AuthService(session)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
