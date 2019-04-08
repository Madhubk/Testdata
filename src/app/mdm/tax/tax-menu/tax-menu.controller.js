(function () {
    "use strict";

    angular.module("Application")
        .controller("TaxMenuController", TaxMenuController);

    TaxMenuController.$inject = ["helperService", "apiService", "taxConfig", "toastr"];

    function TaxMenuController(helperService, apiService, taxConfig, toastr) {
        var TaxMenuCtrl = this;

        function Init() {
            var currentTax = TaxMenuCtrl.currentTax[TaxMenuCtrl.currentTax.code].ePage.Entities;

            TaxMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Tax",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTax
            };

            TaxMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            TaxMenuCtrl.ePage.Masters.DisableSave = false;
            TaxMenuCtrl.ePage.Masters.Config = taxConfig;

            /* Function */
            TaxMenuCtrl.ePage.Masters.Validation = Validation;
        }

        //#region  Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            /* Validation Call */
            TaxMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (TaxMenuCtrl.ePage.Entities.Header.Validations) {
                TaxMenuCtrl.ePage.Masters.Config.RemoveApiErrors(TaxMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": taxConfig.Entities.API.AccTaxRate.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", taxConfig.Entities.API.AccTaxRate.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        TaxMenuCtrl.ePage.Masters.UITaxRate = response.data.Response;
                    }

                    var _count = TaxMenuCtrl.ePage.Masters.UITaxRate.some(function (value, key) {
                        if (value.Code == _input.Code) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    if (_count) {
                        toastr.error("Code is Unique, Rename the Code!.");
                    } else {
                        Save($item);
                    }
                });
            } else {
                TaxMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(TaxMenuCtrl.currentTax);
            }
        }
        //#endregion


        //#region Save
        function Save($item) {
            TaxMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            TaxMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
                _input.CreatedDateTime = new Date();
                _input.Type = "";
                _input.ExtraTaxRateType = "";
                _input.ReferenceExtraRateType = "";
                _input.ReferenceRateType = "";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'TaxRate').then(function (response) {
                TaxMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                TaxMenuCtrl.ePage.Masters.DisableSave = false;

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


        Init();
    }
})();