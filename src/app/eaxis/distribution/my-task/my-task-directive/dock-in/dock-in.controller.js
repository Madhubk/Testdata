(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AllocateDockDirectiveController", AllocateDockDirectiveController);

    AllocateDockDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function AllocateDockDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var AllocateDockCtrl = this;

        function Init() {
            AllocateDockCtrl.ePage = {
                "Title": "",
                "Prefix": "Allocate_Dock",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            AllocateDockCtrl.ePage.Masters.MyTask = AllocateDockCtrl.taskObj;
            AllocateDockCtrl.ePage.Masters.DockInText = "Dock In";
            AllocateDockCtrl.ePage.Masters.DockIn = DockIn;
            getGatepassDetails();
        }

        function DockIn() {
            AllocateDockCtrl.ePage.Masters.DockInText = "Please Wait..";
            AllocateDockCtrl.ePage.Masters.GatepassDetails = filterObjectUpdate(AllocateDockCtrl.ePage.Masters.GatepassDetails, "IsModified");
            AllocateDockCtrl.ePage.Masters.GatepassDetails.TMSGatepassHeader.DockinTime = new Date();
            apiService.post("eAxisAPI", appConfig.Entities.TMSGatepassList.API.Update.Url, AllocateDockCtrl.ePage.Masters.GatepassDetails).then(function (response) {
                AllocateDockCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                AllocateDockCtrl.ePage.Masters.DockInText = "Dock In";

                var _data = {
                    IsCompleted: true,
                    Item: AllocateDockCtrl.ePage.Masters.MyTask
                };

                AllocateDockCtrl.onComplete({
                    $item: _data
                });
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function getGatepassDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepassList.API.GetById.Url + AllocateDockCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    AllocateDockCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        Init();
    }
})();
