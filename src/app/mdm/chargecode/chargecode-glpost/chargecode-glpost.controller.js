(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeGlpostController", ChargecodeGlpostController);

    ChargecodeGlpostController.$inject = ["$timeout", "helperService", "chargecodeConfig", "confirmation"];

    function ChargecodeGlpostController($timeout, helperService, chargecodeConfig, confirmation) {

        var ChargecodeGlpostCtrl = this;

        function Init() {

            var currentChargecode = ChargecodeGlpostCtrl.currentChargecode[ChargecodeGlpostCtrl.currentChargecode.code].ePage.Entities;

            ChargecodeGlpostCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentChargecode
            };

            ChargecodeGlpostCtrl.ePage.Masters.Config = chargecodeConfig;

            /* Function  */
            ChargecodeGlpostCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ChargecodeGlpostCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ChargecodeGlpostCtrl.ePage.Masters.CopyRow = CopyRow;
            ChargecodeGlpostCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ChargecodeGlpostCtrl.ePage.Masters.SetSelectedRow = SetSelectedRow;
            ChargecodeGlpostCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ChargecodeGlpostCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;

            /*  For table */
            ChargecodeGlpostCtrl.ePage.Masters.EnableDeleteButton = true;
            ChargecodeGlpostCtrl.ePage.Masters.EnableCopyButton = true;
            ChargecodeGlpostCtrl.ePage.Masters.Enable = true;
            ChargecodeGlpostCtrl.ePage.Masters.selectedRow = -1;
            ChargecodeGlpostCtrl.ePage.Masters.emptyText = '-';
        }

        //#region AddNewRow, CopyRow, RemoveRow 
        function AddNewRow() {
            var obj = {
                "PK": "",
                "JobType": "",
                "TransportMode": "",
                "DEP_Code": "",
                "GE": "",
                "AG_ACR": "",
                "AG_ACRAccountNum": "",
                "AG_CST": "",
                "AG_CSTAccountNum": "",
                "AG_WIP": "",
                "AG_WIPAccountNum": "",
                "AG_REV": "",
                "AG_REVAccountNum": "",
                "IsModified": false,
                "IsDeleted": false,
                "LineNo": ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.length + 1
            };

            ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.push(obj);
            ChargecodeGlpostCtrl.ePage.Masters.selectedRow = ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.length - 1;

            /* Add Scroll */
            $timeout(function () {
                var objDiv = document.getElementById("ChargecodeGlpostCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            ChargecodeGlpostCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function CopyRow() {
            for (var i = ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.length - 1; i >= 0; i--) {
                if (ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride[i].SingleSelect) {
                    var obj = angular.copy(ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride[i]);
                    obj.PK = "";
                    obj.CreatedDateTime = "";
                    obj.ModifiedDateTime = "";
                    obj.SingleSelect = false
                    obj.IsCopied = true;
                    obj.LineNo = ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.length + 1
                    ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.splice(i + 1, 0, obj);
                }
            }

            ChargecodeGlpostCtrl.ePage.Masters.selectedRow = -1;
            ChargecodeGlpostCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions).then(function (result) {
                ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.map(function (value, key) {
                    if (value.SingleSelect == true) {
                        value.IsDeleted = true;
                    }
                });

                for (var i = ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.length - 1; i >= 0; i--) {
                    if (ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride[i].SingleSelect && ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride[i].IsDeleted) {
                        ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.splice(i, 1);
                    }
                }

                ChargecodeGlpostCtrl.ePage.Masters.selectedRow = -1;
                ChargecodeGlpostCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
                ChargecodeGlpostCtrl.ePage.Masters.EnableCopyButton = true;
                ChargecodeGlpostCtrl.ePage.Masters.EnableDeleteButton = true;
            }, function () {
                console.log("Cancelled");
            });
        }
        //#endregion

        //#region SetSelectedRow
        function SetSelectedRow($index) {
            ChargecodeGlpostCtrl.ePage.Masters.selectedRow = $index;
        }
        //#endregion

        //#region SingleSelectCheckBox, SelectAllCheckBox
        function SingleSelectCheckBox() {
            debugger
            var Checked = ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                ChargecodeGlpostCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = false;
            } else {
                ChargecodeGlpostCtrl.ePage.Entities.Header.GlobalVariables.SelectAll = true;
            }

            var Checked1 = ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1 == true) {
                ChargecodeGlpostCtrl.ePage.Masters.EnableDeleteButton = false;
                ChargecodeGlpostCtrl.ePage.Masters.EnableCopyButton = false;
            } else {
                ChargecodeGlpostCtrl.ePage.Masters.EnableDeleteButton = true;
                ChargecodeGlpostCtrl.ePage.Masters.EnableCopyButton = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride, function (value, key) {
                if (ChargecodeGlpostCtrl.ePage.Entities.Header.GlobalVariables.SelectAll) {
                    value.SingleSelect = true;
                    ChargecodeGlpostCtrl.ePage.Masters.EnableDeleteButton = false;
                    ChargecodeGlpostCtrl.ePage.Masters.EnableCopyButton = false;
                }
                else {
                    value.SingleSelect = false;
                    ChargecodeGlpostCtrl.ePage.Masters.EnableDeleteButton = true;
                    ChargecodeGlpostCtrl.ePage.Masters.EnableCopyButton = true;
                }
            });
        }

        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ChargecodeGlpostCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ChargecodeGlpostCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ChargecodeGlpostCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                ChargecodeGlpostCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ChargecodeGlpostCtrl.currentChargecode.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 

        Init()
    }
})();