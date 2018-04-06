(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AsnirUpdateLineDirectiveController", AsnirUpdateLineDirectiveController);

    AsnirUpdateLineDirectiveController.$inject = ["$scope", "$timeout", "$uibModal", "APP_CONSTANT", "apiService", "helperService", "$window", "$location"];

    function AsnirUpdateLineDirectiveController($scope, $timeout, $uibModal, APP_CONSTANT, apiService, helperService, $window, $location) {
        var AsnirUpdateLineDirectiveCtrl = this;

        function Init() {
            AsnirUpdateLineDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Asnir_Update_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            AsnirUpdateLineDirectiveCtrl.ePage.Masters.MyTask = AsnirUpdateLineDirectiveCtrl.taskObj;

            AsnirUpdateLineDirectiveCtrl.ePage.Masters.GoToInward = GoToInward;

            getInwardDetails();
        }

        function GoToInward(details) {
            var _queryString = {
                PK: details.EntityRefKey,
                WorkOrderID: details.KeyReference
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/WMS/inward?a=" + _queryString);
        }

        function getInwardDetails() {
            var _filter = {
                "PK": AsnirUpdateLineDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "WMSINW"
            };

            apiService.post("eAxisAPI", "WmsInward/FindAll", _input).then(function (response) {
                if (response.data.Response) {
                    AsnirUpdateLineDirectiveCtrl.ePage.Masters.InwardDetails = response.data.Response[0];
                }
            });
        }

        Init();
    }
})();
