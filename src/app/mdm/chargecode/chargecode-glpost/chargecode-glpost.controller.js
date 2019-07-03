(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeGlpostController", ChargecodeGlpostController);

    ChargecodeGlpostController.$inject = ["$timeout", "apiService", "appConfig", "authService", "helperService", "chargecodeConfig", "confirmation"];

    function ChargecodeGlpostController($timeout, apiService, appConfig, authService, helperService, chargecodeConfig, confirmation) {

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
            ChargecodeGlpostCtrl.ePage.Masters.OnChangeValidations = OnChangeValidations;
            ChargecodeGlpostCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ChargecodeGlpostCtrl.ePage.Masters.CopyRow = CopyRow;
            ChargecodeGlpostCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ChargecodeGlpostCtrl.ePage.Masters.SetSelectedRow = SetSelectedRow;
            ChargecodeGlpostCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ChargecodeGlpostCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ChargecodeGlpostCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;


            /*  For table */
            ChargecodeGlpostCtrl.ePage.Masters.EnableDeleteButton = true;
            ChargecodeGlpostCtrl.ePage.Masters.EnableCopyButton = true;
            ChargecodeGlpostCtrl.ePage.Masters.Enable = true;
            ChargecodeGlpostCtrl.ePage.Masters.selectedRow = -1;
            ChargecodeGlpostCtrl.ePage.Masters.emptyText = '-';

            /* DropDown List */
            ChargecodeGlpostCtrl.ePage.Masters.DropDownMasterList = {
                "ChargeGLInvoiceJobType": {
                    "ListSource": []
                },
                "ChargeGLInvoiceTransportMode": {
                    "ListSource": []
                }
            };

            GetDropDownList();
        }

        //#region DropDown
        function GetDropDownList() {
            var typeCodeList = ["ChargeGLInvoiceJobType", "ChargeGLInvoiceTransportMode"];
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
                        ChargecodeGlpostCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ChargecodeGlpostCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                "TransportMode": "",
                "Depcode": "",
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

                ChargecodeGlpostCtrl.ePage.Entities.Header.Data.UIAccChargeGLPostingOverride.map(function (value, key) {
                    if (value.SingleSelect && value.PK && value.IsDeleted) {
                        apiService.get("eAxisAPI", chargecodeConfig.Entities.API.AccGLPostingOverride.API.Delete.Url + value.PK).then(function (response) {
                            console.log("Success");
                        });
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

        //#region SelectedLookupDate
        function SelectedLookupData($index, $item, type) {
        }
        //#endregion

        //#region ErrorWarning Alert Validation
        function OnChangeValidations(fieldvalue, code, IsArray, RowIndex) {
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