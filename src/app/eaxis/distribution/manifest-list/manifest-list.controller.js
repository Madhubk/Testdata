(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DMSManifestController", DMSManifestController);

    DMSManifestController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "dmsManifestConfig", "$timeout", "toastr", "appConfig", "errorWarningService"];

    function DMSManifestController($location, APP_CONSTANT, authService, apiService, helperService, dmsManifestConfig, $timeout, toastr, appConfig, errorWarningService) {

        var DMSManifestCtrl = this;

        function Init() {

            DMSManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": dmsManifestConfig.Entities
            };

            DMSManifestCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            DMSManifestCtrl.ePage.Masters.dataentryName = "TransportsManifest";
            DMSManifestCtrl.ePage.Masters.TabList = [];
            DMSManifestCtrl.ePage.Masters.activeTabIndex = 0;
            DMSManifestCtrl.ePage.Masters.isNewManifestClicked = false;
            DMSManifestCtrl.ePage.Masters.IsTabClick = false;
            DMSManifestCtrl.ePage.Masters.Config = dmsManifestConfig;

            // Remove all Tabs while load shipment
            dmsManifestConfig.TabList = [];

            //functions
            DMSManifestCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DMSManifestCtrl.ePage.Masters.AddTab = AddTab;
            DMSManifestCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            DMSManifestCtrl.ePage.Masters.RemoveTab = RemoveTab;
            DMSManifestCtrl.ePage.Masters.CreateNewManifest = CreateNewManifest;
            DMSManifestCtrl.ePage.Masters.SaveandClose = SaveandClose;

        }

        function SaveandClose(index, currentManifest) {
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            DMSManifestCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", DMSManifestCtrl.ePage.Entities.Header.API.SessionClose.Url + currentManifest.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            DMSManifestCtrl.ePage.Masters.Config.SaveAndClose = false;
            DMSManifestCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                DMSManifestCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewManifest();
            }
        }

        function AddTab(currentManifest, isNew) {
            DMSManifestCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = DMSManifestCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentManifest.entity.ManifestNumber)
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
                DMSManifestCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!isNew) {
                    _currentManifest = currentManifest.entity;
                } else {
                    _currentManifest = currentManifest;
                }

                dmsManifestConfig.GetTabDetails(_currentManifest, isNew).then(function (response) {
                    DMSManifestCtrl.ePage.Masters.TabList = response;
                    var _entity = {};
                    if (DMSManifestCtrl.ePage.Masters.TabList.length > 0) {
                        DMSManifestCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentManifest.entity.ManifestNumber) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        DMSManifestCtrl.ePage.Masters.activeTabIndex = DMSManifestCtrl.ePage.Masters.TabList.length;
                        DMSManifestCtrl.ePage.Masters.CurrentActiveTab(currentManifest.entity.ManifestNumber, _entity);
                        DMSManifestCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Manifest already opened ');
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            dmsManifestConfig.activeTabIndex = DMSManifestCtrl.ePage.Masters.activeTabIndex;
            if (currentTab != null) {
                if (currentTab.label != undefined) {
                    currentTab = currentTab.label.entity;
                } else {
                    currentTab = currentTab;
                }
            }
            DMSManifestCtrl.ePage.Masters.currentManifest = currentTab;
            // validation findall call
            var _obj = {
                ModuleName: ["Manifest"],
                Code: [currentTab],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "TMS",
                    SubModuleCode: "MAN"
                },
                EntityObject: entity
            };

            errorWarningService.GetErrorCodeList(_obj);
        }

        function RemoveTab(event, index, currentManifest) {
            event.preventDefault();
            event.stopPropagation();
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            DMSManifestCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewManifest() {
            var _isExist = DMSManifestCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                DMSManifestCtrl.ePage.Masters.isNewManifestClicked = true;

                helperService.getFullObjectUsingGetById(DMSManifestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsManifestHeader,
                            data: response.data.Response
                        };
                        DMSManifestCtrl.ePage.Masters.AddTab(_obj, true);
                        DMSManifestCtrl.ePage.Masters.isNewManifestClicked = false;
                    } else {
                        console.log("Empty New Manifest response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        Init();
    }
})();