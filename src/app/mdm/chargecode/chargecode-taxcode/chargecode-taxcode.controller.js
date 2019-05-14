(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeTaxcodeController", ChargecodeTaxcodeController);

    ChargecodeTaxcodeController.$inject = ["$timeout", "apiService", "appConfig", "authService", "helperService", "chargecodeConfig", "confirmation"];

    function ChargecodeTaxcodeController($timeout, apiService, appConfig, authService, helperService, chargecodeConfig, confirmation) {

        var ChargecodeTaxcodeCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeTaxcodeCtrl.currentChargecode[ChargecodeTaxcodeCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeTaxcodeCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeTaxcodeCtrl.ePage.Masters.Config = chargecodeConfig;

            /* Function  */
            ChargecodeTaxcodeCtrl.ePage.Masters.OnChangeValidations = OnChangeValidations;
            ChargecodeTaxcodeCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ChargecodeTaxcodeCtrl.ePage.Masters.CopyRow = CopyRow;
            ChargecodeTaxcodeCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ChargecodeTaxcodeCtrl.ePage.Masters.SetSelectedRow = SetSelectedRow;
            ChargecodeTaxcodeCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ChargecodeTaxcodeCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ChargecodeTaxcodeCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;

            /*  For table */
            ChargecodeTaxcodeCtrl.ePage.Masters.EnableDeleteButton = true;
            ChargecodeTaxcodeCtrl.ePage.Masters.EnableCopyButton = true;
            ChargecodeTaxcodeCtrl.ePage.Masters.Enable = true;
            ChargecodeTaxcodeCtrl.ePage.Masters.selectedRow = -1;
            ChargecodeTaxcodeCtrl.ePage.Masters.emptyText = '-';

            /* DropDown List */
            ChargecodeTaxcodeCtrl.ePage.Masters.DropDownMasterList = {
                "ChargeAccountType": {
                    "ListSource": []
                },
                "ChargeJobType": {
                    "ListSource": []
                },
                "ChargeTransportMode": {
                    "ListSource": []
                }
            };

            GetDropDownList();
        }

        //#region DropDownList
        function GetDropDownList() {
            var typeCodeList = ["ChargeAccountType", "ChargeJobType", "ChargeTransportMode"];
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
                        ChargecodeTaxcodeCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ChargecodeTaxcodeCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        //#endregion

        //#region AddNewRow, CopyRow, RemoveRow 
        function AddNewRow() {
            var obj = {
                "PK": "",
                "CostSellAll": "",
                "JobType": "",
                "TransportMode": "",
                "AT_Code": "",
                "Direction": "",
                "IncoTerm": "",
                "Origin": "",
                "Destination": "",
                "AT": "",
                "TaxRegCntryOrGroup": "",
                "CustomsStatus": "",
                "HomeCountryOrZone": "",
                "TaxRegCntryOrZone": "",
                "VATExemptOnExportCharges": "",
                "IsAnIndividual": "",
                "ParentTableCode": "",
                "OrganisationCategory": "",
                "SplitPaymentVATOrganisation": "",
                "IsModified": false,
                "IsDeleted": false,
                "LineNo": ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.length + 1
            };

            ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.push(obj);
            ChargecodeTaxcodeCtrl.ePage.Masters.selectedRow = ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("ChargecodeTaxcodeCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ChargecodeTaxcodeCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function CopyRow() {
            for (var i = ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.length - 1; i >= 0; i--) {
                if (ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride[i].SingleSelect) {
                    var obj = angular.copy(ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride[i]);
                    obj.PK = "";
                    obj.CreatedDateTime = "";
                    obj.ModifiedDateTime = "";
                    obj.SingleSelect = false
                    obj.IsCopied = true;
                    obj.LineNo = ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.length + 1
                    ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.splice(i + 1, 0, obj);
                }
            }

            ChargecodeTaxcodeCtrl.ePage.Masters.selectedRow = -1;
            ChargecodeTaxcodeCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        apiService.get("eAxisAPI", chargecodeConfig.Entities.API.AccTaxOverride.API.Delete.Url + value.PK).then(function (response) {
                            console.log("Success");
                        });
                    }
                });

                for (var i = ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.length - 1; i >= 0; i--) {
                    if (ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride[i].SingleSelect && ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride[i].IsDeleted) {
                        ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.splice(i, 1);
                    }
                }

                ChargecodeTaxcodeCtrl.ePage.Masters.selectedRow = -1;
                ChargecodeTaxcodeCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                ChargecodeTaxcodeCtrl.ePage.Masters.EnableCopyButton = true;
                ChargecodeTaxcodeCtrl.ePage.Masters.EnableDeleteButton = true;
            }, function () {
                console.log("Cancelled");
            });
        }
        //#endregion

        //#region SetSelectedRow
        function SetSelectedRow($index) {
            ChargecodeTaxcodeCtrl.ePage.Masters.selectedRow = $index;
        }
        //#endregion

        //#region SingleSelectCheckBox, SelectAllCheckBox
        function SingleSelectCheckBox() {
            var Checked = ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                ChargecodeTaxcodeCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                ChargecodeTaxcodeCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                ChargecodeTaxcodeCtrl.ePage.Masters.EnableDeleteButton = false;
                ChargecodeTaxcodeCtrl.ePage.Masters.EnableCopyButton = false;
            } else {
                ChargecodeTaxcodeCtrl.ePage.Masters.EnableDeleteButton = true;
                ChargecodeTaxcodeCtrl.ePage.Masters.EnableCopyButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride, function (value, key) {
                if (ChargecodeTaxcodeCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    ChargecodeTaxcodeCtrl.ePage.Masters.EnableDeleteButton = false;
                    ChargecodeTaxcodeCtrl.ePage.Masters.EnableCopyButton = false;
                }
                else {
                    value.SingleSelect = false;
                    ChargecodeTaxcodeCtrl.ePage.Masters.EnableDeleteButton = true;
                    ChargecodeTaxcodeCtrl.ePage.Masters.EnableCopyButton = true;
                }
            });
        }
        //#endregion

        //#region SelectedLookupDate
        function SelectedLookupData($index, $item, type) {
            if (type == 'TaxCode') {
                ChargecodeTaxcodeCtrl.ePage.Entities.Header.Data.UIAccChargeTaxOverride[$index].AT = $item.PK;
            }
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValidations(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ChargecodeTaxcodeCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ChargecodeTaxcodeCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ChargecodeTaxcodeCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                ChargecodeTaxcodeCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ChargecodeTaxcodeCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();