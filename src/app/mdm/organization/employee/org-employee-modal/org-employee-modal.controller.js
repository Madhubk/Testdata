(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgEmployeeModalController", OrgEmployeeModalController);

    OrgEmployeeModalController.$inject = ["$uibModalInstance", "authService", "apiService", "organizationConfig", "helperService", "toastr", "param"];

    function OrgEmployeeModalController($uibModalInstance, authService, apiService, organizationConfig, helperService, toastr, param) {
        let OrgEmployeeModalCtrl = this;

        function Init() {
            let currentOrganization = param.Entity[param.Entity.code].ePage.Entities;

            OrgEmployeeModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Emp_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgEmployeeModalCtrl.ePage.Masters.param = param;
                OrgEmployeeModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);

                OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgEmployeeModalCtrl.ePage.Masters.OnRoleChange = OnRoleChange;
                OrgEmployeeModalCtrl.ePage.Masters.OnBranchChange = OnBranchChange;
                OrgEmployeeModalCtrl.ePage.Masters.OnDepartmentChange = OnDepartmentChange;
                OrgEmployeeModalCtrl.ePage.Masters.Save = Validate;
                OrgEmployeeModalCtrl.ePage.Masters.Cancel = Cancel;

                InitEmployee();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitEmployee() {
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments = {
                FormView: {}
            };

            if (OrgEmployeeModalCtrl.ePage.Masters.param.Item) {
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView = OrgEmployeeModalCtrl.ePage.Masters.param.Item;
            }

            if (OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany) {
                GetBranchList();
            }
        }

        function GetBranchList() {
            OrgEmployeeModalCtrl.ePage.Masters.BranchList = undefined;
            let _filter = {
                "CMP_FK": OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany.CMP_FK
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CmpBranch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CmpBranch.API.FindAll.Url, _input).then(response => {
                if (response.data.Response) {
                    OrgEmployeeModalCtrl.ePage.Masters.BranchList = response.data.Response;
                } else {
                    OrgEmployeeModalCtrl.ePage.Masters.BranchList = [];
                }
            });
        }

        function OnRoleChange($item) {
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.RoleCode = undefined;
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.RoleName = undefined;

            if ($item) {
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.RoleCode = $item.Key;
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.RoleName = $item.Value;
            }
        }

        function OnBranchChange($item) {
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.BranchPK = undefined;
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.BranchCode = undefined;
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.BranchName = undefined;

            if ($item) {
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.BranchPK = $item.PK;
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.BranchCode = $item.Code;
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.BranchName = $item.BranchName;
            }
        }

        function OnDepartmentChange($item) {
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.DepartmentPK = undefined;
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.DepartmentCode = undefined;
            OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.DepartmentName = undefined;

            if ($item) {
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.DepartmentPK = $item.PK;
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.DepartmentCode = $item.Code;
                OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView.DepartmentName = $item.Desc;
            }
        }

        function Validate() {
            OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = true;

            let _validationObj = {
                Code: param.Entity.code,
                GetListAPI: "Validation",
                FilterInput: {
                    ModuleCode: "ORG"
                },
                GroupCode: "ORG_EMPLOYEE",
                Entity: OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView,
                ValidateAPI: "Group",
                ErrorCode: [],
                EntityCode: param.Entity.label,
                EntityPK: param.Entity.pk
            };

            OrgEmployeeModalCtrl.ePage.Entities.GetValidationList(_validationObj).then(response => {
                let _errorCount = response;

                if (_errorCount > 0) {
                    OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = false;

                    toastr.warning("Fill all mandatory fields...!");
                } else {
                    Save();
                }
            });
        }

        function Save() {
            let _input = angular.copy(OrgEmployeeModalCtrl.ePage.Masters.OrgStaffAssignments.FormView);
            _input.CompanyPK = OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany.CMP_FK;
            _input.CompanyCode = OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany.CMP_Name;
            _input.CompanyName = OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany.CMP_Code;
            _input.OrgPK = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
            _input.OrgCode = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
            _input.OrgName = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;
            _input.IsModified = true;
            _input.TenantCode = authService.getUserInfo().TenantCode;

            let _isExist = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.some(value => value.EmployeeCode === _input.EmployeeCode);

            if (!_isExist) {
                OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.push(_input);
            } else {
                let _index = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.findIndex(value => value.EmployeeCode === _input.EmployeeCode);

                if (_index != -1) {
                    OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments[_index] = _input;
                }
            }

            OrgEmployeeModalCtrl.ePage.Masters.param.Entity[OrgEmployeeModalCtrl.ePage.Masters.param.Entity.code].ePage.Entities.Header.Data = OrgEmployeeModalCtrl.ePage.Entities.Header.Data;

            OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = true;

            helperService.SaveEntity(OrgEmployeeModalCtrl.ePage.Masters.param.Entity, "Organization").then(response => {
                if (response.Status === "success" && response.Data) {
                    let _exports = {
                        data: response.Data
                    };
                    $uibModalInstance.close(_exports);
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    (response.Validations && response.Validations.length > 0) ? response.Validations.map(value => toastr.error(value.Message)): toastr.warning("Failed to Save...!");
                }

                OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();
