(function () {
    "use strict";
    angular
        .module("Application")
        .controller("ExchangeRateMenuController", ExchangeRateMenuController);

        ExchangeRateMenuController.$inject = ["$scope", "$timeout", "$filter", "APP_CONSTANT", "authService", "apiService", "toastr", "exchangerateConfig", "helperService", "errorWarningService"];

    function ExchangeRateMenuController($scope, $timeout, $filter, APP_CONSTANT, authService, apiService, toastr, exchangerateConfig, helperService, errorWarningService) {        

        var ExchangeRateMenuCtrl = this;
        function Init() {
            debugger;
            var currentExchangeRate = ExchangeRateMenuCtrl.currentExchangeRate[ExchangeRateMenuCtrl.currentExchangeRate.code].ePage.Entities;
            ExchangeRateMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Exchangerate_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentExchangeRate
            };

            ExchangeRateMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ExchangeRateMenuCtrl.ePage.Masters.PostCostButtonText = "Post Cost";
            ExchangeRateMenuCtrl.ePage.Masters.PostRevenueButtonText = "Post Revenue";
            ExchangeRateMenuCtrl.ePage.Masters.PostButtonText = "Post";
            ExchangeRateMenuCtrl.ePage.Masters.DisableSave = false;
            ExchangeRateMenuCtrl.ePage.Masters.Config = exchangerateConfig;

            /* Function */
            ExchangeRateMenuCtrl.ePage.Masters.Validation = Validation;

            ExchangeRateMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // ExchangeRateMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Finance.Entity[ExchangeRateMenuCtrl.currentExchangeRate.code].GlobalErrorWarningList;
            // ExchangeRateMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Finance.Entity[ExchangeRateMenuCtrl.currentExchangeRate.code];

            // Menu list from configuration
        }

        function Validation($item) {            
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
            ExchangeRateMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ExchangeRateMenuCtrl.ePage.Entities.Header.Validations) {
                ExchangeRateMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ExchangeRateMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": exchangerateConfig.Entities.API.ExchangerateMaster.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", exchangerateConfig.Entities.API.ExchangerateMaster.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        ExchangeRateMenuCtrl.ePage.Masters.UIExchangerateList = response.data.Response;
                    }
                    var _count = ExchangeRateMenuCtrl.ePage.Masters.UIExchangerateList.some(function (value, key) {
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
                ExchangeRateMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ExchangeRateMenuCtrl.currentExchangeRate);
            }
        }


        function ValidateExchangerate($item) {
            ExchangeRateMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ExchangeRateMenuCtrl.ePage.Masters.IsDisableSave = true;
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
                EntityObject: ExchangeRateMenuCtrl.ePage.Entities.Header.Data,
                ErrorCode: _errorCode
            };
            errorWarningService.ValidateValue(_obj);

            $timeout(function () {
                ExchangeRateMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Finance.Entity[ExchangeRateMenuCtrl.currentExchangeRate.code].GlobalErrorWarningList;
                ExchangeRateMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Finance.Entity[ExchangeRateMenuCtrl.currentExchangeRate.code];
                var _errorCount = $filter("listCount")(ExchangeRateMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList, 'MessageType', 'E');

                if (_errorCount > 0) {
                    ExchangeRateMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    ExchangeRateMenuCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    save($item);
                }
            });
        }

        function Save($item) {            
            ExchangeRateMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ExchangeRateMenuCtrl.ePage.Masters.DisableSave = true;

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

            helperService.SaveEntity($item, 'Exchangerate').then(function (response) {
                ExchangeRateMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ExchangeRateMenuCtrl.ePage.Masters.DisableSave = false;

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