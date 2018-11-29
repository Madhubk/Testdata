(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderLinePopupController", OrderLinePopupController);

    OrderLinePopupController.$inject = ["$uibModalInstance", "apiService", "items", "appConfig"];

    function OrderLinePopupController($uibModalInstance, apiService, items, appConfig) {
        var OrderLinePopupCtrl = this;

        function init() {
            OrderLinePopupCtrl.ePage = {
                "Masters": {}
            }
            OrderLinePopupCtrl.ePage.Masters.row = items.row
            OrderLinePopupCtrl.ePage.Masters.index = items.index
            OrderLinePopupCtrl.ePage.Masters.shipment = items.shipment
            OrderLinePopupCtrl.ePage.Masters.order = items.order
            OrderLinePopupCtrl.ePage.Masters.edit = items.edit
            OrderLinePopupCtrl.ePage.Masters.attachOrder = AttachOrder
            OrderLinePopupCtrl.ePage.Masters.attachOrderCancel = AttachOrderCancel
            OrderLinePopupCtrl.ePage.Masters.attachBtn = "Attach";
            OrderLinePopupCtrl.ePage.Masters.attachBtnDisable = false
            initLineItem()
        }

        function initLineItem() {
            apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url + OrderLinePopupCtrl.ePage.Masters.row.PK).then(function (res) {
                if (res.data.Response) {
                    OrderLinePopupCtrl.ePage.Masters.UIPorOrderLines = res.data.Response.UIPorOrderLines
                    OrderLinePopupCtrl.ePage.Masters.UIPorOrderHeader = res.data.Response.UIPorOrderHeader
                }
            });
        }

        function AttachOrder() {
            OrderLinePopupCtrl.ePage.Masters.attachBtn = "Please wait...";
            OrderLinePopupCtrl.ePage.Masters.attachBtnDisable = true
            var updateOrderLine = [];
            OrderLinePopupCtrl.ePage.Masters.UIPorOrderLines.map(function (value, key) {
                var obj = {
                    "EntityRefPK": value.PK,
                    "Properties": [{
                        "PropertyName": "POL_RecievedQuantity",
                        "PropertyNewValue": parseInt(value.RecievedQuantity),
                    }]
                };
                updateOrderLine.push(obj)
            })
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderLine.API.UpdateRecords.Url, updateOrderLine).then(function (res) {
                if (res.data.Response) {
                    if (OrderLinePopupCtrl.ePage.Masters.edit == undefined) {
                        orderAttachUpdate()
                    } else {
                        $uibModalInstance.dismiss('cancel')
                    }
                }
            });

        }

        function orderAttachUpdate() {
            var orderAttach = [{
                "EntityRefPK": OrderLinePopupCtrl.ePage.Masters.row.PK,
                "Properties": [{
                    "PropertyName": "POH_SHP_FK",
                    "PropertyNewValue": OrderLinePopupCtrl.ePage.Masters.shipment.PK,
                }, {
                    "PropertyName": "POH_ShipmentNo",
                    "PropertyNewValue": OrderLinePopupCtrl.ePage.Masters.shipment.UIShipmentHeader.ShipmentNo,
                }]
            }]
            // var _index = OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders.map(function (value, key) {
            //     return value.SHP_FK;
            // }).indexOf(OrderLinePopupCtrl.ePage.Masters.shipment.PK);
            // if (_index !== -1) {
            //     OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders[_index].IsDeleted = false
            // } else {
            //     OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders.push(OrderLinePopupCtrl.ePage.Masters.UIPorOrderHeader)
            // }
            OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders.push(OrderLinePopupCtrl.ePage.Masters.UIPorOrderHeader)
            OrderLinePopupCtrl.ePage.Masters.order.splice(OrderLinePopupCtrl.ePage.Masters.index, 1)
            $uibModalInstance.dismiss('cancel')

            console.log(OrderLinePopupCtrl.ePage.Masters.shipment.UIOrderHeaders)

        }

        function AttachOrderCancel() {
            $uibModalInstance.dismiss('cancel')
        }

        init()
    }
})();