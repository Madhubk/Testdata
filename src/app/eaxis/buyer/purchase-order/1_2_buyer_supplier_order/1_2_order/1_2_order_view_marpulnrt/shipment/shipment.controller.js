(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_two_ReadOnlyShipmentController", one_two_ReadOnlyShipmentController);

    one_two_ReadOnlyShipmentController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function one_two_ReadOnlyShipmentController($window, helperService, appConfig, apiService) {
        var one_two_ReadOnlyShipmentCtrl = this;

        function Init() {
            var obj = one_two_ReadOnlyShipmentCtrl.obj[one_two_ReadOnlyShipmentCtrl.obj.label].ePage.Entities;
            one_two_ReadOnlyShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            one_two_ReadOnlyShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            one_two_ReadOnlyShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            one_two_ReadOnlyShipmentCtrl.ePage.Masters.ConshpMappingList = [];

            if (!one_two_ReadOnlyShipmentCtrl.obj.isNew) {
                if (one_two_ReadOnlyShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.SHP_FK && one_two_ReadOnlyShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(one_two_ReadOnlyShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.SHP_FK);
                }
            }
        }

        function GetShpConMapping(shp_pk, type) {
            var _filter = {
                'SHP_FK': shp_pk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            if (shp_pk != null) {
                apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        one_two_ReadOnlyShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        one_two_ReadOnlyShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                    } else {
                        one_two_ReadOnlyShipmentCtrl.ePage.Masters.ConshpMappingList = [];
                    }
                });
            }
        }

        function EditSingleRecordView(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer_Supplier.PK,
                Code: curEntity.UIShipment_Buyer_Supplier.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment-view?q=" + _queryString, "_blank");
        }

        Init();
    }
})();