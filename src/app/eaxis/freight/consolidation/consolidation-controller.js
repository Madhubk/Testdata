(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolidationController", ConsolidationController);

    ConsolidationController.$inject = ["$location", "$q", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "consolidationConfig", "toastr", "appConfig"];

    function ConsolidationController($location, $q, $timeout, APP_CONSTANT, authService, apiService, helperService, consolidationConfig, toastr, appConfig) {
        var ConsolidationCtrl = this;

        function Init() {
            ConsolidationCtrl.ePage = {
                "Title": "",
                "Prefix": "Consolidation_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": consolidationConfig.Entities
            };

            ConsolidationCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            // For list directive
            ConsolidationCtrl.ePage.Masters.dataentryName = "ConsolHeader";
            ConsolidationCtrl.ePage.Masters.taskName = "ConsolHeader";
            ConsolidationCtrl.ePage.Masters.config = ConsolidationCtrl.ePage.Entities;

            ConsolidationCtrl.ePage.Masters.OrderData = [];
            ConsolidationCtrl.ePage.Masters.TabList = [];
            ConsolidationCtrl.ePage.Masters.activeTabIndex = 0;
            ConsolidationCtrl.ePage.Masters.IsTabClick = false;
            ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = false;
            ConsolidationCtrl.ePage.Masters.SaveButtonText = "Save";
            ConsolidationCtrl.ePage.Masters.IsDisableSave = false;
            ConsolidationCtrl.ePage.Masters.IsNewShipmentClicked = false;

            ConsolidationCtrl.ePage.Masters.AddTab = AddTab;
            ConsolidationCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ConsolidationCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ConsolidationCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ConsolidationCtrl.ePage.Masters.CreateNewConsol = CreateNewConsol;
            ConsolidationCtrl.ePage.Masters.Save = Save;

            CheckUserBasedMenuVisibleType()
        }

        function CreateNewConsol() {
            ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = true;

            helperService.getFullObjectUsingGetById(ConsolidationCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIConConsolHeader,
                        data: response.data.Response.Response
                    };

                    ConsolidationCtrl.ePage.Masters.AddTab(_obj, true);
                    ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = false;
                } else {
                    console.log("Empty New Shipment response");
                }
            });

        }

        function AddTab(currentConsol, isNew) {
            ConsolidationCtrl.ePage.Masters.currentConsol = undefined;

            var _isExist = ConsolidationCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentConsol.entity.ConsolNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                ConsolidationCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsol = undefined;
                if (!isNew) {
                    _currentConsol = currentConsol.entity;
                } else {
                    _currentConsol = currentConsol;
                }

                consolidationConfig.GetTabDetails(_currentConsol, isNew).then(function (response) {
                    ConsolidationCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ConsolidationCtrl.ePage.Masters.activeTabIndex = ConsolidationCtrl.ePage.Masters.TabList.length;
                        ConsolidationCtrl.ePage.Masters.CurrentActiveTab(currentConsol.entity.ConsolNo);
                        ConsolidationCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Consol Already Opened...!');
            }
        }

        function RemoveTab(event, index, currentConsol) {
            event.preventDefault();
            event.stopPropagation();
            var _currentConsol = currentConsol[currentConsol.label].ePage.Entities;

            // Close Current Shipment
            apiService.get("eAxisAPI", ConsolidationCtrl.ePage.Entities.Header.API.ConsolActivityClose.Url + _currentConsol.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // ConsolidationCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            ConsolidationCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ConsolidationCtrl.ePage.Masters.AddTab($item.data, false);
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            ConsolidationCtrl.ePage.Masters.currentConsol = currentTab;
            // Standard Menu Configuration and Data
            ConsolidationCtrl.ePage.Masters.TabList.map(function (value, key) {
                if (value.label === ConsolidationCtrl.ePage.Masters.currentConsol) {
                    console.log()
                    ConsolidationCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.ConsolHeader;
                    ConsolidationCtrl.ePage.Masters.StandardMenuInput.obj = value;
                }
            });
        }

        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                // "EntitySource": "USER",
                "AppCode": authService.getUserInfo().AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _value = JSON.parse(response.data.Response[0].Value);
                        ConsolidationCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        function Save($item) {
            ConsolidationCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ConsolidationCtrl.ePage.Masters.IsDisableSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIConConsolHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Consol').then(function (response) {
                if (response.Status === "success") {
                    var _index = consolidationConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(ConsolidationCtrl.ePage.Masters.currentConsol);

                    if (_index !== -1) {
                        consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data.UIConConsolHeader = response.Data.UIConConsolHeader;
                       
                        consolidationConfig.TabList[_index].isNew = false;
                        // appConfig.Entities.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                ConsolidationCtrl.ePage.Masters.SaveButtonText = "Save";
                ConsolidationCtrl.ePage.Masters.IsDisableSave = false;
            });


          
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

     

        Init();
    }
})();