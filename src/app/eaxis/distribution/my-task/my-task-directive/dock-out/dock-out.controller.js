(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DockOutDirectiveController", DockOutDirectiveController);

    DockOutDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function DockOutDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var DockOutDirectiveCtrl = this;

        function Init() {
            DockOutDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dock_Out",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DockOutDirectiveCtrl.ePage.Masters.MyTask = DockOutDirectiveCtrl.taskObj;
            DockOutDirectiveCtrl.ePage.Masters.DockOutText = "Dock Out";
            DockOutDirectiveCtrl.ePage.Masters.DockOut = DockOut;
            // DatePicker
            DockOutDirectiveCtrl.ePage.Masters.DatePicker = {};
            DockOutDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            DockOutDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            DockOutDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            getGatepassDetails();
        }

        function DockOut() {
            DockOutDirectiveCtrl.ePage.Masters.DockOutText = "Please Wait..";
            DockOutDirectiveCtrl.ePage.Masters.GatepassDetails = filterObjectUpdate(DockOutDirectiveCtrl.ePage.Masters.GatepassDetails, "IsModified");
            DockOutDirectiveCtrl.ePage.Masters.GatepassDetails.TMSGatepassHeader.DockoutTime = new Date();
            apiService.post("eAxisAPI", appConfig.Entities.TMSGatepassList.API.Update.Url, DockOutDirectiveCtrl.ePage.Masters.GatepassDetails).then(function (response) {
                DockOutDirectiveCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                DockOutDirectiveCtrl.ePage.Masters.DockOutText = "Dock Out";

                var _data = {
                    IsCompleted: true,
                    Item: DockOutDirectiveCtrl.ePage.Masters.MyTask
                };

                DockOutDirectiveCtrl.onComplete({
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

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            DockOutDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function getGatepassDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepassList.API.GetById.Url + DockOutDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DockOutDirectiveCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        Init();
    }
})();
