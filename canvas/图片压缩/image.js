 return {
        link: function ($scope, iElm, iAttrs, controller) {
            function convertBase64UrlToBlob(urlData) {
                var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            }
            iElm.on("change", function (e) {
                var files = e.target.files;   
                if (files !== null && files.length !== 0) {  
                    if (files[0].size>6*1024*1024) {
                        layer.msg('上传图片文件大小不可超过6M');
                        return false
                    } 
                    var ready = new FileReader();
                    ready.readAsDataURL(document.getElementById(iAttrs.id).files[0]);              
                    ready.onload = function () {
                        var re = this.result;
                        var img = new Image();
                        img.src = re;
                        img.onload = function () {
                            var that = this;
                            var quality = 0.4;  // 默认图片质量为0.5
                            //生成canvas
                            var canvas = document.createElement('canvas');
                            var ctx = canvas.getContext('2d');
                            // 创建属性节点
                            var anw = document.createAttribute("width");
                            anw.nodeValue = that.width;
                            var anh = document.createAttribute("height");
                            anh.nodeValue = that.height;
                            canvas.setAttributeNode(anw);
                            canvas.setAttributeNode(anh);
                            ctx.drawImage(that, 0, 0, that.width, that.height);
                            // quality值越小，所绘制出的图像越模糊
                            var base64 = canvas.toDataURL('image/jpeg', quality); 
                            var bl = convertBase64UrlToBlob(base64);                            
                            var form = new FormData();// FormData 对象
                            fileName = $('#'+iAttrs.id).val();
                            var nameList = fileName.split('\\')
                            form.append("file", bl,nameList[nameList.length-1]); // 文件对象                         
                            $.ajax({
                                　　url: rooturl2 + "devRepair/uploadRepairImg",
                                　　type: "post",
                                　　data: form,
                                　　processData: false,
                                　　contentType: false,
                                　　success: function (re) {                                    　 
                                          fac.load(0);                                          
                                            console.dir(re);
                                            if (re.code == 1) {
                                                fac.success("上传成功");                                               
                                                if ($scope.fileList === null) {
                                                    $scope.fileList = [];
                                                }
                                                $scope.fileList.push({"imgUrl":re.data});                                    
                                                $('#'+iAttrs.id).val('');
                                                $scope.$apply();
                                            } else {
                                                fac.fail(re.desc);
                                            }
                                   }
                            });
                        }
                    }
                }
            });
        }
    };