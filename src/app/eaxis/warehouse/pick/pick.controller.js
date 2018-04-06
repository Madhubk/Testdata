(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickController", PickController);

    PickController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "pickConfig", "$timeout", "toastr", "appConfig"];

    function PickController($location, APP_CONSTANT, authService, apiService, helperService, pickConfig, $timeout, toastr, appConfig) {

        var PickCtrl = this;

        function Init() {

            PickCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": pickConfig.Entities
            };

            PickCtrl.ePage.Masters.taskName = "WarehousePick";
            PickCtrl.ePage.Masters.dataentryName = "WarehousePick";
            PickCtrl.ePage.Masters.TabList = [];
            PickCtrl.ePage.Masters.activeTabIndex = 0;
            PickCtrl.ePage.Masters.isNewPickClicked = false;
            PickCtrl.ePage.Masters.IsTabClick = false;

            //functions
            PickCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            PickCtrl.ePage.Masters.AddTab = AddTab;
            PickCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            PickCtrl.ePage.Masters.RemoveTab = RemoveTab;
            PickCtrl.ePage.Masters.CreateNewPick = CreateNewPick;
            PickCtrl.ePage.Masters.SaveandClose = SaveandClose;

            PickCtrl.ePage.Masters.Config = pickConfig;

            pickConfig.ValidationFindall();
        }

        function SaveandClose(index, currentPick) {
            var currentPick = currentPick[currentPick.label].ePage.Entities;
            PickCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            apiService.get("eAxisAPI", PickCtrl.ePage.Entities.Header.API.SessionClose.Url + currentPick.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            PickCtrl.ePage.Masters.Config.SaveAndClose = false;
            PickCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                PickCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action == "new") {
                CreateNewPick();
            }
        }

        function AddTab(currentPick, isNew) {
            PickCtrl.ePage.Masters.currentPick = undefined;

            var _isExist = PickCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentPick.entity.PickNo)
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
                PickCtrl.ePage.Masters.IsTabClick = true;
                var _currentPick = undefined;
                if (!isNew) {
                    _currentPick = currentPick.entity;
                } else {
                    _currentPick = currentPick;
                }

                pickConfig.GetTabDetails(_currentPick, isNew).then(function (response) {
                    PickCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        PickCtrl.ePage.Masters.activeTabIndex = PickCtrl.ePage.Masters.TabList.length;
                        PickCtrl.ePage.Masters.CurrentActiveTab(currentPick.entity.PickNo);
                        PickCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Pick already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label.entity;
            } else {
                currentTab = currentTab;
            }
            PickCtrl.ePage.Masters.currentPick = currentTab;
        }

        function RemoveTab(event, index, currentPick) {
            event.preventDefault();
            event.stopPropagation();
            var currentPick = currentPick[currentPick.label].ePage.Entities;
            PickCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", PickCtrl.ePage.Entities.Header.API.SessionClose.Url + currentPick.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewPick() {
            var _isExist = PickCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if(!_isExist){
                PickCtrl.ePage.Masters.isNewPickClicked = true;

                helperService.getFullObjectUsingGetById(PickCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIWmsPickHeader,
                            data: response.data.Response.Response
                        };
                        PickCtrl.ePage.Masters.AddTab(_obj, true);
                        PickCtrl.ePage.Masters.isNewPickClicked = false;
                    } else {
                        console.log("Empty New Pick response");
                    }
                });
            }else{
                toastr.info("New Record Already Opened...!");
            }
        }

       
        Init();
    }
})();