(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceAccountPayableController", FinanceAccountPayableController);

    FinanceAccountPayableController.$inject = ["$timeout", "helperService", "financeConfig", "apiService", "toastr"];

    function FinanceAccountPayableController($timeout, helperService, financeConfig, apiService, toastr) {
        var FinanceAccountPayableCtrl = this;
        
        function Init() {
            FinanceAccountPayableCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_AccountPayable",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": financeConfig.Entities
            };

            FinanceAccountPayableCtrl.ePage.Masters.DataentryName = "AccTransactionHeader";
            FinanceAccountPayableCtrl.ePage.Masters.Title = "AccTransactionHeader";
            FinanceAccountPayableCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            FinanceAccountPayableCtrl.ePage.Masters.TabList = [];
            FinanceAccountPayableCtrl.ePage.Masters.ActiveTabIndex = 0;
            FinanceAccountPayableCtrl.ePage.Masters.IsTabClick = false;
            FinanceAccountPayableCtrl.ePage.Masters.isNewClicked = false;

            /* funtion */
            FinanceAccountPayableCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            FinanceAccountPayableCtrl.ePage.Masters.AddTab = AddTab;
            FinanceAccountPayableCtrl.ePage.Masters.CreateNewAP = CreateNewAP;
            FinanceAccountPayableCtrl.ePage.Masters.RemoveTab = RemoveTab;
        }

        //#region SelectedGridRow
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                FinanceAccountPayableCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewAP();
            }
        }
        //#endregion

        //#region AddTab
        function AddTab(currentTab, isNew) {
            var _isExist = FinanceAccountPayableCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                FinanceAccountPayableCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                financeConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    FinanceAccountPayableCtrl.ePage.Masters.TabList = response;
                    if (FinanceAccountPayableCtrl.ePage.Masters.TabList.length > 0) {
                        FinanceAccountPayableCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        FinanceAccountPayableCtrl.ePage.Masters.ActiveTabIndex = FinanceAccountPayableCtrl.ePage.Masters.TabList.length;
                        FinanceAccountPayableCtrl.ePage.Masters.IsTabClick = false;
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
            FinanceAccountPayableCtrl.ePage.Masters.currentFinanceAP = undefined;

            var _isExist = FinanceAccountPayableCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                FinanceAccountPayableCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(FinanceAccountPayableCtrl.ePage.Entities.API.AccountpayableList.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        FinanceAccountPayableCtrl.ePage.Masters.AddTab(_obj, true);
                        FinanceAccountPayableCtrl.ePage.Masters.isNewClicked = false;
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
            FinanceAccountPayableCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", financeConfig.Entities.API.AccountpayableList.API.AccountpayableListActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
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