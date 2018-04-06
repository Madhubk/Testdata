(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestMenuController", ManifestMenuController);

    ManifestMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "adminManifestConfig", "helperService", "appConfig", "authService", "$state", "confirmation"];

    function ManifestMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, adminManifestConfig, helperService, appConfig, authService, $state, confirmation) {

        var ManifestMenuCtrl = this;

        function Init() {

            var currentManifest = ManifestMenuCtrl.currentManifest[ManifestMenuCtrl.currentManifest.label].ePage.Entities;

            ManifestMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest

            };

            // Standard Menu Configuration and Data
            ManifestMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.TransportsManifest;
            ManifestMenuCtrl.ePage.Masters.StandardMenuInput.obj = ManifestMenuCtrl.currentManifest;

            ManifestMenuCtrl.ePage.Masters.Config = adminManifestConfig;
            ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ManifestMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
            ManifestMenuCtrl.ePage.Masters.DispatchButtonText = "Dispatch Manifest";
            // function
            ManifestMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            ManifestMenuCtrl.ePage.Masters.Validation = Validation;
            ManifestMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            ManifestMenuCtrl.ePage.Masters.DispatchedManifest = DispatchedManifest;

            ManifestMenuCtrl.ePage.Masters.ManifestMenu = {};
            ManifestMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
            ManifestMenuCtrl.ePage.Masters.ManifestMenu.ListSource = ManifestMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        function tabSelected(tab, $index, $event) {
            var _index = adminManifestConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(ManifestMenuCtrl.currentManifest[ManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (adminManifestConfig.TabList[_index].isNew) {
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
                                ManifestMenuCtrl.ePage.Masters.Validation(ManifestMenuCtrl.currentManifest);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                }
                else {
                    if ($index == 1 || $index == 2) {
                        var mydata = ManifestMenuCtrl.currentManifest[ManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data;
                        if (mydata.TmsManifestHeader.ManifestNumber && mydata.TmsManifestHeader.Sender_ORG_FK) {
                            //It opens line page         
                        } else {
                            if (ManifestMenuCtrl.ePage.Masters.active == 1) {
                                $event.preventDefault();
                            }
                            ManifestMenuCtrl.ePage.Masters.active = 1;
                            Validation(ManifestMenuCtrl.currentManifest);
                        }
                    }
                }
            }
        }

        function DispatchedManifest($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            _input.TmsManifestHeader.ActualDispatchDate = new Date();
            ManifestMenuCtrl.ePage.Masters.DispatchManifest = true;
            Validation($item);
            
        }

        function SaveClose($item) {
            ManifestMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ManifestMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ManifestMenuCtrl.ePage.Entities.Header.Validations) {
                ManifestMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ManifestMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ManifestMenuCtrl.currentManifest);
            }
        }

        function Save($item) {
            if (ManifestMenuCtrl.ePage.Masters.SaveAndClose) {
                ManifestMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else if (ManifestMenuCtrl.ePage.Masters.DispatchManifest) {
                ManifestMenuCtrl.ePage.Masters.DispatchButtonText = "Please Wait...";
            } else {
                ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            ManifestMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsManifestHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            _input.TmsManifestConsignment.map(function (value, key) {
                value.TMM_FK = _input.TmsManifestHeader.PK;
            })

            helperService.SaveEntity($item, 'Manifest').then(function (response) {
                ManifestMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (ManifestMenuCtrl.ePage.Masters.SaveAndClose) {
                    ManifestMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else if (ManifestMenuCtrl.ePage.Masters.DispatchManifest) {
                    ManifestMenuCtrl.ePage.Masters.DispatchButtonText = "Dispatch Manifest";
                } else {
                    ManifestMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }

                if (response.Status === "success") {
                    var _index = adminManifestConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ManifestMenuCtrl.currentManifest[ManifestMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            adminManifestConfig.TabList[_index][adminManifestConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            adminManifestConfig.TabList[_index][adminManifestConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        if (ManifestMenuCtrl.ePage.Masters.SaveAndClose) {
                            ManifestMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            ManifestMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        adminManifestConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/manifest") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    ManifestMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ManifestMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ManifestMenuCtrl.currentManifest.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ManifestMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ManifestMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ManifestMenuCtrl.currentManifest);
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