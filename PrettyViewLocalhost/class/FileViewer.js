export default class FileViewer {
    constructor(panel, output, close) {

        this.spacefileOutput = document.getElementById(panel);
        this.fileOutput = document.getElementById(output);
        this.spacefileOutputClose = document.getElementById(close);

        this.txtExt = ['md', 'sql', 'txt', 'html', 'css', 'php', 'js', 'json'];
        this.imgExt = ['png', 'jpg', 'jpeg', 'gif', 'ico', 'svg'];
        this.videoExt = ['mp4', 'mp3'];

        this.spacefileOutputClose.addEventListener('click', () => {
            this.hideFile();
        });
    }

    addTxtExt(ext) {
        this.txtExt.push(ext);
    }
    addImgExt(ext) {
        this.imgExt.push(ext);
    }
    addVideoExt(ext) {
        this.videoExt.push(ext);
    }

    showFile() {
        this.spacefileOutput.style.display = 'flex';
    }

    hideFile() {

        this.fileOutput.innerHTML = '';
        this.spacefileOutput.style.display = 'none';
    }


    getExt(path) {
        const tab = path.split('.');
        return tab[tab.length - 1];
    }
    basename(filePath) {
        return filePath.split('/').pop();
    }

    readFile(path) {

        const ext = this.getExt(path);

        if (this.txtExt.includes(ext)) {

            fetch(path)
                .then(response => response.text())
                .then(data => {

                    this.putText(this.basename(path), data);
                    this.showFile();

                })
                .catch(error => {
                    console.error('Erreur :', error);
                });
        } else if (this.imgExt.includes(ext)) {

            this.putImg(this.basename(path), path);
            this.showFile();

        } else if (this.videoExt.includes(ext)) {

            this.putVideo(this.basename(path), path);
            this.showFile();

        } else {
            alert("impossible de lire ce fichier");
        }

    }

    putText(title, data) {
        this.fileOutput.innerHTML = '';

        const pre = document.createElement('pre');
        const head = document.createElement('div');
        head.classList.add('space-file-head');

        head.textContent = title;
        pre.textContent = data;

        this.fileOutput.appendChild(head);
        this.fileOutput.appendChild(pre);
    }

    putImg(title, path) {
        this.fileOutput.innerHTML = '';

        const head = document.createElement('div');
        head.classList.add('space-file-head');

        head.textContent = title;
        this.fileOutput.appendChild(head);

        const img = document.createElement('img');
        img.classList.add('space-file-img');
        img.src = path;
        this.fileOutput.appendChild(img);
    }

    putVideo(title, path) {
        this.fileOutput.innerHTML = '';

        const head = document.createElement('div');
        head.classList.add('space-file-head');

        head.textContent = title;
        this.fileOutput.appendChild(head);

        const video = document.createElement('video');
        video.setAttribute('controls', true);
        video.setAttribute('autoplay', true);
        video.setAttribute('type', "video/mp4");
        video.classList.add('space-file-video');
        video.src = path;
        this.fileOutput.appendChild(video);
    }
}
