(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrderShipmentController", three_three_OrderShipmentController);

    three_three_OrderShipmentController.$inject = ["$window", "apiService", "appConfig", "helperService", "toastr"];

    function three_three_OrderShipmentController($window, apiService, appConfig, helperService, toastr) {
        /* jshint validthis: true */
        var three_three_OrderShipmentCtrl = this;

        function Init() {
            var currentOrder = three_three_OrderShipmentCtrl.currentOrder[three_three_OrderShipmentCtrl.currentOrder.label].ePage.Entities;
            three_three_OrderShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            three_three_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            three_three_OrderShipmentCtrl.ePage.Masters.SelectedData = SelectedData;
            three_three_OrderShipmentCtrl.ePage.Masters.ShipmentDetach = ShipmentDetach;
            three_three_OrderShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            three_three_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];

            if (!three_three_OrderShipmentCtrl.currentOrder.isNew) {
                if (three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK && three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK, "Edit");
                }
            }
        }

        function SelectedData($item, type) {
            if (type == 'grid') {
                three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Forwarder = $item.data.entity;
            } else {
                three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Forwarder = $item
            }
            three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK = three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Forwarder.PK
            three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ShipmentNo = three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Forwarder.ShipmentNo
            GetShpConMapping(three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK, "New");
        }

        function ShipmentDetach() {
            three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Forwarder = {};
            three_three_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.SHP_FK = "";
            three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ShipmentNo = "";
            three_three_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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
                        three_three_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        three_three_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                        if (type == "New") {
                            OrderStatusUpdate(three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder);
                        }
                    } else {
                        three_three_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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
                        three_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.OrderStatus = response.data.Response[0].OrderStatus;
                    }
                } else {
                    toastr.error("Save Failed...")
                }
            });
        }

        function EditSingleRecordView(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Forwarder.PK,
                Code: curEntity.UIShipment_Forwarder.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
        }

        Init();
    }
})();