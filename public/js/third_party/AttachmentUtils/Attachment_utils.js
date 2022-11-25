export const BASE64_MARKER = ';base64,';

// Takes a file size (in bytes) and returns a human-friendly string representation.
export const humanFileSize = function (size) {
    if (size < 1) return "0 bytes";
    // http://stackoverflow.com/a/20732091
    var factor = 1000; // Technically it should be 1024, but looks like most apps use 1000...
    var i = Math.floor(Math.log(size) / Math.log(factor));
    return (size / Math.pow(factor, i)).toFixed(1) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

// Does the given URL (string) look like a base64-encoded URL?
export const isDataURI = function (url) {
    return url.split(BASE64_MARKER).length === 2;
};

// Converts a data URI string into a File object.
export const dataURItoFile = function (dataURI) {
    if (!isDataURI(dataURI)) { return false; }

    // Format of a base64-encoded URL:
    // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAEOCAIAAAAPH1dAAAAK
    var mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
    var filename = 'dataURI-file-' + (new Date()).getTime() + '.' + mime.split('/')[1];
    var bytes = atob(dataURI.split(BASE64_MARKER)[1]);
    var writer = new Uint8Array(new ArrayBuffer(bytes.length));

    for (var i = 0; i < bytes.length; i++) {
        writer[i] = bytes.charCodeAt(i);
    }

    return new File([writer.buffer], filename, { type: mime });
};