(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgEmployeeModalController", OrgEmployeeModalController);

    OrgEmployeeModalController.$inject = ["$uibModalInstance", "authService", "apiService", "organizationConfig", "helperService", "toastr", "param"];

    function OrgEmployeeModalController($uibModalInstance, authService, apiService, organizationConfig, helperService, toastr, param) {
        var OrgEmployeeModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgEmployeeModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Emp_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgEmployeeModalCtrl.ePage.Masters.param = angular.copy(param);
                OrgEmployeeModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);

                OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgEmployeeModalCtrl.ePage.Masters.OnRoleChange = OnRoleChange;
                OrgEmployeeModalCtrl.ePage.Masters.OnBranchChange = OnBranchChange;
                OrgEmployeeModalCtrl.ePage.Masters.OnDepartmentChange = OnDepartmentChange;
                OrgEmployeeModalCtrl.ePage.Masters.Save = Save;
                OrgEmployeeModalCtrl.ePage.Masters.Cancel = Cancel;

                InitEmployee();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitEmployee() {
            OrgEmployeeModalCtrl.ePage.Masters.Employee = {};
            OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView = {};

            if (OrgEmployeeModalCtrl.ePage.Masters.param.Item) {
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView = angular.copy(OrgEmployeeModalCtrl.ePage.Masters.param.Item);
            }

            if (OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany) {
                GetBranchList();
            }
        }

        function GetBranchList() {
            OrgEmployeeModalCtrl.ePage.Masters.BranchList = undefined;
            var _filter = {
                "CMP_FK": OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany.CMP_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CmpBranch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CmpBranch.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgEmployeeModalCtrl.ePage.Masters.BranchList = response.data.Response;
                } else {
                    OrgEmployeeModalCtrl.ePage.Masters.BranchList = [];
                }
            });
        }

        function OnRoleChange($item) {
            if ($item) {
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.RoleCode = $item.Key;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.RoleName = $item.Value;
            } else {
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.RoleCode = undefined;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.RoleName = undefined;
            }
        }

        function OnBranchChange($item) {
            if ($item) {
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.BranchPK = $item.PK;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.BranchCode = $item.Code;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.BranchName = $item.BranchName;
            } else {
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.BranchPK = undefined;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.BranchCode = undefined;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.BranchName = undefined;
            }
        }

        function OnDepartmentChange($item) {
            if ($item) {
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.DepartmentPK = $item.PK;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.DepartmentCode = $item.Code;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.DepartmentName = $item.Desc;
            } else {
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.DepartmentPK = undefined;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.DepartmentCode = undefined;
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView.DepartmentName = undefined;
            }
        }

        function Save() {
            var _input = angular.copy(OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView);
            _input.CompanyPK = OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany.CMP_FK;
            _input.CompanyCode = OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany.CMP_Name;
            _input.CompanyName = OrgEmployeeModalCtrl.ePage.Masters.param.ActiveCompany.CMP_Code;
            _input.OrgPK = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
            _input.OrgCode = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
            _input.OrgName = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;
            _input.IsModified = true;
            _input.TenantCode = authService.getUserInfo().TenantCode;
            var _isEmpty = angular.equals(_input, {});

            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                var _isExist = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.some(function (value, key) {
                    return value.EmployeeCode === _input.EmployeeCode;
                });

                if (!_isExist) {
                    OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.push(_input);
                } else {
                    var _index = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments.map(function (value, key) {
                        return value.EmployeeCode;
                    }).indexOf(_input.EmployeeCode);

                    if (_index != -1) {
                        OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments[_index] = _input;
                    }
                }

                OrgEmployeeModalCtrl.ePage.Masters.param.Entity[OrgEmployeeModalCtrl.ePage.Masters.param.Entity.label].ePage.Entities.Header.Data = OrgEmployeeModalCtrl.ePage.Entities.Header.Data;

                OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = true;

                helperService.SaveEntity(OrgEmployeeModalCtrl.ePage.Masters.param.Entity, "Organization").then(function (response) {
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

                    OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = false;
                });
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();
