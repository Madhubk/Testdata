(function () {
    "use strict";

    angular
        .module("Application")
        .directive("fileUploadModal", FileUploadModal);

    FileUploadModal.$inject = ["$uibModal"];

    function FileUploadModal($uibModal) {
        var exports = {
            restrict: "EA",
            scope: {
                taskName: "=",
                selectedFiles: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            ele.on("click", function ($event) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "file-upload-modal left",
                    scope: scope,
                    templateUrl: "app/shared/file-upload-modal/file-upload-modal.html",
                    controller: 'FileUploadModalController',
                    controllerAs: "FileUploadModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "fieldName": "File Upload"
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {
                        scope.selectedFiles({
                            $item: response
                        });
                    },
                    function () {
                        console.log("Cancelled");
                    }
                );
            });
        }
    }
})();
