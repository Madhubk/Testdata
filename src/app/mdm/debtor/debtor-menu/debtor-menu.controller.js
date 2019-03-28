(function () {
    "use strict";

    angular.module("Application")
        .controller("DebtorMenuController", DebtorMenuController);

    DebtorMenuController.$inject = ["helperService", "toastr", "authService", "debtorConfig"];

    function DebtorMenuController(helperService, toastr, authService, debtorConfig) {

        var DebtorMenuCtrl = this;

        function Init() {
            var currentDebtor = DebtorMenuCtrl.currentDebtor[DebtorMenuCtrl.currentDebtor.code].ePage.Entities;

            DebtorMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Debtor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDebtor
            };

            DebtorMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            DebtorMenuCtrl.ePage.Masters.DisableSave = false;
            DebtorMenuCtrl.ePage.Masters.Config = debtorConfig;

            /* Function */
            DebtorMenuCtrl.ePage.Masters.Validation = Validation;
            DebtorMenuCtrl.ePage.Masters.Save = Save;
        }

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            DebtorMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DebtorMenuCtrl.ePage.Entities.Header.Validations) {
                DebtorMenuCtrl.ePage.Masters.Config.RemoveApiErrors(DebtorMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                DebtorMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DebtorMenuCtrl.currentDebtor);
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            DebtorMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            DebtorMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
                _input.CreatedDateTime = new Date();
                _input.IsValid = true;
                _input.ModifiedBy = authService.getUserInfo().UserId;
                _input.CreatedBy = authService.getUserInfo().UserId;
                _input.Source = "ERP";
                _input.TenantCode = "20CUB";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Debtor').then(function (response) {
                DebtorMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                DebtorMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    toastr.success("Saved Successfully...!");
                } else if (response.Status === "failed") {
                    toastr.error("Could not Save...!");
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


        Init()
    }
})();