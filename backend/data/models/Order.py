from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import Field, Relationship, SQLModel

from data.models.User import User, now_time

class OrderStatus(str, Enum):
    new = "new"
    processing = "processing"
    done = "done"

class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    pet_name: str = Field(nullable=False, max_length=255)
    source_photo_path: str = Field(nullable=False)
    result_photo_path: Optional[str] = Field(default=None, nullable=True)

    status: OrderStatus = Field(default=OrderStatus.new, index=True)

    user_id: UUID = Field(
        foreign_key="users.id",
        index=True,
        ondelete="CASCADE"
    )
    user: Optional[User] = Relationship(back_populates="orders")

    created_at: datetime = Field(default_factory=now_time, index=True)
    updated_at: datetime = Field(
        default_factory=now_time,
        sa_column_kwargs={"onupdate": now_time},
        index=True
    )