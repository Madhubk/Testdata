(function () {
    "use strict";

    angular
        .module("Application")
        .controller("orderItemModalController", orderItemModalController);

    orderItemModalController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "appConfig", "helperService", "toastr", "$uibModalInstance", "param"];

    function orderItemModalController($scope, $timeout, APP_CONSTANT, apiService, appConfig, helperService, toastr, $uibModalInstance, param) {
        var orderItemModalCtrl = this;

        function Init() {

            orderItemModalCtrl.ePage = {
                "Title": "",
                "Prefix": "OrderItem",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            orderItemModalCtrl.ePage.Masters.addRow = addRow
            orderItemModalCtrl.ePage.Masters.removeRow = removeRow
            orderItemModalCtrl.ePage.Masters.ok = ok
            orderItemModalCtrl.ePage.Masters.OrderReference = param.OrderReference

        }

        function addRow() {
            var _orderRefObj = {
                "IsValid": true,
                "OrderReference": "",
                "Sequence": orderItemModalCtrl.ePage.Masters.OrderReference.length + 1,
                "JDC_FK": "",
                "Source": "POH",
                "SourceRefKey": param.CurrentShipment.Header.Data.PK,
                "IsModified": false,
                "IsDeleted": false
            };
            orderItemModalCtrl.ePage.Masters.OrderReference.push(_orderRefObj)
        }

        function removeRow(index, item) {
            if (item.PK != undefined) {
                item.IsDeleted = true
                apiService.post("eAxisAPI", param.CurrentShipment.ShipmentOrder.API.Upsert.Url, [item]).then(function (response) {
                    if (response.data.Response) {
                        orderItemModalCtrl.ePage.Masters.OrderReference.splice(index, 1)
                    }
                });
            } else {
                orderItemModalCtrl.ePage.Masters.OrderReference.splice(index, 1)
            }
        }

        function ok() {
            orderItemModalCtrl.ePage.Masters.OrderReference.map(function (val, key) {
                val.IsModified = true
            });
            apiService.post("eAxisAPI", param.CurrentShipment.ShipmentOrder.API.Upsert.Url, orderItemModalCtrl.ePage.Masters.OrderReference).then(function (response) {
                if (response.data.Response) {
                    orderItemModalCtrl.ePage.Masters.OrderReference = response.data.Response;
                    $uibModalInstance.close(orderItemModalCtrl.ePage.Masters.OrderReference)
                }
            });
        }




        Init();
    }
})();