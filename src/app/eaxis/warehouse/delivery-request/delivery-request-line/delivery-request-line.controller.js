(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryLineController", DeliveryLineController);

        DeliveryLineController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "deliveryConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation"];

    function DeliveryLineController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, deliveryConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation){
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

            DeliveryLineCtrl.ePage.Masters.Config = $injector.get("deliveryConfig");
            DeliveryLineCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            DeliveryLineCtrl.ePage.Masters.AddNewRow = AddNewRow;
            DeliveryLineCtrl.ePage.Masters.CopyRow = CopyRow;
            DeliveryLineCtrl.ePage.Masters.RemoveRow = RemoveRow;
            DeliveryLineCtrl.ePage.Masters.emptyText = '-';

            DeliveryLineCtrl.ePage.Masters.Pagination = {};
            DeliveryLineCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            DeliveryLineCtrl.ePage.Masters.Pagination.MaxSize = 3;
            DeliveryLineCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            DeliveryLineCtrl.ePage.Masters.Pagination.LocalSearchLength = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.length;

            DeliveryLineCtrl.ePage.Masters.CurrentPageStartingIndex = (DeliveryLineCtrl.ePage.Masters.Pagination.ItemsPerPage) * (DeliveryLineCtrl.ePage.Masters.Pagination.CurrentPage - 1)

            GetUserBasedGridColumList();
            GetDropDownList();
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ"];
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
                "EntitySource": "WMS_OUTWARDLINE",
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
                "ProductCondition":"GDC",
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
                        "ProductCondition":item.ProductCondition,
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
                    DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                    angular.forEach(DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            value.IsDeleted = true;
                        }
                    });
                    var obj = DeliveryLineCtrl.ePage.Entities.Header.Data;
                    apiService.post("eAxisAPI", DeliveryLineCtrl.ePage.Entities.Header.API.UpdateDelivery.Url, obj).then(function (response) {
                    });
                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.length - 1; i >= 0; i--) {
                            if (DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine[i].SingleSelect == true)
                                DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.splice(i, 1);
                        }
                        DeliveryLineCtrl.ePage.Masters.Config.GeneralValidation(DeliveryLineCtrl.currentDelivery);
                    }
                    toastr.success('Record Removed Successfully');
                    DeliveryLineCtrl.ePage.Masters.selectedRow = -1;
                    DeliveryLineCtrl.ePage.Masters.SelectAll = false;
                    DeliveryLineCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    DeliveryLineCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.length; i++) {
                OnChangeValues('value', "E3504", true, i);
                OnChangeValues('value', "E3505", true, i);
                OnChangeValues('value', "E3506", true, i);
                OnChangeValues('value', "E3520", true, i);
                OnChangeValues('value', "E3521", true, i);
                OnChangeValues('value', "E3530", true, i);
            }
            return true;
        }

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                var startData = DeliveryLineCtrl.ePage.Masters.CurrentPageStartingIndex
                var LastData = DeliveryLineCtrl.ePage.Masters.CurrentPageStartingIndex + (DeliveryLineCtrl.ePage.Masters.Pagination.ItemsPerPage);

                if (DeliveryLineCtrl.ePage.Masters.SelectAll) {

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

        function SingleSelectCheckBox() {
            var startData = DeliveryLineCtrl.ePage.Masters.CurrentPageStartingIndex
            var LastData = DeliveryLineCtrl.ePage.Masters.CurrentPageStartingIndex + (DeliveryLineCtrl.ePage.Masters.Pagination.ItemsPerPage);

            var Checked = DeliveryLineCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine.some(function (value, key) {
                // Enable and disable based on page wise
                if ((key >= startData) && (key < LastData)) {
                    if (!value.SingleSelect)
                        return true;
                }
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
                OnChangeValues(item.Units, "E3520");
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
                            OnChangeValues(item.Units, "E3520");
                        }
                    });
                }
            }
        }
        
        Init();
    }

})();