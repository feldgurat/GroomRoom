from fastapi import APIRouter, Depends, HTTPException, status

from data.schemas.User import UserCreate, UserRead, UserLogin
from services.AuthServ import AuthService, get_auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/api/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(
    payload: UserCreate,
    service: AuthService = Depends(get_auth_service),
):
    try:
        return await service.register(payload)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


# @router.post("/login", response_model=TokenPair)
# async def login(
#     payload: UserLogin,
#     service: AuthService = Depends(get_auth_service),
# ):
#     tokens = await service.login(payload.login_or_email, payload.password)
#     if not tokens:
#         raise HTTPException(status_code=401, detail="Неверный логин или пароль")
#     return tokens
