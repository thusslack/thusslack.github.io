var logs = document.getElementById('logs'),
    url = 'receiver.txt',
    // set chunksize to 2 mb
    chunkSize = 1024 * 1024 * 2;

/**
 * ajax wrapper
 *
 * @param payload
 * @param filename
 */
function sendData(payload, filename) {
    // add time logger
    var tu = performance.now();

    // set xhr method
    var xhr;
    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
    else if (window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");

    // add listeners
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 1) {
            logs.value += 'Connection opened: ' + (performance.now() - tu) + ' \n';
        }
        if (xhr.readyState === 4) {
            console.log('request completed successful', xhr.readyState, xhr.status);
            logs.value += 'Upload complete: ' + (performance.now() - tu) + ' \n\n';
        }
    };
    xhr.addEventListener('abort', function (e) {
        logs.value += 'Abort: ' + (performance.now() - tu) + ' \n';
    });
    xhr.addEventListener('error', function (e) {
        logs.value += 'Error: ' + (performance.now() - tu) + ' \n';
    });
    xhr.addEventListener('progress', function (e) {
        var done = e.position || e.loaded, total = e.totalSize || e.total;
        var msg = 'xhr progress: ' + (Math.floor(done / total * 1000) / 10) + '%';
        logs.value += msg + '\n';
    }, false);

    // open connection
    xhr.open("POST", url, true);
    if (filename) {
        xhr.setRequestHeader("X_FILENAME", encodeURIComponent(filename));
    }
    // send payload
    xhr.send(payload);
}

function uploadFile(file) {
    sendData(file);
}

function chunkInput(file) {
    var sliceMethod = file.slice ? 'slice' : (file.webkitSlice ? 'webkitSlice' : (file.mozSlice ? 'mozSlice' : false));
    return file[sliceMethod](0, chunkSize);
}

/**
 * prepares a file chunk to upload
 *
 * @param file
 */
function uploadFileChunked(file) {
    // set slice method if file available
    if (file) {
        sendData(chunkInput(file));
    }
}

/**
 * uses suggested filereader bytearray conversion workaround to generate a blob for upload
 *
 * @param file
 */
function uploadFileChunkedByteArray(file) {
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
        var payload = new Blob([e.target.result]);
        console.log("payload", payload);
        sendData(payload, file.name);
    }, false);
    reader.readAsArrayBuffer(chunkInput(file));
}

/**
 * uses suggested filereader bytearray conversion workaround to generate a blob for upload
 *
 * @param file
 */
function uploadFileByteArray(file) {
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
        var payload = new Blob([e.target.result]);
        console.log("payload", payload);
        sendData(payload, file.name);
    }, false);
    reader.readAsArrayBuffer(file);
}

// setup ajax buttons
document.getElementById('upload').addEventListener('click', function () {
    var file = document.querySelector('#uploads').files[0];
    logs.value += 'Sending full file ' + file.name + '\n';
    logs.value += '--- \n';
    uploadFile(file, file.name);
}, false);

document.getElementById('upload_c').addEventListener('click', function () {
    var file = document.querySelector('#uploads').files[0];
    logs.value += 'Sending chunked file ' + file.name + '\n';
    logs.value += '--- \n';
    uploadFileChunked(file, file.name);
}, false);

document.getElementById('upload_ba').addEventListener('click', function () {
    var file = document.querySelector('#uploads').files[0];
    logs.value += 'Sending byte array file ' + file.name + '\n';
    logs.value += '--- \n';
    uploadFileByteArray(file);
}, false);
document.getElementById('upload_bac').addEventListener('click', function () {
    var file = document.querySelector('#uploads').files[0];
    logs.value += 'Sending byte array chunked file ' + file.name + '\n';
    logs.value += '--- \n';
    uploadFileChunkedByteArray(file);
}, false);

// test empty request timing
logs.value += 'Sending empty request \n';
logs.value += '--- \n';
uploadFile('');

