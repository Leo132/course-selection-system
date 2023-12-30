import {
    query,
    insert,
    update,
    delete_,
} from "./utils.js";


class Management {
    constructor(elements, table) {
        this.table = table;
        this.#init(elements);
    }

    #init(elements) {
        // input boxes
        let service_block = document.getElementById("service");
        for(let [id, [label, element]] of Object.entries(elements)) {
            let div = document.createElement("div");
            div.textContent = label;
            element.classList.add("input-text");
            element.id = id;
            div.classList.add("input-label");
            div.appendChild(element);
            service_block.appendChild(div);
            service_block.appendChild(document.createElement("br"));
        }    
        // buttons
        service_block.appendChild(this.createButtonRow(this.table));
    }    
    
    display(result, clear) {
        let result_block = document.getElementById("result");
        if(clear)
            result_block.innerHTML = '';
        for(let data of result) {
            let li = document.createElement("li");
            li.textContent = Object.values(data).join(' ');
            li.onclick = () => {
                for(let key of Object.keys(data)) {
                    document.getElementById(key).value = data[key];
                    localStorage.setItem(key, data[key]);
                }
            };
            li.classList.add("result_li");
            result_block.appendChild(li);
        }
    }

    async get_result(cols, conditions) {
        return await query(this.table, cols, conditions);
    }    

    async search(_) {
        let inputs = Array.from(document.getElementsByClassName("input-text"));
        let conditions = [];
        for(let input of inputs) {
            if(input.value === '') continue;
            conditions.push(`${input.id} = '${input.value}'`);
        }
        this.display(await this.get_result(null, conditions.length == 0 ? null : conditions), true);
    }    
    
    createButtonRow(table) {
        let button_attrs = [["新增", insert], ["修改", update], ["刪除", delete_], ["查詢", this.search]];
        let row = document.createElement("p");
        for(let [label, func] of button_attrs) {
            let button = document.createElement("button");
            button.textContent = label;
            button.classList.add("button");
            button.onclick = async () => {
                await func(table);
                location.reload();
            };    
            row.appendChild(button);
        }
        row.children[3].onclick = async () => {
            await this.search(null);
        }
        
        return row;
    }        

    async update() {
        this.display(await this.get_result(null, null), false);
    }
}


export class DepartmentManagement extends Management {
    constructor() {
        let elements = {
            "d_id": ["系碼", document.createElement("input")],
            "name_": ["系名", document.createElement("input")],
            "director": ["系主任", document.createElement("input")],
        }
        super(elements, "departments");
        super.update();
    }
}


export class CourseManagement extends Management {
    constructor() {
        let elements = {
            "c_id": ["課碼", document.createElement("input")],
            "name_": ["課名", document.createElement("input")],
            "score": ["學分數", document.createElement("input")],
        };
        super(elements, "courses");
        super.update();
    }
}


export class StudentManagement extends Management {
    constructor() {
        let select = document.createElement("select");
        let elements = {
            "s_id": ["學號", document.createElement("input")],
            "name_": ["姓名", document.createElement("input")],
            "d_id": ["系名", select],
        };
        super(elements, "students");
        this.#init_select(select);
        super.update();
    }

    async #init_select(select) {
        let departments = await query("departments", ["d_id", "name_"], null);
        for(let department of departments) {
            let option = document.createElement("option");
            option.textContent = `${department["d_id"]} ${department["name_"]}`;
            option.value = department["d_id"];
            select.add(option);
        }
    }
}    


export class SelectingManagement extends Management {
    constructor() {
        super();
    }
}


export class Services {
    constructor(active) {
        this.active_service = new {
            "#depm": DepartmentManagement,
            "#courm": CourseManagement,
            "#stum": StudentManagement,
            "#selm": SelectingManagement,
        }[active]();
    }
}