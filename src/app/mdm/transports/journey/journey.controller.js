(function () {
    "use strict";

    angular
        .module("Application")
        .controller("JourneyController", JourneyController);

    JourneyController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "journeyConfig", "$timeout", "toastr", "appConfig"];

    function JourneyController($location, APP_CONSTANT, authService, apiService, helperService, journeyConfig, $timeout, toastr, appConfig) {

        var JourneyCtrl = this;

        function Init() {
            
            JourneyCtrl.ePage = {
                "Title": "",
                "Prefix": "Journey",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": journeyConfig.Entities,
            };

            JourneyCtrl.ePage.Masters.dataentryName = "Journey";
            JourneyCtrl.ePage.Masters.TabList = [];
            JourneyCtrl.ePage.Masters.activeTabIndex = 0;
            JourneyCtrl.ePage.Masters.isNewJourneyClicked = false;
            JourneyCtrl.ePage.Masters.IsTabClick = false;
            JourneyCtrl.ePage.Masters.Config = journeyConfig;

            // Remove all Tabs while load shipment
            journeyConfig.TabList = [];

            //functions
            JourneyCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            JourneyCtrl.ePage.Masters.AddTab = AddTab;
            JourneyCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            JourneyCtrl.ePage.Masters.RemoveTab = RemoveTab;
            JourneyCtrl.ePage.Masters.CreateNewJourney = CreateNewJourney;
            JourneyCtrl.ePage.Masters.SaveandClose = SaveandClose;
            
            journeyConfig.ValidationFindall();
        }

        function SaveandClose(index, currentJourney) {
            var currentJourney = currentJourney[currentJourney.label].ePage.Entities;
            JourneyCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", JourneyCtrl.ePage.Entities.Header.API.SessionClose.Url + currentJourney.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            JourneyCtrl.ePage.Masters.Config.SaveAndClose = false;
            JourneyCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                JourneyCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewJourney();
            }
        }

        function AddTab(currentJourney, isNew) {
            JourneyCtrl.ePage.Masters.currentJourney = undefined;

            var _isExist = JourneyCtrl.ePage.Masters.TabList.some(function (value) {
                // if (!isNew) {
                //     return value.label === currentJourney.entity.Title;
                // } else {
                //     return false;
                // }
                if (!isNew) {
                    if (value.label === currentJourney.entity.Title)
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
                JourneyCtrl.ePage.Masters.IsTabClick = true;
                var _currentJourney = undefined;
                if (!isNew) {
                    _currentJourney = currentJourney.entity;
                } else {
                    _currentJourney = currentJourney;
                }

                journeyConfig.GetTabDetails(_currentJourney, isNew).then(function (response) {
                    JourneyCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        JourneyCtrl.ePage.Masters.activeTabIndex = JourneyCtrl.ePage.Masters.TabList.length;
                        JourneyCtrl.ePage.Masters.CurrentActiveTab(currentJourney.entity.Title);
                        JourneyCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Journey already opened ');
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
            JourneyCtrl.ePage.Masters.currentJourney = currentTab;
        }

        function RemoveTab(event, index, currentJourney) {
            event.preventDefault();
            event.stopPropagation();
            var currentJourney = currentJourney[currentJourney.label].ePage.Entities;
            JourneyCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewJourney() {
            JourneyCtrl.ePage.Masters.isNewJourneyClicked = true;

            helperService.getFullObjectUsingGetById(JourneyCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TmsJourneyHeader,
                        data: response.data.Response
                    };
                    JourneyCtrl.ePage.Masters.AddTab(_obj, true);
                    JourneyCtrl.ePage.Masters.isNewJourneyClicked = false;
                } else {
                    console.log("Empty New Journey response");
                }
            });
        }
        Init();
    }
})();