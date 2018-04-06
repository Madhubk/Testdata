(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FileUploadModalController", FileUploadModalController);

    FileUploadModalController.$inject = ["$scope", "$location", "$uibModalInstance", "APP_CONSTANT", "apiService", "helperService"];

    function FileUploadModalController($scope, $location, $uibModalInstance, APP_CONSTANT, apiService, helperService) {
        var FileUploadModalCtrl = this;

        function Init() {
            FileUploadModalCtrl.ePage = {
                "Title": "",
                "Prefix": "file_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            FileUploadModalCtrl.ePage.Masters.FileList = [];

            FileUploadModalCtrl.ePage.Masters.Ok = Ok;
            FileUploadModalCtrl.ePage.Masters.Cancel = Cancel;
            FileUploadModalCtrl.ePage.Masters.SelectedFiles = SelectedFiles;
            FileUploadModalCtrl.ePage.Masters.RemoveList = RemoveList;
        }

        function Ok() {
            $uibModalInstance.close(FileUploadModalCtrl.ePage.Masters.FileList);
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function SelectedFiles($item) {
            $item.map(function (value, key) {
                FileUploadModalCtrl.ePage.Masters.FileList.push(value);
            });
        }

        function RemoveList(selectedItem, index) {
            FileUploadModalCtrl.ePage.Masters.FileList.splice(index, 1);
        }

        Init();
    }
})();
