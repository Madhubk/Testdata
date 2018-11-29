(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteUnloadDirectiveController", CompleteUnloadDirectiveController);

    CompleteUnloadDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function CompleteUnloadDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var CompleteUnloadCtrl = this;

        function Init() {
            CompleteUnloadCtrl.ePage = {
                "Title": "",
                "Prefix": "Complete_Unload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            CompleteUnloadCtrl.ePage.Masters.MyTask = CompleteUnloadCtrl.taskObj;
            CompleteUnloadCtrl.ePage.Masters.CompleteLoad = CompleteLoad;
            CompleteUnloadCtrl.ePage.Masters.CompleteLoadText = "Complete UnLoad";
            getGatepassDetails();
        }


        function getGatepassDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepassList.API.GetById.Url + CompleteUnloadCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    CompleteUnloadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        function CompleteLoad() {
            CompleteUnloadCtrl.ePage.Masters.CompleteLoadText = "Please Wait..";
            CompleteUnloadCtrl.ePage.Masters.GatepassDetails = filterObjectUpdate(CompleteUnloadCtrl.ePage.Masters.GatepassDetails, "IsModified");
            CompleteUnloadCtrl.ePage.Masters.GatepassDetails.TMSGatepassHeader.LoadOrUnloadEndTime = new Date();
            apiService.post("eAxisAPI", appConfig.Entities.TMSGatepassList.API.Update.Url, CompleteUnloadCtrl.ePage.Masters.GatepassDetails).then(function (response) {
                CompleteUnloadCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                CompleteUnloadCtrl.ePage.Masters.CompleteLoadText = "Complete UnLoad";

                var _data = {
                    IsCompleted: true,
                    Item: CompleteUnloadCtrl.ePage.Masters.MyTask
                };

                CompleteUnloadCtrl.onComplete({
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
            CompleteUnloadCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        Init();
    }
})();
