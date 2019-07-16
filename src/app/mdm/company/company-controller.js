(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompanyController", CompanyController);

    CompanyController.$inject = ["$timeout", "helperService", "apiService", "companyConfig", "toastr", "errorWarningService"];

    function CompanyController($timeout, helperService, apiService, companyConfig, toastr, errorWarningService) {
        var CompanyCtrl = this;

        function Init() {
            CompanyCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Branch",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": companyConfig.Entities
            };

            CompanyCtrl.ePage.Masters.dataEntryName = companyConfig.DataentryName;
            CompanyCtrl.ePage.Masters.Title = companyConfig.DataentryTitle;

            /* Tab */
            CompanyCtrl.ePage.Masters.TabList = [];
            CompanyCtrl.ePage.Masters.ActiveTabIndex = 0;
            CompanyCtrl.ePage.Masters.IsTabClick = false;
            CompanyCtrl.ePage.Masters.isNewClicked = false;

            /* Function */
            CompanyCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            CompanyCtrl.ePage.Masters.AddTab = AddTab;
            CompanyCtrl.ePage.Masters.RemoveTab = RemoveTab;
            CompanyCtrl.ePage.Masters.CreateNewCompany = CreateNewCompany;

            /* ErrorWarningConfig */
            CompanyCtrl.ePage.Masters.Config = companyConfig;
            CompanyCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            companyConfig.ValidationFindall();
        }

        //#region SelectedGridRow
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                CompanyCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewCompany();
            }
        }
        //#endregion

        //#region  AddTab, RemoveTab
        function AddTab(currentTab, isNew) {
            var _isExist = CompanyCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                CompanyCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                companyConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    CompanyCtrl.ePage.Masters.TabList = response;
                    if (CompanyCtrl.ePage.Masters.TabList.length > 0) {
                        CompanyCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        CompanyCtrl.ePage.Masters.ActiveTabIndex = CompanyCtrl.ePage.Masters.TabList.length;
                        CompanyCtrl.ePage.Masters.IsTabClick = false;
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
            CompanyCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", companyConfig.Entities.API.Company.API.CompanyActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Successfully Cleared") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }
        //#endregion

        //#region CreateNewCompany
        function CreateNewCompany() {
            CompanyCtrl.ePage.Masters.currentCompany = undefined;

            var _isExist = CompanyCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                CompanyCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(CompanyCtrl.ePage.Entities.API.Company.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        CompanyCtrl.ePage.Masters.AddTab(_obj, true);
                        CompanyCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Company response");
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
                GroupCode: "COMPANY_MASTER",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }
        //#endregion

        Init();
    }
})();
