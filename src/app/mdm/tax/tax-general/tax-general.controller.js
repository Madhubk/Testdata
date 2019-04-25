(function () {
    "use strict";

    angular.module("Application")
        .controller("TaxGeneralController", TaxGeneralController);

    TaxGeneralController.$inject = ["$timeout", "helperService", "taxConfig", "appConfig", "authService", "apiService", "confirmation"];

    function TaxGeneralController($timeout, helperService, taxConfig, appConfig, authService, apiService, confirmation) {
        var TaxGeneralCtrl = this;

        function Init() {
            var currentTax = TaxGeneralCtrl.currentTax[TaxGeneralCtrl.currentTax.code].ePage.Entities;

            TaxGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Tax",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTax
            };
            
            TaxGeneralCtrl.ePage.Masters.TaxCategoryContent = false;
            TaxGeneralCtrl.ePage.Masters.TaxHierarchyContent = true;
            TaxGeneralCtrl.ePage.Masters.Config = taxConfig;

            /* Function */
            TaxGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            TaxGeneralCtrl.ePage.Masters.SelectCheckBoxTaxHierarchy = SelectCheckBoxTaxHierarchy;
            TaxGeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            TaxGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            TaxGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            TaxGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;
            TaxGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            TaxGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            TaxGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;

            TaxGeneralCtrl.ePage.Masters.OnChangeValidations = OnChangeValidations;

            /*  For table */
            TaxGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            TaxGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            TaxGeneralCtrl.ePage.Masters.Enable = true;
            TaxGeneralCtrl.ePage.Masters.selectedRow = -1;
            TaxGeneralCtrl.ePage.Masters.emptyText = '-';

            /* DropDown List */
            TaxGeneralCtrl.ePage.Masters.DropDownMasterList = {
                "TaxClasification": {
                    "ListSource": []
                },
            };

            GetMastersDropDownList();
        }

        //#region GetDropDownList
        function GetMastersDropDownList() {
            var typeCodeList = ["TaxClasification"];
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
                        TaxGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        TaxGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region  OnChange, Selected Hierarchy
        function OnChangeValues($item) {
            if ($item == "TDS") {
                TaxGeneralCtrl.ePage.Masters.TaxCategoryContent = true;
            }
            else {
                TaxGeneralCtrl.ePage.Masters.TaxCategoryContent = false;
            }
        }

        function SelectCheckBoxTaxHierarchy($item) {
            if ($item) {
                TaxGeneralCtrl.ePage.Masters.TaxHierarchyContent = false;
            } else {
                TaxGeneralCtrl.ePage.Masters.TaxHierarchyContent = true;
            }
        }
        //#endregion

        //#region SelectedLookup
        function SelectedLookupData($item) {
            if ($item) {
                OnChangeValidations($item.Code, 'E1208');
            }
        }
        //#endregion

        //#region  AddRow
        function AddNewRow() {
            var obj = {
                "PK": "",
                "Code": "",
                "Rate": "",
                "AT_Code": TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRate.Code,
                "IsModified": false,
                "IsDeleted": false,
            };

            TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.push(obj);
            TaxGeneralCtrl.ePage.Masters.selectedRow = TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("TaxGeneralCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            TaxGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function CopyRow() {
            for (var i = TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.length - 1; i >= 0; i--) {
                if (TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails[i].SingleSelect) {
                    var obj = angular.copy(TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails[i]);
                    obj.PK = "";
                    obj.CreatedDateTime = "";
                    obj.ModifiedDateTime = "";
                    obj.SingleSelect = false
                    obj.IsCopied = true;
                    obj.LineNo = TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.length + 1
                    TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.splice(i + 1, 0, obj);
                }
            }
            TaxGeneralCtrl.ePage.Masters.selectedRow = -1;
            TaxGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });
                for (var i = TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.length - 1; i >= 0; i--) {
                    if (TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails[i].SingleSelect == true && TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails[i].IsDeleted)
                        TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.splice(i, 1);
                }

                TaxGeneralCtrl.ePage.Masters.selectedRow = -1;
                TaxGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                TaxGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                TaxGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
            }, function () {
                console.log("Cancelled");
            });
        }

        function setSelectedRow($index) {
            TaxGeneralCtrl.ePage.Masters.selectedRow = $index;
        }

        function SingleSelectCheckBox() {
            var Checked = TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                TaxGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                TaxGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                TaxGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                TaxGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            } else {
                TaxGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                TaxGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(TaxGeneralCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails, function (value, key) {
                if (TaxGeneralCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    TaxGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                    TaxGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                }
                else {
                    value.SingleSelect = false;
                    TaxGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                    TaxGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                }
            });
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValidations(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(TaxGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                TaxGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, TaxGeneralCtrl.currentTax.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                TaxGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, TaxGeneralCtrl.currentTax.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init();
    }
})();