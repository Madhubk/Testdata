(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SfuCRDUpdateDirectiveController", SfuCRDUpdateDirectiveController);

    SfuCRDUpdateDirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function SfuCRDUpdateDirectiveController($window, helperService, apiService, appConfig) {
        var SfuCRDUpdateDirectiveCtrl = this;

        function Init() {
            SfuCRDUpdateDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "SFU_CRD_Update",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitPoUpload();
            TaskGetById();
        }

        function InitPoUpload() {
            SfuCRDUpdateDirectiveCtrl.ePage.Masters.MyTask = SfuCRDUpdateDirectiveCtrl.taskObj;
            if (SfuCRDUpdateDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof SfuCRDUpdateDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    SfuCRDUpdateDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(SfuCRDUpdateDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        function TaskGetById() {
            if (SfuCRDUpdateDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.CargoReadiness.API.GetOrdersByGroupId.Url + SfuCRDUpdateDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        SfuCRDUpdateDirectiveCtrl.ePage.Masters.CRDDetails = response.data.Response;
                    } else {
                        SfuCRDUpdateDirectiveCtrl.ePage.Masters.CRDDetails = [];
                    }
                });
            }
        }
        Init();
    }
})();