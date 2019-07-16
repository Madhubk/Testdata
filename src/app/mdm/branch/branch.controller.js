(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BranchController", BranchController);

    BranchController.$inject = ["$timeout", "helperService", "apiService", "branchConfig", "toastr", "errorWarningService"];

    function BranchController($timeout, helperService, apiService, branchConfig, toastr, errorWarningService) {
        var BranchCtrl = this;

        function Init() {
            BranchCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Branch",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": branchConfig.Entities
            };

            BranchCtrl.ePage.Masters.dataEntryName = branchConfig.DataentryName;
            BranchCtrl.ePage.Masters.Title = branchConfig.DataentryTitle;

            /* Tab */
            BranchCtrl.ePage.Masters.TabList = [];
            BranchCtrl.ePage.Masters.ActiveTabIndex = 0;
            BranchCtrl.ePage.Masters.IsTabClick = false;
            BranchCtrl.ePage.Masters.isNewClicked = false;

            /* Function */
            BranchCtrl.ePage.Masters.AddTab = AddTab;
            BranchCtrl.ePage.Masters.RemoveTab = RemoveTab;
            BranchCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            BranchCtrl.ePage.Masters.CreateNewBranch = CreateNewBranch;

            /* ErrorWarningConfig */
            BranchCtrl.ePage.Masters.Config = branchConfig;
            BranchCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            branchConfig.ValidationFindall();
        }

        //#region SelectedGrid
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                BranchCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTax();
            }
        }
        //#endregion

        //#region AddTab, RemoveTab, CreateNewBranch
        function AddTab(currentTab, isNew) {
            var _isExist = BranchCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                BranchCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                branchConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    BranchCtrl.ePage.Masters.TabList = response;
                    if (BranchCtrl.ePage.Masters.TabList.length > 0) {
                        BranchCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        BranchCtrl.ePage.Masters.ActiveTabIndex = BranchCtrl.ePage.Masters.TabList.length;
                        BranchCtrl.ePage.Masters.IsTabClick = false;
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
            BranchCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", branchConfig.Entities.API.Branch.API.BranchActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Successfully Cleared") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewBranch() {
            BranchCtrl.ePage.Masters.currentBranch = undefined;

            var _isExist = BranchCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                BranchCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(BranchCtrl.ePage.Entities.API.Branch.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        BranchCtrl.ePage.Masters.AddTab(_obj, true);
                        BranchCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Branch response");
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
                GroupCode: "FINANCE_BRANCH",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }
        //#endregion

        Init();
    }
})();
