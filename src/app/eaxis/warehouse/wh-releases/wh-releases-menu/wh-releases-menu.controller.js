(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleaseMenuController", ReleaseMenuController);


    ReleaseMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "releaseConfig", "helperService", "appConfig", "authService", "$state", "$filter", "toastr", "$window", "confirmation"];

    function ReleaseMenuController($scope, $timeout, APP_CONSTANT, apiService, releaseConfig, helperService, appConfig, authService, $state, $filter, toastr, $window, confirmation) {

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

            ReleaseMenuCtrl.ePage.Masters.RelaseMenu = {};
            ReleaseMenuCtrl.ePage.Masters.RelaseMenu.ListSource = ReleaseMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            ReleaseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ReleaseMenuCtrl.ePage.Masters.DisableSave = false;

            // function
            ReleaseMenuCtrl.ePage.Masters.Config = releaseConfig;
            ReleaseMenuCtrl.ePage.Masters.FinalizePick = FinalizePick;
            ReleaseMenuCtrl.ePage.Masters.Validation = Validation;

            if (ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'PIF' || ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'CAN') {
                ReleaseMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                ReleaseMenuCtrl.ePage.Masters.DisableSave = true;
            }

        }

        function FinalizePick($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            var filter = $filter("filter")(_input.UIWmsOutward, function (value, key) {
                if (value.WorkOrderStatus == 'FIN') {
                    return value;
                }
            });

            if (filter.length == _input.UIWmsOutward.length) {

                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Do you want to Finalize?',
                    bodyText: 'Once Finalized Pick & Release Cannot be Edited'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        ReleaseMenuCtrl.ePage.Masters.Finalisesave = true;
                        Validation($item);
                    }, function () {
                        console.log("Cancelled");
                    });
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
                ReleaseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleaseMenuCtrl.currentRelease);
                Save($item);
            } else {
                ReleaseMenuCtrl.ePage.Masters.Finalisesave = false;
                ReleaseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleaseMenuCtrl.currentRelease);
            }
        }

        function Save($item) {

            ReleaseMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ReleaseMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            ReleaseMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsPickHeader.PK = _input.PK;
            } else {
                if (ReleaseMenuCtrl.ePage.Masters.Finalisesave) {
                    _input.UIWmsPickHeader.PickStatus = 'PIF';
                    _input.UIWmsPickHeader.PickStatusDesc = 'Finalized';
                }
                $item = filterObjectUpdate($item, "IsModified");
            }

            //Updating the status when manual allocation and deallocation happens
            _input.UIWmsOutward.map(function (value, key) {
                _input.UIWmsPickLine.map(function (val, k) {
                    if (!val.Units) {
                        if (value.PK == val.WOD_FK) {
                            value.PutOrPickSlipDateTime = null;
                            value.PutOrPickCompDateTime = null;
                            value.WorkOrderStatus = "OSP";
                            value.WorkOrderStatusDesc = "Pick Started";
                        }
                    }
                })
            });

            helperService.SaveEntity($item, 'Pick').then(function (response) {

                ReleaseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ReleaseMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                ReleaseMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {

                    releaseConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo) {
                                value.label = ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo;
                                value[ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = releaseConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ReleaseMenuCtrl.currentRelease[ReleaseMenuCtrl.currentRelease.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        releaseConfig.TabList[_index][releaseConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        releaseConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/pick") {
                            helperService.refreshGrid();
                        }

                        ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'PK');
                    }

                    if (ReleaseMenuCtrl.ePage.Masters.SaveAndClose) {
                        if ($state.current.url == "/releases") {
                            ReleaseMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            ReleaseMenuCtrl.ePage.Masters.SaveAndClose = false;
                        } else {
                            $window.close();
                        }
                    }
                    console.log("Success");
                    toastr.success("Saved Successfully...!");

                    ReleaseMenuCtrl.ePage.Entities.Header.GlobalVariables.FetchingInventoryDetails = true;

                    if (ReleaseMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'PIF') {
                        ReleaseMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        ReleaseMenuCtrl.ePage.Masters.DisableSave = true;
                    }

                    if (ReleaseMenuCtrl.ePage.Masters.SaveAndClose) {
                        ReleaseMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        ReleaseMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    ReleaseMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ReleaseMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ReleaseMenuCtrl.currentRelease.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ReleaseMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ReleaseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleaseMenuCtrl.currentRelease);
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