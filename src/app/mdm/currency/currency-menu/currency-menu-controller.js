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
            CurrencyMenuCtrl.ePage.Masters.DeactivateButtonText = "Deactivate";
            CurrencyMenuCtrl.ePage.Masters.ActivateButtonText = "Activate";
            CurrencyMenuCtrl.ePage.Masters.isActivate = true;
            CurrencyMenuCtrl.ePage.Masters.isDeactivate = true;

            /* Function */
            CurrencyMenuCtrl.ePage.Masters.Validation = Validation;
            CurrencyMenuCtrl.ePage.Masters.Activate = Activate;
            CurrencyMenuCtrl.ePage.Masters.Deactivate = Deactivate;
            CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Finance.Entity[CurrencyMenuCtrl.currentCurrency.code].GlobalErrorWarningList;
            // CurrencyMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Finance.Entity[CurrencyMenuCtrl.currentCurrency.code];

            InitActivateDeactivate();
        }

        function InitActivateDeactivate() {
            if (!CurrencyMenuCtrl.currentCurrency.isNew && CurrencyMenuCtrl.ePage.Entities.Header.Data.IsActive) {
                CurrencyMenuCtrl.ePage.Masters.isActivate = true;
                CurrencyMenuCtrl.ePage.Masters.isDeactivate = false;
            }
            else if (!CurrencyMenuCtrl.currentCurrency.isNew && !CurrencyMenuCtrl.ePage.Entities.Header.Data.IsActive) {
                CurrencyMenuCtrl.ePage.Masters.isActivate = false;
                CurrencyMenuCtrl.ePage.Masters.isDeactivate = true;
            }
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
                    }
                    else {
                        if (CurrencyMenuCtrl.ePage.Entities.Header.Data.Code.length > 3) {
                            toastr.error("Currency Code Max 3 Charters");
                        }
                        else if (CurrencyMenuCtrl.ePage.Entities.Header.Data.IsActive == false && CurrencyMenuCtrl.ePage.Masters.isDeactivate == true) {
                            toastr.success("Currency Deactivated Successfully");
                            Save($item);
                        }
                        else if (CurrencyMenuCtrl.ePage.Entities.Header.Data.IsActive == true && CurrencyMenuCtrl.ePage.Masters.isActivate == true) {
                            Save($item);
                        } else {
                            Save($item);
                        }
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

        function Activate() {
            CurrencyMenuCtrl.ePage.Masters.isDeactivate = false;
            CurrencyMenuCtrl.ePage.Masters.isActivate = true;
            CurrencyMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisabledAll = false;
            CurrencyMenuCtrl.ePage.Entities.Header.Data.IsActive = true;
        }

        function Deactivate($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                toastr.error("New Currency should not be deactivate.");
            }
            else {
                var _filter = {
                    "Mstcurrencycode": _input.Code,
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": currencyConfig.Entities.API.CurrencyMaster.API.ValidateCurrency.FilterID
                };
                apiService.post("eAxisAPI", currencyConfig.Entities.API.CurrencyMaster.API.ValidateCurrency.Url, _input).then(function (response) {
                    if (response.data.Response.length > 0) {
                        CurrencyMenuCtrl.ePage.Masters.Data = response.data.Response;

                        var _isDeactivate = CurrencyMenuCtrl.ePage.Masters.Data.some(function (value, key) {
                            if (value.IsActive != "true") {
                                return true;
                            }
                            else {
                                return false;
                            }
                        });

                        if (_isDeactivate) {
                            toastr.error("Can't Deactivate the Branch untill all the open transaction get closed");
                        }
                        else {
                            CurrencyMenuCtrl.ePage.Masters.isDeactivate = true;
                            CurrencyMenuCtrl.ePage.Masters.isActivate = false;
                            CurrencyMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisabledAll = true;
                            CurrencyMenuCtrl.ePage.Entities.Header.Data.IsActive = false;
                        }
                    }
                    else if (response.data.Response.length == 0) {
                        CurrencyMenuCtrl.ePage.Masters.isDeactivate = true;
                        CurrencyMenuCtrl.ePage.Masters.isActivate = false;
                        CurrencyMenuCtrl.ePage.Entities.Header.GlobalVariables.IsDisabledAll = true;
                        CurrencyMenuCtrl.ePage.Entities.Header.Data.IsActive = false;
                    }
                });
            }
        }
        Init();
    }
})();