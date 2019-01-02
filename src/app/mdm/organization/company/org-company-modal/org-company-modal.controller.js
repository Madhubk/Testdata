(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgCompanyModalController", OrgCompanyModalController);

    OrgCompanyModalController.$inject = ["$uibModalInstance", "authService", "apiService", "organizationConfig", "helperService", "toastr", "param"];

    function OrgCompanyModalController($uibModalInstance, authService, apiService, organizationConfig, helperService, toastr, param) {
        var OrgCompanyModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgCompanyModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            try {
                OrgCompanyModalCtrl.ePage.Masters.param = angular.copy(param);
                OrgCompanyModalCtrl.ePage.Masters.DropDownMasterList = angular.copy(organizationConfig.Entities.Header.Meta);

                OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgCompanyModalCtrl.ePage.Masters.Save = Save;
                OrgCompanyModalCtrl.ePage.Masters.Cancel = Cancel;

                InitCompany();
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitCompany() {
            OrgCompanyModalCtrl.ePage.Masters.Company = {};
            OrgCompanyModalCtrl.ePage.Masters.Company.FormView = {};

            if (OrgCompanyModalCtrl.ePage.Masters.param.Item) {
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView = angular.copy(OrgCompanyModalCtrl.ePage.Masters.param.Item);
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

            OrgCompanyModalCtrl.ePage.Masters.Company.OnCompanyChange = OnCompanyChange;
            OrgCompanyModalCtrl.ePage.Masters.Company.OnBranchChange = OnBranchChange;
        }

        function OnCompanyChange($item) {
            if ($item) {
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.CMP_FK = $item.PK;
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.CMP_Code = $item.Code;
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.CMP_Name = $item.Name;
                GetBranchList($item.PK);
            } else {
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.CMP_FK = undefined;
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.CMP_Code = undefined;
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.CMP_Name = undefined;
                OrgCompanyModalCtrl.ePage.Masters.Company.BranchList = [];
            }
        }

        function GetBranchList($item) {
            OrgCompanyModalCtrl.ePage.Masters.Company.BranchList = undefined;
            var _filter = {
                "CMP_FK": $item
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.CmpBranch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CmpBranch.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgCompanyModalCtrl.ePage.Masters.Company.BranchList = response.data.Response;
                } else {
                    OrgCompanyModalCtrl.ePage.Masters.Company.BranchList = [];
                }
            });
        }

        function OnBranchChange($item) {
            if ($item) {
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.BRN_ControllingBranch = $item.PK;
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.BRN_Code = $item.Code;
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.BRN_BranchName = $item.BranchName;
            } else {
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.BRN_ControllingBranch = undefined;
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.BRN_Code = undefined;
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView.BRN_BranchName = undefined;
            }
        }

        function GetDebtorList() {
            OrgCompanyModalCtrl.ePage.Masters.DebtorGroupList = undefined;
            var _input = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.MstDebtorGroup.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstDebtorGroup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgCompanyModalCtrl.ePage.Masters.DebtorGroupList = response.data.Response;
                } else {
                    OrgCompanyModalCtrl.ePage.Masters.DebtorGroupList = [];
                }
            });
        }

        function GetCreditorList() {
            OrgCompanyModalCtrl.ePage.Masters.CreditorGroupList = undefined;
            var _input = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.MstCreditorGroup.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstCreditorGroup.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgCompanyModalCtrl.ePage.Masters.CreditorGroupList = response.data.Response;
                } else {
                    OrgCompanyModalCtrl.ePage.Masters.CreditorGroupList = [];
                }
            });
        }

        function GetCurrencyList() {
            OrgCompanyModalCtrl.ePage.Masters.CurrencyList = undefined;
            var _input = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.MstCurrency.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstCurrency.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgCompanyModalCtrl.ePage.Masters.CurrencyList = response.data.Response;
                } else {
                    OrgCompanyModalCtrl.ePage.Masters.CurrencyList = [];
                }
            });
        }

        function Save() {
            var _input = angular.copy(OrgCompanyModalCtrl.ePage.Masters.Company.FormView);
            _input.IsModified = true;
            _input.ORG_FK = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
            _input.ORG_Code = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
            _input.ORG_Name = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;
            _input.OrgARTerms = [];
            _input.TenantCode = authService.getUserInfo().TenantCode;

            var _isEmpty = angular.equals(_input, {});

            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                var _isExist = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData.some(function (value, key) {
                    return value.PK === _input.PK;
                });

                if (!_isExist) {
                    OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData.push(_input);
                } else {
                    var _index = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData.map(function (value, key) {
                        return value.PK;
                    }).indexOf(_input.PK);

                    if (_index != -1) {
                        OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData[_index] = _input;
                    }
                }

                OrgCompanyModalCtrl.ePage.Masters.param.Entity[OrgCompanyModalCtrl.ePage.Masters.param.Entity.label].ePage.Entities.Header.Data = OrgCompanyModalCtrl.ePage.Entities.Header.Data;

                OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = true;

                helperService.SaveEntity(OrgCompanyModalCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
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

                    OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = false;
                });
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();
