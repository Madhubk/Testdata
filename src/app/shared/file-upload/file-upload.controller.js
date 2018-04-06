(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FileUploadController", FileUploadController);

    FileUploadController.$inject = ["$scope", "$location", "APP_CONSTANT", "apiService", "helperService"];

    function FileUploadController($scope, $location, APP_CONSTANT, apiService, helperService) {
        var FileUploadCtrl = this;

        function Init() {
            FileUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "file_Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            FileUploadCtrl.ePage.Masters.ChangeFileObjToArrayWithData = ChangeFileObjToArrayWithData;
            FileUploadCtrl.ePage.Masters.OnFileChange = OnFileChange;
        }

        function ChangeFileObjToArrayWithData(files) {
            var _files = [];
            $scope.$apply(function () {
                for (var i = 0; i < files.length; i++) {
                    _files.push(files[i])
                }
            });

            _files.map(function (value, key) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    $scope.$apply(function () {
                        _files[key].Data = loadEvent.target.result.split(",")[1];
                    });
                }
                reader.readAsDataURL(files[key]);
                _files[key].Data = reader.result;
            });

            return _files;
        }

        function OnFileChange(files) {
            FileUploadCtrl.selectedFiles({
                $item: files
            });
        }

        Init();
    }
})();
