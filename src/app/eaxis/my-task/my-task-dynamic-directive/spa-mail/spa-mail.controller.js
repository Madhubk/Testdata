(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SpaMailDirectiveController", SpaMailDirectiveController);

    SpaMailDirectiveController.$inject = ["$window", "helperService", "apiService", "appConfig"];

    function SpaMailDirectiveController($window, helperService, apiService, appConfig) {
        var SpaMailDirectiveCtrl = this;

        function Init() {
            SpaMailDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Spa_Mail",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitPoUpload();
            TaskGetById();
        }

        function InitPoUpload() {
            SpaMailDirectiveCtrl.ePage.Masters.MyTask = SpaMailDirectiveCtrl.taskObj;
            if (SpaMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof SpaMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string"){
                    SpaMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(SpaMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        function TaskGetById() {
            if(SpaMailDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.VesselPlanning.API.GetPPAGroupHeaderByVesselPk.Url + SpaMailDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        SpaMailDirectiveCtrl.ePage.Masters.MyTask.CreateBy = response.data.Response[0].CreatedBy;
                        SpaMailDirectiveCtrl.ePage.Masters.MyTask.CreateDate = response.data.Response[0].CreatedDateTime;
                        SpaMailDirectiveCtrl.ePage.Masters.MyTask.Shipper = response.data.Response[0].SupplierCode;
                        SpaMailDirectiveCtrl.ePage.Masters.MyTask.Buyer = response.data.Response[0].BuyerCode;
                        SpaMailDirectiveCtrl.ePage.Masters.MyTask.TransportMode = response.data.Response[0].TransportMode;
                    }
                });
            }
        }

        Init();
    }
})();