from uuid import UUID
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from data.models.Order import Order, OrderStatus
from data.repos.BaseRepo import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self):
        super().__init__(Order)

    async def get_orders_with_status(self, status: OrderStatus, session: AsyncSession, limit = 100, skip = 0):
        stmt = select(Order).where(Order.status == status).offset(skip).limit(limit)
        return await list(session.exec(stmt).all())
    
    async def list_by_user_id(
        self,
        user_id: UUID,
        session: AsyncSession,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Order]:
        safe_limit = max(1, min(limit, 200))
        safe_offset = max(0, offset)

        stmt = (
            select(Order)
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .limit(safe_limit)
            .offset(safe_offset)
        )
        result = await session.exec(stmt)
        return result.all()