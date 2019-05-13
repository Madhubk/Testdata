(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeInvoiceController", ChargecodeInvoiceController);

    ChargecodeInvoiceController.$inject = ["$timeout", "helperService", "chargecodeConfig", "confirmation"];

    function ChargecodeInvoiceController($timeout, helperService, chargecodeConfig, confirmation) {

        var ChargecodeInvoiceCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeInvoiceCtrl.currentChargecode[ChargecodeInvoiceCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeInvoiceCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeInvoiceCtrl.ePage.Masters.Config = chargecodeConfig;

            /* Function  */
            ChargecodeInvoiceCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ChargecodeInvoiceCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ChargecodeInvoiceCtrl.ePage.Masters.CopyRow = CopyRow;
            ChargecodeInvoiceCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ChargecodeInvoiceCtrl.ePage.Masters.SetSelectedRow = SetSelectedRow;
            ChargecodeInvoiceCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ChargecodeInvoiceCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;

            /*  For table */
            ChargecodeInvoiceCtrl.ePage.Masters.EnableDeleteButton = true;
            ChargecodeInvoiceCtrl.ePage.Masters.EnableCopyButton = true;
            ChargecodeInvoiceCtrl.ePage.Masters.Enable = true;
            ChargecodeInvoiceCtrl.ePage.Masters.selectedRow = -1;
            ChargecodeInvoiceCtrl.ePage.Masters.emptyText = '-';
        }

        //#region AddNewRow, CopyRow, RemoveRow 
        function AddNewRow() {
            var obj = {
                "PK": "",
                "JobType": "",
                "TransportMode": "",
                "ChargeType": "",
                "InvoiceType": "",
                "IsModified": false,
                "IsDeleted": false,
                "LineNo": ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.length + 1
            };

            ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.push(obj);
            ChargecodeInvoiceCtrl.ePage.Masters.selectedRow = ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("ChargecodeInvoiceCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ChargecodeInvoiceCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function CopyRow() {
            for (var i = ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.length - 1; i >= 0; i--) {
                if (ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride[i].SingleSelect) {
                    var obj = angular.copy(ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride[i]);
                    obj.PK = "";
                    obj.CreatedDateTime = "";
                    obj.ModifiedDateTime = "";
                    obj.SingleSelect = false
                    obj.IsCopied = true;
                    obj.LineNo = ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.length + 1
                    ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.splice(i + 1, 0, obj);
                }
            }

            ChargecodeInvoiceCtrl.ePage.Masters.selectedRow = -1;
            ChargecodeInvoiceCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                for (var i = ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.length - 1; i >= 0; i--) {
                    if (ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride[i].SingleSelect && ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride[i].IsDeleted) {
                        ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.splice(i, 1);
                    }
                }

                ChargecodeInvoiceCtrl.ePage.Masters.selectedRow = -1;
                ChargecodeInvoiceCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                ChargecodeInvoiceCtrl.ePage.Masters.EnableCopyButton = true;
                ChargecodeInvoiceCtrl.ePage.Masters.EnableDeleteButton = true;
            }, function () {
                console.log("Cancelled");
            });
        }
        //#endregion

        //#region SetSelectedRow
        function SetSelectedRow($index) {
            ChargecodeInvoiceCtrl.ePage.Masters.selectedRow = $index;
        }
        //#endregion

        //#region SingleSelectCheckBox, SelectAllCheckBox
        function SingleSelectCheckBox() {
            var Checked = ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                ChargecodeInvoiceCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                ChargecodeInvoiceCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                ChargecodeInvoiceCtrl.ePage.Masters.EnableDeleteButton = false;
                ChargecodeInvoiceCtrl.ePage.Masters.EnableCopyButton = false;
            } else {
                ChargecodeInvoiceCtrl.ePage.Masters.EnableDeleteButton = true;
                ChargecodeInvoiceCtrl.ePage.Masters.EnableCopyButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(ChargecodeInvoiceCtrl.ePage.Entities.Header.Data.UIAccChargeTypeOverride, function (value, key) {
                if (ChargecodeInvoiceCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    ChargecodeInvoiceCtrl.ePage.Masters.EnableDeleteButton = false;
                    ChargecodeInvoiceCtrl.ePage.Masters.EnableCopyButton = false;
                }
                else {
                    value.SingleSelect = false;
                    ChargecodeInvoiceCtrl.ePage.Masters.EnableDeleteButton = true;
                    ChargecodeInvoiceCtrl.ePage.Masters.EnableCopyButton = true;
                }
            });
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
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