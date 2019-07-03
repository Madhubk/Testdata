(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DockConfigController", DockConfigController);

    DockConfigController.$inject = ["$timeout", "authService", "apiService", "warehousesConfig", "helperService", "$filter", "toastr", "appConfig", "confirmation", "warehouseConfig"];

    function DockConfigController($timeout, authService, apiService, warehousesConfig, helperService, $filter, toastr, appConfig, confirmation, warehouseConfig) {
        var DockConfigCtrl = this;

        function Init() {
            var currentWarehouse = DockConfigCtrl.currentWarehouse[DockConfigCtrl.currentWarehouse.label].ePage.Entities;

            DockConfigCtrl.ePage = {
                "Title": "",
                "Prefix": "Dock_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentWarehouse
            };

            DockConfigCtrl.ePage.Masters.Config = warehousesConfig;

            DockConfigCtrl.ePage.Masters.DropDownMasterList = {};

            //For table
            DockConfigCtrl.ePage.Masters.SelectAll = false;
            DockConfigCtrl.ePage.Masters.EnableDeleteButton = false;
            DockConfigCtrl.ePage.Masters.EnableCopyButton = false;
            DockConfigCtrl.ePage.Masters.Enable = true;
            DockConfigCtrl.ePage.Masters.selectedRow = -1;
            DockConfigCtrl.ePage.Masters.emptyText = '-';
            DockConfigCtrl.ePage.Masters.SearchTable = '';

            DockConfigCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            DockConfigCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            DockConfigCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            DockConfigCtrl.ePage.Masters.AddNewRow = AddNewRow;
            DockConfigCtrl.ePage.Masters.CopyRow = CopyRow;
            DockConfigCtrl.ePage.Masters.RemoveRow = RemoveRow;

            DockConfigCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            GetDockConfiguration();
            GetUserBasedGridColumList();
            GetDropdownList();
        }

        // #region - drop down
        function GetDropdownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["DockPurpose"];
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
                        DockConfigCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        DockConfigCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        // #endregion

        // #region - Get WMS_Dock_Config list
        function GetDockConfiguration() {
            var _filter = {
                WAR_FK: DockConfigCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsDockConfig.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsDockConfig.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig = response.data.Response;
                }
            });
        }
        // #endregion

        //#region User Based Table Column
        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_DOCKCONFIG",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    DockConfigCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        DockConfigCtrl.ePage.Entities.Header.TableProperties.WmsDockConfig = obj;
                        DockConfigCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    DockConfigCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig, function (value, key) {
                if (DockConfigCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    DockConfigCtrl.ePage.Masters.EnableDeleteButton = true;
                    DockConfigCtrl.ePage.Masters.EnableCopyButton = true;
                }
                else {
                    value.SingleSelect = false;
                    DockConfigCtrl.ePage.Masters.EnableDeleteButton = false;
                    DockConfigCtrl.ePage.Masters.EnableCopyButton = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                DockConfigCtrl.ePage.Masters.SelectAll = false;
            } else {
                DockConfigCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                DockConfigCtrl.ePage.Masters.EnableDeleteButton = true;
                DockConfigCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                DockConfigCtrl.ePage.Masters.EnableDeleteButton = false;
                DockConfigCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index) {
            DockConfigCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            DockConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "DockName": "",
                "DockOrder": "",
                "Purpose": "",
                "IsDeleted": false,
            };
            DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.push(obj);
            DockConfigCtrl.ePage.Masters.selectedRow = DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("DockConfigCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            DockConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            DockConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.length - 1; i >= 0; i--) {
                if (DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig[i].SingleSelect) {
                    var obj = angular.copy(DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect = false;
                    obj.IsCopied = true;
                    DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.splice(i + 1, 0, obj);
                }
            }
            DockConfigCtrl.ePage.Masters.selectedRow = -1;
            DockConfigCtrl.ePage.Masters.SelectAll = false;
            DockConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    DockConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", DockConfigCtrl.ePage.Entities.Header.API.WmsDockConfigDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });

                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.length - 1; i >= 0; i--) {
                            if (DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig[i].SingleSelect == true)
                                DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.splice(i, 1);
                        }
                        DockConfigCtrl.ePage.Masters.Config.GeneralValidation(DockConfigCtrl.currentWarehouse);
                    }
                    toastr.success('Record Removed Successfully');
                    DockConfigCtrl.ePage.Masters.selectedRow = -1;
                    DockConfigCtrl.ePage.Masters.SelectAll = false;
                    DockConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    DockConfigCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(DockConfigCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                DockConfigCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DockConfigCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                DockConfigCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DockConfigCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < DockConfigCtrl.ePage.Entities.Header.Data.WmsDockConfig.length; i++) {
                OnChangeValues('value', "E4009", true, i);
                OnChangeValues('value', "E4010", true, i);
                OnChangeValues('value', "E4011", true, i);
            }
            return true;
        }
        //#endregion Validation

        Init();
    }
})();