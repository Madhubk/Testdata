(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupManifestToolBarController", PickupManifestToolBarController);

    PickupManifestToolBarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickupManifestConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr"];

    function PickupManifestToolBarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickupManifestConfig, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr) {

        var PickupManifestToolBarCtrl = this;

        function Init() {


            PickupManifestToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Manifest_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }

            };

            PickupManifestToolBarCtrl.ePage.Masters.IsActiveMenu = PickupManifestToolBarCtrl.activeMenu;
            PickupManifestToolBarCtrl.ePage.Masters.Config = pickupManifestConfig;

            PickupManifestToolBarCtrl.ePage.Masters.Input = PickupManifestToolBarCtrl.input;
            PickupManifestToolBarCtrl.ePage.Masters.DataEntryObject = PickupManifestToolBarCtrl.dataentryObject;

            PickupManifestToolBarCtrl.ePage.Masters.PickBtnText = "Pickup";
            PickupManifestToolBarCtrl.ePage.Masters.IsDisablePickBtn = false;

            PickupManifestToolBarCtrl.ePage.Masters.PickManifest = PickManifest;

        }

        function PickManifest() {
            angular.forEach(PickupManifestToolBarCtrl.ePage.Masters.Input, function (value, key) {
                if (value.ManifestStatus == "DSP") {
                    PickupManifestToolBarCtrl.ePage.Masters.IsDisablePickBtn = true;
                    PickupManifestToolBarCtrl.ePage.Masters.PickBtnText = "Please Wait...";

                    apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + value.PK).then(function (response) {
                        if (response.data.Response) {
                            PickupManifestToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                            PickupManifestToolBarCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ActualPickupDate = new Date();
                            PickupManifestToolBarCtrl.ePage.Entities.Header.Data = filterObjectUpdate(PickupManifestToolBarCtrl.ePage.Entities.Header.Data, "IsModified");
                            apiService.post("eAxisAPI", 'TmsManifestList/Update', PickupManifestToolBarCtrl.ePage.Entities.Header.Data).then(function (response) {
                                if (response.data.Response) {
                                    toastr.success("Manifest " + value.ManifestNumber + " is Picked");
                                    PickupManifestToolBarCtrl.ePage.Masters.PickBtnText = "Pick Manifest";
                                    PickupManifestToolBarCtrl.ePage.Masters.IsDisablePickBtn = false;
                                    helperService.refreshGrid();
                                }
                            });
                        }
                        else {
                            toastr.error("Can't save");
                        }
                    });

                } else {
                    toastr.warning("This Manifest " + value.ManifestNumber + " is in " + value.ManifestStatusDesc + " status. So cannot be Picked.");
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