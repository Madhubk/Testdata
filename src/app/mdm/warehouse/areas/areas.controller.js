(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AreasController", AreasController);

    AreasController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "areasConfig", "$timeout", "toastr", "appConfig"];

    function AreasController($location, APP_CONSTANT, authService, apiService, helperService, areasConfig, $timeout, toastr, appConfig) {
        var AreasCtrl = this;

        function Init() {
            AreasCtrl.ePage = {
                "Title": "",
                "Prefix": "Warehouse_Area",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": areasConfig.Entities
            };

            AreasCtrl.ePage.Masters.taskName = "WarehouseArea";
            AreasCtrl.ePage.Masters.dataentryName = "WarehouseArea";

            AreasCtrl.ePage.Masters.TabList = [];
            areasConfig.TabList = [];
            AreasCtrl.ePage.Masters.activeTabIndex = 0;
            AreasCtrl.ePage.Masters.IsDisableSave = false;
            AreasCtrl.ePage.Masters.IsNewAreasClicked = false;
            AreasCtrl.ePage.Masters.IsTabClick = false;

            //functions
            AreasCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            AreasCtrl.ePage.Masters.AddTab = AddTab;
            AreasCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            AreasCtrl.ePage.Masters.RemoveTab = RemoveTab;
            AreasCtrl.ePage.Masters.CreateNewAreas = CreateNewAreas;
            AreasCtrl.ePage.Masters.Config = areasConfig;
            AreasCtrl.ePage.Masters.SaveandClose = SaveandClose;

            areasConfig.ValidationFindall();
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                AreasCtrl.ePage.Masters.AddTab($item.data, false);
            }else if ($item.action === "new") {
                CreateNewAreas();
            }
        }

        function AddTab(currentAreas, isNew) {

            AreasCtrl.ePage.Masters.currentAreas = undefined;

            var _isExist = AreasCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentAreas.entity.Name)
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
                AreasCtrl.ePage.Masters.IsTabClick = true;
                var _currentAreas = undefined;
                if (!isNew) {
                    _currentAreas = currentAreas.entity;
                } else {
                    _currentAreas = currentAreas;
                }

                areasConfig.GetTabDetails(_currentAreas, isNew).then(function (response) {
                    AreasCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        AreasCtrl.ePage.Masters.activeTabIndex = AreasCtrl.ePage.Masters.TabList.length;
                        AreasCtrl.ePage.Masters.CurrentActiveTab(currentAreas.entity.Name);
                        AreasCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Areas already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            AreasCtrl.ePage.Masters.currentAreas = currentTab;
        }

        function RemoveTab(event, index, currentAreas) {
            event.preventDefault();
            event.stopPropagation();
            var currentAreas = currentAreas[currentAreas.label].ePage.Entities;
            AreasCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewAreas() {
            var _isExist = AreasCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if(!_isExist){
                AreasCtrl.ePage.Masters.IsNewAreasClicked = true;
                helperService.getFullObjectUsingGetById(AreasCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response,
                            Validations:response.data.Response.Validations
                        };
                        if(_obj.entity.Name == null){_obj.entity.Name = "";}
                        AreasCtrl.ePage.Masters.AddTab(_obj, true);
                        AreasCtrl.ePage.Masters.IsNewAreasClicked = false;
                    } else {
                        console.log("Empty New Areas response");
                    }
                });
            }else {
                toastr.info("New Record Already Opened...!");
            }
        }


        function SaveandClose( index, currentAreas){

            var currentAreas = currentAreas[currentAreas.label].ePage.Entities;
            AreasCtrl.ePage.Masters.TabList.splice(index-1, 1);
            AreasCtrl.ePage.Masters.Config.SaveAndClose = false;
            AreasCtrl.ePage.Masters.activeTabIndex = 0;
        }
        
        Init();
    }

})();
