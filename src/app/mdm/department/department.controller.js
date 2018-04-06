(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DepartmentController", DepartmentController);

    DepartmentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "departmentConfig", "toastr"];

    function DepartmentController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, departmentConfig, toastr) {
        var DepartmentCtrl = this;

        function Init() {
            DepartmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse_Department",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": departmentConfig.Entities
            };
            DepartmentCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };
            // For list directive
            DepartmentCtrl.ePage.Masters.IsDisableSave = false;
            DepartmentCtrl.ePage.Masters.SaveButtonText = "Save";
            DepartmentCtrl.ePage.Masters.Save = Save;
            DepartmentCtrl.ePage.Masters.taskName = "CmpDepartment";
            DepartmentCtrl.ePage.Masters.IsNewEmployeeClicked = false;
            DepartmentCtrl.ePage.Masters.OrderData = [];
            DepartmentCtrl.ePage.Masters.TabList = [];
            DepartmentCtrl.ePage.Masters.activeTabIndex = 0;
            DepartmentCtrl.ePage.Masters.AddTab = AddTab;
            DepartmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DepartmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DepartmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            // DepartmentCtrl.ePage.Masters.Yesterday = helperService.DateFilter('@@@Yesterday');
            // DepartmentCtrl.ePage.Masters.Today = helperService.DateFilter('@@@Today');
            // DepartmentCtrl.ePage.Masters.Tomorrow = helperService.DateFilter('@@@Tomorrow');
            // DepartmentCtrl.ePage.Masters.Last7day = helperService.DateFilter('@@@Last7Days');
            // DepartmentCtrl.ePage.Masters.Next7Days = helperService.DateFilter('@@@Next7Days');
            // DepartmentCtrl.ePage.Masters.Last30Days = helperService.DateFilter('@@@Last30Days');
            // DepartmentCtrl.ePage.Masters.Next30Days = helperService.DateFilter('@@@Next30Days');
            // DepartmentCtrl.ePage.Masters.Last60Days = helperService.DateFilter('@@@Last60Days');
            // DepartmentCtrl.ePage.Masters.Next60Days = helperService.DateFilter('@@@Next60Days');
            // DepartmentCtrl.ePage.Masters.LastWeek = helperService.DateFilter('@@@LastWeek');
            // DepartmentCtrl.ePage.Masters.ThisWeek = helperService.DateFilter('@@@ThisWeek');
            // DepartmentCtrl.ePage.Masters.NextWeek = helperService.DateFilter('@@@NextWeek');
            // DepartmentCtrl.ePage.Masters.LastMonth = helperService.DateFilter('@@@LastMonth');
            // DepartmentCtrl.ePage.Masters.ThisMonth = helperService.DateFilter('@@@ThisMonth');
            // DepartmentCtrl.ePage.Masters.NextMonth = helperService.DateFilter('@@@NextMonth');
            // DepartmentCtrl.ePage.Masters.ThisQuarter = helperService.DateFilter('@@@ThisQuarter_From');
            // DepartmentCtrl.ePage.Masters.LastQuarter = helperService.DateFilter('@@@LastQuarter');
            // DepartmentCtrl.ePage.Masters.ThisYearFrom = helperService.DateFilter('@@@ThisYear_From');
            // DepartmentCtrl.ePage.Masters.ThisYearto = helperService.DateFilter('@@@ThisYear_To');
            // DepartmentCtrl.ePage.Masters.Next60DaysFrom = helperService.DateFilter('@@@Next60Days_From');
            // DepartmentCtrl.ePage.Masters.ThisQuarterTo = helperService.DateFilter('@@@Next60Days_To');
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DepartmentCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }
        function AddTab(currentDepartment, isNew) {
            DepartmentCtrl.ePage.Masters.currentDepartment = undefined;
            var _isExist = DepartmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentDepartment.entity.Code;
                } else {
                    return false;
                }
            });
            if (!_isExist) {
                DepartmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentDepartment = undefined;
                if (!isNew) {
                    _currentDepartment = isNew.entity;
                } else {
                    _currentDepartment = currentDepartment;
                }
                departmentConfig.AddDepartment(currentDepartment, isNew).then(function (response) {
                    DepartmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        DepartmentCtrl.ePage.Masters.activeTabIndex = DepartmentCtrl.ePage.Masters.TabList.length;
                        DepartmentCtrl.ePage.Masters.CurrentActiveTab(currentDepartment.entity.Code);
                        DepartmentCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Employee already opened ');
            }
        }
        function RemoveTab(event, index, currentDepartment) {
            event.preventDefault();
            event.stopPropagation();
            var currentDepartment = currentDepartment[currentDepartment.label].ePage.Entities;
            DepartmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function Save(currentDepartment) {
            DepartmentCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            DepartmentCtrl.ePage.Masters.IsDisableSave = true;

            var _DepData = currentDepartment[currentDepartment.label].ePage.Entities,
                _input = _DepData.DepartmentHeader.Data,
                _api;
            if (currentDepartment.isNew) {
                _input = filterObject(_input, "PK");
                _input.PK = _input.PK;
                _api = "CmpDepartment/Insert";
            } else {
                _input.IsModified = true;
                _api = "CmpDepartment/Update";

            }

            apiService.post("eAxisAPI", _api, _input, appName).then(function (response) {
                DepartmentCtrl.ePage.Masters.SaveButtonText = "Save";
                DepartmentCtrl.ePage.Masters.IsDisableSave = false;
            }, function (response) {
                console.log("Error : " + response);
                DepartmentCtrl.ePage.Masters.SaveButtonText = "Save";
                DepartmentCtrl.ePage.Masters.IsDisableSave = false;

            });
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            DepartmentCtrl.ePage.Masters.currentDepartment = currentTab;
        }

        Init();
    }
})();
