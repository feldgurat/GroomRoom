
from sqlmodel import exists, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from data.models.User import User
from data.repos.BaseRepo import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    async def exists_by_email(self, email: str, session: AsyncSession) -> bool:
        stmt = select(exists().where(User.email == email))
        return bool(await session.scalar(stmt))
    
    async def exists_by_login(self, login: str, session: AsyncSession) -> bool:
        stmt = select(exists().where(User.login == login))
        return bool(await session.scalar(stmt))
    
    async def exists_by_contact_number(self, contact_number: str, session: AsyncSession) -> bool:
        stmt = select(exists().where(User.contact_number == contact_number))
        return bool(await session.scalar(stmt))
    
    async def get_by_login_or_email(self, login_or_email: str, session: AsyncSession) -> User | None:
        stmt = (
            select(User)
            .where(or_(User.login == login_or_email, User.email == login_or_email))
            .limit(1)
        )
        result = await session.exec(stmt)
        return result.first()