(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InitiateGatepassController", InitiateGatepassController);

    InitiateGatepassController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "gatepassConfig", "$timeout", "toastr", "appConfig", "errorWarningService"];

    function InitiateGatepassController($location, APP_CONSTANT, authService, apiService, helperService, gatepassConfig, $timeout, toastr, appConfig, errorWarningService) {

        var InitGateCtrl = this;

        function Init() {

            InitGateCtrl.ePage = {
                "Title": "",
                "Prefix": "Gatepass",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": gatepassConfig.Entities
            };

            InitGateCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            InitGateCtrl.ePage.Masters.dataentryName = "Gatepass";
            InitGateCtrl.ePage.Masters.TabList = [];
            InitGateCtrl.ePage.Masters.activeTabIndex = 0;
            InitGateCtrl.ePage.Masters.isNewGatepassClicked = false;
            InitGateCtrl.ePage.Masters.IsTabClick = false;
            InitGateCtrl.ePage.Masters.Config = gatepassConfig;

            // Remove all Tabs while load shipment
            gatepassConfig.TabList = [];

            //functions
            InitGateCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            InitGateCtrl.ePage.Masters.AddTab = AddTab;
            InitGateCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            InitGateCtrl.ePage.Masters.RemoveTab = RemoveTab;
            InitGateCtrl.ePage.Masters.CreateNewGatepass = CreateNewGatepass;
            InitGateCtrl.ePage.Masters.SaveandClose = SaveandClose;
        }

        function SaveandClose(index, currentGatepass) {
            var currentGatepass = currentGatepass[currentGatepass.label].ePage.Entities;
            InitGateCtrl.ePage.Masters.TabList.splice(index - 1, 1);

            // apiService.get("eAxisAPI", InitGateCtrl.ePage.Entities.Header.API.SessionClose.Url + currentGatepass.Header.Data.PK).then(function (response) {
            //     if (response.data.Response === "Success") {
            //     } else {
            //         console.log("Tab close Error : " + response);
            //     }
            // });
            InitGateCtrl.ePage.Masters.Config.SaveAndClose = false;
            InitGateCtrl.ePage.Masters.activeTabIndex = 0;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                InitGateCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewGatepass();
            }
        }

        function AddTab(currentGatepass, isNew) {
            InitGateCtrl.ePage.Masters.currentGatepass = undefined;

            var _isExist = InitGateCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentGatepass.entity.GatepassNo)
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
                InitGateCtrl.ePage.Masters.IsTabClick = true;
                var _currentGatepass = undefined;
                if (!isNew) {
                    _currentGatepass = currentGatepass.entity;
                } else {
                    _currentGatepass = currentGatepass;
                }

                gatepassConfig.GetTabDetails(_currentGatepass, isNew).then(function (response) {
                    InitGateCtrl.ePage.Masters.TabList = response;
                    var _entity = {};
                    if (InitGateCtrl.ePage.Masters.TabList.length > 0) {
                        InitGateCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentGatepass.entity.GatepassNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        InitGateCtrl.ePage.Masters.activeTabIndex = InitGateCtrl.ePage.Masters.TabList.length;
                        InitGateCtrl.ePage.Masters.CurrentActiveTab(currentGatepass.entity.GatepassNo, _entity);
                        InitGateCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Gatepass already opened ');
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab != null) {
                if (currentTab.label != undefined) {
                    currentTab = currentTab.label.entity;
                } else {
                    currentTab = currentTab;
                }
            } else {
                currentTab = "New";
            }
            InitGateCtrl.ePage.Masters.currentGatepass = currentTab;
            // validation findall call
            var _obj = {
                ModuleName: ["Gatepass"],
                Code: [currentTab],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "TMS",
                    SubModuleCode: "GAT"
                },
                EntityObject: entity
            };

            errorWarningService.GetErrorCodeList(_obj);
        }

        function RemoveTab(event, index, currentGatepass) {
            event.preventDefault();
            event.stopPropagation();
            var currentGatepass = currentGatepass[currentGatepass.label].ePage.Entities;
            InitGateCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CreateNewGatepass() {
            var _isExist = InitGateCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                InitGateCtrl.ePage.Masters.isNewGatepassClicked = true;

                helperService.getFullObjectUsingGetById(InitGateCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.TMSGatepassHeader,
                            data: response.data.Response
                        };
                        InitGateCtrl.ePage.Masters.AddTab(_obj, true);
                        InitGateCtrl.ePage.Masters.isNewGatepassClicked = false;
                    } else {
                        console.log("Empty New Gatepass response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        Init();
    }
})();