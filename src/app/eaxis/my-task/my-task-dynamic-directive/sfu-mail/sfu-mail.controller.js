(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuMailDirectiveController", SfuMailDirectiveController);

    SfuMailDirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function SfuMailDirectiveController($window, helperService, apiService, appConfig) {
        var SfuMailDirectiveCtrl = this;

        function Init() {
            SfuMailDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_Mail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitPoUpload();
            TaskGetById();
        }

        function InitPoUpload() {
            SfuMailDirectiveCtrl.ePage.Masters.MyTask = SfuMailDirectiveCtrl.taskObj;
            if (SfuMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof SfuMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string"){
                    SfuMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(SfuMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        function TaskGetById() {
            if(SfuMailDirectiveCtrl.ePage.Masters.MyTask) {
                // var url = "CargoReadiness/FollowUpGroup/GetGroupHeaderByGroupId/";
                apiService.get("eAxisAPI", appConfig.Entities.CargoReadiness.API.GetGroupHeaderByGroupId.Url + SfuMailDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        SfuMailDirectiveCtrl.ePage.Masters.MyTask.CreateBy = response.data.Response.CreatedBy;
                        SfuMailDirectiveCtrl.ePage.Masters.MyTask.CreateDate = response.data.Response.CreatedDateTime;
                        SfuMailDirectiveCtrl.ePage.Masters.MyTask.Shipper = response.data.Response.Supplier;
                        SfuMailDirectiveCtrl.ePage.Masters.MyTask.Buyer = response.data.Response.Buyer;
                    }
                });
            }
        }

        Init();
    }
})();