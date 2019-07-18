(function () {
    "use strict";
    angular
        .module("Application")
        .controller("ExchangeRateMenuController", ExchangeRateMenuController);

    ExchangeRateMenuController.$inject = ["authService", "toastr", "exchangerateConfig", "helperService"];

    function ExchangeRateMenuController(authService, toastr, exchangerateConfig, helperService) {

        var ExchangeRateMenuCtrl = this;
        function Init() {

            var currentExchangeRate = ExchangeRateMenuCtrl.currentExchangeRate[ExchangeRateMenuCtrl.currentExchangeRate.code].ePage.Entities;
            ExchangeRateMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Exchangerate_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentExchangeRate
            };

            ExchangeRateMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ExchangeRateMenuCtrl.ePage.Masters.DisableSave = false;
            ExchangeRateMenuCtrl.ePage.Masters.Config = exchangerateConfig;

            /* Function */
            ExchangeRateMenuCtrl.ePage.Masters.Validation = Validation;
        }

        //#region Validation
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data.UIMstExchangeRate,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            ExchangeRateMenuCtrl.ePage.Masters.Config.GeneralValidation($item);

            if (ExchangeRateMenuCtrl.ePage.Entities.Header.Validations) {
                ExchangeRateMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ExchangeRateMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ExchangeRateMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ExchangeRateMenuCtrl.currentExchangeRate);
            }
        }
        //#endregion

        //#region Save
        function Save($item) {
            ExchangeRateMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ExchangeRateMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;
            var _ExpiryDate = _Data.Header.Data.UIMstExchangeRate.ExpiryDate;
            
            if ($item.isNew) {
                _input.UIMstExchangeRate.PK = _input.PK;
                _input.UIMstExchangeRate.CreatedDateTime = new Date();
                _input.UIMstExchangeRate.CreatedBy = authService.getUserInfo().UserId;
                _input.UIMstExchangeRate.ModifiedBy = authService.getUserInfo().UserId;
                _input.UIMstExchangeRate.IsValid = true;
                _input.UIMstExchangeRate.Source = "ERP";
                _input.UIMstExchangeRate.TenantCode = "20CUB";
                _input.UIMstExchangeRate.ExpiryDate = _ExpiryDate + " " + "23:59:00";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'ExchangeRate').then(function (response) {
                ExchangeRateMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ExchangeRateMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = exchangerateConfig.TabList.map(function (value, key) {
                        return value[value.code].ePage.Entities.Header.Data.PK;
                    }).indexOf(ExchangeRateMenuCtrl.currentExchangeRate[ExchangeRateMenuCtrl.currentExchangeRate.code].ePage.Entities.Header.Data.PK);

                    exchangerateConfig.TabList.map(function (value, key) {
                        if (_index == key) {
                            if (value.isNew) {
                                value.label = ExchangeRateMenuCtrl.ePage.Entities.Header.Data.UIMstExchangeRate.FromCurrency;
                                value[ExchangeRateMenuCtrl.ePage.Entities.Header.Data.Code] = value.isNew;
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