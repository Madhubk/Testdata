(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgCompanyModalController", OrgCompanyModalController);

    OrgCompanyModalController.$inject = ["$uibModalInstance", "authService", "apiService", "organizationConfig", "helperService", "toastr", "param"];

    function OrgCompanyModalController($uibModalInstance, authService, apiService, organizationConfig, helperService, toastr, param) {
        let OrgCompanyModalCtrl = this;

        function Init() {
            let currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgCompanyModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgCompanyModalCtrl.ePage.Masters.param = param;
                OrgCompanyModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);

                OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgCompanyModalCtrl.ePage.Masters.Save = Validate;
                OrgCompanyModalCtrl.ePage.Masters.Cancel = Cancel;

                InitCompany();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitCompany() {
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData = {
                FormView: {}
            };

            if (OrgCompanyModalCtrl.ePage.Masters.param.Item && OrgCompanyModalCtrl.ePage.Masters.param.Item.PK) {
                let _index = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData.findIndex(x => x.PK === OrgCompanyModalCtrl.ePage.Masters.param.Item.PK);

                if (_index !== -1) {
                    OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData[_index];
                }
            } else {
                let _obj = {
                    TenantCode: authService.getUserInfo().TenantCode,
                    IsModified: true
                };

                OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData = [...[_obj], ...OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData];

                OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData[0];
            }

            if (OrgCompanyModalCtrl.ePage.Masters.param.Type == "company" && OrgCompanyModalCtrl.ePage.Masters.param.Item) {
                GetBranchList(OrgCompanyModalCtrl.ePage.Masters.param.ActiveCompany.CMP_FK);
            } else if (OrgCompanyModalCtrl.ePage.Masters.param.Type == "ardetails") {
                GetDebtorList();
                GetCurrencyList();
            } else if (OrgCompanyModalCtrl.ePage.Masters.param.Type == "apdetails") {
                GetCreditorList();
                GetCurrencyList();
            }

            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.OnCompanyChange = OnCompanyChange;
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.OnBranchChange = OnBranchChange;
        }

        function OnCompanyChange($item) {
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.CMP_FK = undefined;
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.CMP_Code = undefined;
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.CMP_Name = undefined;
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.BranchList = [];

            if ($item) {
                OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.CMP_FK = $item.PK;
                OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.CMP_Code = $item.Code;
                OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.CMP_Name = $item.Name;
                GetBranchList($item.PK);
            }
        }

        function GetBranchList($item) {
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.BranchList = undefined;
            let _filter = {
                "CMP_FK": $item
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CmpBranch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CmpBranch.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.BranchList = response.data.Response;
                } else {
                    OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.BranchList = [];
                }
            });
        }

        function OnBranchChange($item) {
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.BRN_ControllingBranch = undefined;
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.BRN_Code = undefined;
            OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.BRN_BranchName = undefined;

            if ($item) {
                OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.BRN_ControllingBranch = $item.PK;
                OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.BRN_Code = $item.Code;
                OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView.BRN_BranchName = $item.BranchName;
            }
        }

        function GetDebtorList() {
            OrgCompanyModalCtrl.ePage.Masters.DebtorGroupList = undefined;
            let _input = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.MstDebtorGroup.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstDebtorGroup.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    OrgCompanyModalCtrl.ePage.Masters.DebtorGroupList = response.data.Response;
                } else {
                    OrgCompanyModalCtrl.ePage.Masters.DebtorGroupList = [];
                }
            });
        }

        function GetCreditorList() {
            OrgCompanyModalCtrl.ePage.Masters.CreditorGroupList = undefined;
            let _input = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.MstCreditorGroup.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstCreditorGroup.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    OrgCompanyModalCtrl.ePage.Masters.CreditorGroupList = response.data.Response;
                } else {
                    OrgCompanyModalCtrl.ePage.Masters.CreditorGroupList = [];
                }
            });
        }

        function GetCurrencyList() {
            OrgCompanyModalCtrl.ePage.Masters.CurrencyList = undefined;
            let _input = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.MstCurrency.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstCurrency.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    OrgCompanyModalCtrl.ePage.Masters.CurrencyList = response.data.Response;
                } else {
                    OrgCompanyModalCtrl.ePage.Masters.CurrencyList = [];
                }
            });
        }

        function Validate() {
            OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = true;

            let _validationObj = {
                Code: param.Entity.code,
                GetListAPI: "Validation",
                FilterInput: {
                    ModuleCode: "ORG"
                },
                GroupCode: "ORG_COMPANY",
                Entity: OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView,
                ValidateAPI: "Group",
                ErrorCode: [],
                EntityCode: param.Entity.label,
                EntityPK: param.Entity.pk
            };

            OrgCompanyModalCtrl.ePage.Entities.GetValidationList(_validationObj).then(response => {
                let _errorCount = response;

                if (_errorCount > 0) {
                    OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    Save();
                }
            });
        }

        function Save() {
            let _input = angular.copy(OrgCompanyModalCtrl.ePage.Masters.OrgCompanyData.FormView);
            _input.IsModified = true;
            _input.ORG_FK = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
            _input.ORG_Code = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
            _input.ORG_Name = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;
            _input.OrgARTerms = [];
            _input.TenantCode = authService.getUserInfo().TenantCode;

            let _isExist = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData.some(value => value.PK === _input.PK);

            if (!_isExist) {
                OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData.push(_input);
            } else {
                let _index = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData.findIndex(value => value.PK === _input.PK);
                if (_index != -1) {
                    OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData[_index] = _input;
                }
            }

            OrgCompanyModalCtrl.ePage.Masters.param.Entity[OrgCompanyModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = OrgCompanyModalCtrl.ePage.Entities.Header.Data;

            OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = true;

            helperService.SaveEntity(OrgCompanyModalCtrl.ePage.Masters.param.Entity, 'Organization').then(response => {
                if (response.Status === "success" && response.Data) {
                    let _exports = {
                        data: response.Data
                    };
                    $uibModalInstance.close(_exports);
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    (response.Validations && response.Validations.length > 0) ? response.Validations.map(value => toastr.error(value.Message)): toastr.warning("Failed to Save...!");
                }

                OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();
