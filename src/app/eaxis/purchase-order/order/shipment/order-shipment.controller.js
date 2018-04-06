(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderShipmentController", OrderShipmentController);

    OrderShipmentController.$inject = ["apiService", "appConfig", "helperService", "$window"];

    function OrderShipmentController(apiService, appConfig, helperService, $window) {
        /* jshint validthis: true */
        var OrderShipmentCtrl = this;

        function Init() {
            var currentOrder = OrderShipmentCtrl.currentOrder[OrderShipmentCtrl.currentOrder.label].ePage.Entities;
            OrderShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            OrderShipmentCtrl.ePage.Masters.SelectedData = SelectedData;
            OrderShipmentCtrl.ePage.Masters.ShipmentDetach = ShipmentDetach;
            OrderShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];

            if (!OrderShipmentCtrl.currentOrder.isNew) {
                GetShpConMapping(OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK);
            }
        }

        function SelectedData($item, type) {
            if (type == 'grid') {
                OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader = $item.entity;
            } else {
                OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader = $item
            }
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK = OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ShipmentNo = OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            GetShpConMapping(OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK);
        }

        function ShipmentDetach() {
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader = {};
            OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK = "";
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ShipmentNo = "";
            OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
        }

        function GetShpConMapping(shp_pk) {
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
                        OrderShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                    } else {
                        OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
                    }
                });
            }
        }

        function EditSingleRecordView(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipmentHeader.PK,
                Code: curEntity.UIShipmentHeader.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
        }

        Init();
    }
})();