(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupMenuController", PickupMenuController);

    PickupMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "pickupConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal"];

    function PickupMenuController($scope, $timeout, APP_CONSTANT, apiService, pickupConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal) {

        var PickupMenuCtrl = this

        function Init() {

            var currentPickup = PickupMenuCtrl.currentPickup[PickupMenuCtrl.currentPickup.label].ePage.Entities;

            PickupMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickup
            };

            PickupMenuCtrl.ePage.Masters.PickupMenu = {};
            PickupMenuCtrl.ePage.Masters.MyTask = {};
            // Menu list from configuration

            PickupMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            PickupMenuCtrl.ePage.Masters.Validation = Validation;
            PickupMenuCtrl.ePage.Masters.Config = pickupConfig;

            //To show hide mytask
            var _menuList = angular.copy(PickupMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (PickupMenuCtrl.currentPickup.isNew) {
                _menuList[_index].IsDisabled = true;

                PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource = _menuList;
                PickupMenuCtrl.ePage.Masters.ActiveMenu = PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource[0];
            } else {
                GetMyTaskList(_menuList, _index);
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickupMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickupMenuCtrl.ePage.Entities.Header.Validations) {
                PickupMenuCtrl.ePage.Masters.Config.RemoveApiErrors(PickupMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                PickupMenuCtrl.ePage.Masters.Finalisesave = false;
                PickupMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupMenuCtrl.currentPickup);
            }
        }

        function Saveonly($item) {
            PickupMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            PickupMenuCtrl.ePage.Masters.DisableSave = true;
            PickupMenuCtrl.ePage.Masters.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsPickup.PK = _input.PK;
                _input.UIWmsPickup.CreatedDateTime = new Date();
                _input.UIWmsPickup.WorkOrderType = 'PIC';
                _input.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                _input.UIWmsWorkorderReport.WOD_FK = _input.PK;
                if (!_input.UIWmsPickup.ExternalReference) {
                    _input.UIWmsPickup.ExternalReference = _input.UIWmsPickup.WorkOrderID;
                }
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Pickup').then(function (response) {

                PickupMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                PickupMenuCtrl.ePage.Masters.DisableSave = false;
                PickupMenuCtrl.ePage.Masters.Loading = false;

                if (response.Status === "success") {
                    pickupConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID) {
                                value.label = PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID;
                                value[PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    var _index = pickupConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(PickupMenuCtrl.currentPickup[PickupMenuCtrl.currentPickup.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response)
                            pickupConfig.TabList[_index][pickupConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        else if (response.Data)
                            pickupConfig.TabList[_index][pickupConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;

                        PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode + ' - ' + PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;

                        pickupConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/pickup-request") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    PickupMenuCtrl.ePage.Entities.Header.GlobalVariables.PercentageValues = true;

                    if (PickupMenuCtrl.ePage.Masters.SaveAndClose) {
                        PickupMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        PickupMenuCtrl.ePage.Masters.SaveAndClose = false;
                        PickupMenuCtrl.ePage.Masters.DisableSave = true;
                    }
                    toastr.success("Saved Successfully");

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    PickupMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        PickupMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, PickupMenuCtrl.currentPickup.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (PickupMenuCtrl.ePage.Entities.Header.Validations != null) {
                        PickupMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupMenuCtrl.currentPickup);
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

        function GetMyTaskList(menuList, index) {
            var _menuList = menuList,
                _index = index;
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                Status: "AVAILABLE,ASSIGNED",
                EntityRefKey: PickupMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        PickupMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    PickupMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
                }

                PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource = _menuList;
                PickupMenuCtrl.ePage.Masters.ActiveMenu = PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource[0];
            });
        }

        Init();
    }

})();