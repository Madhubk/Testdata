(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolMenuController", ConsolMenuController);

    ConsolMenuController.$inject = ["$rootScope", "$injector", "$location", "helperService", "appConfig", "authService", "apiService", "consolidationConfig", "errorWarningService", "confirmation"];

    function ConsolMenuController($rootScope, $injector, $location, helperService, appConfig, authService, apiService, consolidationConfig, errorWarningService, confirmation) {
        var ConsolMenuCtrl = this;

        function Init() {
            var currentConsol = ConsolMenuCtrl.currentConsol[ConsolMenuCtrl.currentConsol.label].ePage.Entities;
            ConsolMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "ConsolMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ConsolMenuCtrl.ePage.Masters.ConsolMenu = {};
            ConsolMenuCtrl.ePage.Masters.MyTask = {};
            ConsolMenuCtrl.ePage.Masters.Config = consolidationConfig
            ConsolMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ConsolMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consolidation.Entity[ConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
            ConsolMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consolidation.Entity[ConsolMenuCtrl.currentConsol.code];
            
            // Standard Menu Configuration and Data
            // ConsolMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.ConsolHeader;
            // ConsolMenuCtrl.ePage.Masters.StandardMenuInput.obj = ConsolMenuCtrl.currentConsol;


            // Menu list from configuration

            var _menuList = angular.copy(ConsolMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (ConsolMenuCtrl.currentConsol.isNew) {
                _menuList[_index].IsDisabled = true;

                ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource = _menuList;
                ConsolMenuCtrl.ePage.Masters.ActiveMenu = ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource[0];
            } else {
                GetMyTaskList(_menuList, _index);
            }

            // Save
            // ConsolMenuCtrl.ePage.Masters.Save = Save;
            // ConsolMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            // ConsolMenuCtrl.ePage.Masters.IsDisableSave = false;
            ConsolMenuCtrl.ePage.Masters.TabSelected = TabSelected;
            ConsolMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
        }

        function GetMyTaskList(menuList, index) {
            var _menuList = menuList,
                _index = index;
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                EntityRefKey: ConsolMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: ConsolMenuCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        ConsolMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    ConsolMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
               }

                ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource = _menuList;
                ConsolMenuCtrl.ePage.Masters.ActiveMenu = ConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource[0];
            });
        }

        function OnMenuClick($item) {
            if ($item) {
                ConsolMenuCtrl.ePage.Masters.ActiveMenu = $item;
                ConsolMenuCtrl.activeTab = ConsolMenuCtrl.ePage.Masters.ActiveMenu;
            }
        }

        function TabSelected(tab, $index, $event) {
            var Config = undefined;
            Config = $injector.get("consolidationConfig");

            var _index = Config.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(ConsolMenuCtrl.currentConsol[ConsolMenuCtrl.currentConsol.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (Config.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'Yes',
                            headerText: 'Save before tab change..',
                            bodyText: 'Do you want to save?'
                        };
                        confirmation.showModal({}, modalOptions).then(function (result) {
                            consolidationConfig.GeneralValidation(ConsolMenuCtrl.currentConsol).then(function (response) {
                                var _errorcount = errorWarningService.Modules.Consol.Entity[ConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
                                ConsolMenuCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Consol.Entity[ConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
                                if (_errorcount.length == 0) {
                                    Save(ConsolMenuCtrl.currentConsol);
                                } else {
                                    helperService.scrollElement('top')
                                    consolidationConfig.ShowErrorWarningModal(ConsolMenuCtrl.currentConsol);
                                }
                            });
                        }, function () {
                            console.log("Cancelled");
                        });
                    }
                }
            }

        }


        function Save($item) {

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;


            _input.UIConConsolHeader.PK = _input.PK;
            _input.UIConsolExtendedInfo = {}

            helperService.SaveEntity($item, 'Consol').then(function (response) {
                if (response.Status === "success") {
                    var _index = consolidationConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(ConsolMenuCtrl.currentConsol.label);

                    if (_index !== -1) {
                        consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        consolidationConfig.TabList[_index].isNew = false;
                        // appConfig.Entities.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
            });
        }



        Init();
    }
})();