from enum import Enum
from pydantic import BaseModel

# for web
class Page(str, Enum):
    index = "index"

# for database
class Table(str, Enum):
    departments = "departments"
    students = "students"
    courses = "courses"
    selecting = "selecting"
