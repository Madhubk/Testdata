(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderViewDefaultShipmentController", OrderViewDefaultShipmentController);

    OrderViewDefaultShipmentController.$inject = ["$window", "helperService", "appConfig", "apiService"];

    function OrderViewDefaultShipmentController($window, helperService, appConfig, apiService) {
        var OrderViewDefaultShipmentCtrl = this;

        function Init() {
            var obj = OrderViewDefaultShipmentCtrl.obj[OrderViewDefaultShipmentCtrl.obj.label].ePage.Entities;
            OrderViewDefaultShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "OneTwoReadOnlyShipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": obj
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            OrderViewDefaultShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            OrderViewDefaultShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            OrderViewDefaultShipmentCtrl.ePage.Masters.ConshpMappingList = [];

            if (!OrderViewDefaultShipmentCtrl.obj.isNew) {
                if (OrderViewDefaultShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.SHP_FK && OrderViewDefaultShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(OrderViewDefaultShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.SHP_FK);
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
                        OrderViewDefaultShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        OrderViewDefaultShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                    } else {
                        OrderViewDefaultShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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