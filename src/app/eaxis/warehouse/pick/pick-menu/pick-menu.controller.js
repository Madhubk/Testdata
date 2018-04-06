(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickMenuController", PickMenuController);

    PickMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "$state"];

    function PickMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, $state) {

        var PickMenuCtrl = this;

        function Init() {

            var currentPick = PickMenuCtrl.currentPick[PickMenuCtrl.currentPick.label].ePage.Entities;

            PickMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick

            };

            // Standard Menu Configuration and Data
            PickMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehousePick;
            PickMenuCtrl.ePage.Masters.StandardMenuInput.obj = PickMenuCtrl.currentPick;
            // function
            PickMenuCtrl.ePage.Masters.Validation = Validation;
            PickMenuCtrl.ePage.Masters.SaveClose = SaveClose;

            PickMenuCtrl.ePage.Masters.Config = pickConfig;
            PickMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            PickMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";

            PickMenuCtrl.ePage.Masters.PickMenu = {};
            PickMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
            PickMenuCtrl.ePage.Masters.PickMenu.ListSource = PickMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            PickMenuCtrl.ePage.Entities.Header.CheckPoints.CallInventoryFunction = false;
            if (PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc == 'Finalized') {
                PickMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
            }
        }
        function SaveClose($item) {
            PickMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickMenuCtrl.ePage.Entities.Header.Validations) {
                PickMenuCtrl.ePage.Masters.Config.RemoveApiErrors(PickMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                PickMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickMenuCtrl.currentPick);
            }
        }

        function Save($item) {
            if (PickMenuCtrl.ePage.Masters.SaveAndClose) {
                PickMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else {
                PickMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            PickMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsPickHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            _input.UIWmsOutward.map(function (value, key) {
                value.WPK_FK = _input.UIWmsPickHeader.PK;
            })
            _input.UIWmsOutwardLines.map(function (value, key) {
                value.WPK_FK = _input.UIWmsPickHeader.PK;
            })

            helperService.SaveEntity($item, 'Pick').then(function (response) {

                if (PickMenuCtrl.ePage.Masters.SaveAndClose) {
                    PickMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else {
                    PickMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }
                PickMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                if (response.Status === "success") {

                    pickConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo) {
                                value.label = PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo;
                                value[PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = pickConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(PickMenuCtrl.currentPick[PickMenuCtrl.currentPick.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if ($state.current.url == "/pick") {
                            helperService.refreshGrid();
                        }
                        if (response.Data.Response) {
                            pickConfig.TabList[_index][pickConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            pickConfig.TabList[_index][pickConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.FinalisedDate = 'null';
                        PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNumber = 'null';
                        
                        pickConfig.TabList[_index][pickConfig.TabList[_index].label].ePage.Entities.Header.Data.UIWmsPickLineSummary.map(function (value, key) {
                            if (value.PickedDateTime) {
                                PickMenuCtrl.ePage.Entities.Header.CheckPoints.CallInventoryFunction = true;
                            }
                        })
                        pickConfig.TabList[_index].isNew = false;

                        $rootScope.toCheckNew();
                    }
                    if (PickMenuCtrl.ePage.Masters.SaveAndClose) {
                        if ($state.current.url == "/pick") {
                            PickMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            PickMenuCtrl.ePage.Masters.SaveAndClose = false;
                        } else {
                            $window.close();
                        }
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    PickMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        PickMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), PickMenuCtrl.currentPick.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (PickMenuCtrl.ePage.Entities.Header.Validations != null) {
                        PickMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickMenuCtrl.currentPick);
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