(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryRequestToolbarController", DeliveryRequestToolbarController);

    DeliveryRequestToolbarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr", "$location", "warehouseConfig"];

    function DeliveryRequestToolbarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr, $location, warehouseConfig) {

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
            // InitAction();
        }

        function InitAction() {
            DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList = [];
            DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount = 0;
            DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount = 0
            angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.Input, function (value, key) {
                if (value.DeliveryLineStatus == "Delivered As Faulty") {
                    DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount + 1;
                    DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList.push(value);
                } else {
                    DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount = DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount + 1;
                }
            });
            if (DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount > 0) {
                DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                toastr.warning("Re-Delivery Request can be created when the Delivery Status is in 'Delivered As Faulty'.");
            }
        }
        // #region - Creating Re-Delivery
        function CreateDelivery() {
            DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList = [];
            DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount = 0;
            DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount = 0
            angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.Input, function (value, key) {
                if (value.DeliveryLineStatus == "Delivered As Faulty") {
                    DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount + 1;
                    DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList.push(value);
                } else {
                    DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount = DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount + 1;
                }
            });
            if (DeliveryRequestToolbarCtrl.ePage.Masters.OtherCount > 0) {
                DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                toastr.warning("Re-Delivery Request can be created when the Delivery Status is in 'Delivered As Faulty'.");
            } else {
                if (DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryCount > 0) {
                    var TempWarehouse = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].WarehouseCode;
                    var TempConsignee = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ConsigneeCode;
                    var TempClient = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ClientCode;
                    var count = 0;
                    // check whether the selected warehouse, client and consignee same or not
                    angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, function (value, key) {
                        if ((TempWarehouse == value.WarehouseCode) && (TempConsignee == value.ConsigneeCode) && (TempClient == value.ClientCode)) {
                            count = count + 1;
                        }
                    });
                    if (count == DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList.length) {
                        DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                        DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Please Wait...";
                        if (DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DeliveryRequest_FK) {
                            apiService.get("eAxisAPI", warehouseConfig.Entities.WmsDeliveryList.API.GetById.Url + DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DeliveryRequest_FK).then(function (response) {
                                if (response.data.Response) {
                                    DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData = response.data.Response;
                                    ReadyToCreateReDelivery();
                                }
                            });
                        } else {
                            // if the delivery header not available, get the address of warehouse and consignee from address findall
                            // get Consignee Job address
                            DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData = {};
                            DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIJobAddress = [];
                            var _filter = {
                                "ORG_FK": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Consignee_FK
                            };
                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
                            };
                            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    angular.forEach(response.data.Response, function (value, key) {
                                        angular.forEach(value.AddressCapability, function (value1, key1) {
                                            if (value1.IsMainAddress) {
                                                var SenderMainAddress = value;
                                                var obj = {
                                                    AddressType: "SUD",
                                                    ORG_FK: SenderMainAddress.ORG_FK,
                                                    OAD_Address_FK: SenderMainAddress.PK,
                                                    Address1: SenderMainAddress.Address1,
                                                    Address2: SenderMainAddress.Address2,
                                                    State: SenderMainAddress.State,
                                                    Postcode: SenderMainAddress.PostCode,
                                                    City: SenderMainAddress.City,
                                                    Email: SenderMainAddress.Email,
                                                    Mobile: SenderMainAddress.Mobile,
                                                    Phone: SenderMainAddress.Phone,
                                                    RN_NKCountryCode: SenderMainAddress.CountryCode,
                                                    Fax: SenderMainAddress.Fax
                                                }
                                                DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIJobAddress.push(obj);
                                            }
                                        });
                                    });
                                    var _filter = {
                                        "WAR_PK": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Warehouse_Fk
                                    };
                                    var _input = {
                                        "searchInput": helperService.createToArrayOfObject(_filter),
                                        "FilterID": warehouseConfig.Entities.OrgHeaderWarehouse.API.FindAll.FilterID
                                    };
                                    apiService.post("eAxisAPI", warehouseConfig.Entities.OrgHeaderWarehouse.API.FindAll.Url, _input).then(function (response) {
                                        if (response.data.Response) {
                                            if (response.data.Response.length > 0) {
                                                // get Warehouse Job address
                                                var _filter = {
                                                    "ORG_FK": response.data.Response[0].PK
                                                };
                                                var _input = {
                                                    "searchInput": helperService.createToArrayOfObject(_filter),
                                                    "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
                                                };
                                                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                                                    if (response.data.Response) {
                                                        angular.forEach(response.data.Response, function (value, key) {
                                                            angular.forEach(value.AddressCapability, function (value1, key1) {
                                                                if (value1.IsMainAddress) {
                                                                    var WarehouseMainAddress = value;
                                                                    var obj = {
                                                                        AddressType: "SND",
                                                                        ORG_FK: WarehouseMainAddress.ORG_FK,
                                                                        OAD_Address_FK: WarehouseMainAddress.PK,
                                                                        Address1: WarehouseMainAddress.Address1,
                                                                        Address2: WarehouseMainAddress.Address2,
                                                                        State: WarehouseMainAddress.State,
                                                                        Postcode: WarehouseMainAddress.PostCode,
                                                                        City: WarehouseMainAddress.City,
                                                                        Email: WarehouseMainAddress.Email,
                                                                        Mobile: WarehouseMainAddress.Mobile,
                                                                        Phone: WarehouseMainAddress.Phone,
                                                                        RN_NKCountryCode: WarehouseMainAddress.CountryCode,
                                                                        Fax: WarehouseMainAddress.Fax
                                                                    }
                                                                    DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIJobAddress.push(obj);
                                                                    ReadyToCreateReDelivery();
                                                                }
                                                            });
                                                        });
                                                    }
                                                });
                                            } else {
                                                ReadyToCreateReDelivery();
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        toastr.warning("Selected Warehouse, Client and Consignee should be same");
                    }
                }
            }
        }

        function ReadyToCreateReDelivery() {
            helperService.getFullObjectUsingGetById(warehouseConfig.Entities.WmsDeliveryList.API.GetById.Url, 'null').then(function (response) {
                if (response.data.Response.Response) {
                    response.data.Response.Response.UIWmsDelivery.PK = response.data.Response.Response.PK;
                    response.data.Response.Response.UIWmsDelivery.ExternalReference = response.data.Response.Response.UIWmsDelivery.WorkOrderID;
                    response.data.Response.Response.UIWmsDelivery.ORG_Client_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Client_Fk;
                    response.data.Response.Response.UIWmsDelivery.ORG_Consignee_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Consignee_FK
                    response.data.Response.Response.UIWmsDelivery.WAR_FK = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Warehouse_Fk;
                    response.data.Response.Response.UIWmsWorkorderReport.AdditionalRef1Code = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DropPoint;
                    response.data.Response.Response.UIWmsWorkorderReport.ResponseType = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ResponseType;
                    response.data.Response.Response.UIWmsWorkorderReport.RequestMode = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].RequestMode;
                    response.data.Response.Response.UIWmsWorkorderReport.Requester = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].RequesterName;
                    response.data.Response.Response.UIWmsWorkorderReport.RequesterContactNo = DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].RequesterContactNumber;
                    response.data.Response.Response.UIJobAddress = angular.copy(DeliveryRequestToolbarCtrl.ePage.Masters.DeliveryData.UIJobAddress);
                    angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                        value.PK = "";
                    });
                    angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, function (value, key) {
                        var obj = {
                            "PK": "",
                            "WOL_Parent_FK": value.DeliveryLine_FK,
                            "ProductCode": value.ProductCode,
                            "ProductDescription": value.ProductDescription,
                            "ProductCondition": "GDC",
                            "PRO_FK": value.PRO_FK,
                            "MCC_NKCommodityCode": "",
                            "Packs": value.Packs,
                            "PAC_PackType": value.PackType,
                            "Units": value.Quantity,
                            "StockKeepingUnit": value.UQ,
                            "PartAttrib1": "",
                            "PartAttrib2": "",
                            "PartAttrib3": "",
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
                            "WorkOrderLineStatus": "ENT",
                            "WorkOrderLineStatusDesc": "Entered"
                        };

                        obj.UISPMSDeliveryReport = {
                            "PK": "",
                            "DeliveryLine_FK": "",
                            "Client_Fk": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Client_Fk,
                            "ClientCode": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ClientCode,
                            "ClientName": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ClientName,
                            "Warehouse_Fk": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Warehouse_Fk,
                            "WarehouseCode": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].WarehouseCode,
                            "WarehouseName": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].WarehouseName,
                            "Consignee_FK": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].Consignee_FK,
                            "ConsigneeCode": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ConsigneeCode,
                            "ConsigneeName": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ConsigneeName,
                            "SiteCode": "",
                            "SiteName": "",
                            "StatusCode": "ENT",
                            "StatusDesc": "Entered",
                            "RequestMode": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].RequestMode,
                            "ResponseType": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].ResponseType,
                            "DropPoint": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].DropPoint,
                            "RequesterName": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].RequesterName,
                            "ReceiverName": "",
                            "ReceiverMailId": "",
                            "AcknowledgedPerson": "",
                            "CSRReceiver": "",
                            "AcknowledgedDateTime": "",
                            "RequestedDateTime": "",
                            "RequesterContactNumber": DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList[0].RequesterContactNumber,
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
                            "IsDeleted": false,
                            "DeliveryLineStatus": "Entered"
                        }
                        response.data.Response.Response.UIWmsDeliveryLine.push(obj);
                    });
                    apiService.post("eAxisAPI", warehouseConfig.Entities.WmsDeliveryList.API.Insert.Url, response.data.Response.Response).then(function (response) {
                        if (response.data.Response) {
                            DeliveryRequestToolbarCtrl.ePage.Masters.IsCreateDeliveryBtn = true;
                            DeliveryRequestToolbarCtrl.ePage.Masters.CreateDeliveryBtnText = "Create Re-Delivery";
                            // var DeliveryRequestFkCount = 0;
                            // angular.forEach(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, function (value, key) {
                            //     if (value.DeliveryRequest_FK) {
                            //         DeliveryRequestFkCount = DeliveryRequestFkCount + 1;
                            //         if (DeliveryRequestFkCount == DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList.length) {
                            //             ChangeDeliveryLineStatus();
                            //         }
                            //     } else {
                            //         DeliveryRequestFkCount = DeliveryRequestFkCount + 1;
                            //         apiService.get("eAxisAPI", warehouseConfig.Entities.WmsDeliveryReport.API.GetById.Url + value.PK).then(function (response) {
                            //             if (response.data.Response) {
                            //                 // if (response.data.Response.length > 0) {
                            //                 response.data.Response.IsModified = true;
                            //                 response.data.Response.DeliveryLineStatus = "Re-Delivery Created";
                            //                 apiService.post("eAxisAPI", warehouseConfig.Entities.WmsDeliveryReport.API.Update.Url, response.data.Response).then(function (response) {
                            //                     if (response.data.Response) {
                            //                         console.log("Delivery Report Updated for " + response.data.Response.DeliveryLineRefNo);
                            //                     }
                            //                 });
                            //                 // }
                            //             }
                            //         });
                            //     }
                            // });
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

        function ChangeDeliveryLineStatus() {
            var TempDeliveryList = _.groupBy(DeliveryRequestToolbarCtrl.ePage.Masters.CancelledDeliveryList, 'DeliveryRequest_FK');
            var TempDeliveryListCount = _.keys(TempDeliveryList).length;
            angular.forEach(TempDeliveryList, function (value2, key2) {
                apiService.get("eAxisAPI", warehouseConfig.Entities.WmsDeliveryList.API.GetById.Url + key2).then(function (response) {
                    if (response.data.Response) {
                        var count = 0;
                        angular.forEach(response.data.Response.UIWmsDeliveryLine, function (value1, key1) {
                            angular.forEach(value2, function (value, key) {
                                if (value1.PK == value.DeliveryLine_FK) {
                                    value1.WorkOrderLineStatus = "RDL";
                                    if (value1.UISPMSDeliveryReport)
                                        value1.UISPMSDeliveryReport.DeliveryLineStatus = "Re-Delivery Created";
                                }
                            });
                            if (value1.WorkOrderLineStatus == "RDL") {
                                count = count + 1;
                            }
                        });
                        if (count == response.data.Response.UIWmsDeliveryLine.length) {
                            response.data.Response.UIWmsDelivery.WorkOrderStatus = "RDL";
                        }
                        response.data.Response = filterObjectUpdate(response.data.Response, "IsModified");
                        apiService.post("eAxisAPI", warehouseConfig.Entities.WmsDeliveryList.API.Update.Url, response.data.Response).then(function (response) {
                            if (response.data.Response) {
                            }
                        });
                    }
                });
            });
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