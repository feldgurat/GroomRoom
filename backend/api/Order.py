from uuid import UUID

from fastapi import APIRouter, File, Form, UploadFile, status

from api.dependences import CurrentUserDep
from data.schemas.Order import DeleteAnswer, OrderOut
from services.OrderServ import OrderServiceDep

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get(
    "/public/completed-orders",
    response_model=list[OrderOut],
    summary="Публичный список последних завершённых заявок",
)
async def public_completed_orders(order_serv: OrderServiceDep) -> list[OrderOut]:
    return await order_serv.get_completed_orders(limit=4)


@router.get(
    "/my-orders",
    response_model=list[OrderOut],
    summary="Мои заявки (авторизованный пользователь)",
)
async def my_orders(user: CurrentUserDep, order_serv: OrderServiceDep) -> list[OrderOut]:
    return await order_serv.get_my_orders(user.id)


@router.post(
    "/create-order",
    response_model=OrderOut,
    status_code=status.HTTP_201_CREATED,
    summary="Создать заявку",
)
async def create_order(
    user: CurrentUserDep,
    order_serv: OrderServiceDep,
    pet_name: str = Form(...),
    photo: UploadFile = File(...),
) -> OrderOut:
    return await order_serv.create_order(user.id, pet_name, photo)


@router.delete(
    "/{order_id}",
    response_model=DeleteAnswer,
    summary="Удалить свою заявку (только статус «Новая»)",
)
async def delete_order(
    order_id: UUID,
    user: CurrentUserDep,
    order_serv: OrderServiceDep,
) -> DeleteAnswer:
    return await order_serv.delete_order(order_id, user.id)
