(function () {
    "use strict";

    angular.module("Application")
        .controller("FinancePeriodController", FinancePeriodController);

    FinancePeriodController.$inject = ["$timeout", "helperService", "apiService", "financeperiodConfig", "toastr", "errorWarningService"];

    function FinancePeriodController($timeout, helperService, apiService, financeperiodConfig, toastr, errorWarningService) {

        var FinancePeriodCtrl = this;

        function Init() {
            FinancePeriodCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Financeperiod",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": financeperiodConfig.Entities
            };

            FinancePeriodCtrl.ePage.Masters.DataentryName = financeperiodConfig.DataentryName;
            FinancePeriodCtrl.ePage.Masters.Title = financeperiodConfig.DataentryTitle;

            FinancePeriodCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            FinancePeriodCtrl.ePage.Masters.TabList = [];
            FinancePeriodCtrl.ePage.Masters.ActiveTabIndex = 0;
            FinancePeriodCtrl.ePage.Masters.IsTabClick = false;
            FinancePeriodCtrl.ePage.Masters.isNewClicked = false;

            /* Function */
            FinancePeriodCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            FinancePeriodCtrl.ePage.Masters.AddTab = AddTab;
            FinancePeriodCtrl.ePage.Masters.RemoveTab = RemoveTab;
            FinancePeriodCtrl.ePage.Masters.CreateNewFinancialPeriod = CreateNewFinancialPeriod;

            /* ErrorWarningConfig */
            FinancePeriodCtrl.ePage.Masters.Config = financeperiodConfig;
            FinancePeriodCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            financeperiodConfig.ValidationFindall();
        }
        //#region SelectedGrid
        function SelectedGridRow($item) {
            debugger;
            if ($item.action === "link" || $item.action === "dblClick") {
                FinancePeriodCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewFinancialPeriod();
            }
        }
        //#endregion

        //#region  AddTab, RemoveTab, NewFinancialperiod
        function AddTab(currentTab, isNew) {
            debugger;
            var _isExist = FinancePeriodCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                FinancePeriodCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                financeperiodConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    debugger;
                    FinancePeriodCtrl.ePage.Masters.TabList = response;
                    console.log("hi", FinancePeriodCtrl.ePage.Masters.TabList);
                    if (FinancePeriodCtrl.ePage.Masters.TabList.length > 0) {
                        FinancePeriodCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        FinancePeriodCtrl.ePage.Masters.ActiveTabIndex = FinancePeriodCtrl.ePage.Masters.TabList.length;
                        FinancePeriodCtrl.ePage.Masters.IsTabClick = false;
                        var _code = currentTab.entity.PK.split("-").join("");
                        GetValidationList(_code, _entity);
                    });
                });
            } else {
                toastr.warning('Record already opened...!');
            }
        }

        function RemoveTab(event, index, currentTab) {
            event.preventDefault();
            event.stopPropagation();
            var _currentTab = currentTab[currentTab.code].ePage.Entities;
            FinancePeriodCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", financeperiodConfig.Entities.API.FinancialPeriod.API.FinancePeriodActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewFinancialPeriod() {
            FinancePeriodCtrl.ePage.Masters.currentCreditor = undefined;

            var _isExist = FinancePeriodCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                FinancePeriodCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(FinancePeriodCtrl.ePage.Entities.API.FinancialPeriod.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        FinancePeriodCtrl.ePage.Masters.AddTab(_obj, true);
                        FinancePeriodCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Finance Period response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }
        //#endregion

        //#region Validation
        function GetValidationList(currentTab, entity) {
            var _obj = {
                ModuleName: ["Finance"],
                Code: [currentTab],
                API: "Group",
                //API: "Validation",
                FilterInput: {
                    ModuleCode: "Finance",
                    SubModuleCode: "JBA",
                },
                GroupCode: "FINANCE_DEBTOR",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }
        //#endregion


        Init()
    }
})();