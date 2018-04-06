(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LegController", LegController);

    LegController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "legConfig", "$timeout", "toastr", "appConfig"];

    function LegController($location, APP_CONSTANT, authService, apiService, helperService, legConfig, $timeout, toastr, appConfig) {

        var LegCtrl = this;

        function Init() {

            LegCtrl.ePage = {
                "Title": "",
                "Prefix": "Leg",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": legConfig.Entities
            };

            LegCtrl.ePage.Masters.taskName = "Leg";
            LegCtrl.ePage.Masters.dataentryName = "Leg";
            LegCtrl.ePage.Masters.TabList = [];
            LegCtrl.ePage.Masters.activeTabIndex = 0;
            LegCtrl.ePage.Masters.isNewLegClicked = false;
            LegCtrl.ePage.Masters.IsTabClick = false;
            LegCtrl.ePage.Masters.Config = legConfig;

            //functions
            LegCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            LegCtrl.ePage.Masters.AddTab = AddTab;
            LegCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            LegCtrl.ePage.Masters.RemoveTab = RemoveTab;
            LegCtrl.ePage.Masters.CreateNewLeg = CreateNewLeg;
            LegCtrl.ePage.Masters.SaveandClose = SaveandClose;
            
            legConfig.ValidationFindall();
        }

        function SaveandClose(index, currentLeg) {
            var currentLeg = currentLeg[currentLeg.label].ePage.Entities;
            LegCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", LegCtrl.ePage.Entities.Header.API.SessionClose.Url + currentLeg.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            LegCtrl.ePage.Masters.Config.SaveAndClose = false;
            LegCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                LegCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewLeg();
            }
        }

        function AddTab(currentLeg, isNew) {
            LegCtrl.ePage.Masters.currentLeg = undefined;

            var _isExist = LegCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentLeg.entity.Title;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                LegCtrl.ePage.Masters.IsTabClick = true;
                var _currentLeg = undefined;
                if (!isNew) {
                    _currentLeg = currentLeg.entity;
                } else {
                    _currentLeg = currentLeg;
                }

                legConfig.GetTabDetails(_currentLeg, isNew).then(function (response) {
                    LegCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        LegCtrl.ePage.Masters.activeTabIndex = LegCtrl.ePage.Masters.TabList.length;
                        LegCtrl.ePage.Masters.CurrentActiveTab(currentLeg.entity.Title);
                        LegCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Leg already opened ');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab != null) {
                if (currentTab.label != undefined) {
                    currentTab = currentTab.label.entity;
                } else {
                    currentTab = currentTab;
                }
            }
            LegCtrl.ePage.Masters.currentLeg = currentTab;
        }

        function RemoveTab(event, index, currentLeg) {
            event.preventDefault();
            event.stopPropagation();
            var currentLeg = currentLeg[currentLeg.label].ePage.Entities;
            LegCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewLeg() {
            LegCtrl.ePage.Masters.isNewLegClicked = true;

            helperService.getFullObjectUsingGetById(LegCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TmsLegHeader,
                        data: response.data.Response
                    };
                    LegCtrl.ePage.Masters.AddTab(_obj, true);
                    LegCtrl.ePage.Masters.isNewLegClicked = false;
                } else {
                    console.log("Empty New Leg response");
                }
            });
        }

        Init();
    }
})();