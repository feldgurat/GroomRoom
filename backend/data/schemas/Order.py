from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from data.models.Order import OrderStatus



class OrderOut(BaseModel):
    id: UUID
    pet_name: str
    source_photo_path: str
    result_photo_path: str | None = None
    status: OrderStatus
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderWithOwnerOut(OrderOut):
    owner_login: str | None = None
    owner_name: str | None = None
    can_delete: bool = False

class DeleteAnswer(BaseModel):
    status: bool
    messange: str