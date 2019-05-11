(function () {
    "use strict";
    angular
        .module("Application")
        .controller("BranchMenuController", BranchMenuController);

    BranchMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "branchConfig", "helperService"];

    function BranchMenuController($scope, $timeout, APP_CONSTANT, apiService, branchConfig, helperService) {
        var BranchMenuCtrl = this;
        function Init() {
            var currentBranch = BranchMenuCtrl.currentBranch[BranchMenuCtrl.currentBranch.label].ePage.Entities;
            BranchMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Branch_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBranch
            };
            BranchMenuCtrl.ePage.Masters.DepartmentMenu = {};
            BranchMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            BranchMenuCtrl.ePage.Masters.Config = branchConfig;
            // Menu list from configuration
        }

        
        function Validation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
            BranchMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (BranchMenuCtrl.ePage.Entities.Header.Validations) {
                BranchMenuCtrl.ePage.Masters.Config.RemoveApiErrors(BranchMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                var _filter = {};
                var _inputField = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": currencyConfig.Entities.API.CurrencyMaster.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", currencyConfig.Entities.API.CurrencyMaster.API.FindAll.Url, _inputField).then(function (response) {
                    if (response.data.Response) {
                        BranchMenuCtrl.ePage.Masters.UICurrencyList = response.data.Response;
                    }
                    var _count = BranchMenuCtrl.ePage.Masters.UICurrencyList.some(function (value, key) {
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
                BranchMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(BranchMenuCtrl.currentBranch);
            }
        }
        Init();
    }
})();