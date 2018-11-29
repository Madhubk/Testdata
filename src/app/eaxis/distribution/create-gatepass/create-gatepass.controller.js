(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreateGatepassController", CreateGatepassController);

    CreateGatepassController.$inject = ["$location", "$scope", "APP_CONSTANT", "authService", "apiService", "helperService", "creategatepassConfig", "$timeout", "toastr", "appConfig", "$state", "$uibModal", "$window", "dynamicLookupConfig"];

    function CreateGatepassController($location, $scope, APP_CONSTANT, authService, apiService, helperService, creategatepassConfig, $timeout, toastr, appConfig, $state, $uibModal, $window, dynamicLookupConfig) {

        var CreateGatepassCtrl = this;
        function Init() {
            CreateGatepassCtrl.ePage = {
                "Title": "",
                "Prefix": "Gatepass",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": creategatepassConfig.Entities
            };
            CreateGatepassCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            CreateGatepassCtrl.ePage.Masters.SaveButtonText = "Save";
            CreateGatepassCtrl.ePage.Masters.IsDisableSave = false;
            //functions
            CreateGatepassCtrl.ePage.Masters.AddTab = AddTab;
            CreateGatepassCtrl.ePage.Masters.CreateNewGatepass = CreateNewGatepass;
            CreateGatepassCtrl.ePage.Masters.CreateGatepass = CreateGatepass;
            CreateGatepassCtrl.ePage.Masters.GoToDashboard = GoToDashboard;

            CreateGatepassCtrl.ePage.Masters.Validation = Validation;
            CreateGatepassCtrl.ePage.Masters.Config = creategatepassConfig;

            creategatepassConfig.ValidationFindall();
            //Left Menu
            CreateNewGatepass();
            GetDynamicLookupConfig();
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var _filter = {
                pageName: 'OrganizationList,OrgHeaderWithWarehouse'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }
        // redirect to dashboard
        function GoToDashboard() {
            $window.open("#/EA/DMS/dashboard", "_self");
        }
        // To close popup and create gatepass
        function CreateGatepass() {
            CreateGatepassCtrl.ePage.Masters.modalInstance.close('close');
            CreateNewGatepass();
        }
        // to create gatepass
        function CreateNewGatepass() {
            CreateGatepassCtrl.ePage.Masters.TabList = [];
            CreateGatepassCtrl.ePage.Masters.Tab = undefined;
            CreateGatepassCtrl.ePage.Masters.isNewClicked = true;
            helperService.getFullObjectUsingGetById(CreateGatepassCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.TMSGatepassHeader,
                        data: response.data.Response,
                        Validations: response.data.Validations
                    };
                    CreateGatepassCtrl.ePage.Masters.AddTab(_obj, true);
                    CreateGatepassCtrl.ePage.Masters.isNewClicked = false;
                } else {
                    console.log("Empty New Gatepass response");
                }
            });
        }

        function AddTab(currentGatepass, isNew) {
            CreateGatepassCtrl.ePage.Masters.currentGatepass = undefined;

            var _isExist = CreateGatepassCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentGatepass.entity.GatepassNumber;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                CreateGatepassCtrl.ePage.Masters.IsTabClick = true;
                var _currentGatepass = undefined;
                if (!isNew) {
                    _currentGatepass = currentGatepass.entity;
                } else {
                    _currentGatepass = currentGatepass;
                }

                creategatepassConfig.GetTabDetails(_currentGatepass, isNew).then(function (response) {
                    CreateGatepassCtrl.ePage.Masters.TabList = response;
                    CreateGatepassCtrl.ePage.Masters.Tab = response[response.length - 1];
                });
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            CreateGatepassCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (CreateGatepassCtrl.ePage.Entities.Header.Validations) {
                CreateGatepassCtrl.ePage.Masters.Config.RemoveApiErrors(CreateGatepassCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                CreateGatepassCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
        }

        function Saveonly($item) {

            CreateGatepassCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            CreateGatepassCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TMSGatepassHeader.PK = _input.PK;
                _input.TMSGatepassHeader.GateinTime = new Date();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Gatepass').then(function (response) {
                CreateGatepassCtrl.ePage.Masters.SaveButtonText = "Save";
                CreateGatepassCtrl.ePage.Masters.IsDisableSave = false;
                if (response.Status === "success") {
                    toastr.success("Gatepass Process Initiated Successfully");
                    CreateGatepassCtrl.ePage.Masters.ProcessInfo = response.Data;
                    $item.isNew = true;
                    openModel().result.then(function (response) { }, function () {
                        console.log("Cancelled");
                    });
                } else {
                    toastr.error("Gatepass Process Initiation Failed.")
                }
            });
        }

        function openModel() {
            return CreateGatepassCtrl.ePage.Masters.modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "success-popup height-80",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/distribution/create-gatepass/create-gatepass-popup.html"
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