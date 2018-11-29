(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneConsolMyTaskController", ThreeOneConsolMyTaskController);

    ThreeOneConsolMyTaskController.$inject = ["helperService", "appConfig", "authService", "apiService"];

    function ThreeOneConsolMyTaskController(helperService, appConfig, authService, apiService) {
        /* jshint validthis: true */
        var ThreeOneConsolMyTaskCtrl = this;
        function Init() {
            var currentObj = ThreeOneConsolMyTaskCtrl.currentConsol[ThreeOneConsolMyTaskCtrl.currentConsol.label].ePage.Entities;
            ThreeOneConsolMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            ThreeOneConsolMyTaskCtrl.ePage.Masters.MyTask = {};

            if (ThreeOneConsolMyTaskCtrl.listSource) {
                ThreeOneConsolMyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(ThreeOneConsolMyTaskCtrl.listSource);
            } else {
                GetMyTaskList();
            }
        }

        function GetMyTaskList() {
            var _filter = {
                UserName: authService.getUserInfo().UserId,
                EntityRefKey: ThreeOneConsolMyTaskCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: ThreeOneConsolMyTaskCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        ThreeOneConsolMyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    }
                } else {
                    ThreeOneConsolMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
                }
            });
        }

        Init();
    }
})();
