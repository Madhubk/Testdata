(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgReferenceModalController", OrgReferenceModalController);

    OrgReferenceModalController.$inject = ["$uibModalInstance", "APP_CONSTANT", "helperService", "toastr", "param"];

    function OrgReferenceModalController($uibModalInstance, APP_CONSTANT, helperService, toastr, param) {
        let OrgReferenceModalCtrl = this;

        function Init() {
            let currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgReferenceModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Reference_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgReferenceModalCtrl.ePage.Masters.param = param;
                OrgReferenceModalCtrl.ePage.Masters.Save = Validate;
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
            OrgReferenceModalCtrl.ePage.Masters.OrgRefDate = {};
            OrgReferenceModalCtrl.ePage.Masters.OrgRefDate.FormView = {};

            if (OrgReferenceModalCtrl.ePage.Masters.param.Item) {
                OrgReferenceModalCtrl.ePage.Masters.OrgRefDate.FormView = OrgReferenceModalCtrl.ePage.Masters.param.Item;
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrgReferenceModalCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        function Validate() {
            OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = true;

            let _validationObj = {
                Code: param.Entity.code,
                GetListAPI: "Validation",
                FilterInput: {
                    ModuleCode: "ORG"
                },
                GroupCode: "ORG_REFERENCE",
                Entity: OrgReferenceModalCtrl.ePage.Masters.OrgRefDate.FormView,
                ValidateAPI: "Group",
                ErrorCode: [],
                EntityCode: param.Entity.label,
                EntityPK: param.Entity.pk
            };

            OrgReferenceModalCtrl.ePage.Entities.GetValidationList(_validationObj).then(response => {
                let _errorCount = response;

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

            let _OrgRefDate = angular.copy(OrgReferenceModalCtrl.ePage.Entities.Header.Data.OrgRefDate);
            let _formView = angular.copy(OrgReferenceModalCtrl.ePage.Masters.OrgRefDate.FormView);
            _formView.IsModified = true;

            if (_formView.PK) {
                let _index = _OrgRefDate.findIndex(value => value.PK === _formView.PK);

                if (_index != -1) {
                    _OrgRefDate[_index] = _formView;
                }
            } else {
                _OrgRefDate = [..._OrgRefDate, ...[_formView]];
            }

            let _input = angular.copy(OrgReferenceModalCtrl.ePage.Entities.Header.Data);
            _input.OrgRefDate = _OrgRefDate;
            _input.IsModified = true;

            OrgReferenceModalCtrl.ePage.Masters.param.Entity[OrgReferenceModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = _input;

            helperService.SaveEntity(OrgReferenceModalCtrl.ePage.Masters.param.Entity, 'Organization').then(response => {
                if (response.Status === "success" && response.Data) {
                    let _exports = {
                        data: response.Data
                    };
                    $uibModalInstance.close(_exports);
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    (response.Validations && response.Validations.length > 0) ? response.Validations.map(value => toastr.error(value.Message)): toastr.warning("Failed to Save...!");
                }

                OrgReferenceModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgReferenceModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        Init();
    }
})();
