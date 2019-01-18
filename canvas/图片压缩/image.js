// 压缩图片 支持单个 
// oFile 'Blob'格式
// cb 回调 blob 格式
function compressImage(oFile, cb) {
    var ready = new FileReader();
    ready.readAsDataURL(oFile);
    ready.onload = function () {
        var re = this.result;
        var img = new Image();
        img.src = re;
        img.onload = function () {
            var that = this;
            var quality = 0.4;  // 默认图片质量为0.5
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.setAttribute("width", that.width)
            canvas.setAttribute("height", that.height)
            ctx.drawImage(that, 0, 0, that.width, that.height);
            var base64 = canvas.toDataURL('image/jpeg', quality);
            var nFile = convertBase64UrlToBlob(base64);
            cb(nFile)
        }
    }
    function convertBase64UrlToBlob(urlData) {
        var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
}

// 使用 
// compressImage(e.target.files[0], function (nFile) {
//     var form = new FormData();
//     form.append("file", nFile, files[0].name);
//     $.ajax({
//         type: 'xxx',
//         url: 'xxx',
//         data: form,
//         processData: false,
//         contentType: false,
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("request_token", 'xxx');
//         },
//         success: function (re) {

//         },
//         error: function (xhr) {

//         }
//     })
// })