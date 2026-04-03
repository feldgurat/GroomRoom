from uuid import UUID

from fastapi import APIRouter, File, UploadFile

from api.dependences import CurrentAdminDep
from data.schemas.Order import DeleteAnswer, OrderOut
from services.OrderServ import OrderServiceDep
from services.UserServ import UserServiceDep

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post(
    "/orders/{order_id}/start-processing",
    response_model=OrderOut,
    summary="Сменить статус заявки: «Новая» → «Обработка данных»",
)
async def start_processing(
    order_id: UUID,
    _admin: CurrentAdminDep,
    order_serv: OrderServiceDep,
) -> OrderOut:
    return await order_serv.start_processing(order_id)


@router.post(
    "/orders/{order_id}/complete",
    response_model=OrderOut,
    summary="Сменить статус заявки: «Обработка данных» → «Услуга оказана» (с фото результата)",
)
async def complete_order(
    order_id: UUID,
    _admin: CurrentAdminDep,
    order_serv: OrderServiceDep,
    result_photo: UploadFile = File(...),
) -> OrderOut:
    return await order_serv.complete_order(order_id, result_photo)


@router.delete(
    "/users/{user_id}",
    response_model=DeleteAnswer,
    summary="Удалить пользователя (администратор)",
)
async def delete_user(
    user_id: UUID,
    _admin: CurrentAdminDep,
    user_serv: UserServiceDep,
) -> DeleteAnswer:
    return await user_serv.delete_user(user_id)
