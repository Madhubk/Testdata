(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PendingPickupToolbarController", PendingPickupToolbarController);

    PendingPickupToolbarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr"];

    function PendingPickupToolbarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr) {

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
                if (!value.PIC_PrdPk) {
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
                PendingPickupToolbarCtrl.ePage.Masters.IsCreatePickupBtn = true;
                PendingPickupToolbarCtrl.ePage.Masters.CreatePickupBtnText = "Please Wait...";

                helperService.getFullObjectUsingGetById(appConfig.Entities.WmsPickupList.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response.Response) {
                        response.data.Response.Response.UIWmsPickup.PK = response.data.Response.Response.PK;
                        response.data.Response.Response.UIWmsPickup.ExternalReference = response.data.Response.Response.UIWmsPickup.WorkOrderID;
                        response.data.Response.Response.UIWmsPickup.ORG_Client_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WOD_ORG_Client_FK;
                        response.data.Response.Response.UIWmsPickup.ORG_Consignee_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WOD_ORG_Consignee_FK
                        response.data.Response.Response.UIWmsPickup.WAR_FK = PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList[0].WOD_WAR_FK;
                        angular.forEach(PendingPickupToolbarCtrl.ePage.Masters.PendingPickupList, function (value, key) {
                            var obj = {
                                "PK": "",
                                "WOL_Parent_FK": value.PK,
                                "ProductCode": value.DELPRD_Req_PrdCode,
                                "ProductDescription": value.DELPRD_Req_PrdDesc,
                                "ProductCondition": "GDC",
                                "PRO_FK": value.DELPRD_Req_PrdPk,
                                "MCC_NKCommodityCode": value.DELPRD_MCC_NKCommodityCode,
                                "Packs": value.Packs,
                                "PAC_PackType": value.PAC_PackType,
                                "Units": value.Units,
                                "StockKeepingUnit": value.DELPRD_StockKeepingUnit,
                                "PartAttrib1": value.PartAttrib1,
                                "PartAttrib2": value.PartAttrib2,
                                "PartAttrib3": value.PartAttrib3,
                                "PackingDate": value.PackingDate,
                                "ExpiryDate": value.ExpiryDate,
                                "UseExpiryDate": false,
                                "UsePackingDate": false,
                                "UsePartAttrib1": false,
                                "UsePartAttrib2": false,
                                "UsePartAttrib3": false,
                                "IsPartAttrib1ReleaseCaptured": false,
                                "IsPartAttrib2ReleaseCaptured": false,
                                "IsPartAttrib3ReleaseCaptured": false,
                                "WorkOrderLineType": "PIC",
                                "IsDeleted": false,
                                "ORG_ClientCode": value.WOD_ORG_Client_FK,
                                "ORG_ClientName": value.DEL_ClientName,
                                "Client_FK": value.DEL_ClientFk,

                                "WAR_WarehouseCode": value.DEL_WAR_Code,
                                "WAR_WarehouseName": value.DEL_WAR_Name,
                                "WAR_FK": value.WOD_WAR_FK,
                            };
                            response.data.Response.Response.UIWmsPickupLine.push(obj);
                        });
                        apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Insert.Url, response.data.Response.Response).then(function (response) {
                            if (response.data.Response) {
                                PendingPickupToolbarCtrl.ePage.Masters.IsCreatePickupBtn = false;
                                PendingPickupToolbarCtrl.ePage.Masters.CreatePickupBtnText = "Create Pickup";
                                toastr.success("Pickup Created Successfully");
                                helperService.refreshGrid();
                                var _queryString = {
                                    PK: response.data.Response.UIWmsPickup.PK,
                                    WorkOrderID: response.data.Response.UIWmsPickup.WorkOrderID,
                                };
                                _queryString = helperService.encryptData(_queryString);
                                $window.open("#/EA/single-record-view/pendingpickup/" + _queryString, "_blank");
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