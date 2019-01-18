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
                if (!value.PL_PrdCode) {
                    PendingPickupToolbarCtrl.ePage.Masters.PendingPickupCount = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupCount + 1;
                    PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList.push(value);
                } else {
                    PendingPickupToolbarCtrl.ePage.Masters.OtherCount = PendingPickupToolbarCtrl.ePage.Masters.OtherCount + 1;
                    PendingPickupToolbarCtrl.ePage.Masters.OtherList = PendingPickupToolbarCtrl.ePage.Masters.OtherList + value.AdditionalRef1Code + ",";
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
                var TempWarehouse = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].DEL_WAR_Code;
                var TempConsignee = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].DEL_ConsigneeCode;
                var count = 0;
                angular.forEach(PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList, function (value, key) {
                    if ((TempWarehouse == value.DEL_WAR_Code) && (TempConsignee == value.DEL_ConsigneeCode)) {
                        count = count + 1;
                    }
                });
                if (count == PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList.length) {
                    PendingPickupToolbarCtrl.ePage.Masters.IsCreatePickupBtn = true;
                    PendingPickupToolbarCtrl.ePage.Masters.CreatePickupBtnText = "Please Wait...";
                    apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].DEL_PK).then(function (response) {
                        if (response.data.Response) {
                            PendingPickupToolbarCtrl.ePage.Masters.DeliveryData = response.data.Response;
                            helperService.getFullObjectUsingGetById(appConfig.Entities.WmsPickupList.API.GetById.Url, 'null').then(function (response) {
                                if (response.data.Response.Response) {
                                    response.data.Response.Response.UIWmsPickup.PK = response.data.Response.Response.PK;
                                    response.data.Response.Response.UIWmsPickup.ExternalReference = response.data.Response.Response.UIWmsPickup.WorkOrderID;
                                    response.data.Response.Response.UIWmsPickup.ORG_Client_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].DEL_ORG_Client_FK;
                                    response.data.Response.Response.UIWmsPickup.ORG_Consignee_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].DEL_ORG_Consignee_FK
                                    response.data.Response.Response.UIWmsPickup.WAR_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].DEL_WAR_FK;
                                    response.data.Response.Response.UIWmsWorkorderReport.AdditionalRef1Code = PendingPickupToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.AdditionalRef1Code;
                                    response.data.Response.Response.UIWmsWorkorderReport.ResponseType = PendingPickupToolbarCtrl.ePage.Masters.DeliveryData.UIWmsWorkorderReport.ResponseType;
                                    response.data.Response.Response.UIJobAddress = angular.copy(PendingPickupToolbarCtrl.ePage.Masters.DeliveryData.UIJobAddress);
                                    angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                                        value.PK = "";
                                    });
                                    // response.data.Response.Response.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                                    // response.data.Response.Response.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;                                                                       
                                    angular.forEach(PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList, function (value, key) {
                                        var obj = {
                                            "PK": "",
                                            "WOL_Parent_FK": value.DL_PK,
                                            "ProductCode": value.DL_Req_PrdCode,
                                            "ProductDescription": value.DL_Req_PrdDesc,
                                            "ProductCondition": "",
                                            "PRO_FK": value.DL_Req_PrdPk,
                                            "MCC_NKCommodityCode": value.DL_NKCommodityCode,
                                            "Packs": value.DL_Packs,
                                            "PAC_PackType": value.DL_PAC_PackType,
                                            "Units": value.DL_Units,
                                            "StockKeepingUnit": value.DL_StockKeepingUnit,
                                            "PartAttrib1": "",
                                            "PartAttrib2": "",
                                            "PartAttrib3": "",
                                            "PackingDate": "",
                                            "ExpiryDate": "",
                                            "UseExpiryDate": value.DL_UseExpiryDate,
                                            "UsePackingDate": value.DL_UsePackingDate,
                                            "UsePartAttrib1": value.DL_UsePartAttrib1,
                                            "UsePartAttrib2": value.DL_UsePartAttrib2,
                                            "UsePartAttrib3": value.DL_UsePartAttrib3,
                                            "IsPartAttrib1ReleaseCaptured": value.DL_IsPartAttrib1ReleaseCaptured,
                                            "IsPartAttrib2ReleaseCaptured": value.DL_IsPartAttrib2ReleaseCaptured,
                                            "IsPartAttrib3ReleaseCaptured": value.DL_IsPartAttrib3ReleaseCaptured,
                                            "WorkOrderLineType": "PIC",
                                            "IsDeleted": false,
                                            "ORG_ClientCode": value.DEL_ClientCode,
                                            "ORG_ClientName": value.DEL_ClientName,
                                            "Client_FK": value.DEL_ClientFk,
                                            "AdditionalRef1Code": value.DL_AdditionalRef1Code,
                                            "AdditionalRef1Type": value.DL_AdditionalRef1Type,
                                            "AdditionalRef1Fk": value.DL_AdditionalRef1Fk,
                                            "WAR_WarehouseCode": value.DEL_WAR_Code,
                                            "WAR_WarehouseName": value.DEL_WAR_Name,
                                            "WAR_FK": value.WOD_WAR_FK,
                                        };
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
                                            }, 2000);
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
                    toastr.warning("Selected Warehouse and Consignee should be same");
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