(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VesselPlanBuyerOrcDirectiveController", VesselPlanBuyerOrcDirectiveController);

    VesselPlanBuyerOrcDirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function VesselPlanBuyerOrcDirectiveController($window, helperService, apiService, appConfig) {
        var VesselPlanBuyerOrcDirectiveCtrl = this;

        function Init() {
            VesselPlanBuyerOrcDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Spa_Mail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {
                            "UIVesselDetails": []
                        }
                    }
                }
            };

            InitVesselPlan();
        }

        function InitVesselPlan() {
            VesselPlanBuyerOrcDirectiveCtrl.ePage.Masters.MyTask = VesselPlanBuyerOrcDirectiveCtrl.taskObj;
            if (VesselPlanBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof VesselPlanBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    VesselPlanBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(VesselPlanBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }

            TaskGetById();
        }

        function TaskGetById() {
            if (VesselPlanBuyerOrcDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + VesselPlanBuyerOrcDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.UIVesselDetails = VesselPlanBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data.UIVesselDetails;
                        response.data.Response.UIVesselDetails.push(response.data.Response.UIOrder_Buyer);
                        VesselPlanBuyerOrcDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();