(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupLineController", PickupLineController);

    PickupLineController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "pickupConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation"];

    function PickupLineController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, pickupConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation) {
        var PickupLineCtrl = this

        function Init() {

            var currentPickup = PickupLineCtrl.currentPickup[PickupLineCtrl.currentPickup.label].ePage.Entities;

            PickupLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Lines",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickup,
            };

            // DatePicker
            PickupLineCtrl.ePage.Masters.DatePicker = {};
            PickupLineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PickupLineCtrl.ePage.Masters.DatePicker.isOpen = [];
            PickupLineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            PickupLineCtrl.ePage.Masters.DropDownMasterList = {};
            PickupLineCtrl.ePage.Masters.userselected = "";
            PickupLineCtrl.ePage.Masters.selectedRow = -1;

            //Functions
            PickupLineCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            PickupLineCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            PickupLineCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            PickupLineCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;

            PickupLineCtrl.ePage.Masters.Config = $injector.get("pickupConfig");
            PickupLineCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            PickupLineCtrl.ePage.Masters.AddNewRow = AddNewRow;
            PickupLineCtrl.ePage.Masters.CopyRow = CopyRow;
            PickupLineCtrl.ePage.Masters.RemoveRow = RemoveRow;
            PickupLineCtrl.ePage.Masters.Attach = Attach;
            PickupLineCtrl.ePage.Masters.emptyText = '-';

            PickupLineCtrl.ePage.Masters.AttachDefaultFilter = {
                // "CancelledDate": "NULL",
                "WDR_DeliveryLineStatus": "Delivered"
            }

            PickupLineCtrl.ePage.Masters.Pagination = {};
            PickupLineCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            PickupLineCtrl.ePage.Masters.Pagination.MaxSize = 3;
            PickupLineCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            PickupLineCtrl.ePage.Masters.Pagination.LocalSearchLength = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.length;

            PickupLineCtrl.ePage.Masters.CurrentPageStartingIndex = (PickupLineCtrl.ePage.Masters.Pagination.ItemsPerPage) * (PickupLineCtrl.ePage.Masters.Pagination.CurrentPage - 1)

            GetUserBasedGridColumList();
            GetDropDownList();
        }

        function Attach($item) {
            angular.forEach($item, function (value, key) {
                var _isExist = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.some(function (value1, index1) {
                    return value1.WOL_Parent_FK === value.WDR_DeliveryLine_FK;
                });

                if (!_isExist) {
                    if (!value.PL_Pk) {
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
                            "ResponseType": value.ResponseType,
                            "PickupPoint": value.WDR_DropPoint,
                            "RequesterName": value.WDR_ReceiverName,
                            "ReceiverName": null,
                            "ReceiverMailId": null,
                            "AcknowledgedPerson": null,
                            "AcknowledgedDateTime": null,
                            "RequestedDateTime": null,
                            "RequesterContactNumber": null,
                            "PickupRequestNo": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID,
                            "PickupRequest_FK": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK,
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
                        PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.push(obj);
                    } else {
                        toastr.warning("Pickup " + value.WPR_PickupRequestNo + " Already Available for this Delivery Line " + value.WDR_DeliveryLineRefNo);
                    }
                } else {
                    toastr.warning(value.WDR_DeliveryLineRefNo + " Already Available...!");
                }
            });
        }

        function SelectedLookupProduct(item, index) {
            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].PRO_FK = item.OSP_FK;

            if (item.MCC_NKCommodityCode == null)
                item.MCC_NKCommodityCode = '';

            if (item.MCC_NKCommodityDesc == null)
                item.MCC_NKCommodityDesc = '';

            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].Commodity = item.MCC_NKCommodityCode + ' - ' + item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].PartAttrib1 = '';
            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].PartAttrib2 = '';
            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].PartAttrib3 = '';
            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].PackingDate = '';
            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].ExpiryDate = '';
            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].Units = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[index].Packs;

            OnChangeValues(item.ProductCode, 'E3093', true, index);
            OnChangeValues(item.StockKeepingUnit, 'E3097', true, index);
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ", "ProductCondition"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        PickupLineCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PickupLineCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            PickupLineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PICKUPLINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    PickupLineCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        PickupLineCtrl.ePage.Entities.Header.TableProperties.UIWmsPickupLine = obj;
                        PickupLineCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    PickupLineCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }

        function setSelectedRow(index) {
            PickupLineCtrl.ePage.Masters.selectedRow = index;
        }
        function AddNewRow() {
            PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "ProductCode": "",
                "ProductDescription": "",
                "ProductCondition": "",
                "PRO_FK": "",
                "Commodity": "",
                "MCC_NKCommodityCode": "",
                "MCC_NKCommodityDesc": "",
                "Packs": "",
                "PAC_PackType": "",
                "Units": "",
                "StockKeepingUnit": "",
                "PartAttrib1": "",
                "PartAttrib2": "",
                "PartAttrib3": "",
                "QtyMet": "",
                "ReservedUnit": "",
                "ShortQty": "",
                "LineComment": "",
                "PackingDate": "",
                "ExpiryDate": "",
                "UseExpiryDate": false,
                "UsePackingDate": false,
                "UsePartAttrib1": false,
                "UsePartAttrib2": false,
                "UsePartAttrib3": false,
                "IsPartAttrib1ReleaseCaptured": false,
                "IsPartAttrib2ReleaseCaptured": false,
                "IsPartAttrib3ReleaseCaptured": false,

                "IsDeleted": false,
                "ORG_ClientCode": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode,
                "ORG_ClientName": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName,
                "Client_FK": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK,

                "WAR_WarehouseCode": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode,
                "WAR_WarehouseName": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName,
                "WAR_FK": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WAR_FK,
            };
            if (PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client) {
                obj.Client = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode;
                obj.ClientRelationship = "OWN";
            }
            PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.push(obj);
            PickupLineCtrl.ePage.Masters.selectedRow = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("PickupLineCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.length - 1; i >= 0; i--) {
                if (PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[i].SingleSelect) {
                    var item = angular.copy(PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[i]);
                    var obj = {
                        "PK": "",
                        "ProductCode": item.ProductCode,
                        "ProductDescription": item.ProductDescription,
                        "ProductCondition": item.ProductCondition,
                        "PRO_FK": item.PRO_FK,
                        "Commodity": item.Commodity,
                        "MCC_NKCommodityCode": item.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": item.MCC_NKCommodityDesc,
                        "Packs": item.Packs,
                        "PAC_PackType": item.PAC_PackType,
                        "Units": item.Units,
                        "StockKeepingUnit": item.StockKeepingUnit,
                        "PartAttrib1": item.PartAttrib1,
                        "PartAttrib2": item.PartAttrib2,
                        "PartAttrib3": item.PartAttrib3,
                        "LineComment": item.LineComment,
                        "PackingDate": item.PackingDate,
                        "ExpiryDate": item.ExpiryDate,
                        "UseExpiryDate": item.UseExpiryDate,
                        "UsePackingDate": item.UsePackingDate,
                        "UsePartAttrib1": item.UsePartAttrib1,
                        "UsePartAttrib2": item.UsePartAttrib2,
                        "UsePartAttrib3": item.UsePartAttrib3,
                        "IsPartAttrib1ReleaseCaptured": item.IsPartAttrib1ReleaseCaptured,
                        "IsPartAttrib2ReleaseCaptured": item.IsPartAttrib2ReleaseCaptured,
                        "IsPartAttrib3ReleaseCaptured": item.IsPartAttrib3ReleaseCaptured,

                        "IsDeleted": false,
                        "IsCopied": true,
                        "ORG_ClientCode": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode,
                        "ORG_ClientName": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName,
                        "Client_FK": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK,

                        "WAR_WarehouseCode": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode,
                        "WAR_WarehouseName": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName,
                        "WAR_FK": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WAR_FK,
                    };
                    obj.UISPMSPickupReport = {
                        "PK": "",
                        "Client_FK": item.UISPMSPickupReport.Client_FK,
                        "ClientCode": item.UISPMSPickupReport.ClientCode,
                        "ClientName": item.UISPMSPickupReport.ClientName,
                        "Warehouse_FK": item.UISPMSPickupReport.Warehouse_FK,
                        "WarehouseCode": item.UISPMSPickupReport.WarehouseCode,
                        "WarehouseName": item.UISPMSPickupReport.WarehouseName,
                        "Consignee_FK": item.UISPMSPickupReport.Consignee_FK,
                        "ConsigneeCode": item.UISPMSPickupReport.ConsigneeCode,
                        "ConsigneeName": item.UISPMSPickupReport.ConsigneeName,
                        "SiteCode": item.UISPMSPickupReport.SiteCode,
                        "SiteName": item.UISPMSPickupReport.SiteName,
                        "StatusCode": item.UISPMSPickupReport.StatusCode,
                        "StatusDesc": item.UISPMSPickupReport.StatusDesc,
                        "RequestMode": item.UISPMSPickupReport.RequestMode,
                        "ResponseType": item.UISPMSPickupReport.ResponseType,
                        "PickupPoint": item.UISPMSPickupReport.PickupPoint,
                        "RequesterName": item.UISPMSPickupReport.RequesterName,
                        "ReceiverName": item.UISPMSPickupReport.ReceiverName,
                        "ReceiverMailId": item.UISPMSPickupReport.ReceiverMailId,
                        "AcknowledgedPerson": item.UISPMSPickupReport.AcknowledgedPerson,
                        "AcknowledgedDateTime": item.UISPMSPickupReport.AcknowledgedDateTime,
                        "RequestedDateTime": item.UISPMSPickupReport.RequestedDateTime,
                        "RequesterContactNumber": item.UISPMSPickupReport.RequesterContactNumber,
                        "PickupRequestNo": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID,
                        "PickupRequest_FK": PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK,
                        "PickupLineRefNo": "",
                        "ProductCode": item.UISPMSPickupReport.ProductCode,
                        "ProductDescription": item.UISPMSPickupReport.ProductDescription,
                        "Packs": item.UISPMSPickupReport.Packs,
                        "PackType": item.UISPMSPickupReport.PackType,
                        "Quantity": item.UISPMSPickupReport.Quantity,
                        "UQ": item.UISPMSPickupReport.UQ,
                        "ProductCondition": "",
                        "PickupProductStatus": "",
                        "UDF1": "",
                        "UDF2": "",
                        "UDF3": "",
                        "PackingDate": "",
                        "ExpiryDate": "",
                        "UseExpiryDate": item.UseExpiryDate,
                        "UsePackingDate": item.UsePackingDate,
                        "UsePartAttrib1": item.UsePartAttrib1,
                        "UsePartAttrib2": item.UsePartAttrib2,
                        "UsePartAttrib3": item.UsePartAttrib3,
                        "IsPartAttrib1ReleaseCaptured": item.IsPartAttrib1ReleaseCaptured,
                        "IsPartAttrib2ReleaseCaptured": item.IsPartAttrib2ReleaseCaptured,
                        "IsPartAttrib3ReleaseCaptured": item.IsPartAttrib3ReleaseCaptured,
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
                    if (PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client) {
                        obj.Client = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode;
                        obj.ClientRelationship = "OWN";
                    }
                    PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.splice(i + 1, 0, obj);
                }
            }
            PickupLineCtrl.ePage.Masters.selectedRow = -1;
            PickupLineCtrl.ePage.Masters.SelectAll = false;
            PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    var count = 0;
                    PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                    angular.forEach(PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            value.IsDeleted = true;
                            count = count + 1;
                        } else if (!value.PK && value.SingleSelect == true) {
                            var ReturnValue = RemoveAllLineErrors();
                            if (ReturnValue) {
                                for (var i = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.length - 1; i >= 0; i--) {
                                    if (PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[key].SingleSelect == true)
                                        PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.splice(key, 1);
                                }
                                toastr.success('Record Removed Successfully');
                                PickupLineCtrl.ePage.Masters.selectedRow = -1;
                                PickupLineCtrl.ePage.Masters.SelectAll = false;
                                PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                PickupLineCtrl.ePage.Masters.EnableDeleteButton = false;
                                PickupLineCtrl.ePage.Masters.Config.GeneralValidation(PickupLineCtrl.currentPickup);
                            }
                        }
                    });
                    if (count > 0) {
                        var obj = PickupLineCtrl.ePage.Entities.Header.Data;
                        apiService.post("eAxisAPI", PickupLineCtrl.ePage.Entities.Header.API.UpdatePickup.Url, obj).then(function (response) {
                            if (response.data.Response) {
                                apiService.get("eAxisAPI", PickupLineCtrl.ePage.Entities.Header.API.GetByID.Url + response.data.Response.UIWmsPickup.PK).then(function (response) {
                                    if (response.data.Response) {
                                        PickupLineCtrl.ePage.Entities.Header.Data = response.data.Response;
                                        PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode + ' - ' + PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
                                        PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode + ' - ' + PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
                                        PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode + ' - ' + PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName;
                                        toastr.success('Record Removed Successfully');
                                        PickupLineCtrl.ePage.Masters.selectedRow = -1;
                                        PickupLineCtrl.ePage.Masters.SelectAll = false;
                                        PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                        PickupLineCtrl.ePage.Masters.EnableDeleteButton = false;
                                    }
                                });
                            }
                        });
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.length; i++) {
                OnChangeValues('value', "E3092", true, i);
                OnChangeValues('value', "E3093", true, i);
                OnChangeValues('value', "E3094", true, i);
                OnChangeValues('value', "E3095", true, i);
                OnChangeValues('value', "E3096", true, i);
                OnChangeValues('value', "E3097", true, i);
            }
            return true;
        }

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine, function (value, key) {
                if (PickupLineCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    PickupLineCtrl.ePage.Masters.EnableDeleteButton = true;
                    PickupLineCtrl.ePage.Masters.EnableCopyButton = true;
                } else {
                    value.SingleSelect = false;
                    PickupLineCtrl.ePage.Masters.EnableDeleteButton = false;
                    PickupLineCtrl.ePage.Masters.EnableCopyButton = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                PickupLineCtrl.ePage.Masters.SelectAll = false;
            } else {
                PickupLineCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                PickupLineCtrl.ePage.Masters.EnableDeleteButton = true;
                PickupLineCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                PickupLineCtrl.ePage.Masters.EnableDeleteButton = false;
                PickupLineCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion
        function OnChangeValues(fieldvalue, code) {
            angular.forEach(PickupLineCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                PickupLineCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, PickupLineCtrl.currentPickup.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                PickupLineCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, PickupLineCtrl.currentPickup.label);
            }
        }
        function FetchQuantity(item, index) {
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                // OnChangeValues(item.Units, "E3520");
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    PickupLineCtrl.ePage.Masters.Loading = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PrdProductUnit.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            PickupLineCtrl.ePage.Masters.Loading = false;
                            OnChangeValues(item.Units, "E3096");
                        }
                    });
                }
            }
        }

        Init();
    }

})();