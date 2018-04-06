(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmployeeControllers", EmployeeControllers);

    EmployeeControllers.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "employeeConfig", "toastr"];

    function EmployeeControllers($location, APP_CONSTANT, authService, apiService, helperService, $timeout, employeeConfig, toastr) {
        var EmployeeCtrls = this;

        function Init() {
            EmployeeCtrls.ePage = {
                "Title": "",
                "Prefix": "Warehouse_Employee",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": employeeConfig.Entities
            };

            EmployeeCtrls.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            // For list directive
            EmployeeCtrls.ePage.Masters.IsDisableSave = false;
            EmployeeCtrls.ePage.Masters.taskName = "CmpEmployee";

            EmployeeCtrls.ePage.Masters.IsNewEmployeeClicked = false;
            EmployeeCtrls.ePage.Masters.OrderData = [];
            EmployeeCtrls.ePage.Masters.TabList = [];
            EmployeeCtrls.ePage.Masters.activeTabIndex = 0;
            EmployeeCtrls.ePage.Masters.AddTab = AddTab;
            EmployeeCtrls.ePage.Masters.SaveButtonText = "Save";
            // EmployeeCtrls.ePage.Masters.Redirect = Redirect;
            EmployeeCtrls.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            // EmployeeCtrls.ePage.Masters.RowSelectionChanged = RowSelectionChanged;
            // EmployeeCtrls.ePage.Masters.RowDoubleClick = RowDoubleClick;
            EmployeeCtrls.ePage.Masters.RemoveTab = RemoveTab;
            EmployeeCtrls.ePage.Masters.Save = Save;
            EmployeeCtrls.ePage.Masters.CreateEmployee = CreateEmployee;
            EmployeeCtrls.ePage.Masters.SelectedGridRow = SelectedGridRow;
            // EmployeeCtrls.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }




        function CreateEmployee() {
            EmployeeCtrls.ePage.Masters.IsNewEmployeeClicked = true;

            apiService.get("eAxisAPI", EmployeeCtrls.ePage.Entities.EmployeeHeader.API.GetByID.Url + 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIShipmentHeader,
                        data: response.data.Response.Response
                    };

                    EmployeeCtrls.ePage.Masters.AddTab(_obj, true);
                    EmployeeCtrls.ePage.Masters.IsNewEmployeeClicked = false;
                } else {
                    console.log("Empty New Employee response");
                }
            });
        }

        function AddTab(currentEmployee, isNewEmployee) {
            EmployeeCtrls.ePage.Masters.currentEmployee = undefined;

            var _isExist = EmployeeCtrls.ePage.Masters.TabList.some(function (value) {
                if (!isNewEmployee) {
                    return value.label === currentEmployee.entity.Code;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                EmployeeCtrls.ePage.Masters.IsTabClick = true;
                var _currentEmployee = undefined;
                if (!isNewEmployee) {
                    _currentEmployee = currentEmployee.entity;
                } else {
                    _currentEmployee = currentEmployee;
                }

                employeeConfig.AddEmployee(_currentEmployee, isNewEmployee).then(function (response) {
                    EmployeeCtrls.ePage.Masters.TabList = response;
                    $timeout(function () {
                        EmployeeCtrls.ePage.Masters.activeTabIndex = EmployeeCtrls.ePage.Masters.TabList.length;
                        EmployeeCtrls.ePage.Masters.CurrentActiveTab(currentEmployee.entity.Code);
                        EmployeeCtrls.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Employee already opened ');
            }
        }


        function RemoveTab(event, index, currentEmployee) {
            event.preventDefault();
            event.stopPropagation();
            var currentEmployee = currentEmployee[currentEmployee.label].ePage.Entities;

            // Close Current Shipment
            // apiService.get("eAxisAPI", EmployeeCtrls.ePage.Entities.EmployeeHeader.API.OrderHeaderActivityClose.Url + _currentOrder.OrderHeader.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //         // ShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });


            EmployeeCtrls.ePage.Masters.TabList.splice(index, 1);
        }

        // function Redirect($item) {
        //     EmployeeCtrls.ePage.Masters.AddTab($item, false);
        // }









        function Save(currentEmployee) {
            EmployeeCtrls.ePage.Masters.SaveButtonText = "Please Wait...";
            EmployeeCtrls.ePage.Masters.IsDisableSave = true;

            var _employeeData = currentEmployee[currentEmployee.label].ePage.Entities,
                _input = _employeeData.EmployeeHeader.Data,
                _api;
            // _input.IsModified= true;
            


            if (currentEmployee.isNewEmployee) {
                _input = filterObject(_input, "PK");
                _input.PK = _input.PK;
                _api = "Employee/Insert";
            } else {
                // _input = filterObjectUpdate(_input, "IsModified");
                _input.IsModified = true;
                _api = "Employee/Update";
            }



            apiService.post("eAxisAPI", _api, _input).then(function (response) {


                EmployeeCtrls.ePage.Masters.SaveButtonText = "Save";
                EmployeeCtrls.ePage.Masters.IsDisableSave = false;
            }, function (response) {
                console.log("Error : " + response);
                EmployeeCtrls.ePage.Masters.SaveButtonText = "Save";
                EmployeeCtrls.ePage.Masters.IsDisableSave = false;

            });


        }



        function filterObjectUpdate(obj, key) {

            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }


        function filterObject(obj, key) {

            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObject(obj[i], key);
                } else if (i == key) {
                    obj[key] = undefined;
                }
            }
            return obj;
        }




        function Redirect($item) {
            EmployeeCtrls.ePage.Masters.AddTab($item, false);

        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            EmployeeCtrls.ePage.Masters.currentEmployee = currentTab;
        }


        function RowDoubleClick($item) {
            EmployeeCtrls.ePage.Masters.AddTab($item, false);
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                EmployeeCtrls.ePage.Masters.AddTab($item.data, false);
            }
        }

        Init();
    }
})();
