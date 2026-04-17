from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from pwdlib import PasswordHash
from sqlmodel.ext.asyncio.session import AsyncSession

from data.db import SessionDep
from data.models.User import User
from data.repos.UserRepo import UserRepository
from data.schemas.Auth import RegisterPayload
from data.schemas.Order import DeleteAnswer

password_hash = PasswordHash.recommended()


class UserService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.userRepo = UserRepository(session)

    async def create(self, payload: RegisterPayload) -> User:
        existing = await self.userRepo.get_by_login(payload.login)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Пользователь с таким логином уже существует",
            )

        user = User(
            name=payload.name,
            login=payload.login,
            email=str(payload.email),
            password_hash=password_hash.hash(payload.password),
        )
        await self.userRepo.add(user)
        await self.session.flush()
        user = await self.userRepo.get_by_login(user.login)
        assert user is not None
        return user

    async def delete_user(self, user_id: UUID) -> DeleteAnswer:
        user = await self.userRepo.get(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден",
            )
        await self.userRepo.delete(user)
        await self.session.commit()
        return DeleteAnswer(status=True, messange="Пользователь удалён")


def get_user_service(session: SessionDep) -> UserService:
    return UserService(session)


UserServiceDep = Annotated[UserService, Depends(get_user_service)]
