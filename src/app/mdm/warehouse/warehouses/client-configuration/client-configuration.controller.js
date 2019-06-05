(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ClientConfigController", ClientConfigController);

    ClientConfigController.$inject = ["$timeout", "authService", "apiService", "warehousesConfig", "helperService", "$filter", "toastr", "appConfig", "confirmation", "warehouseConfig"];

    function ClientConfigController($timeout, authService, apiService, warehousesConfig, helperService, $filter, toastr, appConfig, confirmation, warehouseConfig) {
        var ClientConfigCtrl = this;

        function Init() {
            var currentWarehouse = ClientConfigCtrl.currentWarehouse[ClientConfigCtrl.currentWarehouse.label].ePage.Entities;

            ClientConfigCtrl.ePage = {
                "Title": "",
                "Prefix": "Area_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentWarehouse
            };

            ClientConfigCtrl.ePage.Masters.Config = warehousesConfig;

            //For table
            ClientConfigCtrl.ePage.Masters.SelectAll = false;
            ClientConfigCtrl.ePage.Masters.EnableDeleteButton = false;
            ClientConfigCtrl.ePage.Masters.EnableCopyButton = false;
            ClientConfigCtrl.ePage.Masters.Enable = true;
            ClientConfigCtrl.ePage.Masters.selectedRow = -1;
            ClientConfigCtrl.ePage.Masters.emptyText = '-';
            ClientConfigCtrl.ePage.Masters.SearchTable = '';

            ClientConfigCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ClientConfigCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ClientConfigCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ClientConfigCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ClientConfigCtrl.ePage.Masters.CopyRow = CopyRow;
            ClientConfigCtrl.ePage.Masters.RemoveRow = RemoveRow;

            ClientConfigCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ClientConfigCtrl.ePage.Masters.SelectedLookupOrg = SelectedLookupOrg;

            GetClientParameterByWarehouse();
            GetUserBasedGridColumList();
        }

        // #region - Selected lookup
        function SelectedLookupOrg(item, index) {
            ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[index].ORG_FK = item.PK;
            ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[index].ORG_Code = item.Code;
            ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[index].ORG_Name = item.FullName;
        }
        // #endregion

        // #region - Get WmsClientParameterByWarehouse list
        function GetClientParameterByWarehouse() {
            var _filter = {
                WAR_FK: ClientConfigCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK,
                ORG_IsWarehouseClient: true
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsClientParameterByWarehouse.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsClientParameterByWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse = response.data.Response;
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
                "EntitySource": "WMS_CLIENTCONFIG",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    ClientConfigCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ClientConfigCtrl.ePage.Entities.Header.TableProperties.WmsClientParameterByWarehouse = obj;
                        ClientConfigCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    ClientConfigCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse, function (value, key) {
                if (ClientConfigCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    ClientConfigCtrl.ePage.Masters.EnableDeleteButton = true;
                    ClientConfigCtrl.ePage.Masters.EnableCopyButton = true;
                }
                else {
                    value.SingleSelect = false;
                    ClientConfigCtrl.ePage.Masters.EnableDeleteButton = false;
                    ClientConfigCtrl.ePage.Masters.EnableCopyButton = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                ClientConfigCtrl.ePage.Masters.SelectAll = false;
            } else {
                ClientConfigCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                ClientConfigCtrl.ePage.Masters.EnableDeleteButton = true;
                ClientConfigCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                ClientConfigCtrl.ePage.Masters.EnableDeleteButton = false;
                ClientConfigCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index) {
            ClientConfigCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            ClientConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "ORG_Code": "",
                "ORG_Name": "",
                "IsDeleted": false,
            };
            ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.push(obj);
            ClientConfigCtrl.ePage.Masters.selectedRow = ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("ClientConfigCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ClientConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            ClientConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.length - 1; i >= 0; i--) {
                if (ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[i].SingleSelect) {
                    var obj = angular.copy(ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect = false;
                    obj.IsCopied = true;
                    ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.splice(i + 1, 0, obj);
                }
            }
            ClientConfigCtrl.ePage.Masters.selectedRow = -1;
            ClientConfigCtrl.ePage.Masters.SelectAll = false;
            ClientConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
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
                    ClientConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", ClientConfigCtrl.ePage.Entities.Header.API.WmsClientParameterByWarehouseDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });

                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.length - 1; i >= 0; i--) {
                            if (ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[i].SingleSelect == true)
                                ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.splice(i, 1);
                        }
                        ClientConfigCtrl.ePage.Masters.Config.GeneralValidation(ClientConfigCtrl.currentWarehouse);
                    }
                    toastr.success('Record Removed Successfully');
                    ClientConfigCtrl.ePage.Masters.selectedRow = -1;
                    ClientConfigCtrl.ePage.Masters.SelectAll = false;
                    ClientConfigCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ClientConfigCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion Add,copy,delete row

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ClientConfigCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ClientConfigCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ClientConfigCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ClientConfigCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ClientConfigCtrl.currentWarehouse.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < ClientConfigCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.length; i++) {
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