from core.models.user import User
import core.db  as db
from core.config import cfg
from core.auth import pwd_context
import time
import os
def init_user():
    try:
      username,password=os.getenv("USERNAME", "admin"),os.getenv("PASSWORD", "admin@888")
      db.DB.create_tables()
      db.DB.session.add(User(
          id=0,
          username=username,
          password_hash=pwd_context.hash(password),
          ))
      db.DB.session.commit()
    except Exception as e:
        print("init user error",e)
def init():
    init_user()
if __name__ == '__main__':
    init()