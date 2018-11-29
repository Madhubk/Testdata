(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderShipmentController", OrderShipmentController);

    OrderShipmentController.$inject = ["$window", "apiService", "appConfig", "helperService", "toastr"];

    function OrderShipmentController($window, apiService, appConfig, helperService, toastr) {
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
                if (OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK && OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK, "Edit");
                }
            }
        }

        function SelectedData($item, type) {
            if (type == 'grid') {
                OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader = $item.data.entity;
            } else {
                OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader = $item
            }
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK = OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ShipmentNo = OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            GetShpConMapping(OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK, "New");
        }

        function ShipmentDetach() {
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipmentHeader = {};
            OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.SHP_FK = "";
            OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ShipmentNo = "";
            OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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
                        OrderShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                        if (type == "New") {
                            OrderStatusUpdate(OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader);
                        }
                    } else {
                        OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
                    }
                });
            }
        }

        function OrderStatusUpdate(_items) {
            var _tempObj = {
                "EntityRefPK": _items.PK,
                "Properties": [{
                    "PropertyName": "POH_OrderStatus",
                    "PropertyNewValue": "SHP"
                }]
            };
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.UpdateRecords.Url, [_tempObj]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrderShipmentCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.OrderStatus = response.data.Response[0].OrderStatus;
                    }
                } else {
                    toastr.error("Save Failed...")
                }
            });
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