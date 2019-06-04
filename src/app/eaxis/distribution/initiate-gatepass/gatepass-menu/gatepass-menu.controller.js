(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GatepassMenuController", GatepassMenuController);

    GatepassMenuController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "confirmation", "apiService", "appConfig", "helperService", "toastr", "$timeout", "gatepassConfig", "errorWarningService"];

    function GatepassMenuController($rootScope, $scope, $state, APP_CONSTANT, confirmation, apiService, appConfig, helperService, toastr, $timeout, gatepassConfig, errorWarningService) {

        var GatepassMenuCtrl = this;

        function Init() {
            var currentGatepass = GatepassMenuCtrl.currentGatepass[GatepassMenuCtrl.currentGatepass.label].ePage.Entities;
            GatepassMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "GatePass_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGatepass
            };

            // validation
            if (!GatepassMenuCtrl.currentGatepass.code)
                GatepassMenuCtrl.currentGatepass.code = "New";
            GatepassMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            if (errorWarningService.Modules.Gatepass) {
                GatepassMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Gatepass.Entity[GatepassMenuCtrl.currentGatepass.code];
            }
            GatepassMenuCtrl.ePage.Masters.GatepassMenu = {};
            GatepassMenuCtrl.ePage.Masters.SaveButtonText = "Save";

            // if ($state.current.url == "/create-gatepass") {
            //     GatepassMenuCtrl.ePage.Masters.Config = creategatepassConfig;
            // } else {
            GatepassMenuCtrl.ePage.Masters.Config = gatepassConfig;
            // }

            if (GatepassMenuCtrl.currentGatepass.code)
                GatepassMenuCtrl.ePage.Masters.str = GatepassMenuCtrl.currentGatepass.code.replace(/\//g, '');
            else
                GatepassMenuCtrl.ePage.Masters.str = "New";

            GatepassMenuCtrl.ePage.Masters.GatepassMenu.ListSource = GatepassMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            OnMenuClick(GatepassMenuCtrl.ePage.Masters.GatepassMenu.ListSource[0]);
            GatepassMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            GatepassMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            GatepassMenuCtrl.ePage.Masters.Validation = Validation;
        }

        function OnMenuClick($item) {
            GatepassMenuCtrl.ePage.Masters.ActiveMenuTab = $item;
        }

        function tabSelected(tab, $index, $event) {
            var _index = gatepassConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(GatepassMenuCtrl.currentGatepass[GatepassMenuCtrl.currentGatepass.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (gatepassConfig.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'YES',
                            headerText: 'Save Before Tab Change..',
                            bodyText: 'Do You Want To Save?'
                        };
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                GatepassMenuCtrl.ePage.Masters.Validation(GatepassMenuCtrl.currentGatepass);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                } else {
                    if (((GatepassMenuCtrl.ePage.Masters.GatepassMenu.ListSource[0].IsDisabled) && ($index == 1 || $index == 2)) || ((!GatepassMenuCtrl.ePage.Masters.GatepassMenu.ListSource[0].IsDisabled) && ($index == 2 || $index == 3))) {
                        var mydata = GatepassMenuCtrl.currentGatepass[GatepassMenuCtrl.currentGatepass.label].ePage.Entities.Header.Data;
                        if (mydata.TMSGatepassHeader.ORG_Code && mydata.TMSGatepassHeader.WAR_WarehouseCode) {
                            //It opens line page         
                        } else {
                            if (GatepassMenuCtrl.ePage.Masters.active == 1) {
                                $event.preventDefault();
                            }
                            GatepassMenuCtrl.ePage.Masters.active = 1;
                            Validation(GatepassMenuCtrl.currentGatepass);
                        }
                    }
                }
            }
        };

        function Validation($item) {
            // save manipulation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            GatepassMenuCtrl.ePage.Masters.str = GatepassMenuCtrl.currentGatepass.code.replace(/\//g, '');

            //Validation Call
            var _obj = {
                ModuleName: ["Gatepass"],
                Code: [$item.code],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "DMS",
                    SubModuleCode: "GAT"
                },
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                ErrorCode: ["E3531", "E3532", "E3533", "E3534", "E3535", "E3536", "E3537", "E3545"]
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.Gatepass.Entity[$item.code].GlobalErrorWarningList;

                if (_errorcount.length == 0) {
                    Save($item);
                } else {
                    GatepassMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(GatepassMenuCtrl.currentGatepass);
                }
            });
        }

        function Save($item) {
            GatepassMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";

            GatepassMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TMSGatepassHeader.PK = _input.PK;
                GatepassMenuCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GateinTime = new Date();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Gatepass').then(function (response) {
                GatepassMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                GatepassMenuCtrl.ePage.Masters.SaveButtonText = "Save";

                if (response.Status === "success") {
                    var _index = gatepassConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(GatepassMenuCtrl.currentGatepass[GatepassMenuCtrl.currentGatepass.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        apiService.get("eAxisAPI", gatepassConfig.Entities.Header.API.GetByID.Url + GatepassMenuCtrl.currentGatepass[GatepassMenuCtrl.currentGatepass.label].ePage.Entities.Header.Data.PK).then(function (response) {
                            if (response.data.Response) {
                                gatepassConfig.TabList[_index][gatepassConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                gatepassConfig.TabList.map(function (value, key) {
                                    if (_index == key) {
                                        if (value.New) {
                                            value.label = GatepassMenuCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo;
                                            value[GatepassMenuCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo] = value.New;
                                            delete value.New;
                                        }
                                    }
                                });
                                GatepassMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                            }
                        });
                        toastr.success("Saved Successfully");

                        gatepassConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    toastr.error("save failed");
                    GatepassMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    // angular.forEach(response.Validations, function (value, key) {
                    //     GatepassMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), GatepassMenuCtrl.currentGatepass.label, false, undefined, undefined, undefined, undefined, undefined);
                    // });
                    if (GatepassMenuCtrl.ePage.Entities.Header.Validations != null) {
                        GatepassMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(GatepassMenuCtrl.currentGatepass);
                    }
                }
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