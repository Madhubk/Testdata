(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehousesController", WarehousesController);

    WarehousesController.$inject = ["$location", "APP_CONSTANT", "authService", "$timeout", "apiService", "helperService", "warehousesConfig", "toastr", "appConfig"];

    function WarehousesController($location, APP_CONSTANT, authService, $timeout, apiService, helperService, warehousesConfig, toastr, appConfig) {
        var WarehousesCtrl = this;

        function Init() {
            WarehousesCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": warehousesConfig.Entities
            };

            WarehousesCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            WarehousesCtrl.ePage.Masters.taskName = "Warehouse";
            WarehousesCtrl.ePage.Masters.dataentryName = "Warehouse";
            
            WarehousesCtrl.ePage.Masters.IsNewWarehouseClicked = false;
            WarehousesCtrl.ePage.Masters.OrderData = [];
            WarehousesCtrl.ePage.Masters.TabList = [];
            warehousesConfig.TabList = [];
            WarehousesCtrl.ePage.Masters.activeTabIndex = 0;
            WarehousesCtrl.ePage.Masters.RemoveTab = RemoveTab;
            WarehousesCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            WarehousesCtrl.ePage.Masters.AddTab = AddTab;
            WarehousesCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            WarehousesCtrl.ePage.Masters.CreateNewWarehouse = CreateNewWarehouse;
            WarehousesCtrl.ePage.Masters.Config = warehousesConfig;
            WarehousesCtrl.ePage.Masters.SaveandClose = SaveandClose;

            warehousesConfig.ValidationFindall();
        }

        function AddTab(currentWarehouse, isNew) {

            WarehousesCtrl.ePage.Masters.currentWarehouse = undefined;

            var _isExist = WarehousesCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentWarehouse.entity.WarehouseCode)
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
                WarehousesCtrl.ePage.Masters.IsTabClick = true;
                var _currentWarehouse = undefined;

                if (!isNew) {
                    _currentWarehouse = currentWarehouse.entity;

                } else {
                    _currentWarehouse = currentWarehouse;
                }

                warehousesConfig.GetTabDetails(_currentWarehouse, isNew).then(function (response) {
                    WarehousesCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {

                        WarehousesCtrl.ePage.Masters.activeTabIndex = WarehousesCtrl.ePage.Masters.TabList.length;

                        WarehousesCtrl.ePage.Masters.CurrentActiveTab(currentWarehouse.entity.WarehouseCode);
                        WarehousesCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Warehouse already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {

            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity
            } else {
                currentTab = currentTab;
            }
            WarehousesCtrl.ePage.Masters.currentWarehouse = currentTab;
        }

        function RemoveTab(event, index, currentWarehouse) {
            event.preventDefault();
            event.stopPropagation();
            var currentWarehouse = currentWarehouse[currentWarehouse.label].ePage.Entities;
            WarehousesCtrl.ePage.Masters.TabList.splice(index, 1);
        }


        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                WarehousesCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewWarehouse();
            }
        }

        function CreateNewWarehouse() {
            var _isExist = WarehousesCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                WarehousesCtrl.ePage.Masters.IsNewWarehouseClicked = true;
                helperService.getFullObjectUsingGetById(WarehousesCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.WmsWarehouse,
                            Validations:response.data.Response.Validations,
                            data: response.data.Response
                        };
    
                        WarehousesCtrl.ePage.Masters.AddTab(_obj, true);
                        WarehousesCtrl.ePage.Masters.IsNewWarehouseClicked = false;
                    } else {
                        console.log("Empty New Warehouse response");
                    }
                });
            }else {
                toastr.info("New Record Already Opened...!");
            }
        }

        function SaveandClose(index, currentWarehouse){
            var currentWarehouse = currentWarehouse[currentWarehouse.label].ePage.Entities;
            WarehousesCtrl.ePage.Masters.TabList.splice(index-1, 1);
            WarehousesCtrl.ePage.Masters.Config.SaveAndClose = false;
            WarehousesCtrl.ePage.Masters.activeTabIndex = 0;
        }

        Init();
    }
})();

