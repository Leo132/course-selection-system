import {
    load_css,
} from "./utils.js"

import {
    Services
} from "./conponents.js"


window.addEventListener("load", () => {
    main();
});

function create_navigation_bar() {
    let service_label = [["#depm", "科系管理"], ["#courm", "課程管理"], ["stum", "學生管理"], ["selm", "選課管理"]];
    let navi_bar = document.getElementById("navi_bar");
    for(let [hash, label] of service_label) {
        let li = document.createElement("li");
        li.textContent = label;
        li.classList.add("navigation_tag");
        li.onclick = () => {
            location.hash = hash;
            location.reload();
        };
        navi_bar.appendChild(li);
    }
}

async function init() {
    let active = location.hash === '' ? "#depm" : location.hash;
    let subsystems = new Services(active);

    // navigation bar
    create_navigation_bar();
}

async function main() {
    await init();

    load_css("./static/style/base.css");
    load_css("./static/style/index.css");
}