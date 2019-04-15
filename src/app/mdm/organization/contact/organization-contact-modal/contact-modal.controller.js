(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgContactModalController", OrgContactModalController);

    OrgContactModalController.$inject = ["$uibModalInstance", "helperService", "toastr", "organizationConfig", "param"];

    function OrgContactModalController($uibModalInstance, helperService, toastr, organizationConfig, param) {
        let OrgContactModalCtrl = this;

        function Init() {
            let currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgContactModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Contact_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgContactModalCtrl.ePage.Masters.param = param;
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
            OrgContactModalCtrl.ePage.Masters.OrgContact = {
                FormView: {}
            };

            if (OrgContactModalCtrl.ePage.Masters.param.Item) {
                OrgContactModalCtrl.ePage.Masters.OrgContact.FormView = OrgContactModalCtrl.ePage.Masters.param.Item;
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss("cancel");
        }

        function ValidateContact() {
            OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgContactModalCtrl.ePage.Masters.IsDisableSave = true;

            let _validationObj = {
                Code: param.Entity.code,
                GetListAPI: "Validation",
                FilterInput: {
                    ModuleCode: "ORG"
                },
                GroupCode: "ORG_CONTACT",
                Entity: OrgContactModalCtrl.ePage.Masters.OrgContact.FormView,
                ValidateAPI: "Group",
                ErrorCode: [],
                EntityCode: param.Entity.label,
                EntityPK: param.Entity.pk
            };

            OrgContactModalCtrl.ePage.Entities.GetValidationList(_validationObj).then(response => {
                let _errorCount = response;

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

            let _ContactList = angular.copy(OrgContactModalCtrl.ePage.Entities.Header.Data.OrgContact);
            let _formView = angular.copy(OrgContactModalCtrl.ePage.Masters.OrgContact.FormView);
            _formView.IsModified = true;
            if (_formView.PK) {
                let _index = _ContactList.findIndex(x => x.PK === _formView.PK);

                if (_index != -1) {
                    _ContactList[_index] = _formView;
                }
            } else {
                _ContactList = [..._ContactList, ...[_formView]];
            }

            let _input = angular.copy(OrgContactModalCtrl.ePage.Entities.Header.Data);
            _input.OrgContact = _ContactList;
            _input.IsModified = true;

            OrgContactModalCtrl.ePage.Masters.param.Entity[OrgContactModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgContactModalCtrl.ePage.Masters.param.Entity, 'Organization').then(response => {
                if (response.Status === "success" && response.Data) {
                    let _exports = {
                        data: response.Data
                    };
                    $uibModalInstance.close(_exports);
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    (response.Validations && response.Validations.length > 0) ? response.Validations.map(x => toastr.error(x.Message)): toastr.warning("Failed to Save...!");
                }

                OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgContactModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        Init();
    }
})();
