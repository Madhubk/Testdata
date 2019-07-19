(function () {
    "use strict";

    angular.module("Application")
        .controller("DebtorController", DebtorController);

    DebtorController.$inject = ["$timeout", "helperService", "apiService", "debtorConfig", "toastr", "errorWarningService"];

    function DebtorController($timeout, helperService, apiService, debtorConfig, toastr, errorWarningService) {

        var DebtorCtrl = this;

        function Init() {
            DebtorCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": debtorConfig.Entities
            };

            DebtorCtrl.ePage.Masters.DataentryName = debtorConfig.DataentryName;
            DebtorCtrl.ePage.Masters.Title = debtorConfig.DataentryTitle;

            DebtorCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            DebtorCtrl.ePage.Masters.TabList = [];
            debtorConfig.TabList = [];
            DebtorCtrl.ePage.Masters.ActiveTabIndex = 0;
            DebtorCtrl.ePage.Masters.IsTabClick = false;
            DebtorCtrl.ePage.Masters.isNewClicked = false;

            /* Function */
            DebtorCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DebtorCtrl.ePage.Masters.AddTab = AddTab;
            DebtorCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DebtorCtrl.ePage.Masters.CreateNewDebtor = CreateNewDebtor;

            /* ErrorWarningConfig */
            DebtorCtrl.ePage.Masters.Config = debtorConfig;
            DebtorCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            debtorConfig.ValidationFindall();
        }

        //#region SelectedGrid
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DebtorCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewDebtor();
            }
        }
        //#endregion

        //#region  AddTab, RemoveTab, NewDebtor
        function AddTab(currentTab, isNew) {
            var _isExist = DebtorCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                DebtorCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                debtorConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    DebtorCtrl.ePage.Masters.TabList = response;
                    if (DebtorCtrl.ePage.Masters.TabList.length > 0) {
                        DebtorCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        DebtorCtrl.ePage.Masters.ActiveTabIndex = DebtorCtrl.ePage.Masters.TabList.length;
                        DebtorCtrl.ePage.Masters.IsTabClick = false;
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
            DebtorCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", debtorConfig.Entities.API.DebtorGroup.API.DebtorGroupActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewDebtor() {
            DebtorCtrl.ePage.Masters.currentCreditor = undefined;

            var _isExist = DebtorCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                DebtorCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(DebtorCtrl.ePage.Entities.API.DebtorGroup.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        DebtorCtrl.ePage.Masters.AddTab(_obj, true);
                        DebtorCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Debtor response");
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