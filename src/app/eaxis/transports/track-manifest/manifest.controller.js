(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestController", ManifestController);

    ManifestController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "manifestConfig", "$timeout", "toastr", "appConfig"];

    function ManifestController($location, APP_CONSTANT, authService, apiService, helperService, manifestConfig, $timeout, toastr, appConfig) {

        var ManifestCtrl = this;

        function Init() {

            ManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": manifestConfig.Entities
            };

            ManifestCtrl.ePage.Masters.dataentryName = "TransportsManifest";
            ManifestCtrl.ePage.Masters.TabList = [];
            ManifestCtrl.ePage.Masters.activeTabIndex = 0;
            ManifestCtrl.ePage.Masters.isNewManifestClicked = false;
            ManifestCtrl.ePage.Masters.IsTabClick = false;
            ManifestCtrl.ePage.Masters.Config = manifestConfig;

            // Remove all Tabs while load shipment
            manifestConfig.TabList = [];

            //functions
            ManifestCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ManifestCtrl.ePage.Masters.AddTab = AddTab;
            ManifestCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ManifestCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ManifestCtrl.ePage.Masters.CreateNewManifest = CreateNewManifest;
            ManifestCtrl.ePage.Masters.SaveandClose = SaveandClose;
            ManifestCtrl.ePage.Masters.UnDispatchClose = UnDispatchClose;

            manifestConfig.ValidationFindall();

            getOrgSender();
        }
        function getOrgSender() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        ManifestCtrl.ePage.Masters.UserAccessCode = response.data.Response[0].ORG_Code;
                        getOrgHeader(ManifestCtrl.ePage.Masters.UserAccessCode);
                    }
                }
            });
        }

        function getOrgHeader(item) {
            var _filter = {
                "OrgCode": item
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", ManifestCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ManifestCtrl.ePage.Masters.SenderDetails = response.data.Response[0];
                }
            });
        }

        function SaveandClose(index, currentManifest) {
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            ManifestCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", ManifestCtrl.ePage.Entities.Header.API.SessionClose.Url + currentManifest.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            ManifestCtrl.ePage.Masters.Config.SaveAndClose = false;
            ManifestCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function UnDispatchClose(index, currentManifest) {
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            ManifestCtrl.ePage.Masters.TabList.splice(index, 1);

            // apiService.get("eAxisAPI", ManifestCtrl.ePage.Entities.Header.API.SessionClose.Url + currentManifest.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            ManifestCtrl.ePage.Masters.Config.SaveAndClose = false;
            ManifestCtrl.ePage.Masters.Config.UnDispatchClose = false;
            ManifestCtrl.ePage.Masters.activeTabIndex = index;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ManifestCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewManifest();
            }
        }

        function AddTab(currentManifest, isNew) {
            ManifestCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = ManifestCtrl.ePage.Masters.TabList.some(function (value) {
                // if (!isNew) {
                //     return value.label === currentManifest.entity.ManifestNumber;
                // } else {
                //     return false;
                // }
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
                ManifestCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!isNew) {
                    _currentManifest = currentManifest.entity;
                } else {
                    _currentManifest = currentManifest;
                }

                manifestConfig.GetTabDetails(_currentManifest, isNew).then(function (response) {
                    ManifestCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ManifestCtrl.ePage.Masters.activeTabIndex = ManifestCtrl.ePage.Masters.TabList.length;
                        ManifestCtrl.ePage.Masters.CurrentActiveTab(currentManifest.entity.ManifestNumber);
                        ManifestCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Manifest already opened ');
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
            ManifestCtrl.ePage.Masters.currentManifest = currentTab;
        }

        function RemoveTab(event, index, currentManifest) {
            event.preventDefault();
            event.stopPropagation();
            var currentManifest = currentManifest[currentManifest.label].ePage.Entities;
            ManifestCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewManifest() {
            var _isExist = ManifestCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                ManifestCtrl.ePage.Masters.isNewManifestClicked = true;

                helperService.getFullObjectUsingGetById(ManifestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TmsManifestHeader,
                            data: response.data.Response
                        };
                        ManifestCtrl.ePage.Masters.AddTab(_obj, true);
                        ManifestCtrl.ePage.Masters.isNewManifestClicked = false;
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