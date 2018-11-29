(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdConfirmDirectiveController", OrdConfirmDirectiveController);

    OrdConfirmDirectiveController.$inject = ["helperService", "apiService", "appConfig"];

    function OrdConfirmDirectiveController(helperService, apiService, appConfig) {
        var OrdConfirmDirectiveCtrl = this;

        function Init() {
            OrdConfirmDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Confirm",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            InitOrderConfirmation();
        }

        function InitOrderConfirmation() {
            OrdConfirmDirectiveCtrl.ePage.Masters.MyTask = OrdConfirmDirectiveCtrl.taskObj;
            if (OrdConfirmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof OrdConfirmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    OrdConfirmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(OrdConfirmDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function TaskGetById() {
            if (OrdConfirmDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url + OrdConfirmDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        OrdConfirmDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    } else {}
                });
            }
        }

        Init();
    }
})();