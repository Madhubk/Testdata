(function () {
    "use strict";

    angular.module("Application")
        .controller("DebtorMenuController", DebtorMenuController);

    DebtorMenuController.$inject = ["helperService", "toastr", "authService", "debtorConfig", "apiService"];

    function DebtorMenuController(helperService, toastr, authService, debtorConfig, apiService) {

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

            DebtorMenuCtrl.ePage.Masters.ActivateButtonText = "Activate";
            DebtorMenuCtrl.ePage.Masters.DisableActivate = true;
            DebtorMenuCtrl.ePage.Masters.DeactivateButtonText = "Deactivate";
            DebtorMenuCtrl.ePage.Masters.DisableDeactivate = true;
            DebtorMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            DebtorMenuCtrl.ePage.Masters.DisableSave = false;
            DebtorMenuCtrl.ePage.Masters.Config = debtorConfig;

            /* Function */
            DebtorMenuCtrl.ePage.Masters.Validation = Validation;
            DebtorMenuCtrl.ePage.Masters.Activate = Activate;
            DebtorMenuCtrl.ePage.Masters.Deactivate = Deactivate;

            InitActivateDeactivate();
        }

        //#region InitActivateDeactivate
        function InitActivateDeactivate() {
            if (!DebtorMenuCtrl.currentDebtor.isNew && DebtorMenuCtrl.ePage.Entities.Header.Data.IsValid) {
                DebtorMenuCtrl.ePage.Masters.DisableActivate = true;
                DebtorMenuCtrl.ePage.Masters.DisableDeactivate = false;
            }
            else if (!DebtorMenuCtrl.currentDebtor.isNew && !DebtorMenuCtrl.ePage.Entities.Header.Data.IsValid) {
                DebtorMenuCtrl.ePage.Masters.DisableActivate = false;
                DebtorMenuCtrl.ePage.Masters.DisableDeactivate = true;
            }
        }
        //#endregion

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
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": debtorConfig.Entities.API.DebtorGroup.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", debtorConfig.Entities.API.DebtorGroup.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        DebtorMenuCtrl.ePage.Masters.UIDebtorList = response.data.Response;
                    }

                    var _count = DebtorMenuCtrl.ePage.Masters.UIDebtorList.some(function (value, key) {
                        if (value.Code == _input.Code) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if ($item.isNew && _count) {
                        toastr.error("Code is Unique, Rename the Code!.");
                    } else {
                        if (_input.Code.length > 3) {
                            toastr.error("Code is accept max 3 character only!.");
                        } else if ($item.isNew && !_input.IsValid) {
                            toastr.error("New debtor group can not be deactivate!.");
                        } else {
                            Save($item);
                        }
                    }
                });
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
                    var _index = debtorConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(DebtorMenuCtrl.currentDebtor[DebtorMenuCtrl.currentDebtor.code].ePage.Entities.Header.Data.PK);

                    debtorConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = DebtorMenuCtrl.ePage.Entities.Header.Data.Code;
                                value[DebtorMenuCtrl.ePage.Entities.Header.Data.Code] = value.isNew;
                                delete value.isNew;
                            }
                        }
                    });

                    helperService.refreshGrid();
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

        //#region  Activate, Deactivate
        function Activate() {
            DebtorMenuCtrl.ePage.Masters.DisableActivate = true;
            DebtorMenuCtrl.ePage.Masters.DisableDeactivate = false;
            DebtorMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisabledAll = false;
            DebtorMenuCtrl.ePage.Entities.Header.Data.IsValid = true;
        }

        function Deactivate() {
            DebtorMenuCtrl.ePage.Masters.DisableDeactivate = true;
            DebtorMenuCtrl.ePage.Masters.DisableActivate = false;
            DebtorMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisabledAll = true;
            DebtorMenuCtrl.ePage.Entities.Header.Data.IsValid = false;
        }
        //#endregion

        Init()
    }
})();