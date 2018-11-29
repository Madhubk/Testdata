(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StartUnloadDirectiveController", StartUnloadDirectiveController);

    StartUnloadDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function StartUnloadDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var StartUnloadCtrl = this;

        function Init() {
            StartUnloadCtrl.ePage = {
                "Title": "",
                "Prefix": "Start_Unload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            // DatePicker
            StartUnloadCtrl.ePage.Masters.DatePicker = {};
            StartUnloadCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            StartUnloadCtrl.ePage.Masters.DatePicker.isOpen = [];
            StartUnloadCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            StartUnloadCtrl.ePage.Masters.MyTask = StartUnloadCtrl.taskObj;
            StartUnloadCtrl.ePage.Masters.StartLoad = StartLoad;
            StartUnloadCtrl.ePage.Masters.StartLoadText = "Start UnLoad";
            getGatepassDetails();
        }

        function getGatepassDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepassList.API.GetById.Url + StartUnloadCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    StartUnloadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        function StartLoad() {
            StartUnloadCtrl.ePage.Masters.StartLoadText = "Please Wait..";
            StartUnloadCtrl.ePage.Masters.GatepassDetails = filterObjectUpdate(StartUnloadCtrl.ePage.Masters.GatepassDetails, "IsModified");
            StartUnloadCtrl.ePage.Masters.GatepassDetails.TMSGatepassHeader.LoadOrUnloadStartTime = new Date();
            apiService.post("eAxisAPI", appConfig.Entities.TMSGatepassList.API.Update.Url, StartUnloadCtrl.ePage.Masters.GatepassDetails).then(function (response) {
                StartUnloadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                StartUnloadCtrl.ePage.Masters.StartLoadText = "Start UnLoad";

                var _data = {
                    IsCompleted: true,
                    Item: StartUnloadCtrl.ePage.Masters.MyTask
                };

                StartUnloadCtrl.onComplete({
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
            StartUnloadCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        Init();
    }
})();
