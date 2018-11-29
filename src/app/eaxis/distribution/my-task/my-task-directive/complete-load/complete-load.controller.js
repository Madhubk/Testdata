(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteLoadDirectiveController", CompleteLoadDirectiveController);

    CompleteLoadDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function CompleteLoadDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var CompleteLoadCtrl = this;

        function Init() {
            CompleteLoadCtrl.ePage = {
                "Title": "",
                "Prefix": "Complete_Load",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            CompleteLoadCtrl.ePage.Masters.MyTask = CompleteLoadCtrl.taskObj;
            CompleteLoadCtrl.ePage.Masters.CompleteLoad = CompleteLoad;
            CompleteLoadCtrl.ePage.Masters.CompleteLoadText = "Complete Load";
            getGatepassDetails();
        }

        function getGatepassDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepassList.API.GetById.Url + CompleteLoadCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    CompleteLoadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        function CompleteLoad() {
            CompleteLoadCtrl.ePage.Masters.CompleteLoadText = "Please Wait..";
            CompleteLoadCtrl.ePage.Masters.GatepassDetails = filterObjectUpdate(CompleteLoadCtrl.ePage.Masters.GatepassDetails, "IsModified");
            CompleteLoadCtrl.ePage.Masters.GatepassDetails.TMSGatepassHeader.LoadOrUnloadEndTime = new Date();
            apiService.post("eAxisAPI", appConfig.Entities.TMSGatepassList.API.Update.Url, CompleteLoadCtrl.ePage.Masters.GatepassDetails).then(function (response) {
                CompleteLoadCtrl.ePage.Masters.GatepassDetails = response.data.Response;

                var _data = {
                    IsCompleted: true,
                    Item: CompleteLoadCtrl.ePage.Masters.MyTask
                };

                CompleteLoadCtrl.onComplete({
                    $item: _data
                });

                CompleteLoadCtrl.ePage.Masters.CompleteLoadText = "Complete Load";
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
            CompleteLoadCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        Init();
    }
})();
