from __future__ import annotations

from abc import ABC
from typing import Generic, TypeVar
from uuid import UUID

from sqlmodel import SQLModel, select
from sqlmodel.ext.asyncio.session import AsyncSession

ModelT = TypeVar("ModelT", bound=SQLModel)


class BaseRepository(ABC, Generic[ModelT]):
    def __init__(self, model: type[ModelT], session: AsyncSession) -> None:
        self.session = session
        self.model = model


    async def add(self, obj: ModelT) -> ModelT:
        self.session.add(obj)
        await self.session.flush()
        return obj

    async def get(self, pk: UUID) -> ModelT | None:
        return await self.session.get(self.model, pk)

    async def list(self) -> list[ModelT]:
        stmt = select(self.model)
        result = await self.session.exec(stmt)
        return list(result.all())

    async def delete(self, obj: ModelT) -> None:
        await self.session.delete(obj)
        await self.session.flush()

    async def update(self, obj: ModelT) -> ModelT:
        merged = await self.session.merge(obj)
        await self.session.flush()
        await self.session.refresh(merged)
        return merged