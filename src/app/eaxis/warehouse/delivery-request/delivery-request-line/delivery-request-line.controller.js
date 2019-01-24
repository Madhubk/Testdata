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
            DeliveryLineCtrl.ePage.Masters.emptyText = '-';



            GetUserBasedGridColumList();
            GetDropDownList();
        }

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

        function setSelectedRow(index) {
            DeliveryLineCtrl.ePage.Masters.selectedRow = index;
        }
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

        //#region checkbox selection
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

        Init();
    }

})();