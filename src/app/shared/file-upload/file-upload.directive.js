(function () {
    "use strict";

    angular
        .module("Application")
        .directive("fileUpload", FileUpload);

    FileUpload.$inject = [];

    function FileUpload() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/file-upload/file-upload.html",
            controller: "FileUploadController",
            controllerAs: "FileUploadCtrl",
            scope: {
                selectedFiles: "&"
            },
            link: Link,
            bindToController: true
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            ele.on('dragenter', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            ele.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.originalEvent.dataTransfer) {
                    if (e.originalEvent.dataTransfer.files.length > 0) {
                        var _files = scope.FileUploadCtrl.ePage.Masters.ChangeFileObjToArrayWithData(e.originalEvent.dataTransfer.files);
                        scope.FileUploadCtrl.ePage.Masters.OnFileChange(_files);
                    }
                }
                return false;
            });

            ele.on("change", function (e) {
                var _files = scope.FileUploadCtrl.ePage.Masters.ChangeFileObjToArrayWithData(e.target.files);
                scope.FileUploadCtrl.ePage.Masters.OnFileChange(_files);
            });
        }
    }
})();
