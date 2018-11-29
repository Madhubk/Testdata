(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupManifestMenuController", PickupManifestMenuController);

    PickupManifestMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickupManifestConfig", "helperService", "appConfig", "authService", "$state", "confirmation"];

    function PickupManifestMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickupManifestConfig, helperService, appConfig, authService, $state, confirmation) {

        var PickupMenuCtrl = this;

        function Init() {

            var currentManifest = PickupMenuCtrl.currentManifest[PickupMenuCtrl.currentManifest.label].ePage.Entities;

            PickupMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest

            };

            PickupMenuCtrl.ePage.Masters.Config = pickupManifestConfig;
            PickupMenuCtrl.ePage.Masters.SaveButtonText = "Pick";
            // function
            PickupMenuCtrl.ePage.Masters.Validation = Validation;

            PickupMenuCtrl.ePage.Masters.ManifestMenu = {};
            PickupMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
            PickupMenuCtrl.ePage.Masters.ManifestMenu.ListSource = PickupMenuCtrl.ePage.Entities.Header.Meta.MenuList;
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
                Save($item);
            } else {
                PickupMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupMenuCtrl.currentManifest);
            }
        }

        function Save($item) {

            PickupMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";

            PickupMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsManifestHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            _input.TmsManifestHeader.ActualPickupDate = new Date();

            helperService.SaveEntity($item, 'Manifest').then(function (response) {
                PickupMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                PickupMenuCtrl.ePage.Masters.SaveButtonText = "Pick";


                if (response.Status === "success") {
                    var _index = pickupManifestConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(PickupMenuCtrl.currentManifest[PickupMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + PickupMenuCtrl.currentManifest[PickupMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK).then(function (response) {
                            if (response.data.Response) {
                                pickupManifestConfig.TabList[_index][pickupManifestConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;
                            }
                        });

                        pickupManifestConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/pickup-manifest") {
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