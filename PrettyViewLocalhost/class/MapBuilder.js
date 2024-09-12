export default class MapBuilder {
    constructor(mapLocation, output, back, loading) {

        this.racine = mapLocation;
        this.separator = "/";
        this.output = document.getElementById(output);
        this.back = document.getElementById(back);
        this.loading = document.getElementById(loading);
        this.map = [];
        this.keys = [];
        this.begin = "";
        this.currentPath = "";
        this.currentData = [];
        this.firstname = "root";

        this.back.addEventListener("click", () => {
            this.currentPath = this.begin;
            this.update();
        });

    }

    rename(firstname) {
        this.firstname = firstname;
    }

    addReader(reader) {
        this.reader = reader;
    }

    setFileIcon(file) {
        this.fileIcon = file;
    }
    setFolderIcon(folder) {
        this.folderIcon = folder;
    }
    setSeparator(separator) {
        this.separator = separator;
    }

    build() {
        this.getMap().then(data => {

            this.begin = Object.keys(data)[0].split(this.separator)[0];
            this.currentPath = this.begin;
            this.loading.remove();
            this.map = data;
            this.keys = this.getKey(data);
            this.update();
        });
    }

    async getMap() {
        const response = await fetch(this.racine);
        if (!response.ok) {
            alert("Error");
        }
        console.log(response);

        return response.json();
    }


    lvl() {
        return this.currentPath.split(this.separator).length;
    }
    update() {

        const result = document.createElement('div');
        result.classList.add('output-block');

        let nb_children = this.output.childElementCount;
        this.currentData = this.folderAt(this.currentPath, this.keys);

        this.checkLvl(nb_children);

        const head = document.createElement('div');
        head.classList.add('list');
        head.classList.add('list-head');

        const heading = document.createElement('div');
        heading.classList.add('list-heading');

        const title = this.currentDir();
        heading.textContent = title == ".." ? this.firstname : title;
        head.appendChild(heading);

        head.setAttribute('link', this.currentPath);
        if (this.containeIndex(this.currentPath)) {
            head.ondblclick = () => {
                window.location.href = head.getAttribute("link");
            };
        } else {
            head.ondblclick = () => {
                alert("can't find index");
            };
        }

        result.appendChild(head);

        const folderList = this.setContent();

        this.back.innerHTML = this.lvl();
        result.appendChild(folderList);
        this.addLvl(result);

    }
    setContent() {

        const result = document.createElement('div');
        result.classList.add("folder-list");

        this.setFolders(result);
        this.setFiles(result);

        return result;
    }
    setFolders(cible) {

        for (let i = 0; i < this.currentData.length; i++) {

            const div = document.createElement('div');
            div.setAttribute("link", this.currentPath + this.separator + this.currentData[i]);
            div.classList.add('list');

            div.onclick = () => {
                this.currentPath = div.getAttribute("link");
                this.setActive(div);
                this.update();
            };

            if (this.containeIndex(this.currentPath + this.separator + this.currentData[i])) {
                div.ondblclick = () => {
                    window.location.href = div.getAttribute("link");
                };
            } else {
                div.ondblclick = () => {
                    alert("can't find index");
                };
            }

            const img = document.createElement("img");
            img.src = this.folderIcon;
            const name = document.createElement('div');

            name.classList.add('folder-name');
            const p = document.createElement('p');
            p.textContent = this.currentData[i];
            name.appendChild(p);

            div.appendChild(img);
            div.appendChild(name);

            cible.appendChild(div);
        }
    }

    setFiles(cible) {
        const files = this.map[this.currentPath];

        if (files !== undefined) {

            for (let i = 0; i < files.length; i++) {

                const div = document.createElement('div');
                div.setAttribute("link", this.currentPath + this.separator + files[i]);
                div.classList.add('list');

                div.onclick = () => {
                    if (this.reader === undefined) {
                        alert("can't read file, add a FileViewer");
                        return;
                    } else {
                        this.reader.readFile(div.getAttribute("link"));
                    }

                };

                const img = document.createElement("img");
                img.src = this.fileIcon;
                const name = document.createElement('div');

                name.classList.add('folder-name');
                const p = document.createElement('p');
                p.textContent = files[i];
                name.appendChild(p);

                div.appendChild(img);
                div.appendChild(name);

                cible.appendChild(div);
            }
        }
    }
    containeIndex(path) {

        const list = this.map[path];
        const files = [];

        for (let i = 0; i < list.length; i++) {
            files.push(list[i].split('.')[0]);
            if (list[i].split('.')[0] == 'index') {
                return true;
            }
        }

        return false;
    }

    setActive(child) {
        const parent = child.parentNode;
        const childs = parent.childNodes;
        for (let i = 0; i < childs.length; i++) {
            childs[i].classList.remove('active');
        }
        child.classList.add('active');
    }

    checkLvl(current) {
        let nb = this.lvl();
        for (let i = current; i > nb - 1; i--) {
            this.unsetLvl();
        }
    }
    unsetLvl() {
        this.output.removeChild(this.output.lastElementChild);
    }
    addLvl(lvl) {
        this.output.appendChild(lvl);
    }
    currentDir() {
        const result = this.currentPath.split(this.separator);
        return result[result.length - 1];
    }

    getKey(obj) {
        let result = [];
        Object.keys(obj).forEach(key => {
            if (!result.includes(key)) {
                result.push(key);
            }
        });
        return result;
    }
    folderAt(path, tab) {
        let result = [];
        let current = "";
        for (let i = 0; i < tab.length; i++) {
            if (tab[i].includes(path + "/")) {
                current = tab[i].split(path)[1];
                current = current.split(this.separator);
                if (current.length == 2) {
                    result.push(current[1]);
                }
            }
        }
        return result;
    }

}
