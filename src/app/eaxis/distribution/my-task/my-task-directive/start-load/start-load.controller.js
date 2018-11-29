(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StartLoadDirectiveController", StartLoadDirectiveController);

    StartLoadDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function StartLoadDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var StartLoadCtrl = this;

        function Init() {
            StartLoadCtrl.ePage = {
                "Title": "",
                "Prefix": "Start_Load",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            // DatePicker
            StartLoadCtrl.ePage.Masters.DatePicker = {};
            StartLoadCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            StartLoadCtrl.ePage.Masters.DatePicker.isOpen = [];
            StartLoadCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            StartLoadCtrl.ePage.Masters.MyTask = StartLoadCtrl.taskObj;
            StartLoadCtrl.ePage.Masters.StartLoad = StartLoad;
            StartLoadCtrl.ePage.Masters.StartLoadText = "Start Load";
            getGatepassDetails();
        }

        function getGatepassDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepassList.API.GetById.Url + StartLoadCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    StartLoadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        function StartLoad() {
            StartLoadCtrl.ePage.Masters.StartLoadText = "Please Wait..";
            StartLoadCtrl.ePage.Masters.GatepassDetails = filterObjectUpdate(StartLoadCtrl.ePage.Masters.GatepassDetails, "IsModified");
            StartLoadCtrl.ePage.Masters.GatepassDetails.TMSGatepassHeader.LoadOrUnloadStartTime = new Date();
            apiService.post("eAxisAPI", appConfig.Entities.TMSGatepassList.API.Update.Url, StartLoadCtrl.ePage.Masters.GatepassDetails).then(function (response) {
                StartLoadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                StartLoadCtrl.ePage.Masters.StartLoadText = "Start Load";
                var _data = {
                    IsCompleted: true,
                    Item: StartLoadCtrl.ePage.Masters.MyTask
                };

                StartLoadCtrl.onComplete({
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
            StartLoadCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        Init();
    }
})();
