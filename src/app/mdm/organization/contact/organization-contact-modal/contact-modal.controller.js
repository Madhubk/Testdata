(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgContactModalController", OrgContactModalController);

    OrgContactModalController.$inject = ["$timeout", "$filter", "$uibModalInstance", "helperService", "toastr", "organizationConfig", "param", "errorWarningService"];

    function OrgContactModalController($timeout, $filter, $uibModalInstance, helperService, toastr, organizationConfig, param, errorWarningService) {
        var OrgContactModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgContactModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Contact_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgContactModalCtrl.ePage.Masters.param = angular.copy(param);

                OrgContactModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);

                OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgContactModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgContactModalCtrl.ePage.Masters.SaveContact = ValidateContact;
                OrgContactModalCtrl.ePage.Masters.Cancel = Cancel;

                InitOrgContact();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitOrgContact() {
            OrgContactModalCtrl.ePage.Masters.OrgContact = {};
            OrgContactModalCtrl.ePage.Masters.OrgContact.FormView = {};

            if (OrgContactModalCtrl.ePage.Masters.param.Item) {
                OrgContactModalCtrl.ePage.Masters.OrgContact.FormView = OrgContactModalCtrl.ePage.Masters.param.Item;
            }

            OrgContactModalCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrgContactModalCtrl.ePage.Masters.GlobalErrorWarningList = errorWarningService.Modules.Organization.Entity[param.Entity.code ? param.Entity.code : param.Entity.label].GlobalErrorWarningList;
            OrgContactModalCtrl.ePage.Masters.ErrorWarningObj = errorWarningService.Modules.Organization.Entity[param.Entity.code ? param.Entity.code : param.Entity.label];
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        function ValidateContact() {
            OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgContactModalCtrl.ePage.Masters.IsDisableSave = true;

            var _code = param.Entity.code ? param.Entity.code : param.Entity.label;
            var _obj = {
                ModuleName: ["Organization"],
                Code: [_code],
                API: "Group",
                GroupCode: "ORG_CONTACT",
                RelatedBasicDetails: [],
                EntityObject: OrgContactModalCtrl.ePage.Masters.OrgContact.FormView,
                ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);

            $timeout(function () {
                var _errorCount = $filter("listCount")(OrgContactModalCtrl.ePage.Masters.GlobalErrorWarningList, 'MessageType', 'E');

                if (_errorCount > 0) {
                    OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgContactModalCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    SaveContact();
                }
            });
        }

        function SaveContact() {
            OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgContactModalCtrl.ePage.Masters.IsDisableSave = true;

            var _ContactList = angular.copy(OrgContactModalCtrl.ePage.Entities.Header.Data.OrgContact);
            var _formView = angular.copy(OrgContactModalCtrl.ePage.Masters.OrgContact.FormView);
            _formView.IsModified = true;
            if (_formView.PK) {
                var _index = _ContactList.map(function (value, key) {
                    return value.PK;
                }).indexOf(_formView.PK);

                if (_index != -1) {
                    _ContactList[_index] = _formView;
                }
            } else {
                _ContactList = _ContactList.concat(_formView);
            }

            var _input = angular.copy(OrgContactModalCtrl.ePage.Entities.Header.Data);
            _input.OrgContact = _ContactList;
            _input.IsModified = true;

            OrgContactModalCtrl.ePage.Masters.param.Entity[OrgContactModalCtrl.ePage.Masters.param.Entity.label].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgContactModalCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
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

                OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgContactModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        Init();
    }
})();
