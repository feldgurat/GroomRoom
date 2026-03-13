from typing import Any, Generic, List, TypeVar
from uuid import UUID

from sqlmodel import SQLModel, select

from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("M", bound=SQLModel)

class BaseRepository(Generic[T]):
    def __init__(self, model: T):
        self.model = model
    
    async def save_entity(self, entity: T, session: AsyncSession):
        session.add(entity)
        await session.flush()
        await session.refresh(entity)
        return entity
    
    async def update_entity(self, id: UUID, data: dict[str, Any], session: AsyncSession):
        entity = session.get(self.model, id)
        for key, val in  data.items():
            setattr(entity, key, val)
        session.add(entity)
        await session.flush()
        await session.refresh(entity)
        return entity
    
    async def delete_entity(self, id: UUID, session: AsyncSession) -> bool:
        entity = await session.get(self.model, id)
        if entity is None:
            return False

        await self.session.delete(entity)
        await self.session.flush()
        return True
    
    async def get_entity(self, id: UUID, session: AsyncSession):
        return await session.get(self.model, id)
    
    async def get_entities(self, session: AsyncSession, limit: int = 100, skip: int = 0) -> List[T]:
        stmt = select(self.model).offset(skip).limit(limit)
        return await list(session.exec(stmt).all())