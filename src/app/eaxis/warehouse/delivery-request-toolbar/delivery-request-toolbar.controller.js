(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryRequestToolbarController", DeliveryRequestToolbarController);

    DeliveryRequestToolbarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr", "$location"];

    function DeliveryRequestToolbarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr, $location) {

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
                if (value.DeliveryLineStatus == "Cancelled") {
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
                    apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DeliveryRequest_FK).then(function (response) {
                        if (response.data.Response) {
                            DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData = response.data.Response;
                            helperService.getFullObjectUsingGetById(appConfig.Entities.WmsDeliveryList.API.GetById.Url, 'null').then(function (response) {
                                if (response.data.Response.Response) {
                                    response.data.Response.Response.UIWmsDelivery.PK = response.data.Response.Response.PK;
                                    response.data.Response.Response.UIWmsDelivery.ExternalReference = response.data.Response.Response.UIWmsDelivery.WorkOrderID;
                                    response.data.Response.Response.UIWmsDelivery.ORG_Client_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Client_Fk;
                                    response.data.Response.Response.UIWmsDelivery.ORG_Consignee_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Consignee_FK
                                    response.data.Response.Response.UIWmsDelivery.WAR_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Warehouse_Fk;
                                    response.data.Response.Response.UIWmsWorkorderReport.AdditionalRef1Code = DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.AdditionalRef1Code;
                                    response.data.Response.Response.UIWmsWorkorderReport.ResponseType = DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.ResponseType;
                                    response.data.Response.Response.UIWmsWorkorderReport.RequestMode = DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.RequestMode;
                                    response.data.Response.Response.UIWmsWorkorderReport.Requester = DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.Requester;
                                    response.data.Response.Response.UIWmsWorkorderReport.RequesterContactNo = DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.RequesterContactNo;
                                    response.data.Response.Response.UIJobAddress = angular.copy(DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIJobAddress);
                                    angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                                        value.PK = "";
                                    });
                                    // response.data.Response.Response.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                                    // response.data.Response.Response.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;                                   
                                    
                                    angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, function (value, key) {
                                        var obj = {
                                            "PK": "",
                                            "WOL_Parent_FK": value.DeliveryLine_FK,
                                            "ProductCode": value.ProductCode,
                                            "ProductDescription": value.ProductDescription,
                                            "ProductCondition": value.ProductCondition,
                                            "PRO_FK": value.PRO_FK,
                                            "MCC_NKCommodityCode": "",
                                            "Packs": value.Packs,
                                            "PAC_PackType": value.PackType,
                                            "Units": value.Quantity,
                                            "StockKeepingUnit": value.UQ,
                                            "PartAttrib1": value.UDF1,
                                            "PartAttrib2": value.UDF2,
                                            "PartAttrib3": value.UDF3,
                                            "PackingDate": value.PackingDate,
                                            "ExpiryDate": value.ExpiryDate,
                                            "UseExpiryDate": value.UseExpiryDate,
                                            "UsePackingDate": value.UsePackingDate,
                                            "UsePartAttrib1": value.UsePartAttrib1,
                                            "UsePartAttrib2": value.UsePartAttrib2,
                                            "UsePartAttrib3": value.UsePartAttrib3,
                                            "IsPartAttrib1ReleaseCaptured": value.IsPartAttrib1ReleaseCaptured,
                                            "IsPartAttrib2ReleaseCaptured": value.IsPartAttrib2ReleaseCaptured,
                                            "IsPartAttrib3ReleaseCaptured": value.IsPartAttrib3ReleaseCaptured,
                                            "WorkOrderLineType": "DEL",
                                            "IsDeleted": false,
                                            "ORG_ClientCode": value.ClientCode,
                                            "ORG_ClientName": value.ClientName,
                                            "Client_FK": value.Client_Fk,
                                            "AdditionalRef1Code": "R-" + value.DeliveryLineRefNo,
                                            "AdditionalRef1Type": "DeliveryLine",
                                            "WAR_WarehouseCode": value.WarehouseCode,
                                            "WAR_WarehouseName": value.WarehouseName,
                                            "WAR_FK": value.Warehouse_Fk,
                                        };

                                        obj.UISPMSDeliveryReport = {
                                            "PK": "",
                                            "DeliveryLine_FK": "",
                                            "Client_Fk": response.data.Response.Response.UIWmsDelivery.ORG_Client_FK,
                                            "ClientCode": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsDelivery.ClientCode,
                                            "ClientName": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsDelivery.ClientName,
                                            "Warehouse_Fk": response.data.Response.Response.UIWmsDelivery.WAR_FK,
                                            "WarehouseCode": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsDelivery.WarehouseCode,
                                            "WarehouseName": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsDelivery.WarehouseName,
                                            "Consignee_FK": response.data.Response.Response.UIWmsDelivery.ORG_Consignee_FK,
                                            "ConsigneeCode": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsDelivery.ConsigneeCode,
                                            "ConsigneeName": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsDelivery.ConsigneeName,
                                            "SiteCode": "",
                                            "SiteName": "",
                                            "StatusCode": "ENT",
                                            "StatusDescription": "Entered",
                                            "RequestMode": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.RequestMode,
                                            "ResponseType": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.ResponseType,
                                            "DropPoint": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.AdditionalRef1Code,
                                            "RequesterName": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.Requester,
                                            "ReceiverName": "",
                                            "ReceiverMailId": "",
                                            "AcknowledgedPerson": "",
                                            "AcknowledgedDateTime": "",
                                            "RequestedDateTime": "",
                                            "RequesterContactNumber": DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.RequesterContactNo,
                                            "DeliveryRequestNo": response.data.Response.Response.UIWmsDelivery.WorkOrderID,
                                            "DeliveryRequest_FK": response.data.Response.Response.UIWmsDelivery.PK,
                                            "DeliveryLineRefNo": "R-" + value.DeliveryLineRefNo,
                                            "PRO_FK": value.PRO_FK,
                                            "ProductCode": value.ProductCode,
                                            "ProductDescription": value.ProductDescription,
                                            "Packs": value.Packs,
                                            "PackType": value.PackType,
                                            "Quantity": value.Quantity,
                                            "UQ": value.UQ,
                                            "ProductCondition": value.ProductCondition,
                                            "UDF1": value.UDF1,
                                            "UDF2": value.UDF2,
                                            "UDF3": value.UDF3,
                                            "PackingDate": value.PackingDate,
                                            "ExpiryDate": value.ExpiryDate,
                                            "UseExpiryDate": value.UseExpiryDate,
                                            "UsePackingDate": value.UsePackingDate,
                                            "UsePartAttrib1": value.UsePartAttrib1,
                                            "UsePartAttrib2": value.UsePartAttrib2,
                                            "UsePartAttrib3": value.UsePartAttrib3,
                                            "IsPartAttrib1ReleaseCaptured": value.IsPartAttrib1ReleaseCaptured,
                                            "IsPartAttrib2ReleaseCaptured": value.IsPartAttrib2ReleaseCaptured,
                                            "IsPartAttrib3ReleaseCaptured": value.IsPartAttrib3ReleaseCaptured,
                                            "Receiver": "",
                                            "ReceiverContactNumber": "",
                                            "DeliveryComments": "",
                                            "CancelledDateTime": "",
                                            "IsModified": false,
                                            "IsDeleted": false
                                        }
                                        response.data.Response.Response.UIWmsDeliveryLine.push(obj);
                                    });
                                    apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Insert.Url, response.data.Response.Response).then(function (response) {
                                        if (response.data.Response) {
                                            DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                                            DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Create Re-Delivery";
                                            angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, function (value, key) {
                                                apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + value.DeliveryRequest_FK).then(function (response) {
                                                    if (response.data.Response) {
                                                        var count = 0;
                                                        angular.forEach(response.data.Response.UIWmsDeliveryLine, function (value1, key1) {
                                                            if (value1.PK == value.DeliveryLine_FK) {
                                                                value1.WorkOrderLineStatus = "RDL";
                                                                value1.UISPMSDeliveryReport.DeliveryLineStatus = "Re-Delivery Created";
                                                            }
                                                            if (value1.WorkOrderLineStatus == "RDL") {
                                                                count = count + 1;
                                                            }
                                                        });
                                                        if (count == response.data.Response.UIWmsDeliveryLine.length) {
                                                            response.data.Response.UIWmsDelivery.WorkOrderStatus = "RDL";
                                                        }
                                                        response.data.Response = filterObjectUpdate(response.data.Response, "IsModified");
                                                        apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Update.Url, response.data.Response).then(function (response) {
                                                            if (response.data.Response) {
                                                            }
                                                        });
                                                    }
                                                });
                                            });
                                            $timeout(function () {
                                                toastr.success("Delivery Created Successfully");
                                                helperService.refreshGrid();
                                                var _filter = {
                                                    PSM_FK: "1ece5a1b-e617-45f8-a16d-33601c12e702",
                                                    WSI_FK: "9ae0c4ab-b4bd-4763-9490-563a361dea4a",
                                                    UserStatus: "WITHIN_KPI_AVAILABLE",
                                                    EntityRefKey: response.data.Response.UIWmsDelivery.PK
                                                };
                                                $location.path("/EA/my-tasks").search({
                                                    filter: helperService.encryptData(_filter)
                                                });
                                            }, 3000);

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