(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_TrackContainerController", three_TrackContainerController);

    three_TrackContainerController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "three_TrackcontainerConfig", "toastr", "freightApiConfig"];

    function three_TrackContainerController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, three_TrackcontainerConfig, toastr, freightApiConfig) {
        /* jshint validthis: true */
        var three_TrackContainerCtrl = this;
        var location = $location;

        function Init() {
            three_TrackContainerCtrl.ePage = {
                "Title": "",
                "Prefix": "Container_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_TrackcontainerConfig.Entities
            };
            var _queryString = $location.search();
          
            // For list directive
            three_TrackContainerCtrl.ePage.Masters.taskName = "BPTrackContainer";
            three_TrackContainerCtrl.ePage.Masters.dataentryName = "BPTrackContainer";
            three_TrackContainerCtrl.ePage.Masters.taskHeader = "";
            if(_queryString.item!=undefined&&_queryString.item!=null&&_queryString.item!=''){
                three_TrackContainerCtrl.ePage.Masters.DefaultFilter =JSON.parse(helperService.decryptData(_queryString.item));
            }
            // Remove all Tabs while load shipment
            three_TrackcontainerConfig.TabList = [];

            three_TrackContainerCtrl.ePage.Masters.TabList = [];
            three_TrackContainerCtrl.ePage.Masters.activeTabIndex = 0;
            three_TrackContainerCtrl.ePage.Masters.IsTabClick = false;

            // Functions
            three_TrackContainerCtrl.ePage.Entities.AddTab = AddTab;
            three_TrackContainerCtrl.ePage.Masters.RemoveTab = RemoveTab;
            three_TrackContainerCtrl.ePage.Masters.RemoveAllTab = RemoveAllTab;
            three_TrackContainerCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            three_TrackContainerCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;


        }



        function AddTab(currentContainer, isNew) {
            three_TrackContainerCtrl.ePage.Masters.currentContainer = undefined;

            var _isExist = three_TrackContainerCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentContainer.entity.ContainerNo)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New") {
                        return true;
                    } else
                        return false;
                }
            });
            if (!_isExist) {
                three_TrackContainerCtrl.ePage.Masters.IsTabClick = true;
                var _currentContainer = undefined;
                if (!isNew) {
                    _currentContainer = currentContainer.entity;
                } else {
                    _currentContainer = currentContainer;
                }

                three_TrackcontainerConfig.GetTabDetails(_currentContainer, isNew).then(function (response) {
                    var _entity = {};
                    three_TrackContainerCtrl.ePage.Masters.TabList = response;

                    if (three_TrackContainerCtrl.ePage.Masters.TabList.length > 0) {
                        three_TrackContainerCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentContainer.entity.ContainerNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        three_TrackContainerCtrl.ePage.Masters.activeTabIndex = three_TrackContainerCtrl.ePage.Masters.TabList.length;
                        three_TrackContainerCtrl.ePage.Masters.CurrentActiveTab(currentContainer.entity.ContainerNo, _entity);
                        three_TrackContainerCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentContainer) {
            event.preventDefault();
            event.stopPropagation();
            var _currentContainer = currentContainer[currentContainer.label].ePage.Entities;

            // Close Current Shipment
            apiService.get("eAxisAPI", freightApiConfig.Entities["1_3"].API.activityclose.Url + _currentContainer.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // three_TrackContainerCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            three_TrackContainerCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function RemoveAllTab() {
            event.preventDefault();
            event.stopPropagation();
            three_TrackContainerCtrl.ePage.Masters.TabList.map(function (value, key) {
                var _currentContainer = value[value.label].ePage.Entities;
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_3"].API.activityclose.Url + _currentContainer.Header.Data.PK).then(function (response) {
                    if (response.data.Status == "Success") {
                        three_TrackContainerCtrl.ePage.Masters.TabList.shift();
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            });
            three_TrackContainerCtrl.ePage.Masters.activeTabIndex = three_TrackContainerCtrl.ePage.Masters.TabList.length;
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            three_TrackContainerCtrl.ePage.Masters.currentContainer = currentTab;

        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                three_TrackContainerCtrl.ePage.Entities.AddTab($item.data, false);
            }
        }
        Init();
    }
})();