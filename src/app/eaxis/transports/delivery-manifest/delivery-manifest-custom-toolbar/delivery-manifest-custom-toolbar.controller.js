(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryManifestToolBarController", DeliveryManifestToolBarController);

    DeliveryManifestToolBarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "deliveryManifestConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr"];

    function DeliveryManifestToolBarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, deliveryManifestConfig, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr) {

        var DeliveryManifestToolBarCtrl = this;

        function Init() {


            DeliveryManifestToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Manifest_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }

            };

            DeliveryManifestToolBarCtrl.ePage.Masters.IsActiveMenu = DeliveryManifestToolBarCtrl.activeMenu;
            DeliveryManifestToolBarCtrl.ePage.Masters.Config = deliveryManifestConfig;

            DeliveryManifestToolBarCtrl.ePage.Masters.Input = DeliveryManifestToolBarCtrl.input;
            DeliveryManifestToolBarCtrl.ePage.Masters.DataEntryObject = DeliveryManifestToolBarCtrl.dataentryObject;

            DeliveryManifestToolBarCtrl.ePage.Masters.DeliveryBtnText = "Delivery";
            DeliveryManifestToolBarCtrl.ePage.Masters.IsDisableDeliveryBtn = false;

            DeliveryManifestToolBarCtrl.ePage.Masters.DeliveryManifest = DeliveryManifest;

        }

        function DeliveryManifest() {
            angular.forEach(DeliveryManifestToolBarCtrl.ePage.Masters.Input, function (value, key) {
                if (value.ManifestStatus == "DSP") {
                    DeliveryManifestToolBarCtrl.ePage.Masters.IsDisableDeliveryBtn = true;
                    DeliveryManifestToolBarCtrl.ePage.Masters.DeliveryBtnText = "Please Wait...";

                    apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + value.PK).then(function (response) {
                        if (response.data.Response) {
                            DeliveryManifestToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                            DeliveryManifestToolBarCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
                            DeliveryManifestToolBarCtrl.ePage.Entities.Header.Data = filterObjectUpdate(DeliveryManifestToolBarCtrl.ePage.Entities.Header.Data, "IsModified");
                            apiService.post("eAxisAPI", 'TmsManifestList/Update', DeliveryManifestToolBarCtrl.ePage.Entities.Header.Data).then(function (response) {
                                if (response.data.Response) {
                                    toastr.success("Manifest " + value.ManifestNumber + " is Delivered");
                                    DeliveryManifestToolBarCtrl.ePage.Masters.DeliveryBtnText = "Delivery Manifest";
                                    DeliveryManifestToolBarCtrl.ePage.Masters.IsDisableDeliveryBtn = false;
                                    helperService.refreshGrid();
                                }
                            });
                        }
                        else {
                            toastr.error("Can't save");
                        }
                    });

                } else {
                    toastr.warning("This Manifest " + value.ManifestNumber + " is in " + value.ManifestStatusDesc + " status. So cannot be Delivered.");
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