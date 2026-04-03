from datetime import timedelta

from fastapi import APIRouter, HTTPException, status

from api.dependences import CurrentUserDep
from data.schemas.Auth import LoginPayload, RegisterPayload, Token
from data.schemas.User import UserOut
from services.AuthServ import AuthServiceDep
from services.UserServ import UserServiceDep

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterPayload,
    service: UserServiceDep,
):
    user = await service.create(payload)
    await service.session.commit()
    return user

@router.post("/login", response_model=Token)
async def login(
    payload: LoginPayload,
    service: AuthServiceDep,
):
    data = payload.model_dump()
    user = await service.authenticate_user(data["login"], data['password'])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = await service.create_access_token(
        data={"sub": user.login, "ver": user.token_version},
        expires_delta=timedelta(minutes=15)
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/logout")
async def logout(
    current_user: CurrentUserDep,
    service: AuthServiceDep,
):
    await service.inc_token_version(current_user)
    await service.session.commit()
    return {"status": "ok"}