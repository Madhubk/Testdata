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
            PickupLineCtrl.ePage.Masters.emptyText = '-';

            PickupLineCtrl.ePage.Masters.Pagination = {};
            PickupLineCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            PickupLineCtrl.ePage.Masters.Pagination.MaxSize = 3;
            PickupLineCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            PickupLineCtrl.ePage.Masters.Pagination.LocalSearchLength = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.length;

            PickupLineCtrl.ePage.Masters.CurrentPageStartingIndex = (PickupLineCtrl.ePage.Masters.Pagination.ItemsPerPage) * (PickupLineCtrl.ePage.Masters.Pagination.CurrentPage - 1)

            GetUserBasedGridColumList();
            GetDropDownList();
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
                "EntitySource": "WMS_OUTWARDLINE",
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
                    PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                    angular.forEach(PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            value.IsDeleted = true;
                        }
                    });
                    var obj = PickupLineCtrl.ePage.Entities.Header.Data;
                    apiService.post("eAxisAPI", PickupLineCtrl.ePage.Entities.Header.API.UpdatePickup.Url, obj).then(function (response) {
                    });
                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.length - 1; i >= 0; i--) {
                            if (PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine[i].SingleSelect == true)
                                PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.splice(i, 1);
                        }
                        PickupLineCtrl.ePage.Masters.Config.GeneralValidation(PickupLineCtrl.currentPickup);
                    }
                    toastr.success('Record Removed Successfully');
                    PickupLineCtrl.ePage.Masters.selectedRow = -1;
                    PickupLineCtrl.ePage.Masters.SelectAll = false;
                    PickupLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    PickupLineCtrl.ePage.Masters.EnableDeleteButton = false;
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
                var startData = PickupLineCtrl.ePage.Masters.CurrentPageStartingIndex
                var LastData = PickupLineCtrl.ePage.Masters.CurrentPageStartingIndex + (PickupLineCtrl.ePage.Masters.Pagination.ItemsPerPage);

                if (PickupLineCtrl.ePage.Masters.SelectAll) {

                    // Enable and disable based on page wise
                    if ((key >= startData) && (key < LastData)) {
                        value.SingleSelect = true;
                    }
                }
                else {
                    if ((key >= startData) && (key < LastData)) {
                        value.SingleSelect = false;
                    }
                }
            });

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

        function SingleSelectCheckBox() {
            var startData = PickupLineCtrl.ePage.Masters.CurrentPageStartingIndex
            var LastData = PickupLineCtrl.ePage.Masters.CurrentPageStartingIndex + (PickupLineCtrl.ePage.Masters.Pagination.ItemsPerPage);

            var Checked = PickupLineCtrl.ePage.Entities.Header.Data.UIWmsPickupLine.some(function (value, key) {
                // Enable and disable based on page wise
                if ((key >= startData) && (key < LastData)) {
                    if (!value.SingleSelect)
                        return true;
                }
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