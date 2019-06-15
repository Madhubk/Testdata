(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountReceivableController", AccountReceivableController);

        AccountReceivableController.$inject = ["$timeout", "helperService", "financeConfig", "apiService", "toastr"];

    function AccountReceivableController($timeout, helperService, financeConfig, apiService, toastr) {
        var AccountReceivableCtrl = this;
        
        function Init() {
            AccountReceivableCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_AccountReceivable",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": financeConfig.Entities
            };

            AccountReceivableCtrl.ePage.Masters.DataentryName = "AccTransactionHeader";
            AccountReceivableCtrl.ePage.Masters.Title = "AccTransactionHeader";
            AccountReceivableCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            AccountReceivableCtrl.ePage.Masters.TabList = [];
            AccountReceivableCtrl.ePage.Masters.ActiveTabIndex = 0;
            AccountReceivableCtrl.ePage.Masters.IsTabClick = false;
            AccountReceivableCtrl.ePage.Masters.isNewClicked = false;

            /* funtion */
            AccountReceivableCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            AccountReceivableCtrl.ePage.Masters.AddTab = AddTab;
            AccountReceivableCtrl.ePage.Masters.CreateNewAP = CreateNewAP;
            AccountReceivableCtrl.ePage.Masters.RemoveTab = RemoveTab;
        }

        //#region SelectedGridRow
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                AccountReceivableCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewAP();
            }
        }
        //#endregion

        //#region AddTab
        function AddTab(currentTab, isNew) {
            var _isExist = AccountReceivableCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                AccountReceivableCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                financeConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    AccountReceivableCtrl.ePage.Masters.TabList = response;
                    if (AccountReceivableCtrl.ePage.Masters.TabList.length > 0) {
                        AccountReceivableCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        AccountReceivableCtrl.ePage.Masters.ActiveTabIndex = AccountReceivableCtrl.ePage.Masters.TabList.length;
                        AccountReceivableCtrl.ePage.Masters.IsTabClick = false;
                        var _code = currentTab.entity.PK.split("-").join("");
                        //GetValidationList(_code, _entity);
                    });
                });
            } else {
                toastr.info('Record already opened');
            }
        }
        //#endregion

        //#region CreateNewAP, RemoveTab
        function CreateNewAP(currentTab, isNew) {
            AccountReceivableCtrl.ePage.Masters.currentFinanceAP = undefined;

            var _isExist = AccountReceivableCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                AccountReceivableCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(AccountReceivableCtrl.ePage.Entities.API.AccountreceivableList.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        AccountReceivableCtrl.ePage.Masters.AddTab(_obj, true);
                        AccountReceivableCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Job response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentTab) {
            event.preventDefault();
            event.stopPropagation();
            var _currentTab = currentTab[currentTab.code].ePage.Entities;
            AccountReceivableCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", financeConfig.Entities.API.AccountreceivableList.API.AccountreceivableListActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }
        //#endregion

        Init();
    }

})();