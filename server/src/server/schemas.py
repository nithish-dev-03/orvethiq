from pydantic import BaseModel

class CreateUser(BaseModel):
    user_name: str
    password: str

class UserSchema(BaseModel):
    pass

class User(CreateUser):
    id: int
    
    class Config:
        from_attributes = True
