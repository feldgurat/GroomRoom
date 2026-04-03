from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from data.models.User import Role


class UserOut(BaseModel):
    id: UUID
    name: str
    login: str
    email: EmailStr
    role: Role
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)