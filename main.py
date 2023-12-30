'''
Web backend
'''

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# ./lib
from lib.datatype import Page, Table
from lib.db_f import (
    sid_check,
    get_departments, get_courses, get_students,
    insert, update, delete
)

_TITLE = "選課查詢系統"

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

prep = lambda s: s if s is None else s.replace('>', '=').split(';')

# get method
@app.get("/query/{type_}")
def query(type_: Table, cols: str=None, conditions: str=None):
    print(f"{type_=}")
    print(f"{cols=}")
    print(f"{conditions=}")
    data = {
        "departments": get_departments,
        "courses": get_courses,
        "students": get_students,
    }[type_](prep(cols), prep(conditions))

    return data

@app.get("/insert")
def insert_(table: str, values: str):
    insert(table, prep(values))

@app.get("/update")
def update_(table: str, cols_values: str, conditions: str):
    update(table, prep(cols_values), prep(conditions))

@app.get("/delete")
def delete_(table: str, conditions: str):
    delete(table, prep(conditions))

@app.get("/{page}", response_class=HTMLResponse)
async def load_page(request: Request, page: Page):
    print(f"load {page}.html...")
    kwargs = {
        "request": request,
        "title": _TITLE,
    }

    return templates.TemplateResponse(f"{page}.html", kwargs)

# post method

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="localhost",
        port=8000,
        reload=True
    )