from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from backend.data.models.Order import OrderStatus




class OrderRead(BaseModel):
    id: int
    pet_name: str
    status: OrderStatus
    source_image_url: str
    result_image_url: str | None
    created_at: str
    updated_at: str
    owner_login: str | None = None
    owner_name: str | None = None
    can_delete: bool = False
