(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_OrderShipmentController", one_three_OrderShipmentController);

    one_three_OrderShipmentController.$inject = ["$window", "apiService", "appConfig", "helperService", "orderApiConfig", "toastr"];

    function one_three_OrderShipmentController($window, apiService, appConfig, helperService, orderApiConfig, toastr) {
        /* jshint validthis: true */
        var one_three_OrderShipmentCtrl = this;

        function Init() {
            var currentOrder = one_three_OrderShipmentCtrl.currentOrder[one_three_OrderShipmentCtrl.currentOrder.label].ePage.Entities;
            one_three_OrderShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            one_three_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            one_three_OrderShipmentCtrl.ePage.Masters.SelectedData = SelectedData;
            one_three_OrderShipmentCtrl.ePage.Masters.ShipmentDetach = ShipmentDetach;
            one_three_OrderShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            one_three_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];

            if (!one_three_OrderShipmentCtrl.currentOrder.isNew) {
                if (one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SHP_FK && one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SHP_FK, "Edit");
                }
            }
            one_three_OrderShipmentCtrl.ePage.Masters.DefaultFilterShipmnetSearch = {
                ORG_Consignee_Code: one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Buyer,
                ORG_Shipper_Code: one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.Supplier
            }
        }

        function SelectedData($item, type) {
            if (type == 'grid') {
                one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer_Forwarder = $item.data.entity;
            } else {
                one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer_Forwarder = $item
            }
            one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SHP_FK = one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer_Forwarder.PK
            one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ShipmentNo = one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer_Forwarder.ShipmentNo
            GetShpConMapping(one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SHP_FK, "New");
        }

        function ShipmentDetach() {
            one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer_Forwarder = {};
            one_three_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.SHP_FK = "";
            one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ShipmentNo = "";
            one_three_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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
                        one_three_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        one_three_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                        if (type == "New") {
                            OrderStatusUpdate(one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder);
                        }
                    } else {
                        one_three_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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
            apiService.post('eAxisAPI', orderApiConfig.Entities.BuyerOrder.API.updaterecords.Url, [_tempObj]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        one_three_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OrderStatus = response.data.Response[0].OrderStatus;
                    }
                } else {
                    toastr.error("Save Failed...")
                }
            });
        }

        function EditSingleRecordView(curEntity) {
            var _queryString = {
                PK: curEntity.UIShipment_Buyer_Forwarder.PK,
                ShipmentNo: curEntity.UIShipment_Buyer_Forwarder.ShipmentNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/shipment-view?q=" + _queryString, "_blank");
        }

        Init();
    }
})();