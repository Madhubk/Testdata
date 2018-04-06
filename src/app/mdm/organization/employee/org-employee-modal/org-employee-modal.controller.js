(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgEmployeeModalController", OrgEmployeeModalController);

    OrgEmployeeModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "organizationConfig", "helperService", "toastr", "param"];

    function OrgEmployeeModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, organizationConfig, helperService, toastr, param) {
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

            OrgEmployeeModalCtrl.ePage.Masters.param = param;
            OrgEmployeeModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgEmployeeModalCtrl.ePage.Masters.Save = Save;
            OrgEmployeeModalCtrl.ePage.Masters.Cancel = Cancel;

            OrgEmployeeModalCtrl.ePage.Masters.Config = organizationConfig;

            InitEmployee();
        }   

        function InitEmployee() {
            OrgEmployeeModalCtrl.ePage.Masters.Employee = {};
            OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView = {};

            if (OrgEmployeeModalCtrl.ePage.Masters.param.Item) {
                OrgEmployeeModalCtrl.ePage.Masters.Employee.FormView = angular.copy(OrgEmployeeModalCtrl.ePage.Masters.param.Item);
            }
        }

        function Save(obj, entity, type) {
            var _isEmpty = angular.equals(obj, {});

            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                obj.IsModified = true;
                obj.CompanyPK = OrgEmployeeModalCtrl.ePage.Masters.param.SelectedCompany.CMP_FK;
                obj.CompanyCode = OrgEmployeeModalCtrl.ePage.Masters.param.SelectedCompany.CMP_Name;
                obj.CompanyName = OrgEmployeeModalCtrl.ePage.Masters.param.SelectedCompany.CMP_Code;
                obj.OrgCode = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
                obj.OrgName = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;
                obj.OrgPK = OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;

                var _isExist = OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity].some(function (value, key) {
                    return value.EmployeeCode === obj.EmployeeCode;
                });

                if (!_isExist) {
                    OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity].push(obj);
                } else {
                    var _index = OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity].map(function (value, key) {
                        if (value.PK === obj.PK) {
                            OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity][key].BranchPK = obj.BranchPK;
                            OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity][key].CompanyPK = obj.CompanyPK;
                            OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity][key].DepartmentPK = obj.DepartmentPK;
                            OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity][key].EmployeePK = obj.EmployeePK;
                            OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity][key].IsModified = obj.IsModified;
                            OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity][key].RoleCode = obj.RoleCode;
                            OrgEmployeeModalCtrl.ePage.Entities.Header.Data[entity][key].OrgPK = obj.OrgPK;
                        }
                    });
                }

                OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = true;

                helperService.SaveEntity(OrgEmployeeModalCtrl.ePage.Masters.param.Entity,"Organization").then(function (response) {
                    if (response.Status === "success") {
                        var _exports = {
                            Data: obj,
                            entity: entity,
                            type: type
                        };
                        $uibModalInstance.close(_exports);
                        Cancel();
                    } 
                else if (response.Status === "failed") {
                    var _filter = {
                    "OrgPK": OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                    "CompanyPK": obj.CMP_FK
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.OrgEmployeeAssignments.API.FindAll.FilterID
                    };

                    apiService.post("eAxisAPI", appConfig.Entities.OrgEmployeeAssignments.API.FindAll.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments = response.data.Response;
                            console.log(OrgEmployeeModalCtrl.ePage.Entities.Header.Data.OrgStaffAssignments);
                        }
                    });
                    Cancel();
                }
                    OrgEmployeeModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgEmployeeModalCtrl.ePage.Masters.IsDisableSave = false;

                    OrgEmployeeModalCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                    OrgEmployeeModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), OrgEmployeeModalCtrl.ePage.Masters.param.Entity.label, false, undefined, undefined, undefined, undefined, undefined);
                });
                OrgEmployeeModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgEmployeeModalCtrl.ePage.Entities);
                });

            }
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();
