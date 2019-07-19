(function () {
    "use strict";

    angular.module("Application")
        .controller("DepartmentController", DepartmentController);

    DepartmentController.$inject = ["$timeout", "helperService", "departmentConfig", "toastr", "apiService", "errorWarningService"];

    function DepartmentController($timeout, helperService, departmentConfig, toastr, apiService, errorWarningService) {

        var DepartmentCtrl = this;

        function Init() {
            DepartmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Department",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": departmentConfig.Entities
            };

            DepartmentCtrl.ePage.Masters.DataentryName = departmentConfig.DataentryName;
            DepartmentCtrl.ePage.Masters.Title = departmentConfig.DataentryTitle;

            DepartmentCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            DepartmentCtrl.ePage.Masters.TabList = [];
            departmentConfig.TabList = [];
            DepartmentCtrl.ePage.Masters.ActiveTabIndex = 0;
            DepartmentCtrl.ePage.Masters.IsTabClick = false;
            DepartmentCtrl.ePage.Masters.isNewClicked = false;

            /* Function */
            DepartmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DepartmentCtrl.ePage.Masters.AddTab = AddTab;
            DepartmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DepartmentCtrl.ePage.Masters.CreateNewDepartment = CreateNewDepartment;

             /* ErrorWarningConfig */
             DepartmentCtrl.ePage.Masters.Config = departmentConfig;
             DepartmentCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
 
             departmentConfig.ValidationFindall();
        }

        //#region SelectedGrid
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DepartmentCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewDepartment();
            }
        }
        //#endregion

        //#region AddTab, RemoveTab, NewDepartment
        function AddTab(currentTab, isNew) {
            var _isExist = DepartmentCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                DepartmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                departmentConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    DepartmentCtrl.ePage.Masters.TabList = response;
                    if (DepartmentCtrl.ePage.Masters.TabList.length > 0) {
                        DepartmentCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        DepartmentCtrl.ePage.Masters.ActiveTabIndex = DepartmentCtrl.ePage.Masters.TabList.length;
                        DepartmentCtrl.ePage.Masters.IsTabClick = false;
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
            DepartmentCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", departmentConfig.Entities.API.Department.API.DepartmentActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }
        //#endregion

        function CreateNewDepartment() {
            DepartmentCtrl.ePage.Masters.currentDepartment = undefined;

            var _isExist = DepartmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                DepartmentCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(DepartmentCtrl.ePage.Entities.API.Department.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
                        };
                        DepartmentCtrl.ePage.Masters.AddTab(_obj, true);
                        DepartmentCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Department response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        //#region Validation
        function GetValidationList(currentTab, entity){
            var _obj = {
                ModuleName: ["Finance"],
                Code: [currentTab],
                API: "Group",
                //API: "Validation",
                FilterInput: {
                    ModuleCode: "Finance",
                    SubModuleCode: "JBA",
                },
                GroupCode: "FINANCE_DEPARTMENT",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }
        //#endregion

        Init();
    }
})();