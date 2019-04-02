(function () {
    "use strict";

    angular.module("Application")
        .controller("CreditorController", CreditorController);

    CreditorController.$inject = ["$timeout", "apiService", "helperService", "creditorConfig", "toastr", "errorWarningService"];

    function CreditorController($timeout, apiService, helperService, creditorConfig, toastr, errorWarningService) {

        var CreditorCtrl = this;

        function Init() {
            CreditorCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Creaditor",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": creditorConfig.Entities
            };

            CreditorCtrl.ePage.Masters.DataentryName = creditorConfig.DataentryName;
            CreditorCtrl.ePage.Masters.Title = creditorConfig.DataentryTitle;

            CreditorCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            CreditorCtrl.ePage.Masters.TabList = [];
            CreditorCtrl.ePage.Masters.ActiveTabIndex = 0;
            CreditorCtrl.ePage.Masters.IsTabClick = false;
            CreditorCtrl.ePage.Masters.isNewClicked = false;

            /* Function */
            CreditorCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            CreditorCtrl.ePage.Masters.AddTab = AddTab;
            CreditorCtrl.ePage.Masters.RemoveTab = RemoveTab;
            CreditorCtrl.ePage.Masters.CreateNewCreditor = CreateNewCreditor;

            /* ErrorWarningConfig */
            CreditorCtrl.ePage.Masters.Config = creditorConfig;
            CreditorCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            creditorConfig.ValidationFindall();
        }

        //#region SelectedGrid
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                CreditorCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewCreditor();
            }
        }
        //#endregion

        //#region  AddTab, RemoveTab, NewCreditor
        function AddTab(currentTab, isNew) {
            var _isExist = CreditorCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                CreditorCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                creditorConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    CreditorCtrl.ePage.Masters.TabList = response;
                    if (CreditorCtrl.ePage.Masters.TabList.length > 0) {
                        CreditorCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        CreditorCtrl.ePage.Masters.ActiveTabIndex = CreditorCtrl.ePage.Masters.TabList.length;
                        CreditorCtrl.ePage.Masters.IsTabClick = false;
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
            CreditorCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", creditorConfig.Entities.API.CreditorGroup.API.CreditorGroupActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewCreditor() {
            CreditorCtrl.ePage.Masters.currentCreditor = undefined;

            var _isExist = CreditorCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                CreditorCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(CreditorCtrl.ePage.Entities.API.CreditorGroup.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        CreditorCtrl.ePage.Masters.AddTab(_obj, true);
                        CreditorCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Creditor response");
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
                GroupCode: "FINANCE_CREDITOR",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }
        //#endregion

        Init()
    }
})();