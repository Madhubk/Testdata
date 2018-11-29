(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestCustomToolBarController", ManifestCustomToolBarController);

    ManifestCustomToolBarController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "manifestConfig", "helperService", "appConfig", "authService", "$state", "confirmation", "$uibModal", "$window", "$http", "toastr"];

    function ManifestCustomToolBarController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, manifestConfig, helperService, appConfig, authService, $state, confirmation, $uibModal, $window, $http, toastr) {

        var ManifestToolBarCtrl = this;

        function Init() {


            ManifestToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {

                        }
                    }
                }

            };

            ManifestToolBarCtrl.ePage.Masters.IsActiveMenu = ManifestToolBarCtrl.activeMenu;
            ManifestToolBarCtrl.ePage.Masters.Config = manifestConfig;

            ManifestToolBarCtrl.ePage.Masters.Input = ManifestToolBarCtrl.input;
            ManifestToolBarCtrl.ePage.Masters.DataEntryObject = ManifestToolBarCtrl.dataentryObject;

            ManifestToolBarCtrl.ePage.Masters.DispatchBtnText = "Dispatch Manifest";
            ManifestToolBarCtrl.ePage.Masters.CancelBtnText = "Cancel Manifest";
            ManifestToolBarCtrl.ePage.Masters.UnDispatchBtnText = "Un Dispatch Manifest";

            ManifestToolBarCtrl.ePage.Masters.IsDisableDispatchBtn = false;

            ManifestToolBarCtrl.ePage.Masters.DispatchManifest = DispatchManifest;
            ManifestToolBarCtrl.ePage.Masters.Cancel = Cancel;
            ManifestToolBarCtrl.ePage.Masters.UnDispatch = UnDispatch;
            InitAction();
        }

        function UnDispatch() {
            if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.DispatchCount) {
                ManifestToolBarCtrl.ePage.Masters.IsDisableDispatchBtn = true;
                ManifestToolBarCtrl.ePage.Masters.UnDispatchBtnText = "Please Wait...";
                angular.forEach(ManifestToolBarCtrl.ePage.Masters.Input, function (value, key) {
                    apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + value.PK).then(function (response) {
                        if (response.data.Response) {
                            ManifestToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                            ManifestToolBarCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ActualDispatchDate = "";
                            ManifestToolBarCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestStatus = "DRF";
                            ManifestToolBarCtrl.ePage.Entities.Header.Data = filterObjectUpdate(ManifestToolBarCtrl.ePage.Entities.Header.Data, "IsModified");
                            apiService.post("eAxisAPI", 'TmsManifestList/Update', ManifestToolBarCtrl.ePage.Entities.Header.Data).then(function (response) {
                                if (response.data.Response) {
                                    toastr.success("Manifest " + value.ManifestNumber + " is Undispatched");
                                    ManifestToolBarCtrl.ePage.Masters.UnDispatchBtnText = "Un Dispatch Manifest";
                                    ManifestToolBarCtrl.ePage.Masters.IsDisableDispatchBtn = false;
                                    helperService.refreshGrid();
                                }
                            });
                        }
                    });
                });
            } else if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.DraftCount) {
                toastr.warning("It can be Undispatched only when the manifest status is in In-Transit.");
            } else if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.OtherCount) {
                toastr.warning("It can be Undispatched only when the manifest status is in In-Transit.");
            } else {
                toastr.warning("Selected Manifest Status should be same.")
            }
        }

        function InitAction() {
            ManifestToolBarCtrl.ePage.Masters.DraftCount = 0;
            ManifestToolBarCtrl.ePage.Masters.DispatchCount = 0;
            ManifestToolBarCtrl.ePage.Masters.OtherCount = 0;
            angular.forEach(ManifestToolBarCtrl.ePage.Masters.Input, function (value, key) {
                if (value.ManifestStatus == "DRF") {
                    ManifestToolBarCtrl.ePage.Masters.DraftCount = ManifestToolBarCtrl.ePage.Masters.DraftCount + 1;
                } else if (value.ManifestStatus == "DSP") {
                    ManifestToolBarCtrl.ePage.Masters.DispatchCount = ManifestToolBarCtrl.ePage.Masters.DispatchCount + 1;
                } else {
                    ManifestToolBarCtrl.ePage.Masters.OtherCount = ManifestToolBarCtrl.ePage.Masters.OtherCount + 1;
                }
            });
        }

        function DispatchManifest() {
            if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.DraftCount) {
                ManifestToolBarCtrl.ePage.Masters.IsDisableDispatchBtn = true;
                ManifestToolBarCtrl.ePage.Masters.DispatchBtnText = "Please Wait...";
                angular.forEach(ManifestToolBarCtrl.ePage.Masters.Input, function (value, key) {
                    apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + value.PK).then(function (response) {
                        if (response.data.Response) {
                            ManifestToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                            ManifestToolBarCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ActualDispatchDate = new Date();
                            ManifestToolBarCtrl.ePage.Entities.Header.Data = filterObjectUpdate(ManifestToolBarCtrl.ePage.Entities.Header.Data, "IsModified");
                            apiService.post("eAxisAPI", 'TmsManifestList/Update', ManifestToolBarCtrl.ePage.Entities.Header.Data).then(function (response) {
                                if (response.data.Response) {
                                    toastr.success("Manifest " + value.ManifestNumber + " is Dispatched");
                                    ManifestToolBarCtrl.ePage.Masters.DispatchBtnText = "Dispatch Manifest";
                                    ManifestToolBarCtrl.ePage.Masters.IsDisableDispatchBtn = false;
                                    helperService.refreshGrid();
                                }
                            });
                        }
                    });
                });
            } else if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.DispatchCount) {
                toastr.warning("It can be dispatched only when the manifest status is in Draft.");
            } else if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.OtherCount) {
                toastr.warning("It can be dispatched only when the manifest status is in Draft");
            } else {
                toastr.warning("Selected Manifest Status should be same.")
            }
        }

        function Cancel() {
            if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.DraftCount) {
                ManifestToolBarCtrl.ePage.Masters.IsDisableDispatchBtn = true;
                ManifestToolBarCtrl.ePage.Masters.DispatchBtnText = "Please Wait...";
                angular.forEach(ManifestToolBarCtrl.ePage.Masters.Input, function (value, key) {
                    apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + value.PK).then(function (response) {
                        if (response.data.Response) {
                            ManifestToolBarCtrl.ePage.Entities.Header.Data = response.data.Response;
                            ManifestToolBarCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsCancel = true;
                            ManifestToolBarCtrl.ePage.Entities.Header.Data = filterObjectUpdate(ManifestToolBarCtrl.ePage.Entities.Header.Data, "IsModified");
                            apiService.post("eAxisAPI", 'TmsManifestList/Update', ManifestToolBarCtrl.ePage.Entities.Header.Data).then(function (response) {
                                if (response.data.Response) {
                                    toastr.success("Manifest " + value.ManifestNumber + " is Canceled");
                                    ManifestToolBarCtrl.ePage.Masters.Cancel = "Cancel Manifest";
                                    ManifestToolBarCtrl.ePage.Masters.IsDisableDispatchBtn = false;
                                    helperService.refreshGrid();
                                }
                            });
                        }
                    });
                });
            } else if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.DispatchCount) {
                toastr.warning("It can be cancelled only when the manifest status is in Draft.");
            } else if (ManifestToolBarCtrl.ePage.Masters.Input.length == ManifestToolBarCtrl.ePage.Masters.OtherCount) {
                toastr.warning("It can be cancelled only when the manifest status is in Draft.");
            } else {
                toastr.warning("Selected Manifest Status should be same.")
            }
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