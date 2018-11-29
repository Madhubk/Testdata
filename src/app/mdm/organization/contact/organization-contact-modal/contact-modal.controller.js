(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgContactModalController", OrgContactModalController);

    OrgContactModalController.$inject = ["$uibModalInstance", "helperService", "toastr", "organizationConfig", "param"];

    function OrgContactModalController($uibModalInstance, helperService, toastr, organizationConfig, param) {
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

            OrgContactModalCtrl.ePage.Masters.param = angular.copy(param);

            OrgContactModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);

            OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgContactModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgContactModalCtrl.ePage.Masters.SaveContact = SaveContact;
            OrgContactModalCtrl.ePage.Masters.Cancel = Cancel;

            InitOrgContact();
        }

        function InitOrgContact() {
            OrgContactModalCtrl.ePage.Masters.OrgContact = {};
            OrgContactModalCtrl.ePage.Masters.OrgContact.FormView = {};

            if (OrgContactModalCtrl.ePage.Masters.param.Item) {
                OrgContactModalCtrl.ePage.Masters.OrgContact.FormView = OrgContactModalCtrl.ePage.Masters.param.Item;
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        function SaveContact() {
            debugger
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
                    toastr.warning("Failed to Save...!");
                    if (response.Validations && response.Validations.length > 0) {}
                }

                OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgContactModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        Init();
    }
})();
