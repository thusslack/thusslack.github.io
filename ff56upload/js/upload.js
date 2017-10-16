function uploadFile(file) {
    var url = '/';
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type","multipart/form-data");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // handle response
            console.log(xhr.readyState, xhr.status, xhr.responseText);
        } else {
            // handle error
            console.log(xhr.readyState, xhr.status, xhr.responseText);
        }
    };
    xhr.addEventListener('progress', function(e) {
        var done = e.position || e.loaded, total = e.totalSize || e.total;
        console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
    }, false);

    formData.append("upload_file", file);
    xhr.send(formData);
}

var uploadfiles = document.querySelector('#uploads');
uploadfiles.addEventListener('change', function () {
    var files = this.files;
    console.log("files to upload:", files);
    for (var i = 0, len = files.length; i < len; i++) {
        uploadFile(this.files[i]); // call the function to upload the file
    }
}, false);
