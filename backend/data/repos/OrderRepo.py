from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from data.models.Order import Order, OrderStatus
from data.repos.BaseRepo import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(Order, session)

    async def get_completed(self, limit: int = 4) -> list[Order]:
        stmt = (
            select(Order)
            .where(Order.status == OrderStatus.done)
            .order_by(Order.created_at.desc())
            .limit(limit)
        )
        result = await self.session.exec(stmt)
        return list(result.all())

    async def get_all(self) -> list[Order]:
        stmt = select(Order).order_by(Order.created_at.desc()) 
        result = await self.session.exec(stmt)
        return list(result.all())

    async def get_by_user_id(self, user_id: UUID) -> list[Order]:
        stmt = (
            select(Order)
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        )
        result = await self.session.exec(stmt)
        return list(result.all())
