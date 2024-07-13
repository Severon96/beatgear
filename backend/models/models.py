from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class User(BaseModel):
    id: UUID
    username: UUID
    first_name: str
    last_name: str
    created_at: datetime
    updated_at: datetime
