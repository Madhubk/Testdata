(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreateGatepassController", CreateGatepassController);

    CreateGatepassController.$inject = ["$location", "$scope", "APP_CONSTANT", "authService", "apiService", "helperService", "gatepassConfig", "$timeout", "toastr", "appConfig", "$state", "$uibModal", "$window", "dynamicLookupConfig", "errorWarningService"];

    function CreateGatepassController($location, $scope, APP_CONSTANT, authService, apiService, helperService, gatepassConfig, $timeout, toastr, appConfig, $state, $uibModal, $window, dynamicLookupConfig, errorWarningService) {

        var CreateGatepassCtrl = this;

        function Init() {
            CreateGatepassCtrl.ePage = {
                "Title": "",
                "Prefix": "Gatepass",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": gatepassConfig.Entities
            };
            CreateGatepassCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            errorWarningService.Modules = {};

            CreateGatepassCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            CreateGatepassCtrl.ePage.Masters.SaveButtonText = "Save";
            CreateGatepassCtrl.ePage.Masters.IsDisableSave = false;
            //functions
            CreateGatepassCtrl.ePage.Masters.AddTab = AddTab;
            CreateGatepassCtrl.ePage.Masters.CreateNewGatepass = CreateNewGatepass;
            CreateGatepassCtrl.ePage.Masters.CreateGatepass = CreateGatepass;
            CreateGatepassCtrl.ePage.Masters.GoToDashboard = GoToDashboard;

            CreateGatepassCtrl.ePage.Masters.Validation = Validation;
            CreateGatepassCtrl.ePage.Masters.Config = gatepassConfig;

            // gatepassConfig.ValidationFindall();
            //Left Menu
            CreateNewGatepass();
            GetRelatedLookupList();
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrgHeaderWarehouse_3195,Transporter_3022",
                SAP_FK: authService.getUserInfo().AppPK
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

                gatepassConfig.GetTabDetails(_currentGatepass, isNew).then(function (response) {
                    CreateGatepassCtrl.ePage.Masters.TabList = response;
                    CreateGatepassCtrl.ePage.Masters.Tab = response[response.length - 1];

                    // validation findall call            
                    var _obj = {
                        ModuleName: ["Gatepass"],
                        Code: ["New"],
                        API: "Validation",
                        FilterInput: {
                            ModuleCode: "DMS",
                            SubModuleCode: "GAT"
                        },
                        EntityObject: CreateGatepassCtrl.ePage.Masters.Tab
                    };

                    errorWarningService.GetErrorCodeList(_obj);
                });
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            //Validation Call
            // CreateGatepassCtrl.ePage.Masters.Config.GeneralValidation($item);
            // if (CreateGatepassCtrl.ePage.Entities.Header.Validations) {
            //     CreateGatepassCtrl.ePage.Masters.Config.RemoveApiErrors(CreateGatepassCtrl.ePage.Entities.Header.Validations, $item.label);
            // }

            // if (_errorcount.length == 0) {
            //     Saveonly($item);
            // } else {
            //     CreateGatepassCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            // }
            CreateGatepassCtrl.ePage.Masters.str = $item.code.replace(/\//g, '');
            //Validation Call            
            var _obj = {
                ModuleName: ["Gatepass"],
                Code: [$item.code],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "DMS",
                    SubModuleCode: "GAT"
                },
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                ErrorCode: ["E3531", "E3532", "E3533", "E3534", "E3535", "E3536", "E3537"]
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.Gatepass.Entity[$item.code].GlobalErrorWarningList;

                if (_errorcount.length == 0) {
                    Saveonly($item);
                } else {
                    CreateGatepassCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
                }
            });
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