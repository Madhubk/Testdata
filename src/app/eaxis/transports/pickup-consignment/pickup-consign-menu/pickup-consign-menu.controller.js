(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupConsignMenuController", PickupConsignMenuController);

    PickupConsignMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickupConsignmentConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "toastr"];

    function PickupConsignMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickupConsignmentConfig, helperService, appConfig, authService, $state, confirmation, toastr) {

        var PickupConsignMenuCtrl = this;

        function Init() {

            var currentConsignment = PickupConsignMenuCtrl.currentConsignment[PickupConsignMenuCtrl.currentConsignment.label].ePage.Entities;

            PickupConsignMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment

            };

            PickupConsignMenuCtrl.ePage.Masters.Config = pickupConsignmentConfig;
            PickupConsignMenuCtrl.ePage.Masters.SaveButtonText = "Pickup Consignment";
            // function
            PickupConsignMenuCtrl.ePage.Masters.Validation = Validation;

            PickupConsignMenuCtrl.ePage.Masters.ConsignmentMenu = {};
            PickupConsignMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
            PickupConsignMenuCtrl.ePage.Masters.ConsignmentMenu.ListSource = PickupConsignMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickupConsignMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickupConsignMenuCtrl.ePage.Entities.Header.Validations) {
                PickupConsignMenuCtrl.ePage.Masters.Config.RemoveApiErrors(PickupConsignMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                PickupConsignMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupConsignMenuCtrl.currentConsignment);
            }
        }

        function Save($item) {

            PickupConsignMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";

            PickupConsignMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsConsignmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            _input.TmsConsignmentHeader.ActualPickupDateTime = new Date();

            helperService.SaveEntity($item, 'Consignment').then(function (response) {
                PickupConsignMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                PickupConsignMenuCtrl.ePage.Masters.SaveButtonText = "Pickup Consignment";


                if (response.Status === "success") {
                    var _index = pickupConsignmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(PickupConsignMenuCtrl.currentConsignment[PickupConsignMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + PickupConsignMenuCtrl.currentConsignment[PickupConsignMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK).then(function (response) {
                            if (response.data.Response) {
                                pickupConsignmentConfig.TabList[_index][pickupConsignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;
                                SaveandClose(_index, PickupConsignMenuCtrl.currentConsignment);
                            }
                        });

                        pickupConsignmentConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/pickup-consignment") {
                            helperService.refreshGrid();
                        }
                    }
                    toastr.success("Saved Successfully");
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("save failed");
                }
            });
        }

        function SaveandClose(index, currentConsignment) {
            var currentConsignment = currentConsignment[currentConsignment.label].ePage.Entities;
            pickupConsignmentConfig.TabList.splice(index - 1, 1);
            PickupConsignMenuCtrl.ePage.Masters.Config.SaveAndClose = false;
            PickupConsignMenuCtrl.ePage.Masters.activeTabIndex = 0;
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