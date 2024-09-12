import MapBuilder from './class/MapBuilder.js';
import FileViewer from './class/FileViewer.js';

const reader = new FileViewer("file-reader-space", "file-reader", "close-file-reader");
const map = new MapBuilder("map.php", "folders", "back", "loading");
map.addReader(reader);
map.rename("LOCALHOST");
map.setFileIcon("assets/file.svg");
map.setFolderIcon("assets/folder.svg");

map.build();