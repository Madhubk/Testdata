(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestTransactionMenuController", ManifestTransactionMenuController);

    ManifestTransactionMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "manifestTransConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation"];

    function ManifestTransactionMenuController($scope, $timeout, APP_CONSTANT, apiService, manifestTransConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation) {
        var ManifestTransMenuCtrl = this

        function Init() {

            var currentManifestTrans = ManifestTransMenuCtrl.currentManifestTrans[ManifestTransMenuCtrl.currentManifestTrans.label].ePage.Entities;

            ManifestTransMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "ManifestTrans_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifestTrans
            };
            ManifestTransMenuCtrl.ePage.Masters.ManifestTransMenu = {};
            ManifestTransMenuCtrl.ePage.Masters.ManifestTransMenu.ListSource = ManifestTransMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            ManifestTransMenuCtrl.ePage.Masters.SaveButtonText = "Save";

            ManifestTransMenuCtrl.ePage.Masters.Config = manifestTransConfig;

            ManifestTransMenuCtrl.ePage.Masters.Save = Save;


        }


        function Save($item) {

            ManifestTransMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ManifestTransMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsManifestHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Manifest').then(function (response) {

                ManifestTransMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                ManifestTransMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {
                    var _index = manifestTransConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ManifestTransMenuCtrl.currentManifestTrans[ManifestTransMenuCtrl.currentManifestTrans.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (ManifestTransMenuCtrl.currentManifestTrans[ManifestTransMenuCtrl.currentManifestTrans.label].ePage.Entities.Header.Data.TmsManifestHeader.IsCancel != true) {
                            apiService.get("eAxisAPI",manifestTransConfig.Entities.Header.API.GetByID.Url + ManifestTransMenuCtrl.currentManifestTrans[ManifestTransMenuCtrl.currentManifestTrans.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    manifestTransConfig.TabList[_index][manifestTransConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    manifestTransConfig.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = ManifestTransMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber;
                                                value[ManifestTransMenuCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber] = value.New;
                                                delete value.New;
                                            }
                                        }
                                    });
                                    ManifestTransMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                                }
                            });
                            ManifestTransMenuCtrl.ePage.Masters.SaveReceiveItemButtonText = "Save";
                            toastr.success("Saved Successfully");
                        } else {
                            toastr.success("Cancelled Successfully");
                            ManifestTransMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }
                        manifestTransConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/manifest-list") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    toastr.error("save failed");
                    ManifestTransMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ManifestTransMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ManifestTransMenuCtrl.currentManifestTrans.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ManifestTransMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ManifestTransMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ManifestTransMenuCtrl.currentManifestTrans);
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