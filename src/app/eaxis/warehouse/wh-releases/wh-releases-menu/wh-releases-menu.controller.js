(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleaseMenuController", ReleaseMenuController);


    ReleaseMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "releaseConfig", "helperService", "appConfig", "authService", "$state", "$filter", "toastr", "$window", "confirmation", "warehouseConfig"];

    function ReleaseMenuController($scope, $timeout, APP_CONSTANT, apiService, releaseConfig, helperService, appConfig, authService, $state, $filter, toastr, $window, confirmation, warehouseConfig) {

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
                        // check whether MTR inward created or not for MTR outward

                        var filter1 = $filter("filter")(_input.UIWmsOutward, function (value, key) {
                            if (value.WorkOrderSubType == 'MTR') {
                                return value;
                            }
                        });
                        if (filter1.length > 0) {
                            angular.forEach(filter1, function (value, key) {
                                // check whether the MTR inward created for Order or Not
                                var _filter = {
                                    "WOD_Parent_FK": value.PK
                                };
                                var _input = {
                                    "searchInput": helperService.createToArrayOfObject(_filter),
                                    "FilterID": warehouseConfig.Entities.WmsInward.API.FindAll.FilterID
                                };

                                apiService.post("eAxisAPI", warehouseConfig.Entities.WmsInward.API.FindAll.Url, _input).then(function (response) {
                                    if (response.data.Response) {
                                        if (response.data.Response.length > 0) {
                                            ReleaseMenuCtrl.ePage.Masters.InwardDetails = response.data.Response;
                                            var InwardDetails = _.groupBy(ReleaseMenuCtrl.ePage.Masters.InwardDetails, 'WOD_Parent_FK');
                                            var InwardDetailsCount = _.keys(InwardDetails).length;
                                            if (InwardDetailsCount == filter1.length) {
                                                ReleaseMenuCtrl.ePage.Masters.Finalisesave = true;
                                                Validation($item);
                                            } else {
                                                ReleaseMenuCtrl.ePage.Masters.Config.PushErrorWarning("E3113", "It can be Finalized when all the Material Transfer Outward having Material Transfer Inward", "E", false, 'InwardDetails', ReleaseMenuCtrl.currentRelease.label, false, undefined, undefined, 'InwardDetails', undefined, 'general');
                                                ReleaseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleaseMenuCtrl.currentRelease);
                                            }
                                        } else {
                                            ReleaseMenuCtrl.ePage.Masters.Config.PushErrorWarning("E3113", "It can be Finalized when all the Material Transfer Outward having Material Transfer Inward", "E", false, 'InwardDetails', ReleaseMenuCtrl.currentRelease.label, false, undefined, undefined, 'InwardDetails', undefined, 'general');
                                            ReleaseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReleaseMenuCtrl.currentRelease);
                                            // toastr.warning("It can be Finalized when all the Material Transfer Outward having Material Transfer Inward");
                                        }
                                    }
                                });
                            });
                        } else {
                            ReleaseMenuCtrl.ePage.Masters.Finalisesave = true;
                            Validation($item);
                        }
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


            // Changing IsModified if only values has been touched.
            _input.UIWmsPickLine.map(function (v, k) {
                if (v.IsTouched) {
                    v.IsModified = true;
                } else {
                    v.IsModified = false;
                }
            });
            _input.UIWmsPickLineSummary.map(function (v, k) {
                if (v.IsTouched) {
                    v.IsModified = true;
                } else {
                    v.IsModified = false;
                }
            });

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
                });
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

                } else {
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