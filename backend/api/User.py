from fastapi import APIRouter, status

from api.dependences import CurrentUserDep
from data.schemas.User import UserOut
from services.UserServ import UserServiceDep


router = APIRouter(prefix="/user", tags=["User"])


@router.get("/me", response_model=UserOut, status_code=status.HTTP_200_OK)
async def read_me(current_user: CurrentUserDep) -> UserOut:
    return UserOut(**current_user.model_dump())