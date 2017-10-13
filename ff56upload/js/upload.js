function uploadFile(file) {
    var url = '/';
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // handle response
            console.log(xhr.readyState, xhr.status, xhr.responseText);
        } else {
            // handle error
            console.log(xhr.readyState, xhr.status, xhr.responseText);
        }
    };
    formData.append("upload_file", file);
    xhr.send(formData);
}

var uploadfiles = document.querySelector('#uploads');
uploadfiles.addEventListener('change', function () {
    var files = this.files;
    for (var i = 0, len = files.length; i < len; i++) {
        uploadFile(this.files[i]); // call the function to upload the file
    }
}, false);
