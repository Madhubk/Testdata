(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadPODirectiveController", UploadPODirectiveController);

    UploadPODirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function UploadPODirectiveController($window, helperService, apiService, appConfig) {
        var UploadPODirectiveCtrl = this;

        function Init() {
            UploadPODirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload_PO",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitPoUpload();
            TaskGetById();
        }

        function InitPoUpload() {
            UploadPODirectiveCtrl.ePage.Masters.MyTask = UploadPODirectiveCtrl.taskObj;
            if (UploadPODirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if(typeof UploadPODirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    UploadPODirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(UploadPODirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            UploadPODirectiveCtrl.ePage.Masters.OpenActivity = OpenActivity;
        }

        function TaskGetById() {
            if(UploadPODirectiveCtrl.ePage.Masters.MyTask) {
                var url = "PorOrderBatchUpload/GetById/";
                apiService.get("eAxisAPI", url + UploadPODirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        UploadPODirectiveCtrl.ePage.Masters.MyTask.CreateBy = response.data.Response.CreatedBy;
                        UploadPODirectiveCtrl.ePage.Masters.MyTask.CreateDate = response.data.Response.CreatedDateTime;
                    }
                });
            }
        }

        function OpenActivity(_obj) {
            var _queryString = {
                PK: _obj.EntityRefKey,
                BatchUploadNo: _obj.KeyReference
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/po-batch-upload/" + _queryString, "_blank");
        }

        Init();
    }
})();