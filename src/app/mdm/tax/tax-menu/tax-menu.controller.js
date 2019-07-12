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
            var _Calculation = 0;
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
                        if (value.Code == _input.UIAccTaxRate.Code && value.RN_NKCountry == _input.UIAccTaxRate.RN_NKCountry) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });

                    TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.map(function (value, key) {
                        _Calculation = _Calculation + parseFloat(value.Rate);
                    });

                    if (_count) {
                        toastr.error("Code / Country already avaliable in tax master!.");
                    } else {
                        if (TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRate.Code.length > 10) {
                            toastr.error("Tax Code Max 10 Charters");
                        }
                        else if (!TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRate.TaxHierarchy && TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.length > 0) {
                            TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails = [];
                            Save($item);
                        } else if (TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRate.TaxHierarchy && TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRateDetails.length == 0) {
                            toastr.error("Add atleast one record in TaxRate grid Details, Otherwise uncheck Tax Hierarchy");
                        }
                        else if (TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRate.TaxHierarchy && parseFloat(TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRate.RateObsolete) != _Calculation) {
                            toastr.error("Tax total sub code Rate % is missmatch with tax amount.");
                        } else {
                            Save($item);
                        }
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
                _input.UIAccTaxRate.PK = _input.PK;
                _input.UIAccTaxRate.ExtraTaxRateType = "";
                _input.UIAccTaxRate.ReferenceExtraRateType = "";
                _input.UIAccTaxRate.ReferenceRateType = "";
                _input.UIAccTaxRate.CreatedDateTime = new Date();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'TaxRate').then(function (response) {
                TaxMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                TaxMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = taxConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(TaxMenuCtrl.currentTax[TaxMenuCtrl.currentTax.code].ePage.Entities.Header.Data.PK);

                    taxConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRate.Code;
                                value[TaxMenuCtrl.ePage.Entities.Header.Data.UIAccTaxRate.Code] = value.isNew;
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

        Init();
    }
})();