(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneConsolMenuController", ThreeOneConsolMenuController);

    ThreeOneConsolMenuController.$inject = ["$injector", "helperService", "three_consolidationConfig", "errorWarningService", "confirmation"];

    function ThreeOneConsolMenuController($injector, helperService, three_consolidationConfig, errorWarningService, confirmation) {
        var ThreeOneConsolMenuCtrl = this;

        function Init() {
            var currentConsol = ThreeOneConsolMenuCtrl.currentConsol[ThreeOneConsolMenuCtrl.currentConsol.label].ePage.Entities;
            ThreeOneConsolMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "ConsolMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };
            ThreeOneConsolMenuCtrl.ePage.Masters.ConsolMenu = {};
            ThreeOneConsolMenuCtrl.ePage.Masters.MyTask = {};
            ThreeOneConsolMenuCtrl.ePage.Masters.Config = three_consolidationConfig
            ThreeOneConsolMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ThreeOneConsolMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consolidation.Entity[ThreeOneConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
            ThreeOneConsolMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consolidation.Entity[ThreeOneConsolMenuCtrl.currentConsol.code];
            
            // Menu list from configuration
            var _menuList = angular.copy(ThreeOneConsolMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (ThreeOneConsolMenuCtrl.currentConsol.isNew) {
                _menuList[_index].IsDisabled = true;

                ThreeOneConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource = _menuList;
                ThreeOneConsolMenuCtrl.ePage.Masters.ActiveMenu = ThreeOneConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource[0];
            } else {
                GetMyTaskList(_menuList, _index);
            }

            // Save
            // ThreeOneConsolMenuCtrl.ePage.Masters.Save = Save;
            // ThreeOneConsolMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            // ThreeOneConsolMenuCtrl.ePage.Masters.IsDisableSave = false;
            ThreeOneConsolMenuCtrl.ePage.Masters.TabSelected = TabSelected;
            ThreeOneConsolMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
        }

        function GetMyTaskList(menuList, index) {
            var _menuList = menuList,
                _index = index;
            // var _filter = {
            //     C_Performer: authService.getUserInfo().UserId,
            //     EntityRefKey: ThreeOneConsolMenuCtrl.ePage.Entities.Header.Data.PK,
            //     KeyReference: ThreeOneConsolMenuCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo
            // };
            // var _input = {
            //     "searchInput": helperService.createToArrayOfObject(_filter),
            //     "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            // };

            // apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         if (response.data.Response.length > 0) {
            //             ThreeOneConsolMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
            //         } else {
            //             if (_index != -1) {
            //                 _menuList[_index].IsDisabled = true;
            //             }
            //         }
            //     } else {
                    ThreeOneConsolMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
               // }

                ThreeOneConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource = _menuList;
                ThreeOneConsolMenuCtrl.ePage.Masters.ActiveMenu = ThreeOneConsolMenuCtrl.ePage.Masters.ConsolMenu.ListSource[0];
            //});
        }

        function OnMenuClick($item) {
            if ($item) {
                ThreeOneConsolMenuCtrl.ePage.Masters.ActiveMenu = $item;
                ThreeOneConsolMenuCtrl.activeTab = ThreeOneConsolMenuCtrl.ePage.Masters.ActiveMenu;
            }
        }

        function TabSelected(tab, $index, $event) {
            var Config = undefined;
            Config = $injector.get("three_consolidationConfig");

            var _index = Config.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(ThreeOneConsolMenuCtrl.currentConsol[ThreeOneConsolMenuCtrl.currentConsol.label].ePage.Entities.Header.Data.PK);

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
                            three_consolidationConfig.GeneralValidation(ThreeOneConsolMenuCtrl.currentConsol).then(function (response) {
                                var _errorcount = errorWarningService.Modules.Consol.Entity[ThreeOneConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
                                ThreeOneConsolMenuCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Consol.Entity[ThreeOneConsolMenuCtrl.currentConsol.code].GlobalErrorWarningList;
                                if (_errorcount.length == 0) {
                                    Save(ThreeOneConsolMenuCtrl.currentConsol);
                                } else {
                                    helperService.scrollElement('top')
                                    three_consolidationConfig.ShowErrorWarningModal(ThreeOneConsolMenuCtrl.currentConsol);
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
                    var _index = three_consolidationConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(ThreeOneConsolMenuCtrl.currentConsol.label);

                    if (_index !== -1) {
                        three_consolidationConfig.TabList[_index][three_consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        three_consolidationConfig.TabList[_index].isNew = false;
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