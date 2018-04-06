(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreateConsignController", CreateConsignController);

    CreateConsignController.$inject = ["$location", "$scope", "APP_CONSTANT", "authService", "apiService", "helperService", "createConsignConfig", "$timeout", "toastr", "appConfig", "$state", "$uibModal", "$window"];

    function CreateConsignController($location, $scope, APP_CONSTANT, authService, apiService, helperService, createConsignConfig, $timeout, toastr, appConfig, $state, $uibModal, $window) {

        var CreateConsignCtrl = this;
        function Init() {
            CreateConsignCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": createConsignConfig.Entities
            };

            CreateConsignCtrl.ePage.Masters.SaveButtonText = "Save";
            CreateConsignCtrl.ePage.Masters.IsDisableSave = false;
            //functions
            CreateConsignCtrl.ePage.Masters.AddTab = AddTab;
            CreateConsignCtrl.ePage.Masters.CreateNewConsignment = CreateNewConsignment;
            CreateConsignCtrl.ePage.Masters.CreateConsignment = CreateConsignment;
            CreateConsignCtrl.ePage.Masters.GoToDashboard = GoToDashboard;


            CreateConsignCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.TransportsConsignment;
            CreateConsignCtrl.ePage.Masters.StandardMenuInput.obj = CreateConsignCtrl.currentConsignment;
            CreateConsignCtrl.ePage.Masters.Validation = Validation;
            CreateConsignCtrl.ePage.Masters.Config = createConsignConfig;

            createConsignConfig.ValidationFindall();
            //Left Menu
            CreateNewConsignment();
        }

        // redirect to dashboard
        function GoToDashboard() {
            $window.open("#/EA/TMS/transports-dashboard", "_self");
        }
        // To close popup and create consignment
        function CreateConsignment() {
            CreateConsignCtrl.ePage.Masters.modalInstance.close('close');
            CreateNewConsignment();
        }
        // to create consignment
        function CreateNewConsignment() {
            CreateConsignCtrl.ePage.Masters.TabList = [];
            CreateConsignCtrl.ePage.Masters.Tab = undefined;
            CreateConsignCtrl.ePage.Masters.isNewClicked = true;
            helperService.getFullObjectUsingGetById(CreateConsignCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TmsConsignmentHeader,
                        data: response.data.Response,
                        Validations: response.data.Validations
                    };
                    CreateConsignCtrl.ePage.Masters.AddTab(_obj, true);
                    CreateConsignCtrl.ePage.Masters.isNewClicked = false;
                } else {
                    console.log("Empty New Inward response");
                }
            });
        }

        function AddTab(currentConsignment, isNew) {
            CreateConsignCtrl.ePage.Masters.currentConsignment = undefined;

            var _isExist = CreateConsignCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentConsignment.entity.ConsignmentNumber;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                CreateConsignCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsignment = undefined;
                if (!isNew) {
                    _currentConsignment = currentConsignment.entity;
                } else {
                    _currentConsignment = currentConsignment;
                }

                createConsignConfig.GetTabDetails(_currentConsignment, isNew).then(function (response) {
                    CreateConsignCtrl.ePage.Masters.TabList = response;
                    CreateConsignCtrl.ePage.Masters.Tab = response[response.length - 1];
                });
            }
        }

        function Validation($item) {
        
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            CreateConsignCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (CreateConsignCtrl.ePage.Entities.Header.Validations) {
                CreateConsignCtrl.ePage.Masters.Config.RemoveApiErrors(CreateConsignCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                CreateConsignCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
        }

        function Saveonly($item) {

            CreateConsignCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CreateConsignCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsConsignmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Consignment').then(function (response) {
                CreateConsignCtrl.ePage.Masters.SaveButtonText = "Save";
                CreateConsignCtrl.ePage.Masters.IsDisableSave = false;
                if (response.Status === "success") {
                    CreateConsignCtrl.ePage.Masters.ProcessInfo = response.Data;
                    $item.isNew = true;
                    openModel().result.then(function (response) { }, function () {
                        console.log("Cancelled");
                    });
                } else {
                    toastr.error("Consignment Process Initiation Failed.")
                }
            });
        }

        function openModel() {
            return CreateConsignCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/transports/create-consignment/create-consign-popup.html"
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