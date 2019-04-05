(function () {
    "use strict";
    angular
        .module("Application")
        .controller("CurrencyMenuController", CurrencyMenuController);

    CurrencyMenuController.$inject = ["$scope", "$timeout", "$filter", "APP_CONSTANT", "authService", "apiService", "toastr", "currencyConfig", "helperService", "errorWarningService"];

    function CurrencyMenuController($scope, $timeout, $filter, APP_CONSTANT, authService, apiService, toastr, currencyConfig, helperService, errorWarningService) {        
        var CurrencyMenuCtrl = this;
        function Init() {
            var currentCurrency = CurrencyMenuCtrl.currentCurrency[CurrencyMenuCtrl.currentCurrency.code].ePage.Entities;
            CurrencyMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Currency_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCurrency
            };

            CurrencyMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            CurrencyMenuCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
            CurrencyMenuCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
            CurrencyMenuCtrl.ePage.Masters.PostButtonText = "Post";
            CurrencyMenuCtrl.ePage.Masters.DisableSave = false;
            CurrencyMenuCtrl.ePage.Masters.Config = currencyConfig;

            /* Function */
            CurrencyMenuCtrl.ePage.Masters.Validation = Validation;

            CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Finance.Entity[CurrencyMenuCtrl.currentCurrency.code].GlobalErrorWarningList;
            // CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Finance.Entity[CurrencyMenuCtrl.currentCurrency.code];

            // Menu list from configuration
        }

        function Validation($item) {            
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
            CurrencyMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (CurrencyMenuCtrl.ePage.Entities.Header.Validations) {
                CurrencyMenuCtrl.ePage.Masters.Config.RemoveApiErrors(CurrencyMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": currencyConfig.Entities.API.CurrencyMaster.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", currencyConfig.Entities.API.CurrencyMaster.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        CurrencyMenuCtrl.ePage.Masters.UICurrencyList = response.data.Response;
                    }
                    var _count = CurrencyMenuCtrl.ePage.Masters.UICurrencyList.some(function (value, key) {
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
                CurrencyMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(CurrencyMenuCtrl.currentCurrency);
            }
        }


        function ValidateCurrency($item) {
            CurrencyMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CurrencyMenuCtrl.ePage.Masters.IsDisableSave = true;
            var _errorCode = ["E1314", "E1317"];
            // if (param.Entity.isNew) {
            //     _errorCode = ["E9101", "E9102", "E9103", "E9104", "E9105", "E9106", "E9107", "E9108", "E9109", "E9110", "E9111", "E9112", "E9113"];
            // } else {
            //     _errorCode = ["E9101", "E9102"];
            // }

            var _code = _errorCode;
            var _groupCode = "FINANCE_CURRENCY";
            var _obj = {
                ModuleName: ["Finance"],
                Code: [_code],
                API: "Group",
                GroupCode: _groupCode,
                RelatedBasicDetails: [],
                EntityObject: CurrencyMenuCtrl.ePage.Entities.Header.Data,
                ErrorCode: _errorCode
            };
            errorWarningService.ValidateValue(_obj);

            $timeout(function () {
                CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Finance.Entity[CurrencyMenuCtrl.currentCurrency.code].GlobalErrorWarningList;
                CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Finance.Entity[CurrencyMenuCtrl.currentCurrency.code];
                var _errorCount = $filter("listCount")(CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList, 'MessageType', 'E');

                if (_errorCount > 0) {
                    CurrencyMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    CurrencyMenuCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    save($item);
                }
            });
        }

        function Save($item) {            
            CurrencyMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CurrencyMenuCtrl.ePage.Masters.DisableSave = true;

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
                _input.UnitName="Test";
                _input.SubUnitName="Test1";
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Currency').then(function (response) {
                CurrencyMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                CurrencyMenuCtrl.ePage.Masters.DisableSave = false;

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

        Init();
    }
})();