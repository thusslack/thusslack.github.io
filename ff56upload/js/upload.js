function uploadFile(file) {
    // add time loggers
    console.time('load');
    console.time('error');
    console.time('abort');
    console.time('upload');

    var url = '/';
    var xhr;
    var chunkSize = 1024 * 1024 * 2;

    if(window.XMLHttpRequest)       xhr = new XMLHttpRequest();
    else if(window.ActiveXObject)   xhr = new ActiveXObject("Microsoft.XMLHTTP");
    var sliceMethod = data.slice ? 'slice' : (data.webkitSlice ? 'webkitSlice' : (data.mozSlice ? 'mozSlice' : false));



    xhr.open("POST", url, true);
    //xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.setRequestHeader("X_FILENAME", encodeURIComponent(file.name));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // handle response
            console.log('request completed successful', xhr.readyState, xhr.status, xhr.responseText);
        } else {
            // handle error
            console.log('request error', xhr.readyState, xhr.status, xhr.responseText);
        }
        console.timeEnd('upload');
    };
    xhr.addEventListener('abort', function(e) { console.timeEnd('abort'); });
    xhr.addEventListener('error', function(e) { console.timeEnd('error'); });
    xhr.addEventListener('load', function(e) {  console.timeEnd('load'); });
    xhr.addEventListener('progress', function(e) {
        var done = e.position || e.loaded, total = e.totalSize || e.total;
        console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
    }, false);

    // send first chunk of chunksize
    xhr.send(file[sliceMethod](chunkSize));
}

var uploadfiles = document.querySelector('#uploads');
uploadfiles.addEventListener('change', function () {
    var file = this.files[0];
    console.log("file to upload:", file);
    uploadFile(file); // call the function to upload the file
}, false);
