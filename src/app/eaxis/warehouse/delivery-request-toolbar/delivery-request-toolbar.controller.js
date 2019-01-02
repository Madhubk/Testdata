(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryRequestToolbarController", DeliveryRequestToolbarController);

    DeliveryRequestToolbarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr"];

    function DeliveryRequestToolbarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr) {

        var DeliveryRequestToolbarCtrl = this;

        function Init() {


            DeliveryRequestToolbarCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Request_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }

            };

            DeliveryRequestToolbarCtrl.ePage.Masters.IsActiveMenu = DeliveryRequestToolbarCtrl.activeMenu;

            DeliveryRequestToolbarCtrl.ePage.Masters.Input = DeliveryRequestToolbarCtrl.input;
            DeliveryRequestToolbarCtrl.ePage.Masters.DataEntryObject = DeliveryRequestToolbarCtrl.dataentryObject;

            DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Create Re-Delivery";

            DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = false;

            DeliveryRequestToolbarCtrl.ePage.Masters.CreateDelivery = CreateDelivery;
            InitAction();
        }

        function InitAction() {            
            DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList = [];            
            DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount = 0;
            DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount = 0
            angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.Input, function (value, key) {
                if (value.WorkOrderStatus == "CAN") {
                    DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount + 1;
                    DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList.push(value);
                } else {
                    DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount = DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount + 1;                    
                }
            });            
            if (DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount > 0) {
                DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                toastr.warning("Re-Delivery Request can be created when the Delivery Status is in Cancelled.");
            }
        }

        function CreateDelivery() {            
            if (DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount > 0) {
                var TempWarehouse = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].WarehouseCode;
                var TempConsignee = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ConsigneeCode;
                var TempClient = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ClientCode;
                var count = 0;
                angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, function (value, key) {
                    if ((TempWarehouse == value.WarehouseCode) && (TempConsignee == value.ConsigneeCode) && (TempClient == value.ClientCode)) {
                        count = count + 1;
                    }
                });
                if (count == DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList.length) {
                    DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                    DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Please Wait...";
                    apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].WOD_FK).then(function (response) {
                        if (response.data.Response) {
                            DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData = response.data.Response;
                            helperService.getFullObjectUsingGetById(appConfig.Entities.WmsDeliveryList.API.GetById.Url, 'null').then(function (response) {
                                if (response.data.Response.Response) {
                                    response.data.Response.Response = DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData;
                                    response.data.Response.Response.UIWmsDelivery.PK = response.data.Response.Response.PK;
                                    response.data.Response.Response.UIWmsDelivery.WorkOrderID = response.data.Response.Response.UIWmsDelivery.WorkOrderID;
                                    response.data.Response.Response.UIWmsDelivery.ExternalReference = response.data.Response.Response.UIWmsDelivery.WorkOrderID;
                                    response.data.Response.Response.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                                    response.data.Response.Response.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;
                                    angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                                        value.PK = "";
                                    });
                                    angular.forEach(response.data.Response.Response.UIWmsDeliveryLine, function (value, key) {
                                        value.PK = "";
                                        value.AdditionalRef1Code = "R-" + value.AdditionalRef1Code;
                                    });

                                    apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Insert.Url, response.data.Response.Response).then(function (response) {
                                        if (response.data.Response) {
                                            DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                                            DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Create Re-Delivery";
                                            toastr.success("Delivery Created Successfully");
                                            // var _queryString = {
                                            //     PK: response.data.Response.UIWmsDelivery.PK,
                                            //     WorkOrderID: response.data.Response.UIWmsDelivery.WorkOrderID,
                                            // };
                                            // _queryString = helperService.encryptData(_queryString);
                                            // $window.open("#/EA/single-record-view/pendingDelivery/" + _queryString, "_blank");
                                            helperService.refreshGrid();
                                        } else {
                                            toastr.error("Delivery Creation Failed. Please try again later");
                                            DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = false;
                                            DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Create Re-Delivery";
                                        }
                                    });
                                } else {
                                    console.log("Empty New Delivery response");
                                }
                            });
                        }
                    });
                } else {
                    toastr.warning("Selected Warehouse, Client and Consignee should be same");
                }
            }
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        Init();
    }
})();