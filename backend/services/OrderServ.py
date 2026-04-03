import uuid
from pathlib import Path
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, UploadFile, status
from sqlmodel.ext.asyncio.session import AsyncSession

from data.db import SessionDep
from data.models.Order import Order, OrderStatus
from data.repos.OrderRepo import OrderRepository
from data.schemas.Order import DeleteAnswer

# ─── константы ────────────────────────────────────────────────────────────────
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/bmp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".bmp"}
MAX_PHOTO_SIZE = 2 * 1024 * 1024  # 2 МБ

UPLOAD_DIR = Path("uploads")
RESULT_DIR = UPLOAD_DIR / "result"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
RESULT_DIR.mkdir(parents=True, exist_ok=True)


# ─── вспомогательная функция ──────────────────────────────────────────────────
async def _save_photo(upload: UploadFile, dest_dir: Path) -> str:
    """Валидирует и сохраняет загружаемый файл. Возвращает относительный путь."""
    # Проверяем MIME-тип
    if upload.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Допустимые форматы: JPEG, BMP",
        )

    # Проверяем расширение
    suffix = Path(upload.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Допустимые расширения: .jpg, .jpeg, .bmp",
        )

    # Читаем содержимое и проверяем размер
    content = await upload.read()
    if len(content) > MAX_PHOTO_SIZE:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Размер файла не должен превышать 2 МБ",
        )

    filename = f"{uuid.uuid4()}{suffix}"
    file_path = dest_dir / filename
    file_path.write_bytes(content)

    return str(file_path)


# ─── сервис ───────────────────────────────────────────────────────────────────
class OrderService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.orderRepo = OrderRepository(session)

    async def get_completed_orders(self, limit: int = 4) -> list[Order]:
        """Публичный список завершённых заявок (для главной страницы)."""
        return await self.orderRepo.get_completed(limit)

    async def get_my_orders(self, user_id: UUID) -> list[Order]:
        """Список заявок текущего пользователя."""
        return await self.orderRepo.get_by_user_id(user_id)

    async def create_order(
        self, user_id: UUID, pet_name: str, photo: UploadFile
    ) -> Order:
        """Создать новую заявку со статусом 'Новая'."""
        photo_path = await _save_photo(photo, UPLOAD_DIR)

        order = Order(
            pet_name=pet_name,
            source_photo_path=photo_path,
            user_id=user_id,
            status=OrderStatus.new,
        )
        await self.orderRepo.add(order)
        await self.session.commit()
        await self.session.refresh(order)
        return order

    async def delete_order(self, order_id: UUID, user_id: UUID) -> DeleteAnswer:
        """
        Удалить заявку. Разрешено только владельцу,
        если статус заявки ещё «Новая».
        """
        order = await self.orderRepo.get(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заявка не найдена",
            )
        if order.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нельзя удалить чужую заявку",
            )
        if order.status != OrderStatus.new:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Нельзя удалить заявку, которая уже обрабатывается или выполнена",
            )

        await self.orderRepo.delete(order)
        await self.session.commit()
        return DeleteAnswer(status=True, messange="Заявка удалена")

    # ── Административные методы ───────────────────────────────────────────────

    async def start_processing(self, order_id: UUID) -> Order:
        """Администратор: «Новая» → «Обработка данных»."""
        order = await self.orderRepo.get(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заявка не найдена",
            )
        if order.status != OrderStatus.new:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Перевести в обработку можно только заявку со статусом «Новая»",
            )

        order.status = OrderStatus.processing
        updated = await self.orderRepo.update(order)
        await self.session.commit()
        return updated

    async def complete_order(self, order_id: UUID, result_photo: UploadFile) -> Order:
        """Администратор: «Обработка данных» → «Услуга оказана» + фото результата."""
        order = await self.orderRepo.get(order_id)
        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заявка не найдена",
            )
        if order.status != OrderStatus.processing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Завершить можно только заявку со статусом «Обработка данных»",
            )

        result_path = await _save_photo(result_photo, RESULT_DIR)
        order.result_photo_path = result_path
        order.status = OrderStatus.done
        updated = await self.orderRepo.update(order)
        await self.session.commit()
        return updated


def get_order_service(session: SessionDep) -> OrderService:
    return OrderService(session)


OrderServiceDep = Annotated[OrderService, Depends(get_order_service)]
