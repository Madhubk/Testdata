(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityPageOrderShipmentController", ActivityPageOrderShipmentController);

    ActivityPageOrderShipmentController.$inject = ["$window", "helperService", "appConfig", "apiService", "myTaskActivityConfig"];

    function ActivityPageOrderShipmentController($window, helperService, appConfig, apiService, myTaskActivityConfig) {
        var ActivityPageOrderShipmentCtrl = this;

        function Init() {
            var obj = myTaskActivityConfig.Entities.Order[myTaskActivityConfig.Entities.Order.label].ePage.Entities;
            ActivityPageOrderShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            ActivityPageOrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            ActivityPageOrderShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            ActivityPageOrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];

            if (!ActivityPageOrderShipmentCtrl.obj.isNew) {
                if (ActivityPageOrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK && ActivityPageOrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(ActivityPageOrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK);
                }
            }
        }

        function GetShpConMapping(shp_pk, type) {
            var _filter = {
                'SHP_FK': shp_pk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerConShpMapping.API.FindAll.FilterID
            };
            if (shp_pk != null) {
                apiService.post("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ActivityPageOrderShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        ActivityPageOrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                    } else {
                        ActivityPageOrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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
            $window.open("#/EA/single-record-view/shipment-view?q=" + _queryString, "_blank");
        }

        Init();
    }
})();