from typing import TYPE_CHECKING
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum
from datetime import datetime, timezone

if TYPE_CHECKING:
    from data.models.Order import Order

def now_time() -> datetime:
    return datetime.now(timezone.utc)

class Role(str, Enum):
    user = "user"
    admin = "admin"

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    name: str = Field(max_length=255)
    login: str = Field(index=True, unique=True, max_length=255)
    email: str = Field(index=True, unique=True, max_length=255)
    password_hash: str = Field()

    role: Role = Field(default=Role.user, index=True)
    orders: list["Order"] = Relationship(back_populates="user")

    created_at: datetime = Field(default_factory=now_time)