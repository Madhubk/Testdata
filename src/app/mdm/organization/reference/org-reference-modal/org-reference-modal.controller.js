(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgReferenceModalController", OrgReferenceModalController);

    OrgReferenceModalController.$inject = ["$timeout", "$filter", "$uibModalInstance", "APP_CONSTANT", "helperService", "toastr", "param", "errorWarningService"];

    function OrgReferenceModalController($timeout, $filter, $uibModalInstance, APP_CONSTANT, helperService, toastr, param, errorWarningService) {
        var OrgReferenceModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgReferenceModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Reference_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgReferenceModalCtrl.ePage.Masters.param = angular.copy(param);
                OrgReferenceModalCtrl.ePage.Masters.Save = ValidateOrgReference;
                OrgReferenceModalCtrl.ePage.Masters.Cancel = Cancel;

                OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgReferenceModalCtrl.ePage.Masters.DatePicker = {};
                OrgReferenceModalCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
                OrgReferenceModalCtrl.ePage.Masters.DatePicker.isOpen = [];
                OrgReferenceModalCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

                InitOrgReference();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitOrgReference() {
            OrgReferenceModalCtrl.ePage.Masters.OrgReference = {};
            OrgReferenceModalCtrl.ePage.Masters.OrgReference.FormView = {};

            if (OrgReferenceModalCtrl.ePage.Masters.param.Item) {
                OrgReferenceModalCtrl.ePage.Masters.OrgReference.FormView = OrgReferenceModalCtrl.ePage.Masters.param.Item;
            }

            OrgReferenceModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrgReferenceModalCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Organization.Entity[param.Entity.code].GlobalErrorWarningList;
            OrgReferenceModalCtrl.ePage.Masters.ErrorWarningObj = errorWarningService.Modules.Organization.Entity[param.Entity.code];
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrgReferenceModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        function ValidateOrgReference() {
            OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = true;

            var _code = param.Entity.code;
            var _obj = {
                ModuleName: ["Organization"],
                Code: [_code],
                API: "Group",
                GroupCode: "ORG_REFERENCE",
                RelatedBasicDetails: [],
                EntityObject: OrgReferenceModalCtrl.ePage.Masters.OrgReference.FormView,
                ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);

            $timeout(function () {
                var _errorCount = $filter("listCount")(OrgReferenceModalCtrl.ePage.Masters.GlobalErrorWarningList, 'MessageType', 'E');

                if (_errorCount > 0) {
                    OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    Save();
                }
            });
        }

        function Save() {
            OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = true;

            var _OrgRefDate = angular.copy(OrgReferenceModalCtrl.ePage.Entities.Header.Data.OrgRefDate);
            var _formView = angular.copy(OrgReferenceModalCtrl.ePage.Masters.OrgReference.FormView);
            _formView.IsModified = true;
            if (_formView.PK) {
                var _index = _OrgRefDate.map(function (value, key) {
                    return value.PK;
                }).indexOf(_formView.PK);

                if (_index != -1) {
                    _OrgRefDate[_index] = _formView;
                }
            } else {
                _OrgRefDate = _OrgRefDate.concat(_formView);
            }

            var _input = angular.copy(OrgReferenceModalCtrl.ePage.Entities.Header.Data);
            _input.OrgRefDate = _OrgRefDate;
            _input.IsModified = true;

            OrgReferenceModalCtrl.ePage.Masters.param.Entity[OrgReferenceModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgReferenceModalCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
                if (response.Status === "success") {
                    if (response.Data) {
                        var _exports = {
                            data: response.Data
                        };
                        $uibModalInstance.close(_exports);
                    }
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    if (response.Validations && response.Validations.length > 0) {
                        response.Validations.map(function (value, key) {
                            toastr.error(value.Message);
                        });
                    } else {
                        toastr.warning("Failed to Save...!");
                    }
                }

                OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        Init();
    }
})();
