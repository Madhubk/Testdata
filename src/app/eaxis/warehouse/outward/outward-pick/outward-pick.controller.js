(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardPickController", OutwardPickController);

    OutwardPickController.$inject = ["$scope", "$state", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "$injector", "$window", "toastr", "confirmation"];

    function OutwardPickController($scope, $state, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, $injector, $window, toastr, confirmation) {

        var OutwardPickCtrl = this;

        function Init() {

            var pickDetails = OutwardPickCtrl.pickDetails;

            OutwardPickCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Pick",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": pickDetails,
            };

            OutwardPickCtrl.ePage.Masters.emptyText = ' - ';

            OutwardPickCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            OutwardPickCtrl.ePage.Masters.GoToReleasePage = GoToReleasePage;

            GeneralValues();

        }

        function GoToReleasePage() {
            var _queryString = {
                PK: OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.PK,
                PickNo: OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.PickNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/outwardrelease/" + _queryString, "_blank");
        }

        function GeneralValues() {
            if (OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.WarehouseCode == null)
                OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.WarehouseCode = '';

            if (OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.WarehouseName == null)
                OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.WarehouseName = '';

            OutwardPickCtrl.ePage.Masters.Warehouse = OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.WarehouseCode + ' - ' + OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.WarehouseName;

            if (OutwardPickCtrl.ePage.Masters.Warehouse == ' - ')
                OutwardPickCtrl.ePage.Masters.Warehouse = '';

        }

        function SingleRecordView() {
            var _queryString = {
                PK: OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.PK,
                PickNo: OutwardPickCtrl.ePage.Entities.UIWmsPickHeader.PickNo,
                ConfigName:"pickConfig"
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/outwardpick/" + _queryString, "_blank");
        }

        Init();
    }

})();