(function () {
    "use strict";

    angular.module("Application")
        .controller("AccountPayableController", AccountPayableController);

    AccountPayableController.$inject = ["$timeout", "helperService", "accountPayableConfig", "apiService", "toastr"];

    function AccountPayableController($timeout, helperService, accountPayableConfig, apiService, toastr) {
        var AccountPayableCtrl = this;

        function Init() {
            AccountPayableCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_AccountPayable",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": accountPayableConfig.Entities
            };

            AccountPayableCtrl.ePage.Masters.DataentryName = accountPayableConfig.DataentryName;
            AccountPayableCtrl.ePage.Masters.Title = accountPayableConfig.DataentryTitle;
            AccountPayableCtrl.ePage.Masters.DefaultFilter = {
                "Ledger": "AP"
            };

            /* Tab */
            AccountPayableCtrl.ePage.Masters.TabList = [];
            AccountPayableCtrl.ePage.Masters.ActiveTabIndex = 0;
            AccountPayableCtrl.ePage.Masters.IsTabClick = false;
            AccountPayableCtrl.ePage.Masters.isNewClicked = false;

            /* funtion */
            AccountPayableCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            AccountPayableCtrl.ePage.Masters.AddTab = AddTab;
            AccountPayableCtrl.ePage.Masters.CreateNewAP = CreateNewAP;
            AccountPayableCtrl.ePage.Masters.RemoveTab = RemoveTab;
        }

        //#region SelectedGridRow
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                AccountPayableCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewAP();
            }
        }
        //#endregion

        //#region AddTab
        function AddTab(currentTab, isNew) {
            var _isExist = AccountPayableCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                AccountPayableCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                accountPayableConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    AccountPayableCtrl.ePage.Masters.TabList = response;
                    if (AccountPayableCtrl.ePage.Masters.TabList.length > 0) {
                        AccountPayableCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        AccountPayableCtrl.ePage.Masters.ActiveTabIndex = AccountPayableCtrl.ePage.Masters.TabList.length;
                        AccountPayableCtrl.ePage.Masters.IsTabClick = false;
                        var _code = currentTab.entity.PK.split("-").join("");
                    });
                });
            } else {
                toastr.info('Record already opened');
            }
        }
        //#endregion

        //#region CreateNewAP, RemoveTab
        function CreateNewAP() {
            AccountPayableCtrl.ePage.Masters.currentFinanceAP = undefined;

            var _isExist = AccountPayableCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                AccountPayableCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(AccountPayableCtrl.ePage.Entities.API.AccountpayableList.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        AccountPayableCtrl.ePage.Masters.AddTab(_obj, true);
                        AccountPayableCtrl.ePage.Masters.isNewClicked = false;
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
            AccountPayableCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", accountPayableConfig.Entities.API.AccountpayableList.API.AccountpayableListActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
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