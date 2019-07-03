(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AreaDetailsController", AreaDetailsController);

    AreaDetailsController.$inject = ["$timeout", "authService", "apiService", "warehousesConfig", "helperService", "$filter", "toastr", "appConfig", "$injector", "confirmation",];

    function AreaDetailsController($timeout, authService, apiService, warehousesConfig, helperService, $filter, toastr, appConfig, $injector, confirmation) {
        var AreaDetailsCtrl = this;

        function Init() {
            var currentWarehouse = AreaDetailsCtrl.currentWarehouse[AreaDetailsCtrl.currentWarehouse.label].ePage.Entities;

            AreaDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Area_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentWarehouse
            };

            AreaDetailsCtrl.ePage.Masters.Config = warehousesConfig;

            //For table
            AreaDetailsCtrl.ePage.Masters.SelectAll = false;
            AreaDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
            AreaDetailsCtrl.ePage.Masters.EnableCopyButton = false;
            AreaDetailsCtrl.ePage.Masters.Enable = true;
            AreaDetailsCtrl.ePage.Masters.selectedRow = -1;
            AreaDetailsCtrl.ePage.Masters.emptyText = '-';
            AreaDetailsCtrl.ePage.Masters.SearchTable = '';

            AreaDetailsCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            AreaDetailsCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            AreaDetailsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            AreaDetailsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            AreaDetailsCtrl.ePage.Masters.CopyRow = CopyRow;
            AreaDetailsCtrl.ePage.Masters.RemoveRow = RemoveRow;

            AreaDetailsCtrl.ePage.Masters.DropDownMasterList = {};

            AreaDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            GetUserBasedGridColumList();
            AreaList();
            GetDropDownList();
        }

        //#region User Based Table Column
        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_WAREHOUSEMASTER",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    AreaDetailsCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        AreaDetailsCtrl.ePage.Entities.Header.TableProperties.WmsArea = obj;
                        AreaDetailsCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    AreaDetailsCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion

        //#region Get dropdown values
        function GetDropDownList() {
            var typeCodeList = ["AreaType"];
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
                        AreaDetailsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        AreaDetailsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion Dropdwon list

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea, function (value, key) {
                if (AreaDetailsCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    AreaDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                    AreaDetailsCtrl.ePage.Masters.EnableCopyButton = true;
                }
                else {
                    value.SingleSelect = false;
                    AreaDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                    AreaDetailsCtrl.ePage.Masters.EnableCopyButton = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                AreaDetailsCtrl.ePage.Masters.SelectAll = false;
            } else {
                AreaDetailsCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                AreaDetailsCtrl.ePage.Masters.EnableDeleteButton = true;
                AreaDetailsCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                AreaDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                AreaDetailsCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region General    
        function AreaList() {
            AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea = $filter('orderBy')(AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea, 'CreatedDateTime');
            AreaDetailsCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject.WmsArea = angular.copy(AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea);
        }
        //#endregion General

        //#region Add,copy,delete row

        function setSelectedRow(index) {
            AreaDetailsCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            AreaDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": null,
                "Name": null,
                "AreaType": null,
                "IsDeleted": false,
            };
            AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.push(obj);
            AreaDetailsCtrl.ePage.Masters.selectedRow = AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("AreaDetailsCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            AreaDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            AreaDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.length - 1; i >= 0; i--) {
                if (AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea[i].SingleSelect) {
                    var obj = angular.copy(AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea[i]);
                    obj.PK = null;
                    obj.CreatedDateTime = null;
                    obj.ModifiedDateTime = null;
                    obj.SingleSelect = false;
                    obj.IsCopied = true;
                    AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.splice(i + 1, 0, obj);
                }
            }
            AreaDetailsCtrl.ePage.Masters.selectedRow = -1;
            AreaDetailsCtrl.ePage.Masters.SelectAll = false;
            AreaDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    AreaDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", AreaDetailsCtrl.ePage.Entities.Header.API.AreaDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });

                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.length - 1; i >= 0; i--) {
                            if (AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea[i].SingleSelect == true)
                                AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.splice(i, 1);
                        }
                        AreaDetailsCtrl.ePage.Masters.Config.GeneralValidation(AreaDetailsCtrl.currentWarehouse);
                    }
                    toastr.success('Record Removed Successfully');
                    AreaDetailsCtrl.ePage.Masters.selectedRow = -1;
                    AreaDetailsCtrl.ePage.Masters.SelectAll = false;
                    AreaDetailsCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    AreaDetailsCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(AreaDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                AreaDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AreaDetailsCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                AreaDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, AreaDetailsCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < AreaDetailsCtrl.ePage.Entities.Header.Data.WmsArea.length; i++) {
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