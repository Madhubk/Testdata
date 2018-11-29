(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GateOutDirectiveController", GateOutDirectiveController);

    GateOutDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location", "appConfig"];

    function GateOutDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location, appConfig) {
        var GateOutDirectiveCtrl = this;

        function Init() {
            GateOutDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Gate_Out",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            GateOutDirectiveCtrl.ePage.Masters.GateOutText = "Gate Out";
            GateOutDirectiveCtrl.ePage.Masters.GateOut = GateOut;
            // DatePicker
            GateOutDirectiveCtrl.ePage.Masters.DatePicker = {};
            GateOutDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            GateOutDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            GateOutDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            GateOutDirectiveCtrl.ePage.Masters.MyTask = GateOutDirectiveCtrl.taskObj;
            getGatepassDetails();
        }

        function GateOut() {
            GateOutDirectiveCtrl.ePage.Masters.GateOutText = "Please Wait..";
            GateOutDirectiveCtrl.ePage.Masters.GatepassDetails = filterObjectUpdate(GateOutDirectiveCtrl.ePage.Masters.GatepassDetails, "IsModified");
            GateOutDirectiveCtrl.ePage.Masters.GatepassDetails.TMSGatepassHeader.GateoutTime = new Date();
            apiService.post("eAxisAPI", appConfig.Entities.TMSGatepassList.API.Update.Url, GateOutDirectiveCtrl.ePage.Masters.GatepassDetails).then(function (response) {
                GateOutDirectiveCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                GateOutDirectiveCtrl.ePage.Masters.GateOutText = "Gate Out";

                var _data = {
                    IsCompleted: true,
                    Item: GateOutDirectiveCtrl.ePage.Masters.MyTask
                };

                GateOutDirectiveCtrl.onComplete({
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
            GateOutDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function getGatepassDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepassList.API.GetById.Url + GateOutDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    GateOutDirectiveCtrl.ePage.Masters.GatepassDetails = response.data.Response;
                }
            });
        }

        Init();
    }
})();
