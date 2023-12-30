import pymysql

# lib
try:
    from datatype import Table
except ImportError:
    from lib.datatype import Table

_DATABASE = "myschooldb"


def _connect_db(database: str=None):
    import os
    from dotenv import load_dotenv

    try:
        dotenv_path = "./.env"
        load_dotenv(dotenv_path, override=True)
        db_settings = {
            "host" : "localhost",
            "port" : 3306,
            "user": os.getenv("DB_USER"),
            "password" : os.getenv("DB_PASSWORD"),
            "database": database,
            "charset" : "utf8",
        }
        conn = pymysql.connect(**db_settings)
        return conn
    except Exception as e:
        print("Error: database connecting fail...")
        print(e)

def _query(conn, query_str: str, have_result: bool=False):
    print(f"{query_str=}")        # for debugging

    with conn.cursor() as cursor:
        cursor.execute(query_str)

        if have_result:
            return cursor.description, cursor.fetchall()

    conn.commit()

def _insert_row(conn, table: Table, cols: list[str], vals: list[str]):
    vals = list(map(lambda val: f'"{val}"' if isinstance(val, str) else str(val), vals))
    query = f"insert into {table} ({', '.join(cols)}) values ({', '.join(vals)});"

    _query(conn, query)

def _update_row(conn, table: Table, cols_vals: list[str], conditions: list[str]):
    query = f"update {table} set {', '.join(cols_vals)}{' where ' + ' and '.join(conditions) if conditions else ''};"

    _query(conn, query)

def _delete_row(conn, table: Table, conditions: list[str]):
    query = f"delete from {table}{' where ' + ' and '.join(conditions) if conditions else ''};"

    _query(conn, query)

def _search(conn, query: str, cols: list[str]=None):
    descriptions, rows = _query(conn, query, True)

    if not cols:
        cols = [desc[0] for desc in descriptions]

    return [{col : r for col, r in zip(cols, row)} for row in rows]

def _search_cols(conn, table: Table, cols: list[str]=None, conditions: list[str]=None):
    query = f"select {', '.join(cols) if cols else '*'} from {table}{' where ' + ' and '.join(conditions) if conditions else ''};"

    return _search(conn, query, cols)

def sid_check(s_id: str):
    with _connect_db(_DATABASE) as conn:
        s_info = _search_cols(conn, "students", ["s_id", "name_", "d_id"], [f"s_id = '{s_id}'"])
    return {
        "is_sid_exist": len(s_info) > 0,
        "s_info": s_info,
    }

def get_data(table: str, cols: list[str], conditions: list[str]):
    with _connect_db(_DATABASE) as conn:
        result = _search_cols(conn, table, cols, conditions)
    return result

def get_departments(cols: list[str], conditions: list[str]):
    return get_data("departments", cols, conditions)

def get_courses(cols: list[str], conditions: list[str]):
    return get_data("courses", cols, conditions)

def get_students(cols: list[str], conditions: list[str]):
    return get_data("students", cols, conditions)

def insert(table: str, values: list[str]):
    with _connect_db(_DATABASE) as conn:
        _insert_row(conn, table, [], values)

def update(table: str, cols_vals: list[str], conditions: list[str]):
    with _connect_db(_DATABASE) as conn:
        _update_row(conn, table, cols_vals, conditions)

def delete(table: str, conditions: list[str]):
    with _connect_db(_DATABASE) as conn:
        _delete_row(conn, table, conditions)

def init(*, reload: bool=False):
    with _connect_db() as conn:
        if reload:
            _query(conn, f"drop database if exists {_DATABASE}")
        with open("./init.sql", 'r', encoding="utf-8") as f:
            for query in f.read().split("\n\n"):
                _query(conn, query)

if __name__ == "__main__":
    init(reload=True)