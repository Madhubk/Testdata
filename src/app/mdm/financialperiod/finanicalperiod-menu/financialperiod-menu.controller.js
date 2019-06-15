(function () {
    "use strict";

    angular.module("Application")
        .controller("FinancePeriodMenuController", FinancePeriodMenuController);

    FinancePeriodMenuController.$inject = ["helperService", "toastr", "authService", "financeperiodConfig", "apiService"];

    function FinancePeriodMenuController(helperService, toastr, authService, financeperiodConfig, apiService) {

        var FinancePeriodMenuCtrl = this;

        function Init() {
            debugger;
            var currentFinancialperiod = FinancePeriodMenuCtrl.currentFinancialperiod[FinancePeriodMenuCtrl.currentFinancialperiod.code].ePage.Entities;

            FinancePeriodMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Financeperiod",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentFinancialperiod
            };

            FinancePeriodMenuCtrl.ePage.Masters.ActivateButtonText = "Activate";
            FinancePeriodMenuCtrl.ePage.Masters.DisableActivate = true;
            FinancePeriodMenuCtrl.ePage.Masters.DeactivateButtonText = "Deactivate";
            FinancePeriodMenuCtrl.ePage.Masters.DisableDeactivate = false;
            FinancePeriodMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            FinancePeriodMenuCtrl.ePage.Masters.DisableSave = false;
            FinancePeriodMenuCtrl.ePage.Masters.Config = financeperiodConfig;

            /* Function */
            FinancePeriodMenuCtrl.ePage.Masters.Validation = Validation;
            FinancePeriodMenuCtrl.ePage.Masters.Activate = Activate;
            FinancePeriodMenuCtrl.ePage.Masters.Deactivate = Deactivate;
        }

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            FinancePeriodMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (FinancePeriodMenuCtrl.ePage.Entities.Header.Validations) {
                FinancePeriodMenuCtrl.ePage.Masters.Config.RemoveApiErrors(FinancePeriodMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": financeperiodConfig.Entities.API.FinancialPeriod.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", financeperiodConfig.Entities.API.FinancialPeriod.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        FinancePeriodMenuCtrl.ePage.Masters.UIFinancialPeriodList = response.data.Response;
                    }

                    var _count = FinancePeriodMenuCtrl.ePage.Masters.UIFinancialPeriodList.some(function (value, key) {
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
                            toastr.error("New FinancialPeriod can not be deactivate!.");
                        } else {
                            Save($item);
                        }
                    }
                });
            } else {
                FinancePeriodMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(FinancePeriodMenuCtrl.currentFinancialperiod);
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            FinancePeriodMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            FinancePeriodMenuCtrl.ePage.Masters.DisableSave = true;

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

            helperService.SaveEntity($item, 'FinancePeriod').then(function (response) {
                FinancePeriodMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                FinancePeriodMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = financeperiodConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(FinancePeriodMenuCtrl.currentFinancialperiod[FinancePeriodMenuCtrl.currentFinancialperiod.code].ePage.Entities.Header.Data.PK);

                    financeperiodConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = FinancePeriodMenuCtrl.ePage.Entities.Header.Data.Code;
                                value[FinancePeriodMenuCtrl.ePage.Entities.Header.Data.Code] = value.isNew;
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
            FinancePeriodMenuCtrl.ePage.Masters.DisableActivate = true;
            FinancePeriodMenuCtrl.ePage.Masters.DisableDeactivate = false;
            FinancePeriodMenuCtrl.ePage.Entities.Header.Data.IsValid = true;
        }

        function Deactivate() {
            FinancePeriodMenuCtrl.ePage.Masters.DisableDeactivate = true;
            FinancePeriodMenuCtrl.ePage.Masters.DisableActivate = false;
            FinancePeriodMenuCtrl.ePage.Entities.Header.Data.IsValid = false;
        }
        //#endregion

        Init()
    }
})();