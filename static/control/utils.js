

export async function query(type_, cols, conditions) {
    let args = (cols != null ? `cols=${cols.join(';')}` : '') +
               (conditions != null ? `&conditions=${conditions.join(';')}` : '');
    return await fetch(`http://localhost:8000/query/${type_}?${args}`)
        .then((response) => { return response.json(); });
}

export async function insert(table) {
    let values = Array.from(document.getElementsByClassName("input-text")).map((input) => input.value);
    let args = `table=${table}` +
               (values != null ? `&values=${values.join(';')}` : '');
    return await fetch(`http://localhost:8000/insert?${args}`)
        .then((response) => { return response.json(); });
}

export async function update(table) {
    let inputs = Array.from(document.getElementsByClassName("input-text"));
    let cols_values = [];
    let conditions = [];
    for(let input of inputs) {
        let arr = localStorage.getItem(input.id) === input.value ? conditions : cols_values;
        arr.push(`${input.id} = '${input.value}'`);
    }
    let args = `table=${table}` +
               (cols_values != null ? `&cols_values=${cols_values.join(';')}` : '') +
               (conditions != null ? `&conditions=${conditions.join(';')}` : '');
    return await fetch(`http://localhost:8000/update?${args}`)
        .then((response) => { return response.json(); });
}

export async function delete_(table) {
    let inputs = Array.from(document.getElementsByClassName("input-text"));
    let conditions = [];
    for(let input of inputs)
        conditions.push(`${input.id} = '${input.value}'`);
    let args = `table=${table}` +
               (conditions != null ? `&conditions=${conditions.join(';')}` : '');
    return await fetch(`http://localhost:8000/delete?${args}`)
        .then((response) => { return response.json(); });
}

export async function post_data(url, data) {
    return await fetch(url, {
        method: "POST",                         // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)              // body data type must match "Content-Type" header
    }).then((response) => response.json());
}

export function load_css(file) {
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = file;
    document.getElementsByTagName("head")[0].appendChild(link);
}
