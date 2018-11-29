(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdBuyerViewShipmentController", OrdBuyerViewShipmentController);

    OrdBuyerViewShipmentController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function OrdBuyerViewShipmentController($window, helperService, appConfig, apiService) {
        var OrdBuyerViewShipmentCtrl = this;

        function Init() {
            var obj = OrdBuyerViewShipmentCtrl.obj[OrdBuyerViewShipmentCtrl.obj.label].ePage.Entities;
            OrdBuyerViewShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            OrdBuyerViewShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            OrdBuyerViewShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            OrdBuyerViewShipmentCtrl.ePage.Masters.ConshpMappingList = [];

            if (!OrdBuyerViewShipmentCtrl.obj.isNew) {
                if (OrdBuyerViewShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK && OrdBuyerViewShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(OrdBuyerViewShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK);
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
                        OrdBuyerViewShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        OrdBuyerViewShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                    } else {
                        OrdBuyerViewShipmentCtrl.ePage.Masters.ConshpMappingList = [];
                    }
                });
            }
        }

        function EditSingleRecordView(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer.PK,
                Code: curEntity.UIShipment_Buyer.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
        }

        Init();
    }
})();