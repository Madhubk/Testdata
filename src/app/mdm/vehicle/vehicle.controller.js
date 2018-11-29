(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VehicleController", VehicleController);

    VehicleController.$inject = ["$location", "APP_CONSTANT", "authService", "$timeout", "apiService", "helperService", "vehicleConfig", "toastr", "appConfig"];

    function VehicleController($location, APP_CONSTANT, authService, $timeout, apiService, helperService, vehicleConfig, toastr, appConfig) {
        var VehicleCtrl = this;

        function Init() {
            VehicleCtrl.ePage = {
                "Title": "",
                "Prefix": "Vehicle",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": vehicleConfig.Entities
            };

            VehicleCtrl.ePage.Masters.taskName = "Vehicle";
            VehicleCtrl.ePage.Masters.dataentryName = "Vehicle";

            VehicleCtrl.ePage.Masters.defaultFilter = {
                "IsVehicle": "true"
            };

            VehicleCtrl.ePage.Masters.IsNewVehicleClicked = false;
            VehicleCtrl.ePage.Masters.TabList = [];
            vehicleConfig.TabList = [];
            VehicleCtrl.ePage.Masters.activeTabIndex = 0;
            VehicleCtrl.ePage.Masters.RemoveTab = RemoveTab;
            VehicleCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            VehicleCtrl.ePage.Masters.AddTab = AddTab;
            VehicleCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            VehicleCtrl.ePage.Masters.CreateNewVehicle = CreateNewVehicle;
            VehicleCtrl.ePage.Masters.Config = vehicleConfig;
            VehicleCtrl.ePage.Masters.SaveandClose = SaveandClose;

            vehicleConfig.ValidationFindall();
        }

        function AddTab(currentVehicle, isNew) {

            VehicleCtrl.ePage.Masters.currentVehicle = undefined;

            var _isExist = VehicleCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentVehicle.entity.Code)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                VehicleCtrl.ePage.Masters.IsTabClick = true;
                var _currentVehicle = undefined;

                if (!isNew) {
                    _currentVehicle = currentVehicle.entity;

                } else {
                    _currentVehicle = currentVehicle;
                }

                vehicleConfig.GetTabDetails(_currentVehicle, isNew).then(function (response) {
                    VehicleCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {

                        VehicleCtrl.ePage.Masters.activeTabIndex = VehicleCtrl.ePage.Masters.TabList.length;

                        VehicleCtrl.ePage.Masters.CurrentActiveTab(currentVehicle.entity.Code);
                        VehicleCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Vehicle already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab != null) {
                if (currentTab.label != undefined) {
                    currentTab = currentTab.label.entity
                } else {
                    currentTab = currentTab;
                }
            }
            VehicleCtrl.ePage.Masters.currentVehicle = currentTab;
        }

        function RemoveTab(event, index, currentVehicle) {
            event.preventDefault();
            event.stopPropagation();
            var currentVehicle = currentVehicle[currentVehicle.label].ePage.Entities;
            VehicleCtrl.ePage.Masters.TabList.splice(index, 1);
        }


        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                VehicleCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewVehicle();
            }
        }

        function CreateNewVehicle() {
            var _isExist = VehicleCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                VehicleCtrl.ePage.Masters.IsNewVehicleClicked = true;
                apiService.get("eAxisAPI", VehicleCtrl.ePage.Entities.Header.API.NewGetByID.Url).then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            Validations: response.data.Response.Validations,
                            data: response.data.Response
                        };

                        VehicleCtrl.ePage.Masters.AddTab(_obj, true);
                        VehicleCtrl.ePage.Masters.IsNewVehicleClicked = false;
                    } else {
                        console.log("Empty New Vehicle response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        function SaveandClose(index, currentVehicle) {
            var currentVehicle = currentVehicle[currentVehicle.label].ePage.Entities;
            VehicleCtrl.ePage.Masters.TabList.splice(index - 1, 1);
            VehicleCtrl.ePage.Masters.Config.SaveAndClose = false;
            VehicleCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();
    }
})();

