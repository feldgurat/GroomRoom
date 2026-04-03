
from sqlmodel import exists, or_, select
from sqlmodel.ext.asyncio.session import AsyncSession
from data.models.User import User
from data.repos.BaseRepo import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_login(self, login: str) -> User | None:
        stmt = select(User).where(User.login == login)
        result = await self.session.exec(stmt)
        return result.first()