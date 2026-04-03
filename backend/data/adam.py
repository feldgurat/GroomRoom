from pwdlib import PasswordHash

from data.db import SessionLocal
from data.models.User import Role, User
from data.repos.UserRepo import UserRepository

_password_hash = PasswordHash.recommended()

ADMIN_LOGIN = "admin"
ADMIN_PASSWORD = "grooming"


async def adam() -> None:
    async with SessionLocal() as session:
        repo = UserRepository(session)
        existing = await repo.get_by_login(ADMIN_LOGIN)
        if existing is not None:
            return

        admin = User(
            name="Администратор",
            login=ADMIN_LOGIN,
            email="admin@groomroom.ru",
            password_hash=_password_hash.hash(ADMIN_PASSWORD),
            role=Role.admin,
        )
        session.add(admin)
        await session.commit()
