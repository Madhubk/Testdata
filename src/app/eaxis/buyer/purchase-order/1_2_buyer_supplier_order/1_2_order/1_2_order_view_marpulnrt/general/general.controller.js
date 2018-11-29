(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_two_ReadOnlyGeneralController", one_two_ReadOnlyGeneralController);

    one_two_ReadOnlyGeneralController.$inject = ["$window" ,"helperService"];

    function one_two_ReadOnlyGeneralController($window, helperService) {
        var one_two_ReadOnlyGeneralCtrl = this;

        function Init() {
            var obj = one_two_ReadOnlyGeneralCtrl.obj[one_two_ReadOnlyGeneralCtrl.obj.label].ePage.Entities;
            one_two_ReadOnlyGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "one_two_ReadOnlyGeneral",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitGeneral();
        }

        function InitGeneral() {
            one_two_ReadOnlyGeneralCtrl.ePage.Masters.SelectedShipmentRow = SelectedShipmentRow;
        }

        function SelectedShipmentRow(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer_Supplier.PK,
                Code: curEntity.UIShipment_Buyer_Supplier.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
        }

        Init();
    }
})();