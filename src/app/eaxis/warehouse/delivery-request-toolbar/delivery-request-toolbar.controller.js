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
                if (value.DL_WorkOrderLineStatus == "CAN") {
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
                var TempWarehouse = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DEL_WAR_Code;
                var TempConsignee = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DEL_ConsigneeCode;
                var TempClient = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DEL_ClientCode;
                var count = 0;
                angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, function (value, key) {
                    if ((TempWarehouse == value.DEL_WAR_Code) && (TempConsignee == value.DEL_ConsigneeCode) && (TempClient == value.DEL_ClientCode)) {
                        count = count + 1;
                    }
                });
                if (count == DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList.length) {
                    DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                    DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Please Wait...";
                    apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DEL_WorkOrderPk).then(function (response) {
                        if (response.data.Response) {
                            DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData = response.data.Response;
                            helperService.getFullObjectUsingGetById(appConfig.Entities.WmsDeliveryList.API.GetById.Url, 'null').then(function (response) {
                                if (response.data.Response.Response) {
                                    response.data.Response.Response.UIWmsDelivery.PK = response.data.Response.Response.PK;
                                    response.data.Response.Response.UIWmsDelivery.ExternalReference = response.data.Response.Response.UIWmsDelivery.WorkOrderID;
                                    response.data.Response.Response.UIWmsDelivery.ORG_Client_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DEL_Client_FK;
                                    response.data.Response.Response.UIWmsDelivery.ORG_Consignee_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DEL_ConsigneeFk
                                    response.data.Response.Response.UIWmsDelivery.WAR_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DEL_WAR_FK;
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
                                            "WOL_Parent_FK": value.DL_PK,
                                            "ProductCode": value.DL_Req_PrdCode,
                                            "ProductDescription": value.DL_Req_PrdDesc,
                                            "ProductCondition": value.DL_ProductCondition,
                                            "PRO_FK": value.DL_Req_PrdPk,
                                            "MCC_NKCommodityCode": value.DL_MCC_NKCommodityCode,
                                            "Packs": value.DL_Packs,
                                            "PAC_PackType": value.DL_PAC_PackType,
                                            "Units": value.DL_Units,
                                            "StockKeepingUnit": value.DL_StockKeepingUnit,
                                            "PartAttrib1": value.DL_PartAttrib1,
                                            "PartAttrib2": value.DL_PartAttrib2,
                                            "PartAttrib3": value.DL_PartAttrib3,
                                            "PackingDate": value.DL_PackingDate,
                                            "ExpiryDate": value.DL_ExpiryDate,
                                            "UseExpiryDate": value.DL_UseExpiryDate,
                                            "UsePackingDate": value.DL_UsePackingDate,
                                            "UsePartAttrib1": value.DL_UsePartAttrib1,
                                            "UsePartAttrib2": value.DL_UsePartAttrib2,
                                            "UsePartAttrib3": value.DL_UsePartAttrib3,
                                            "IsPartAttrib1ReleaseCaptured": value.DL_IsPartAttrib1ReleaseCaptured,
                                            "IsPartAttrib2ReleaseCaptured": value.DL_IsPartAttrib2ReleaseCaptured,
                                            "IsPartAttrib3ReleaseCaptured": value.DL_IsPartAttrib3ReleaseCaptured,
                                            "WorkOrderLineType": "DEL",
                                            "IsDeleted": false,
                                            "ORG_ClientCode": value.DEL_ClientCode,
                                            "ORG_ClientName": value.DEL_ClientName,
                                            "Client_FK": value.DEL_Client_FK,
                                            "AdditionalRef1Code": "R-" + value.DL_AdditionalRef1Code,
                                            "AdditionalRef1Type": value.DL_AdditionalRef1Type,
                                            "WAR_WarehouseCode": value.DEL_WAR_Code,
                                            "WAR_WarehouseName": value.DEL_WAR_Name,
                                            "WAR_FK": value.DEL_WAR_FK,
                                        };
                                        response.data.Response.Response.UIWmsDeliveryLine.push(obj);
                                    });
                                    apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Insert.Url, response.data.Response.Response).then(function (response) {
                                        if (response.data.Response) {
                                            DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                                            DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Create Re-Delivery";
                                            angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, function (value, key) {
                                                apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + value.DEL_WorkOrderPk).then(function (response) {
                                                    if (response.data.Response) {
                                                        var count = 0;
                                                        angular.forEach(response.data.Response.UIWmsDeliveryLine, function (value1, key1) {
                                                            if (value1.PK == value.DL_PK) {
                                                                value1.WorkOrderLineStatus = "RDL";
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