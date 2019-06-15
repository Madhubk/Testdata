(function () {
    "use strict";

    angular.module("Application")
        .controller("ConfigurationController", ConfigurationController);

    ConfigurationController.$inject = ["$timeout", "$uibModalInstance", "apiService", "appConfig", "organizationConfig", "authService", "helperService", "param", "CompanyDataIndex", "toastr", "confirmation"];

    function ConfigurationController($timeout, $uibModalInstance, apiService, appConfig, organizationConfig, authService, helperService, param, CompanyDataIndex, toastr, confirmation) {
        var ConfigurationCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            ConfigurationCtrl.ePage = {
                "Title": "",
                "Prefix": "Configuration",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": angular.copy(currentOrganization)
            };

            ConfigurationCtrl.ePage.Masters.param = angular.copy(param);
            ConfigurationCtrl.ePage.Masters.CompanyDataIndex = angular.copy(CompanyDataIndex);

            ConfigurationCtrl.ePage.Masters.CloseButtonText = "Close";
            ConfigurationCtrl.ePage.Masters.SaveButtonText = "Save";
            ConfigurationCtrl.ePage.Masters.IsDisableSave = false;
            ConfigurationCtrl.ePage.Masters.DisabledAccDetails = true;

            /* Function */
            ConfigurationCtrl.ePage.Masters.Close = Close;
            ConfigurationCtrl.ePage.Masters.Validation = Validation;
            ConfigurationCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ConfigurationCtrl.ePage.Masters.CopyRow = CopyRow;
            ConfigurationCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ConfigurationCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConfigurationCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ConfigurationCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ConfigurationCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            ConfigurationCtrl.ePage.Masters.OnChangeAccDetails = OnChangeAccDetails;

            /* For Table */
            ConfigurationCtrl.ePage.Masters.SelectAll = false;
            ConfigurationCtrl.ePage.Masters.EnableCopyButton = true;
            ConfigurationCtrl.ePage.Masters.EnableDeleteButton = true;
            ConfigurationCtrl.ePage.Masters.Enable = true;
            ConfigurationCtrl.ePage.Masters.selectedRow = -1;
            ConfigurationCtrl.ePage.Masters.emptyText = '-';

            /* DropDown List */
            ConfigurationCtrl.ePage.Masters.DropDownMasterList = {
                "AccountGroup": {
                    "ListSource": []
                },
                "GSTRecognition": {
                    "ListSource": []
                },
                "JobType": {
                    "ListSource": []
                },
                "BussType": {
                    "ListSource": []
                },
                "ModeofTransport": {
                    "ListSource": []
                }
            };

            GetDropDownList();
        }

        //#region GetDropDownList
        function GetDropDownList() {
            var typeCodeList = ["AccountGroup", "GSTRecognition", "JOBTYPE", "BUSSTYPE", "ModeofTransport"];
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
                        ConfigurationCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ConfigurationCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region AddNewRow, CopyRow, RemoveRow
        function AddNewRow() {
            var obj = {
                "PK": "",
                "JobType": "",
                "BusinessType": "",
                "ModeOfTransport": "",
                "Currency": "",
                "CfxPercentage": "",
                "CfxMin": "",
                "IsModified": false,
                "IsDeleted": false,
            };
            ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift.push(obj);
            ConfigurationCtrl.ePage.Masters.selectedRow = ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("ConfigurationCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
        }

        function CopyRow() {
            for (var i = ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift.length - 1; i >= 0; i--) {
                if (ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift[i].SingleSelect) {
                    var obj = angular.copy(ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect = false;
                    obj.IsCopied = true;
                    ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift.splice(i + 1, 0, obj);
                }
            }
            ConfigurationCtrl.ePage.Masters.selectedRow = -1;
            ConfigurationCtrl.ePage.Masters.SelectAll = false;
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

                    angular.forEach(ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", organizationConfig.Entities.API.CurrencyUplift.API.Delete.Url + value.PK).then(function (response) { });
                        }
                    });

                    for (var i = ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift.length - 1; i >= 0; i--) {
                        if (ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift[i].SingleSelect == true)
                            ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift.splice(i, 1);
                    }
                    toastr.success('Record Removed Successfully');
                    ConfigurationCtrl.ePage.Masters.selectedRow = -1;
                    ConfigurationCtrl.ePage.Masters.SelectAll = false;
                    ConfigurationCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion

        //#region 
        function setSelectedRow(index) {
            ConfigurationCtrl.ePage.Masters.selectedRow = index;
        }
        //#endregion

        //#region Checkbox SingleSelectCheckBox, SelectAllCheckBox
        function SingleSelectCheckBox() {
            var Checked = ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                ConfigurationCtrl.ePage.Masters.SelectAll = false;
            } else {
                ConfigurationCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                ConfigurationCtrl.ePage.Masters.EnableCopyButton = false;
                ConfigurationCtrl.ePage.Masters.EnableDeleteButton = false;
            } else {
                ConfigurationCtrl.ePage.Masters.EnableCopyButton = true;
                ConfigurationCtrl.ePage.Masters.EnableDeleteButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(ConfigurationCtrl.ePage.Entities.Header.Data.objUICurrencyUplift, function (value, key) {
                if (ConfigurationCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    ConfigurationCtrl.ePage.Masters.EnableCopyButton = false;
                    ConfigurationCtrl.ePage.Masters.EnableDeleteButton = false;
                } else {
                    value.SingleSelect = false;
                    ConfigurationCtrl.ePage.Masters.EnableCopyButton = true;
                    ConfigurationCtrl.ePage.Masters.EnableDeleteButton = true;
                }
            });
        }
        //#endregion

        //#region SelectedLookupData
        function SelectedLookupData($index, $item) {
        }
        //#endregion

        //#region Checkbox OnChangeAccDetails
        function OnChangeAccDetails($item) {
            if ($item) {
                ConfigurationCtrl.ePage.Masters.DisabledAccDetails = false;
            } else {
                ConfigurationCtrl.ePage.Masters.DisabledAccDetails = true;
            }
        }
        //#endregion

        //#region Close, Validation With Save
        function Close() {
            $uibModalInstance.close();
        }

        function Validation(CurrentEntity, CurrentEntityGridTable) {
            ConfigurationCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ConfigurationCtrl.ePage.Masters.IsDisableSave = true;

            ConfigurationCtrl.ePage.Entities.Header.Data[CurrentEntity] = filterObjectUpdate(ConfigurationCtrl.ePage.Entities.Header.Data[CurrentEntity], "IsModified");

            ConfigurationCtrl.ePage.Entities.Header.Data[CurrentEntityGridTable] = filterObjectUpdate(ConfigurationCtrl.ePage.Entities.Header.Data[CurrentEntityGridTable], "IsModified");

            if (ConfigurationCtrl.ePage.Entities.Header.Data[CurrentEntityGridTable].length > 0) {
                ConfigurationCtrl.ePage.Entities.Header.Data[CurrentEntityGridTable].map(function (value, key) {
                    (value.PK) ? value.IsModified = true : value.IsModified = false;
                });
            }

            ConfigurationCtrl.ePage.Masters.param.Entity[ConfigurationCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = ConfigurationCtrl.ePage.Entities.Header.Data;

            helperService.SaveEntity(ConfigurationCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
                if (response.Status === "success") {
                    if (response.Data) {
                        var _exports = {
                            data: response.Data
                        };
                        toastr.success("Saved Successfully...!");
                        $uibModalInstance.close(_exports);
                    }
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    toastr.warning("Failed to Save...!");
                    ConfigurationCtrl.ePage.Masters.SaveButtonText = "Save";
                    ConfigurationCtrl.ePage.Masters.IsDisableSave = false;
                    $uibModalInstance.close();
                }
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
        //#endregion

        Init();
    }
})();