from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    full_name: str
    login: str
    email: EmailStr
    password: str




class UserLogin(BaseModel):
    login_or_email: str
    password: str

class UserRead(BaseModel):
    id: int
    full_name: str
    login: str
    email: str
    role: str
    created_at: str

    model_config = ConfigDict(from_attributes=True)

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class OrderOut(BaseModel):
    id: int
    pet_name: str
    status: str
    source_image_url: str
    result_image_url: str | None
    created_at: str
    updated_at: str
    owner_login: str | None = None
    owner_name: str | None = None
    can_delete: bool = False