(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleaseMenuController", ReleaseMenuController);

    ReleaseMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "releaseConfig", "helperService", "appConfig", "authService", "$state", "$filter", "toastr"];

    function ReleaseMenuController($scope, $timeout, APP_CONSTANT, apiService, releaseConfig, helperService, appConfig, authService, $state, $filter, toastr) {

        var ReleaseMenuCtrl = this;

        function Init() {

            var currentRelease = ReleaseMenuCtrl.currentRelease[ReleaseMenuCtrl.currentRelease.label].ePage.Entities;


            ReleaseMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Release_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentRelease

            };

            // Standard Menu Configuration and Data
            ReleaseMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseRelease;

            ReleaseMenuCtrl.ePage.Masters.StandardMenuInput.obj = ReleaseMenuCtrl.currentRelease;
            // function
            ReleaseMenuCtrl.ePage.Masters.FinalizePick = FinalizePick;
            ReleaseMenuCtrl.ePage.Masters.Validation = Validation;
            ReleaseMenuCtrl.ePage.Masters.SaveClose = SaveClose;

            ReleaseMenuCtrl.ePage.Masters.Config = releaseConfig;
            ReleaseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ReleaseMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";

            ReleaseMenuCtrl.ePage.Masters.FinalisePickText = "Finalize Pick";
            ReleaseMenuCtrl.ePage.Masters.IsDisableSave = false;

            ReleaseMenuCtrl.ePage.Masters.ReleaseMenu = {};
            ReleaseMenuCtrl.ePage.Masters.DropDownMasterList = {};

            if (ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc == 'Finalized') {
                ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
                ReleaseMenuCtrl.ePage.Masters.IsShowPickStatus = true;
                ReleaseMenuCtrl.ePage.Masters.IsDisablePick = true;
            } else {
                ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                ReleaseMenuCtrl.ePage.Masters.IsShowPickStatus = false;
                ReleaseMenuCtrl.ePage.Masters.IsDisablePick = false;
            }

            // if (ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickLineSummary != null) {
            //     ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickLineSummary.map(function (value, key) {
            //         if (value.IsPicked == "True") {
            //             value.IsPicked = "Yes";
            //         }
            //         else {
            //             value.IsPicked = "No";
            //         }
            //     });
            // }
            // Menu list from configuration
            ReleaseMenuCtrl.ePage.Masters.ReleaseMenu.ListSource = ReleaseMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        function SaveClose($item) {
            ReleaseMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function FinalizePick($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            var filter = $filter("filter")(_input.UIWmsOutward, function (value, key) {
                if (value.WorkOrderStatusDesc == 'Finalised') {
                    return value;
                }
            });

            if (filter.length == _input.UIWmsOutward.length) {
                ReleaseMenuCtrl.ePage.Masters.Finalisesave = true;
                Validation($item);
            } else {
                toastr.error("Before finalize the pick all the Orders in this pick should finalized")
            }


        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ReleaseMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ReleaseMenuCtrl.ePage.Entities.Header.Validations) {
                ReleaseMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ReleaseMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ReleaseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleaseMenuCtrl.currentRelease);
            }
        }

        function Save($item) {
            if (ReleaseMenuCtrl.ePage.Masters.Finalisesave == true) {
                ReleaseMenuCtrl.ePage.Masters.FinalisePickText = "Please Wait...";
            } else if (ReleaseMenuCtrl.ePage.Masters.SaveAndClose) {
                ReleaseMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else {
                ReleaseMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }

            ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsPickHeader.PK = _input.PK;
            } else {
                if (ReleaseMenuCtrl.ePage.Masters.Finalisesave == true) {
                    _input.UIWmsPickHeader.PickStatus = 'PIF';
                    _input.UIWmsPickHeader.PickStatusDesc = 'Finalized';
                }
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Pick').then(function (response) {
                if (response.Status === "success") {
                    var _index = releaseConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ReleaseMenuCtrl.currentRelease[ReleaseMenuCtrl.currentRelease.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            releaseConfig.TabList[_index][releaseConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            releaseConfig.TabList[_index][releaseConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }

                        if (ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc == "Finalized") {
                            ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableAllocate = true;
                            ReleaseMenuCtrl.ePage.Masters.IsShowPickStatus = true;
                            ReleaseMenuCtrl.ePage.Masters.IsDisablePick = true;
                            ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableFeild = true;
                            ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
                        }
                        else {
                            ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                        }
                        releaseConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/releases") {
                            helperService.refreshGrid();
                        }
                    }
                    if (ReleaseMenuCtrl.ePage.Masters.Finalisesave == true) {
                        ReleaseMenuCtrl.ePage.Masters.FinalisePickText = "Finalize Pick";
                    } else if (ReleaseMenuCtrl.ePage.Masters.SaveAndClose) {
                        ReleaseMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                    } else {
                        ReleaseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    }

                    if (ReleaseMenuCtrl.ePage.Masters.SaveAndClose) {
                        ReleaseMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        ReleaseMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    ReleaseMenuCtrl.ePage.Masters.IsShowPickStatus = false;

                    ReleaseMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ReleaseMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ReleaseMenuCtrl.currentRelease.label, false, undefined, undefined, undefined, undefined, undefined);
                    });

                    if (ReleaseMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ReleaseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleaseMenuCtrl.currentRelease);
                    }

                    ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.IsDisableFeild = false;
                    ReleaseMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                    if (ReleaseMenuCtrl.ePage.Masters.Finalisesave == true) {
                        ReleaseMenuCtrl.ePage.Masters.FinalisePickText = "Finalize Pick";
                    } else if (ReleaseMenuCtrl.ePage.Masters.SaveAndClose) {
                        ReleaseMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                    } else {
                        ReleaseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    }
                }
                ReleaseMenuCtrl.ePage.Masters.Finalisesave = false;
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