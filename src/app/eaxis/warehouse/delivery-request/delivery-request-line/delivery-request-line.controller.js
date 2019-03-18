(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryLineController", DeliveryLineController);

    DeliveryLineController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "deliveryConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation"];

    function DeliveryLineController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, deliveryConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation) {
        var DeliveryLineCtrl = this

        function Init() {
            var currentDelivery = DeliveryLineCtrl.currentDelivery[DeliveryLineCtrl.currentDelivery.label].ePage.Entities;

            DeliveryLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Lines",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDelivery,
            };
            // DatePicker
            DeliveryLineCtrl.ePage.Masters.DatePicker = {};
            DeliveryLineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DeliveryLineCtrl.ePage.Masters.DatePicker.isOpen = [];
            DeliveryLineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            DeliveryLineCtrl.ePage.Masters.DropDownMasterList = {};
            DeliveryLineCtrl.ePage.Masters.userselected = "";
            DeliveryLineCtrl.ePage.Masters.selectedRow = -1;

            //Functions
            DeliveryLineCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            DeliveryLineCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            DeliveryLineCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            DeliveryLineCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;

            DeliveryLineCtrl.ePage.Masters.Config = $injector.get("deliveryConfig");
            DeliveryLineCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            DeliveryLineCtrl.ePage.Masters.AddNewRow = AddNewRow;
            DeliveryLineCtrl.ePage.Masters.CopyRow = CopyRow;
            DeliveryLineCtrl.ePage.Masters.RemoveRow = RemoveRow;
            DeliveryLineCtrl.ePage.Masters.AddToOutward = AddToOutward;
            DeliveryLineCtrl.ePage.Masters.emptyText = '-';
            DeliveryLineCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
            DeliveryLineCtrl.ePage.Masters.setSelectedOutwardRow = setSelectedOutwardRow;
            DeliveryLineCtrl.ePage.Masters.AddDeliveryLineToOutward = AddDeliveryLineToOutward;

            GetUserBasedGridColumList();
            GetDropDownList();
        }
        // #region - adding new delivery line to existing outward
        function CloseEditActivityModal() {
            DeliveryLineCtrl.ePage.Masters.modalInstance.dismiss('cancel');
        }

        function AddDeliveryLineToOutward() {
            if (DeliveryLineCtrl.ePage.Masters.selectedOutwardRow >= 0) {
                DeliveryLineCtrl.ePage.Masters.Loading = true;
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + DeliveryLineCtrl.ePage.Masters.UnFinalizedOrders[DeliveryLineCtrl.ePage.Masters.selectedOutwardRow].PK).then(function (response) {
                    if (response.data.Response) {
                        angular.forEach(DeliveryLineCtrl.ePage.Masters.SelectedDeliveryLine, function (value, key) {
                            if (DeliveryLineCtrl.ePage.Masters.UnFinalizedOrders[DeliveryLineCtrl.ePage.Masters.selectedOutwardRow].WorkOrderSubType == "MTR") {
                                value.MOL_PrdCode = value.DL_Req_PrdCode;
                            } else {
                                value.OL_PrdCode = value.DL_Req_PrdCode;
                            }
                            var obj = {
                                "Parent_FK": value.DL_PK,
                                "PK": "",
                                "WorkOrderType": "ORD",
                                "WorkOrderLineType": "ORD",
                                "WorkOrderID": response.data.Response.UIWmsOutwardHeader.WorkOrderID,
                                "ExternalReference": response.data.Response.UIWmsOutwardHeader.WorkOrderID,
                                "WOD_FK": response.data.Response.PK,
                                "ProductCode": value.DL_Req_PrdCode,
                                "ProductDescription": value.DL_Req_PrdDesc,
                                "PRO_FK": value.DL_Req_PrdPk,
                                "Commodity": value.Commodity,
                                "MCC_NKCommodityCode": value.DL_MCC_NKCommodityCode,
                                "MCC_NKCommodityDesc": value.DL_MCC_NKCommodityDesc,
                                "ProductCondition": "GDC",
                                "Packs": value.DL_Packs,
                                "PAC_PackType": value.DL_PAC_PackType,
                                "Units": value.DL_Units,
                                "StockKeepingUnit": value.DL_StockKeepingUnit,
                                "PartAttrib1": value.DL_PartAttrib1,
                                "PartAttrib2": value.DL_PartAttrib2,
                                "PartAttrib3": value.DL_PartAttrib3,
                                "LineComment": value.DL_LineComment,
                                "PackingDate": value.DL_PackingDate,
                                "ExpiryDate": value.DL_ExpiryDate,
                                "AdditionalRef1Code": value.DL_AdditionalRef1Code,
                                "AdditionalRef1Type": "DeliveryLine",
                                "AdditionalRef1Fk": value.DL_PK,
                                "UseExpiryDate": value.DL_UseExpiryDate,
                                "UsePackingDate": value.DL_UsePackingDate,
                                "UsePartAttrib1": value.DL_UsePartAttrib1,
                                "UsePartAttrib2": value.DL_UsePartAttrib2,
                                "UsePartAttrib3": value.DL_UsePartAttrib3,
                                "IsPartAttrib1ReleaseCaptured": value.DL_IsPartAttrib1ReleaseCaptured,
                                "IsPartAttrib2ReleaseCaptured": value.DL_IsPartAttrib2ReleaseCaptured,
                                "IsPartAttrib3ReleaseCaptured": value.DL_IsPartAttrib3ReleaseCaptured,

                                "IsDeleted": false,
                                "ORG_ClientCode": value.DEL_ClientCode,
                                "ORG_ClientName": value.DEL_ClientName,
                                "Client_FK": value.DEL_Client_FK,

                                "WAR_WarehouseCode": value.DEL_WAR_Code,
                                "WAR_WarehouseName": value.DEL_WAR_Name,
                                "WAR_FK": value.DEL_WAR_FK,
                            };
                            response.data.Response.UIWmsWorkOrderLine.push(obj);
                        });
                        response.data.Response = filterObjectUpdate(response.data.Response, "IsModified");
                        apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.Update.Url, response.data.Response).then(function (response) {
                            if (response.data.Status == 'Success') {
                                DeliveryLineCtrl.ePage.Masters.OutwardDetails = response.data.Response;
                                toastr.success("Delivery Line added to the Order " + DeliveryLineCtrl.ePage.Masters.OutwardDetails.UIWmsOutwardHeader.WorkOrderID);
                                DeliveryLineCtrl.ePage.Masters.Loading = false;
                                deliveryConfig.CallOutwardFunction = true;
                                DeliveryLineCtrl.ePage.Entities.Header.Data = filterObjectUpdate(DeliveryLineCtrl.ePage.Entities.Header.Data, "IsModified");
                                apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Update.Url, DeliveryLineCtrl.ePage.Entities.Header.Data).then(function (response) {
                                    if (response.data.Response) {
                                        apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + response.data.Response.UIWmsDelivery.PK).then(function (response) {
                                            if (response.data.Response) {
                                                DeliveryLineCtrl.ePage.Entities.Header.Data = response.data.Response;
                                                DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode + ' - ' + DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
                                                DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode + ' - ' + DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName;
                                                DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                toastr.warning("Select the Order");
            }
            DeliveryLineCtrl.ePage.Masters.modalInstance.dismiss('cancel');
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

        function AddToOutward() {
            DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var count = 0;
            var SelectedLine = [];
            angular.forEach(DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                if (!value.PK && value.SingleSelect == true) {
                    count = count + 1;
                } else if (value.PK && value.SingleSelect == true) {
                    SelectedLine.push(value);
                }
            });
            if (count > 0) {
                toastr.warning("Save the line(s) before add to Order.")
            } else {
                var _filter = {
                    "WOD_Parent_FK": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.WmsOutwardList.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            DeliveryLineCtrl.ePage.Masters.UnFinalizedOrders = [];
                            DeliveryLineCtrl.ePage.Entities.Header.Data.DeliveryOrders = response.data.Response;
                            angular.forEach(DeliveryLineCtrl.ePage.Entities.Header.Data.DeliveryOrders, function (v, k) {
                                if (v.WorkOrderStatus != "FIN") {
                                    DeliveryLineCtrl.ePage.Masters.UnFinalizedOrders.push(v);
                                }
                            });
                            if (DeliveryLineCtrl.ePage.Masters.UnFinalizedOrders.length > 0) {
                                DeliveryLineCtrl.ePage.Masters.SelectedDeliveryLine = [];
                                angular.forEach(DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                                    if (value.PK && value.SingleSelect == true) {
                                        angular.forEach(DeliveryLineCtrl.ePage.Entities.Header.Data.UIvwWmsDeliveryList, function (value1, key1) {
                                            if (value.PK == value1.DL_PK) {
                                                if (value1.MOL_PrdCode || value1.OL_PrdCode) {
                                                    var TempOutwardNo = value1.MOL_PrdCode ? value1.MOT_WorkOrderId : value1.OUT_WorkOrderId;
                                                    toastr.warning("This Delivery line " + value1.DL_AdditionalRef1Code + " already attached to outward " + TempOutwardNo);
                                                } else {
                                                    DeliveryLineCtrl.ePage.Masters.SelectedDeliveryLine.push(value1);
                                                }
                                            }
                                        });
                                    }
                                });
                                if (DeliveryLineCtrl.ePage.Masters.SelectedDeliveryLine.length == SelectedLine.length) {
                                    OpenModal();
                                }
                            } else {
                                toastr.warning("It can be added when the Order(s) is not Finalized.")
                            }
                        } else {
                            toastr.warning("Order not yet created.")
                        }
                    }
                });
            }
        }

        function OpenModal() {
            return DeliveryLineCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup1",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/delivery-request/delivery-request-line/outward-details.html"
            });
        }
        function setSelectedOutwardRow(index) {
            DeliveryLineCtrl.ePage.Masters.selectedOutwardRow = index;
        }
        // #endregion
        // #region - general
        function SelectedLookupProduct(item, index) {
            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].PRO_FK = item.OSP_FK;

            if (item.MCC_NKCommodityCode == null)
                item.MCC_NKCommodityCode = '';

            if (item.MCC_NKCommodityDesc == null)
                item.MCC_NKCommodityDesc = '';

            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].Commodity = item.MCC_NKCommodityCode + ' - ' + item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].PartAttrib1 = '';
            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].PartAttrib2 = '';
            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].PartAttrib3 = '';
            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].PackingDate = '';
            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].ExpiryDate = '';
            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].Units = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[index].Packs;

            OnChangeValues(item.ProductCode, 'E3086', true, index);
            OnChangeValues(item.StockKeepingUnit, 'E3090', true, index);
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
                        DeliveryLineCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        DeliveryLineCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            DeliveryLineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_DELIVERYLINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    DeliveryLineCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        DeliveryLineCtrl.ePage.Entities.Header.TableProperties.UIWmsDeliveryLine = obj;
                        DeliveryLineCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    DeliveryLineCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        // #endregion
        // #region -  Add, copy, delete row activities
        function AddNewRow() {
            DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "ProductCode": "",
                "ProductDescription": "",
                "ProductCondition": "GDC",
                "PRO_FK": "",
                "WorkOrderLineType": "DEL",
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
                "ORG_ClientCode": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode,
                "ORG_ClientName": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName,
                "Client_FK": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Client_FK,

                "WAR_WarehouseCode": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode,
                "WAR_WarehouseName": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName,
                "WAR_FK": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_FK,
            };
            obj.UISPMSDeliveryReport = {
                "PK": "",
                "DeliveryLine_FK": "",
                "DeliveryLineStatus": "",
                "Client_Fk": null,
                "ClientCode": null,
                "ClientName": null,
                "Warehouse_Fk": null,
                "WarehouseCode": null,
                "WarehouseName": null,
                "Consignee_FK": null,
                "ConsigneeCode": null,
                "ConsigneeName": null,
                "SiteCode": null,
                "SiteName": null,
                "StatusCode": null,
                "StatusDesc": null,
                "RequestMode": null,
                "ResponseType": null,
                "DropPoint": null,
                "RequesterName": null,
                "ReceiverName": null,
                "ReceiverMailId": null,
                "AcknowledgedPerson": null,
                "CSRReceiver": "",
                "AcknowledgedDateTime": null,
                "RequestedDateTime": null,
                "RequesterContactNumber": null,
                "DeliveryRequestNo": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrdrID,
                "DeliveryRequest_FK": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK,
                "DeliveryLineRefNo": null,
                "PRO_FK": null,
                "ProductCode": null,
                "ProductDescription": null,
                "Packs": null,
                "PackType": null,
                "Quantity": null,
                "UQ": null,
                "ProductCondition": null,
                "UDF1": null,
                "UDF2": null,
                "UDF3": null,
                "PackingDate": null,
                "ExpiryDate": null,
                "DEL_MTR_OUT_RefNo": null,
                "DEL_MTR_OUT_Fk": null,
                "DEL_MTR_FromWH_Fk": null,
                "DEL_MTR_ToWH_Fk": null,
                "DEL_MTR_FromWH_Code": null,
                "DEL_MTR_ToWH_Code": null,
                "DEL_MTR_FromWH_Name": null,
                "DEL_MTR_ToWH_Name": null,
                "DEL_MTR_OUT_ExternalRefNumber": null,
                "DEL_MTR_CustomerReference": null,
                "DEL_MTR_OL_Fk": null,
                "DEL_MTR_INW_RefNo": null,
                "DEL_MTR_INW_Fk": null,
                "DEL_MTR_IL_Fk": null,
                "DEL_MTR_OUT_CreatedDateTime": null,
                "DEL_OUT_RefNo": null,
                "DEL_OOU_Fk": null,
                "DEL_OUT_ExternalRefNumber": null,
                "DEL_OUT_CustomerReference": null,
                "DEL_OUT_CreatedDateTime": null,
                "DEL_OL_Fk": null,
                "DEL_OL_Product_Fk": null,
                "DEL_OL_ProductCode": null,
                "DEL_OL_ProductDesc": null,
                "DEL_PickUDF1": null,
                "DEL_PickUDF2": null,
                "DEL_PickUDF3": null,
                "Manifest_Fk": null,
                "ManifestNo": null,
                "ManifestType": null,
                "VehicleType": null,
                "VehicleNo": null,
                "DriverName": null,
                "DriverContactNo": null,
                "EstimatedDispatchDate": null,
                "EstimatedDeliveryDate": null,
                "Consignment_Fk": null,
                "ConsignmentNumber": null,
                "ActualDispatchDate": null,
                "AcutalDeliveryDate": null,
                "Receiver": null,
                "ReceiverContactNumber": null,
                "DeliveryComments": null,
                "CancelledDateTime": null,
                "IsModified": false,
                "IsDeleted": false,
                "UsePartAttrib1": "",
                "UsePartAttrib2": "",
                "UsePartAttrib3": "",
                "IsPartAttrib1ReleaseCaptured": "",
                "IsPartAttrib2ReleaseCaptured": "",
                "IsPartAttrib3ReleaseCaptured": "",
                "UseExpiryDate": "",
                "UsePackingDate": ""
            }
            if (DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client) {
                obj.Client = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode;
                obj.ClientRelationship = "OWN";
            }
            DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.push(obj);
            DeliveryLineCtrl.ePage.Masters.selectedRow = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("DeliveryLineCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.length - 1; i >= 0; i--) {
                if (DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[i].SingleSelect) {
                    var item = angular.copy(DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[i]);
                    var obj = {
                        "PK": "",
                        "ProductCode": item.ProductCode,
                        "ProductDescription": item.ProductDescription,
                        "ProductCondition": item.ProductCondition,
                        "PRO_FK": item.PRO_FK,
                        "Commodity": item.Commodity,
                        "WorkOrderLineType": item.WorkOrderLineType,
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
                        "ORG_ClientCode": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode,
                        "ORG_ClientName": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName,
                        "Client_FK": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Client_FK,

                        "WAR_WarehouseCode": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode,
                        "WAR_WarehouseName": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName,
                        "WAR_FK": DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_FK,
                    };
                    obj.UISPMSDeliveryReport = {
                        "PK": "",
                        "DeliveryLine_FK": "",
                        "DeliveryLineStatus": "",
                        "Client_Fk": item.UISPMSDeliveryReport.Client_FK,
                        "ClientCode": item.UISPMSDeliveryReport.ClientCode,
                        "ClientName": item.UISPMSDeliveryReport.ClientName,
                        "Warehouse_Fk": item.UISPMSDeliveryReport.Warehouse_Fk,
                        "WarehouseCode": item.UISPMSDeliveryReport.WarehouseCode,
                        "WarehouseName": item.UISPMSDeliveryReport.WarehouseName,
                        "Consignee_FK": item.UISPMSDeliveryReport.Consignee_FK,
                        "ConsigneeCode": item.UISPMSDeliveryReport.ConsigneeCode,
                        "ConsigneeName": item.UISPMSDeliveryReport.ConsigneeName,
                        "SiteCode": item.UISPMSDeliveryReport.SiteCode,
                        "SiteName": item.UISPMSDeliveryReport.SiteName,
                        "StatusCode": item.UISPMSDeliveryReport.StatusCode,
                        "StatusDesc": item.UISPMSDeliveryReport.StatusDesc,
                        "RequestMode": item.UISPMSDeliveryReport.RequestMode,
                        "ResponseType": item.UISPMSDeliveryReport.ResponseType,
                        "DropPoint": item.UISPMSDeliveryReport.DropPoint,
                        "RequesterName": item.UISPMSDeliveryReport.RequesterName,
                        "ReceiverName": item.UISPMSDeliveryReport.ReceiverName,
                        "ReceiverMailId": item.UISPMSDeliveryReport.ReceiverMailId,
                        "AcknowledgedPerson": item.UISPMSDeliveryReport.AcknowledgedPerson,
                        "CSRReceiver": item.UISPMSDeliveryReport.CSRReceiver,
                        "AcknowledgedDateTime": item.UISPMSDeliveryReport.AcknowledgedDateTime,
                        "RequestedDateTime": item.UISPMSDeliveryReport.RequestedDateTime,
                        "RequesterContactNumber": item.UISPMSDeliveryReport.RequesterContactNumber,
                        "DeliveryRequestNo": item.UISPMSDeliveryReport.DeliveryRequestNo,
                        "DeliveryRequest_FK": item.UISPMSDeliveryReport.DeliveryRequest_FK,
                        "DeliveryLineRefNo": item.UISPMSDeliveryReport.DeliveryLineRefNo,
                        "PRO_FK": item.UISPMSDeliveryReport.PRO_FK,
                        "ProductCode": item.UISPMSDeliveryReport.ProductCode,
                        "ProductDescription": item.UISPMSDeliveryReport.ProductDescription,
                        "Packs": item.UISPMSDeliveryReport.Packs,
                        "PackType": item.UISPMSDeliveryReport.PackType,
                        "Quantity": item.UISPMSDeliveryReport.Quantity,
                        "UQ": item.UISPMSDeliveryReport.UQ,
                        "ProductCondition": item.UISPMSDeliveryReport.ProductCondition,
                        "UDF1": item.UISPMSDeliveryReport.UDF1,
                        "UDF2": item.UISPMSDeliveryReport.UDF2,
                        "UDF3": item.UISPMSDeliveryReport.UDF3,
                        "PackingDate": item.UISPMSDeliveryReport.PackingDate,
                        "ExpiryDate": item.UISPMSDeliveryReport.ExpiryDate,
                        "DEL_MTR_OUT_RefNo": item.UISPMSDeliveryReport.DEL_MTR_OUT_RefNo,
                        "DEL_MTR_OUT_Fk": item.UISPMSDeliveryReport.DEL_MTR_OUT_Fk,
                        "DEL_MTR_FromWH_Fk": item.UISPMSDeliveryReport.DEL_MTR_FromWH_Fk,
                        "DEL_MTR_ToWH_Fk": item.UISPMSDeliveryReport.DEL_MTR_ToWH_Fk,
                        "DEL_MTR_FromWH_Code": item.UISPMSDeliveryReport.DEL_MTR_FromWH_Code,
                        "DEL_MTR_ToWH_Code": item.UISPMSDeliveryReport.DEL_MTR_FromWH_Name,
                        "DEL_MTR_FromWH_Name": item.UISPMSDeliveryReport.DEL_MTR_FromWH_Name,
                        "DEL_MTR_ToWH_Name": item.UISPMSDeliveryReport.DEL_MTR_ToWH_Name,
                        "DEL_MTR_OUT_ExternalRefNumber": item.UISPMSDeliveryReport.DEL_MTR_OUT_ExternalRefNumber,
                        "DEL_MTR_CustomerReference": item.UISPMSDeliveryReport.DEL_MTR_CustomerReference,
                        "DEL_MTR_OL_Fk": item.UISPMSDeliveryReport.DEL_MTR_OL_Fk,
                        "DEL_MTR_INW_RefNo": item.UISPMSDeliveryReport.DEL_MTR_INW_RefNo,
                        "DEL_MTR_INW_Fk": item.UISPMSDeliveryReport.DEL_MTR_INW_Fk,
                        "DEL_MTR_IL_Fk": item.UISPMSDeliveryReport.DEL_MTR_IL_Fk,
                        "DEL_MTR_OUT_CreatedDateTime": item.UISPMSDeliveryReport.DEL_MTR_OUT_CreatedDateTime,
                        "DEL_OUT_RefNo": item.UISPMSDeliveryReport.DEL_OUT_RefNo,
                        "DEL_OOU_Fk": item.UISPMSDeliveryReport.DEL_OOU_Fk,
                        "DEL_OUT_ExternalRefNumber": item.UISPMSDeliveryReport.DEL_OUT_ExternalRefNumber,
                        "DEL_OUT_CustomerReference": item.UISPMSDeliveryReport.DEL_OUT_CustomerReference,
                        "DEL_OUT_CreatedDateTime": item.UISPMSDeliveryReport.DEL_OUT_CreatedDateTime,
                        "DEL_OL_Fk": item.UISPMSDeliveryReport.DEL_OL_Fk,
                        "DEL_OL_Product_Fk": item.UISPMSDeliveryReport.DEL_OL_Product_Fk,
                        "DEL_OL_ProductCode": item.UISPMSDeliveryReport.DEL_OL_ProductCode,
                        "DEL_OL_ProductDesc": item.UISPMSDeliveryReport.DEL_OL_ProductDesc,
                        "DEL_PickUDF1": item.UISPMSDeliveryReport.DEL_PickUDF1,
                        "DEL_PickUDF2": item.UISPMSDeliveryReport.DEL_PickUDF2,
                        "DEL_PickUDF3": item.UISPMSDeliveryReport.DEL_PickUDF3,
                        "Manifest_Fk": item.UISPMSDeliveryReport.Manifest_Fk,
                        "ManifestNo": item.UISPMSDeliveryReport.ManifestNo,
                        "ManifestType": item.UISPMSDeliveryReport.ManifestType,
                        "VehicleType": item.UISPMSDeliveryReport.VehicleType,
                        "VehicleNo": item.UISPMSDeliveryReport.VehicleNo,
                        "DriverName": item.UISPMSDeliveryReport.DriverName,
                        "DriverContactNo": item.UISPMSDeliveryReport.DriverContactNo,
                        "EstimatedDispatchDate": item.UISPMSDeliveryReport.EstimatedDispatchDate,
                        "EstimatedDeliveryDate": item.UISPMSDeliveryReport.EstimatedDeliveryDate,
                        "Consignment_Fk": item.UISPMSDeliveryReport.Consignment_Fk,
                        "ConsignmentNumber": item.UISPMSDeliveryReport.ConsignmentNumber,
                        "ActualDispatchDate": item.UISPMSDeliveryReport.ActualDispatchDate,
                        "AcutalDeliveryDate": item.UISPMSDeliveryReport.AcutalDeliveryDate,
                        "Receiver": item.UISPMSDeliveryReport.Receiver,
                        "ReceiverContactNumber": item.UISPMSDeliveryReport.ReceiverContactNumber,
                        "DeliveryComments": item.UISPMSDeliveryReport.DeliveryComments,
                        "CancelledDateTime": item.UISPMSDeliveryReport.CancelledDateTime,
                        "IsModified": false,
                        "IsDeleted": false,
                        "UsePartAttrib1": item.UISPMSDeliveryReport.UsePartAttrib1,
                        "UsePartAttrib2": item.UISPMSDeliveryReport.UsePartAttrib2,
                        "UsePartAttrib3": item.UISPMSDeliveryReport.UsePartAttrib3,
                        "IsPartAttrib1ReleaseCaptured": item.UISPMSDeliveryReport.IsPartAttrib1ReleaseCaptured,
                        "IsPartAttrib2ReleaseCaptured": item.UISPMSDeliveryReport.IsPartAttrib2ReleaseCaptured,
                        "IsPartAttrib3ReleaseCaptured": item.UISPMSDeliveryReport.IsPartAttrib3ReleaseCaptured,
                        "UseExpiryDate": item.UISPMSDeliveryReport.UseExpiryDate,
                        "UsePackingDate": item.UISPMSDeliveryReport.UsePackingDate
                    }
                    if (DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client) {
                        obj.Client = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode;
                        obj.ClientRelationship = "OWN";
                    }
                    DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.splice(i + 1, 0, obj);
                }
            }
            DeliveryLineCtrl.ePage.Masters.selectedRow = -1;
            DeliveryLineCtrl.ePage.Masters.SelectAll = false;
            DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                    angular.forEach(DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            value.IsDeleted = true;
                            value.UISPMSDeliveryReport.IsDeleted = true;
                            count = count + 1;
                        } else if (!value.PK && value.SingleSelect == true) {
                            var ReturnValue = RemoveAllLineErrors();
                            if (ReturnValue) {
                                for (var i = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.length - 1; i >= 0; i--) {
                                    if (DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[i].SingleSelect == true)
                                        DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.splice(i, 1);
                                }
                                toastr.success('Record Removed Successfully');
                                DeliveryLineCtrl.ePage.Masters.Config.GeneralValidation(DeliveryLineCtrl.currentDelivery);
                                DeliveryLineCtrl.ePage.Masters.selectedRow = -1;
                                DeliveryLineCtrl.ePage.Masters.SelectAll = false;
                                DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                DeliveryLineCtrl.ePage.Masters.EnableDeleteButton = false;
                            }
                        }
                    });
                    if (count > 0) {
                        var obj = DeliveryLineCtrl.ePage.Entities.Header.Data;
                        apiService.post("eAxisAPI", DeliveryLineCtrl.ePage.Entities.Header.API.UpdateDelivery.Url, obj).then(function (response) {
                            if (response.data.Response) {
                                apiService.get("eAxisAPI", DeliveryLineCtrl.ePage.Entities.Header.API.GetByID.Url + response.data.Response.UIWmsDelivery.PK).then(function (response) {
                                    if (response.data.Response) {
                                        DeliveryLineCtrl.ePage.Entities.Header.Data = response.data.Response;
                                        DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
                                        DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode + ' - ' + DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
                                        DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode + ' - ' + DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName;
                                        toastr.success('Record Removed Successfully');
                                        DeliveryLineCtrl.ePage.Masters.selectedRow = -1;
                                        DeliveryLineCtrl.ePage.Masters.SelectAll = false;
                                        DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                        DeliveryLineCtrl.ePage.Masters.EnableDeleteButton = false;
                                    }
                                });
                            }
                        });
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }
        function setSelectedRow(index) {
            DeliveryLineCtrl.ePage.Masters.selectedRow = index;
        }
        function RemoveAllLineErrors() {
            for (var i = 0; i < DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.length; i++) {
                OnChangeValues('value', "E3085", true, i);
                OnChangeValues('value', "E3086", true, i);
                OnChangeValues('value', "E3087", true, i);
                OnChangeValues('value', "E3088", true, i);
                OnChangeValues('value', "E3089", true, i);
                OnChangeValues('value', "E3090", true, i);
            }
            return true;
        }
        function FetchQuantity(item, index) {
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                // OnChangeValues(item.Units, "E3089");
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    DeliveryLineCtrl.ePage.Masters.Loading = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PrdProductUnit.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            DeliveryLineCtrl.ePage.Masters.Loading = false;
                            OnChangeValues(item.Units, "E3089");
                        }
                    });
                }
            }
        }
        // #endregion
        // #region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                if (DeliveryLineCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    DeliveryLineCtrl.ePage.Masters.EnableDeleteButton = true;
                    DeliveryLineCtrl.ePage.Masters.EnableCopyButton = true;
                } else {
                    value.SingleSelect = false;
                    DeliveryLineCtrl.ePage.Masters.EnableDeleteButton = false;
                    DeliveryLineCtrl.ePage.Masters.EnableCopyButton = false;
                }
            });
        }
        function SingleSelectCheckBox() {
            var Checked = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                DeliveryLineCtrl.ePage.Masters.SelectAll = false;
            } else {
                DeliveryLineCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                DeliveryLineCtrl.ePage.Masters.EnableDeleteButton = true;
                DeliveryLineCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                DeliveryLineCtrl.ePage.Masters.EnableDeleteButton = false;
                DeliveryLineCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion
        // #region - validation
        function OnChangeValues(fieldvalue, code) {
            angular.forEach(DeliveryLineCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                DeliveryLineCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DeliveryLineCtrl.currentDelivery.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                DeliveryLineCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DeliveryLineCtrl.currentDelivery.label);
            }
        }
        // #endregion

        Init();
    }

})();