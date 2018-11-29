(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryManifestMenuController", DeliveryManifestMenuController);

    DeliveryManifestMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "deliveryManifestConfig", "helperService", "appConfig", "authService", "$state", "confirmation"];

    function DeliveryManifestMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, deliveryManifestConfig, helperService, appConfig, authService, $state, confirmation) {

        var DeliveryMenuCtrl = this;

        function Init() {

            var currentManifest = DeliveryMenuCtrl.currentManifest[DeliveryMenuCtrl.currentManifest.label].ePage.Entities;

            DeliveryMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest

            };

            DeliveryMenuCtrl.ePage.Masters.Config = deliveryManifestConfig;
            DeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Delivery";
            // function
            DeliveryMenuCtrl.ePage.Masters.Validation = Validation;

            DeliveryMenuCtrl.ePage.Masters.ManifestMenu = {};
            DeliveryMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
            DeliveryMenuCtrl.ePage.Masters.ManifestMenu.ListSource = DeliveryMenuCtrl.ePage.Entities.Header.Meta.MenuList;
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            DeliveryMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DeliveryMenuCtrl.ePage.Entities.Header.Validations) {
                DeliveryMenuCtrl.ePage.Masters.Config.RemoveApiErrors(DeliveryMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                DeliveryMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DeliveryMenuCtrl.currentManifest);
            }
        }

        function Save($item) {

            DeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";

            DeliveryMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsManifestHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            _input.TmsManifestHeader.ActualDeliveryDate = new Date();

            helperService.SaveEntity($item, 'Manifest').then(function (response) {
                DeliveryMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                DeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Delivery";


                if (response.Status === "success") {
                    var _index = deliveryManifestConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(DeliveryMenuCtrl.currentManifest[DeliveryMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + DeliveryMenuCtrl.currentManifest[DeliveryMenuCtrl.currentManifest.label].ePage.Entities.Header.Data.PK).then(function (response) {
                            if (response.data.Response) {
                                deliveryManifestConfig.TabList[_index][deliveryManifestConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;
                            }
                        });

                        deliveryManifestConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/delivery-manifest") {
                            helperService.refreshGrid();
                        }
                    }
                    toastr.success("Saved Successfully");
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.erorr("save failed");
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