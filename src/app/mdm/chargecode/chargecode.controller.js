(function () {
    "use strict";

    angular.module("Application")
        .controller("ChargecodeController", ChargecodeController);

    ChargecodeController.$inject = ["$timeout", "apiService", "helperService", "chargecodeConfig", "toastr", "errorWarningService"];

    function ChargecodeController($timeout, apiService, helperService, chargecodeConfig, toastr, errorWarningService) {

        var ChargecodeCtrl = this;

        function Init() {
            ChargecodeCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Chargecode",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": chargecodeConfig.Entities
            };

            ChargecodeCtrl.ePage.Masters.DataentryName = chargecodeConfig.DataentryName;
            ChargecodeCtrl.ePage.Masters.Title = chargecodeConfig.DataentryTitle;

            ChargecodeCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            ChargecodeCtrl.ePage.Masters.TabList = [];
            ChargecodeCtrl.ePage.Masters.ActiveTabIndex = 0;
            ChargecodeCtrl.ePage.Masters.IsTabClick = false;
            ChargecodeCtrl.ePage.Masters.isNewClicked = false;

            /* Function */
            ChargecodeCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ChargecodeCtrl.ePage.Masters.AddTab = AddTab;
            ChargecodeCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ChargecodeCtrl.ePage.Masters.CreateNewChargecode = CreateNewChargecode;

            /* ErrorWarningConfig */
            ChargecodeCtrl.ePage.Masters.Config = chargecodeConfig;
            ChargecodeCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            chargecodeConfig.ValidationFindall();
        }

        //#region SelectedGrid
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ChargecodeCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewChargecode();
            }
        }
        //#endregion

        //#region  AddTab, RemoveTab, NewChargecode
        function AddTab(currentTab, isNew) {
            var _isExist = ChargecodeCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                ChargecodeCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                chargecodeConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    ChargecodeCtrl.ePage.Masters.TabList = response;
                    if (ChargecodeCtrl.ePage.Masters.TabList.length > 0) {
                        ChargecodeCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        ChargecodeCtrl.ePage.Masters.ActiveTabIndex = ChargecodeCtrl.ePage.Masters.TabList.length;
                        ChargecodeCtrl.ePage.Masters.IsTabClick = false;
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
            ChargecodeCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", chargecodeConfig.Entities.API.ChargecodeGroup.API.ChargecodeGroupActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewChargecode() {
            ChargecodeCtrl.ePage.Masters.currentChargecode = undefined;

            var _isExist = ChargecodeCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                ChargecodeCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(ChargecodeCtrl.ePage.Entities.API.ChargecodeGroup.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        ChargecodeCtrl.ePage.Masters.AddTab(_obj, true);
                        ChargecodeCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Chargecode response");
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
                GroupCode: "FINANCE_Chargecode",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }
        //#endregion

        Init()
    }
})();