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
            SpaMailDirectiveCtrl.ePage.Masters.PortOfLoading = undefined;
            if (SpaMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof SpaMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    SpaMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(SpaMailDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        function TaskGetById() {
            if (SpaMailDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.VesselPlanning.API.GetOrdersByVesselPk.Url + SpaMailDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            SpaMailDirectiveCtrl.ePage.Masters.SpaDetails = response.data.Response;
                            OrderGetById(response.data.Response[0].POH_FK);
                        }
                    } else {
                        SpaMailDirectiveCtrl.ePage.Masters.SpaDetails = [];
                    }
                });
            }
        }

        function OrderGetById(_orderPk) {
            var _filter = {
                "PK": _orderPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        SpaMailDirectiveCtrl.ePage.Masters.PortOfLoading = response.data.Response[0].PortOfLoading;
                    }
                } else {

                }
            });
        }

        Init();
    }
})();