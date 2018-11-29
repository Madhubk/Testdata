(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolMyTaskController", ConsolMyTaskController);

    ConsolMyTaskController.$inject = ["helperService", "appConfig", "authService", "apiService"];

    function ConsolMyTaskController(helperService, appConfig, authService, apiService) {
        /* jshint validthis: true */
        var ConsolMyTaskCtrl = this;
        function Init() {
            var currentObj = ConsolMyTaskCtrl.currentConsol[ConsolMyTaskCtrl.currentConsol.label].ePage.Entities;
            ConsolMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            ConsolMyTaskCtrl.ePage.Masters.MyTask = {};
            if (ConsolMyTaskCtrl.listSource) {
                ConsolMyTaskCtrl.ePage.Masters.MyTask.ListSource = angular.copy(ConsolMyTaskCtrl.listSource);
            } else {
                GetMyTaskList();
            }
        }

        function GetMyTaskList() {
            var _filter = {
                UserName: authService.getUserInfo().UserId,
                EntityRefKey: ConsolMyTaskCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: ConsolMyTaskCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        ConsolMyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    }
                } else {
                    ConsolMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
                }
            });
        }

        Init();
    }
})();
