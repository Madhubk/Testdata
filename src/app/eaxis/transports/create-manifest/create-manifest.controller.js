(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreateManifestController", CreateManifestController);

    CreateManifestController.$inject = ["$location", "$scope", "APP_CONSTANT", "authService", "apiService", "helperService", "createmanifestConfig", "$timeout", "toastr", "appConfig", "$state", "$uibModal", "$window"];

    function CreateManifestController($location, $scope, APP_CONSTANT, authService, apiService, helperService, createmanifestConfig, $timeout, toastr, appConfig, $state, $uibModal, $window) {

        var CreateManifestCtrl = this;
        function Init() {
            CreateManifestCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": createmanifestConfig.Entities
            };

            CreateManifestCtrl.ePage.Masters.SaveButtonText = "Save";
            CreateManifestCtrl.ePage.Masters.IsDisableSave = false;
            //functions
            CreateManifestCtrl.ePage.Masters.AddTab = AddTab;
            CreateManifestCtrl.ePage.Masters.CreateNewManifest = CreateNewManifest;
            CreateManifestCtrl.ePage.Masters.CreateManifest = CreateManifest;
            CreateManifestCtrl.ePage.Masters.GoToDashboard = GoToDashboard;

            CreateManifestCtrl.ePage.Masters.Validation = Validation;
            CreateManifestCtrl.ePage.Masters.Config = createmanifestConfig;

            createmanifestConfig.ValidationFindall();
            //Left Menu
            CreateNewManifest();
        }

        // redirect to dashboard
        function GoToDashboard() {
            $window.open("#/EA/TMS/transports-dashboard", "_self");
        }
        // To close popup and create manifest
        function CreateManifest() {
            CreateManifestCtrl.ePage.Masters.modalInstance.close('close');
            CreateNewManifest();
        }
        // to create manifest
        function CreateNewManifest() {
            CreateManifestCtrl.ePage.Masters.TabList = [];
            CreateManifestCtrl.ePage.Masters.Tab = undefined;
            CreateManifestCtrl.ePage.Masters.isNewClicked = true;
            helperService.getFullObjectUsingGetById(CreateManifestCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TmsManifestHeader,
                        data: response.data.Response,
                        Validations: response.data.Validations
                    };
                    CreateManifestCtrl.ePage.Masters.AddTab(_obj, true);
                    CreateManifestCtrl.ePage.Masters.isNewClicked = false;
                } else {
                    console.log("Empty New Manifest response");
                }
            });
        }

        function AddTab(currentManifest, isNew) {
            CreateManifestCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = CreateManifestCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentManifest.entity.ManifestNumber;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                CreateManifestCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!isNew) {
                    _currentManifest = currentManifest.entity;
                } else {
                    _currentManifest = currentManifest;
                }

                createmanifestConfig.GetTabDetails(_currentManifest, isNew).then(function (response) {
                    CreateManifestCtrl.ePage.Masters.TabList = response;
                    CreateManifestCtrl.ePage.Masters.Tab = response[response.length - 1];
                });
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            CreateManifestCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (CreateManifestCtrl.ePage.Entities.Header.Validations) {
                CreateManifestCtrl.ePage.Masters.Config.RemoveApiErrors(CreateManifestCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                CreateManifestCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
        }

        function Saveonly($item) {

            CreateManifestCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CreateManifestCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsManifestHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Manifest').then(function (response) {
                CreateManifestCtrl.ePage.Masters.SaveButtonText = "Save";
                CreateManifestCtrl.ePage.Masters.IsDisableSave = false;
                if (response.Status === "success") {
                    toastr.success("Manifest Process Initiated Successfully");
                    CreateManifestCtrl.ePage.Masters.ProcessInfo = response.Data;
                    $item.isNew = true;
                    openModel().result.then(function (response) { }, function () {
                        console.log("Cancelled");
                    });
                } else {
                    toastr.error("Manifest Process Initiation Failed.")
                }
            });
        }

        function openModel() {
            return CreateManifestCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/transports/create-manifest/create-manifest-popup.html"
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