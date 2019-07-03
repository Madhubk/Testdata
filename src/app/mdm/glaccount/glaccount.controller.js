(function () {
    "use strict";

    angular.module("Application")
        .controller("GLaccountController", GLaccountController);

    GLaccountController.$inject = ["$timeout", "helperService", "apiService", "glaccountConfig", "toastr", "errorWarningService"];

    function GLaccountController($timeout, helperService, apiService, glaccountConfig, toastr, errorWarningService) {

        var GLaccountCtrl = this;

        function Init() {
            GLaccountCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_GLaccount",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": glaccountConfig.Entities
            };

            GLaccountCtrl.ePage.Masters.DataentryName = glaccountConfig.DataentryName;
            GLaccountCtrl.ePage.Masters.Title = glaccountConfig.DataentryTitle;

            GLaccountCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            GLaccountCtrl.ePage.Masters.TabList = [];
            GLaccountCtrl.ePage.Masters.ActiveTabIndex = 0;
            GLaccountCtrl.ePage.Masters.IsTabClick = false;
            GLaccountCtrl.ePage.Masters.isNewClicked = false;

            /* Function */
            GLaccountCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            GLaccountCtrl.ePage.Masters.AddTab = AddTab;
            GLaccountCtrl.ePage.Masters.RemoveTab = RemoveTab;
            GLaccountCtrl.ePage.Masters.CreateNewGLaccount = CreateNewGLaccount;

            /* ErrorWarningConfig */
            GLaccountCtrl.ePage.Masters.Config = glaccountConfig;
            GLaccountCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            glaccountConfig.ValidationFindall();
        }

        //#region SelectedGrid
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                GLaccountCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewGLaccount();
            }
        }
        //#endregion

        //#region  AddTab, RemoveTab, NewGGLaccount
        function AddTab(currentTab, isNew) {
            var _isExist = GLaccountCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                GLaccountCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                glaccountConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    GLaccountCtrl.ePage.Masters.TabList = response;
                    if (GLaccountCtrl.ePage.Masters.TabList.length > 0) {
                        GLaccountCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        GLaccountCtrl.ePage.Masters.ActiveTabIndex = GLaccountCtrl.ePage.Masters.TabList.length;
                        GLaccountCtrl.ePage.Masters.IsTabClick = false;
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
            GLaccountCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", glaccountConfig.Entities.API.GLaccount.API.GLaccountActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewGLaccount() {
            GLaccountCtrl.ePage.Masters.currentCreditor = undefined;

            var _isExist = GLaccountCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                GLaccountCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(GLaccountCtrl.ePage.Entities.API.GLaccount.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        GLaccountCtrl.ePage.Masters.AddTab(_obj, true);
                        GLaccountCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New GLaccount response");
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