(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgReferenceModalController", OrgReferenceModalController);

    OrgReferenceModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "organizationConfig", "helperService", "toastr", "param"];

    function OrgReferenceModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, organizationConfig, helperService, toastr, param) {
        var OrgReferenceModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgReferenceModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgReferenceModalCtrl.ePage.Masters.param = param;
            OrgReferenceModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;
            OrgReferenceModalCtrl.ePage.Masters.Save = Save;
            OrgReferenceModalCtrl.ePage.Masters.Cancel = Cancel;
            
            OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Save";

            OrgReferenceModalCtrl.ePage.Masters.Config = organizationConfig;

            OrgReferenceModalCtrl.ePage.Masters.DatePicker = {};
            OrgReferenceModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrgReferenceModalCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrgReferenceModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function Save(obj, entity, type) {
            var _isEmpty = angular.equals(obj, {});

            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                obj.IsModified = true;
                var _isExist = OrgReferenceModalCtrl.ePage.Entities.Header.Data[entity].some(function (value, key) {
                    return value.PK === obj.PK;
                });

                if (!_isExist) {
                    OrgReferenceModalCtrl.ePage.Entities.Header.Data[entity].push(obj);
                } else {
                    var _index = OrgReferenceModalCtrl.ePage.Entities.Header.Data[entity].map(function (value, key) {
                        if (value.PK === obj.PK) {
                            OrgReferenceModalCtrl.ePage.Entities.Header.Data[entity][key] = obj;
                        }
                    });
                }

                OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = true;

                helperService.SaveEntity(OrgReferenceModalCtrl.ePage.Masters.param.Entity,'Organization').then(function (response) {
                    if (response.Status === "success") {
                        var _exports = {
                            Data: obj,
                            entity: entity,
                            type: type
                        };
                        $uibModalInstance.close(_exports);
                        Cancel();
                        OrgReferenceModalCtrl.ePage.Masters.Config.refreshgrid();
                    } else if (response === "failed") {
                        Cancel();
                    }
                    OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = false;

                    OrgReferenceModalCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                    OrgReferenceModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), OrgReferenceModalCtrl.ePage.Masters.param.Entity.label, false, undefined, undefined, undefined, undefined, undefined);
                });
                if(OrgReferenceModalCtrl.ePage.Entities.Header.Validations !== null){
                    OrgReferenceModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgReferenceModalCtrl.ePage.Entities);    
                }    
                
                });
            }
        }
        function OpenDatePicker($event, opened){
            $event.preventDefault();
            $event.stopPropagation();

            OrgReferenceModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Cancel() {
            OrgReferenceModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();
