(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_OrderShipmentController", one_one_OrderShipmentController);

    one_one_OrderShipmentController.$inject = ["$window", "apiService", "appConfig", "helperService", "toastr"];

    function one_one_OrderShipmentController($window, apiService, appConfig, helperService, toastr) {
        /* jshint validthis: true */
        var one_one_OrderShipmentCtrl = this;

        function Init() {
            var currentOrder = one_one_OrderShipmentCtrl.currentOrder[one_one_OrderShipmentCtrl.currentOrder.label].ePage.Entities;
            one_one_OrderShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitOrderShipment();
        }

        function InitOrderShipment() {
            one_one_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            one_one_OrderShipmentCtrl.ePage.Masters.SelectedData = SelectedData;
            one_one_OrderShipmentCtrl.ePage.Masters.ShipmentDetach = ShipmentDetach;
            one_one_OrderShipmentCtrl.ePage.Masters.EditSingleRecordView = EditSingleRecordView;
            one_one_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];

            if (!one_one_OrderShipmentCtrl.currentOrder.isNew) {
                if (one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK && one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK != '00000000-0000-0000-0000-000000000000') {
                    GetShpConMapping(one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK, "Edit");
                }
            }
        }

        function SelectedData($item, type) {
            if (type == 'grid') {
                one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer = $item.data.entity;
            } else {
                one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer = $item
            }
            one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK = one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer.PK
            one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ShipmentNo = one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer.ShipmentNo
            GetShpConMapping(one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK, "New");
        }

        function ShipmentDetach() {
            one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIShipment_Buyer = {};
            one_one_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = false;
            one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.SHP_FK = "";
            one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.ShipmentNo = "";
            one_one_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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
                        one_one_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = response.data.Response;
                        one_one_OrderShipmentCtrl.ePage.Masters.ShipmentDetailsShow = true;
                        if (type == "New") {
                            OrderStatusUpdate(one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer);
                        }
                    } else {
                        one_one_OrderShipmentCtrl.ePage.Masters.ConshpMappingList = [];
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
                        one_one_OrderShipmentCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.OrderStatus = response.data.Response[0].OrderStatus;
                    }
                } else {
                    toastr.error("Save Failed...")
                }
            });
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