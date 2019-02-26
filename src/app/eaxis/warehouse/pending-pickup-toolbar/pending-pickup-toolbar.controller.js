(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PendingPickupToolbarController", PendingPickupToolbarController);

    PendingPickupToolbarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr", "$location"];

    function PendingPickupToolbarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr, $location) {

        var PendingPickupToolbarCtrl = this;

        function Init() {


            PendingPickupToolbarCtrl.ePage = {
                "Title": "",
                "Prefix": "Pending_Pickup_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }

            };

            PendingPickupToolbarCtrl.ePage.Masters.IsActiveMenu = PendingPickupToolbarCtrl.activeMenu;

            PendingPickupToolbarCtrl.ePage.Masters.Input = PendingPickupToolbarCtrl.input;
            PendingPickupToolbarCtrl.ePage.Masters.DataEntryObject = PendingPickupToolbarCtrl.dataentryObject;

            PendingPickupToolbarCtrl.ePage.Masters.CreatePickupBtnText = "Create Pickup";

            PendingPickupToolbarCtrl.ePage.Masters.IsCreatePickupBtn = false;

            PendingPickupToolbarCtrl.ePage.Masters.CreatePickup = CreatePickup;
            InitAction();
        }

        function InitAction() {
            PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList = [];
            PendingPickupToolbarCtrl.ePage.Masters.OtherList = "";
            PendingPickupToolbarCtrl.ePage.Masters.PendingPickupCount = 0;
            PendingPickupToolbarCtrl.ePage.Masters.OtherCount = 0
            angular.forEach(PendingPickupToolbarCtrl.ePage.Masters.Input, function (value, key) {
                if (!value.WPR_PK) {
                    PendingPickupToolbarCtrl.ePage.Masters.PendingPickupCount = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupCount + 1;
                    PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList.push(value);
                } else {
                    PendingPickupToolbarCtrl.ePage.Masters.OtherCount = PendingPickupToolbarCtrl.ePage.Masters.OtherCount + 1;
                    PendingPickupToolbarCtrl.ePage.Masters.OtherList = PendingPickupToolbarCtrl.ePage.Masters.OtherList + value.WDR_DeliveryLineRefNo + ",";
                }
            });
            PendingPickupToolbarCtrl.ePage.Masters.OtherList = PendingPickupToolbarCtrl.ePage.Masters.OtherList.slice(0, -1);
            if (PendingPickupToolbarCtrl.ePage.Masters.OtherCount > 0) {
                PendingPickupToolbarCtrl.ePage.Masters.IsCreatePickupBtn = true;
                toastr.warning("Pickup Request cannot be created for this delivery line " + PendingPickupToolbarCtrl.ePage.Masters.OtherList);
            }
        }

        function CreatePickup() {
            if (PendingPickupToolbarCtrl.ePage.Masters.PendingPickupCount > 0) {
                var TempWarehouse = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WDR_WarehouseCode;
                var TempConsignee = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WDR_ConsigneeCode;
                var TempClient = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WDR_ClientCode;
                var count = 0;
                angular.forEach(PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList, function (value, key) {
                    if ((TempWarehouse == value.WDR_WarehouseCode) && (TempConsignee == value.WDR_ConsigneeCode) && (TempClient == value.WDR_ClientCode)) {
                        count = count + 1;
                    }
                });
                if (count == PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList.length) {
                    PendingPickupToolbarCtrl.ePage.Masters.IsCreatePickupBtn = true;
                    PendingPickupToolbarCtrl.ePage.Masters.CreatePickupBtnText = "Please Wait...";
                    apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WDR_DeliveryRequest_FK).then(function (response) {
                        if (response.data.Response) {
                            PendingPickupToolbarCtrl.ePage.Masters.DeliveryData = response.data.Response;
                            helperService.getFullObjectUsingGetById(appConfig.Entities.WmsPickupList.API.GetById.Url, 'null').then(function (response) {
                                if (response.data.Response.Response) {
                                    response.data.Response.Response.UIWmsPickup.PK = response.data.Response.Response.PK;
                                    response.data.Response.Response.UIWmsPickup.ExternalReference = response.data.Response.Response.UIWmsPickup.WorkOrderID;
                                    response.data.Response.Response.UIWmsPickup.ORG_Client_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WDR_Client_Fk;
                                    response.data.Response.Response.UIWmsPickup.ORG_Consignee_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WDR_Consignee_FK
                                    response.data.Response.Response.UIWmsPickup.WAR_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WDR_Warehouse_Fk;
                                    response.data.Response.Response.UIWmsWorkorderReport.AdditionalRef1Code = PendingPickupToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.AdditionalRef1Code;
                                    response.data.Response.Response.UIWmsWorkorderReport.ResponseType = PendingPickupToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.ResponseType;
                                    response.data.Response.Response.UIJobAddress = angular.copy(PendingPickupToolbarCtrl.ePage.Masters.DeliveryData.UIJobAddress);
                                    angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                                        value.PK = "";
                                    });
                                    
                                    angular.forEach(PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList, function (value, key) {
                                        var obj = {
                                            "PK": "",
                                            "WOL_Parent_FK": value.WDR_DeliveryLine_FK,
                                            "ProductCode": value.WDR_ProductCode,
                                            "ProductDescription": value.WDR_ProductDescription,
                                            "ProductCondition": "",
                                            "PRO_FK": value.WDR_PRO_FK,
                                            "MCC_NKCommodityCode": "",
                                            "Packs": value.WDR_Packs,
                                            "PAC_PackType": value.WDR_PackType,
                                            "Units": value.WDR_Quantity,
                                            "StockKeepingUnit": value.WDR_UQ,
                                            "PartAttrib1": "",
                                            "PartAttrib2": "",
                                            "PartAttrib3": "",
                                            "PackingDate": "",
                                            "ExpiryDate": "",
                                            "UseExpiryDate": value.WDR_UseExpiryDate,
                                            "UsePackingDate": value.WDR_UsePackingDate,
                                            "UsePartAttrib1": value.WDR_UsePartAttrib1,
                                            "UsePartAttrib2": value.WDR_UsePartAttrib2,
                                            "UsePartAttrib3": value.WDR_UsePartAttrib3,
                                            "IsPartAttrib1ReleaseCaptured": value.WDR_IsPartAttrib1ReleaseCaptured,
                                            "IsPartAttrib2ReleaseCaptured": value.WDR_IsPartAttrib2ReleaseCaptured,
                                            "IsPartAttrib3ReleaseCaptured": value.WDR_IsPartAttrib3ReleaseCaptured,
                                            "WorkOrderLineType": "PIC",
                                            "IsDeleted": false,
                                            "ORG_ClientCode": value.WDR_ClientCode,
                                            "ORG_ClientName": value.WDR_ClientName,
                                            "Client_FK": value.WDR_Client_Fk,
                                            "AdditionalRef1Code": value.WDR_DeliveryLineRefNo,
                                            "AdditionalRef1Type": "DeliveryLine",
                                            "AdditionalRef1Fk": value.WDR_DeliveryLine_FK,
                                            "WAR_WarehouseCode": value.WDR_WarehouseCode,
                                            "WAR_WarehouseName": value.WDR_WarehouseName,
                                            "WAR_FK": value.WDR_Warehouse_Fk,
                                        };
                                        
                                        obj.UISPMSPickupReport = {
                                            "PK": "",
                                            "Client_FK": value.WDR_Client_Fk,
                                            "ClientCode": value.WDR_ClientCode,
                                            "ClientName": value.WDR_ConsigneeName,
                                            "Warehouse_FK": value.WDR_Warehouse_Fk,
                                            "WarehouseCode": value.WDR_WarehouseCode,
                                            "WarehouseName": value.WDR_WarehouseName,
                                            "Consignee_FK": value.WDR_Consignee_FK,
                                            "ConsigneeCode": value.WDR_ConsigneeCode,
                                            "ConsigneeName": value.WDR_ConsigneeName,
                                            "SiteCode": null,
                                            "SiteName": null,
                                            "StatusCode": "ENT",
                                            "StatusDesc": "Entered",
                                            "RequestMode": null,
                                            "ResponseType": value.WDR_ResponseType,
                                            "PickupPoint": value.WDR_DropPoint,
                                            "RequesterName": value.WDR_RequesterName,
                                            "ReceiverName": null,
                                            "ReceiverMailId": null,
                                            "AcknowledgedPerson": null,
                                            "AcknowledgedDateTime": null,
                                            "RequestedDateTime": null,
                                            "RequesterContactNumber": null,
                                            "PickupRequestNo": response.data.Response.Response.UIWmsPickup.WorkOrderID,
                                            "PickupRequest_FK": response.data.Response.Response.UIWmsPickup.PK,
                                            "PickupLineRefNo": value.WDR_DeliveryLineRefNo,
                                            "ProductCode": value.WDR_ProductCode,
                                            "ProductDescription": value.WDR_ProductDescription,
                                            "Packs": value.WDR_Packs,
                                            "PackType": value.WDR_PackType,
                                            "Quantity": value.WDR_Quantity,
                                            "UQ": value.WDR_UQ,
                                            "ProductCondition": "",
                                            "PickupProductStatus": "",
                                            "UDF1": "",
                                            "UDF2": "",
                                            "UDF3": "",
                                            "PackingDate": "",
                                            "ExpiryDate": "",
                                            "UseExpiryDate": value.WDR_UseExpiryDate,
                                            "UsePackingDate": value.WDR_UsePackingDate,
                                            "UsePartAttrib1": value.WDR_UsePartAttrib1,
                                            "UsePartAttrib2": value.WDR_UsePartAttrib2,
                                            "UsePartAttrib3": value.WDR_UsePartAttrib3,
                                            "IsPartAttrib1ReleaseCaptured": value.WDR_IsPartAttrib1ReleaseCaptured,
                                            "IsPartAttrib2ReleaseCaptured": value.WDR_IsPartAttrib2ReleaseCaptured,
                                            "IsPartAttrib3ReleaseCaptured": value.WDR_IsPartAttrib3ReleaseCaptured,
                                            "PickupPerson": null,
                                            "PickupPersonContactNo": null,
                                            "HandOverPerson": null,
                                            "HandOverPersonContactNo": null,
                                            "Receiver": null,
                                            "ReceiverContactNo": null,
                                            "ReceivedDateTime": null,
                                            "PickupComment": null,
                                            "FaultyDescription": null,
                                            "IsDeleted": false,
                                            "IsModified": false,
                                            "PickupLine_FK": "",
                                            "PickupLineStatus": "Pickup Requested"
                                        }
                                        response.data.Response.Response.UIWmsPickupLine.push(obj);
                                    });
                                    apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Insert.Url, response.data.Response.Response).then(function (response) {
                                        if (response.data.Response) {
                                            PendingPickupToolbarCtrl.ePage.Masters.IsCreatePickupBtn = true;
                                            PendingPickupToolbarCtrl.ePage.Masters.CreatePickupBtnText = "Create Pickup";
                                            toastr.success("Pickup Created Successfully");
                                            // var _queryString = {
                                            //     PK: response.data.Response.UIWmsPickup.PK,
                                            //     WorkOrderID: response.data.Response.UIWmsPickup.WorkOrderID,
                                            // };
                                            // _queryString = helperService.encryptData(_queryString);
                                            // $window.open("#/EA/single-record-view/pendingpickup/" + _queryString, "_blank");
                                            helperService.refreshGrid();
                                            $timeout(function () {
                                                var _filter = {
                                                    PSM_FK: "b37d7a0a-d29e-4cb2-82e7-f2c47a081f0c",
                                                    WSI_FK: "e89d563a-9bfb-4a2d-aea9-22c666828f18",
                                                    UserStatus: "WITHIN_KPI_AVAILABLE",
                                                    EntityRefKey: response.data.Response.UIWmsPickup.PK
                                                };
                                                $location.path("/EA/my-tasks").search({
                                                    filter: helperService.encryptData(_filter)
                                                });
                                            }, 3000);
                                        } else {
                                            toastr.error("Pickup Creation Failed. Please try again later");
                                            PendingPickupToolbarCtrl.ePage.Masters.IsCreatePickupBtn = false;
                                            PendingPickupToolbarCtrl.ePage.Masters.CreatePickupBtnText = "Create Pickup";
                                        }
                                    });
                                } else {
                                    console.log("Empty New Pickup response");
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