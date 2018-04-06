(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardMyTaskController", InwardMyTaskController);

    InwardMyTaskController.$inject = ["helperService", "appConfig", "apiService", "authService"];

    function InwardMyTaskController(helperService, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var InwardMyTaskCtrl = this;

        function Init() {
            var currentObj = InwardMyTaskCtrl.currentInward[InwardMyTaskCtrl.currentInward.label].ePage.Entities;

            InwardMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            InwardMyTaskCtrl.ePage.Masters.MyTask = {};

            GetTaskList();
        }

        function GetTaskList() {
            
            var _filter = {
                UserName: authService.getUserInfo().UserId,
                EntityRefKey: InwardMyTaskCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: InwardMyTaskCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardMyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                } else {
                    InwardMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
                }
            });
        }

        Init();
    }
})();
