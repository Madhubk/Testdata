(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LocationController", LocationController);

    LocationController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "locationConfig", "toastr", "appConfig"];

    function LocationController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, locationConfig, toastr, appConfig) {
        var LocationCtrl = this,
            Entity = $location.hash();

        function Init() {
            LocationCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse_Location",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": locationConfig.Entities
            };

            LocationCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };
            LocationCtrl.ePage.Masters.Config = locationConfig;
            // For list directive
            LocationCtrl.ePage.Masters.taskName = "WarehouseRow";
            LocationCtrl.ePage.Masters.dataentryName = "WarehouseRow";

            LocationCtrl.ePage.Masters.IsNewLocationClicked = false;
            LocationCtrl.ePage.Masters.OrderData = [];
            LocationCtrl.ePage.Masters.TabList = [];
            LocationCtrl.ePage.Masters.activeTabIndex = 0;
            LocationCtrl.ePage.Masters.AddTab = AddTab;
            LocationCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            LocationCtrl.ePage.Masters.RemoveTab = RemoveTab;

            LocationCtrl.ePage.Masters.CreateNewLocation = CreateNewLocation;
            LocationCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            LocationCtrl.ePage.Masters.SaveandClose = SaveandClose;

            if (Entity) {
                LocationCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));

                LocationCtrl.ePage.Masters.defaultFilter = {
                    "WarehouseCode": LocationCtrl.ePage.Masters.Entity.WarehouseCode
                }
            }


            locationConfig.ValidationFindall();

        }

        function CreateNewLocation() {
            var _isExist = LocationCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                LocationCtrl.ePage.Masters.IsNewLocationClicked = true;
                apiService.get("eAxisAPI", LocationCtrl.ePage.Entities.Header.API.GetByID.Url + 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.WmsRow,
                            data: response.data.Response,
                            Validations: response.data.Response.Validations
                        };
                        LocationCtrl.ePage.Masters.AddTab(_obj, true);
                        LocationCtrl.ePage.Masters.IsNewLocationClicked = false;
                    } else {
                        console.log("Empty New Row response");
                    }
                });
            }else {
                toastr.info("New Record Already Opened...!");
            }
        }

        function AddTab(currentLocation, isNew) {

            LocationCtrl.ePage.Masters.currentLocation = undefined;

            var _isExist = LocationCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentLocation.entity.Name)
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

            var _isExist = LocationCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentLocation.entity.Name;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                LocationCtrl.ePage.Masters.IsTabClick = true;
                var _currentLocation = undefined;
                if (!isNew) {
                    _currentLocation = currentLocation.entity;
                } else {
                    _currentLocation = currentLocation;
                }
                locationConfig.GetTabDetails(_currentLocation, isNew).then(function (response) {
                    LocationCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        LocationCtrl.ePage.Masters.activeTabIndex = LocationCtrl.ePage.Masters.TabList.length;
                        LocationCtrl.ePage.Masters.CurrentActiveTab(currentLocation.entity.Name);
                        LocationCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Row is already opened ');
            }
        }


        function RemoveTab(event, index, currentLocation) {
            event.preventDefault();
            event.stopPropagation();
            var currentLocation = currentLocation[currentLocation.label].ePage.Entities;
            LocationCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", LocationCtrl.ePage.Entities.Header.API.SessionClose.Url + currentLocation.Header.Data.PK).then(function(response){
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }
        
        function Redirect($item) {
            LocationCtrl.ePage.Masters.AddTab($item, false);
        }

        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            LocationCtrl.ePage.Masters.currentLocation = currentTab;
        }


        function RowDoubleClick($item) {
            LocationCtrl.ePage.Masters.AddTab($item, false);
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                LocationCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewLocation();
            }
        }

        function SaveandClose( index, currentLocation){
            var currentLocation = currentLocation[currentLocation.label].ePage.Entities;
            LocationCtrl.ePage.Masters.TabList.splice(index-1, 1);
            LocationCtrl.ePage.Masters.Config.SaveAndClose = false;
            LocationCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();
    }
})();
