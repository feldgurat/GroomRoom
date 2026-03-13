import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends
from jose import jwt
from passlib.context import CryptContext
from sqlmodel.ext.asyncio.session import AsyncSession


from data.schemas.User import UserCreate, UserRead
from data.repos.UserRepo import UserRepository
from data.db import get_session


