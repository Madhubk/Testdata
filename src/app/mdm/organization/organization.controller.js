(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationController", OrganizationController);

    OrganizationController.$inject = ["$timeout", "apiService", "authService", "helperService", "organizationConfig", "toastr", "errorWarningService"];

    function OrganizationController($timeout, apiService, authService, helperService, organizationConfig, toastr, errorWarningService) {
        var OrganizationCtrl = this;

        function Init() {
            OrganizationCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": organizationConfig.Entities
            };

            try {
                OrganizationCtrl.ePage.Masters.dataEntryName = "OrganizationList";
                OrganizationCtrl.ePage.Masters.config = organizationConfig;
                OrganizationCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

                OrganizationCtrl.ePage.Masters.TabList = [];
                organizationConfig.TabList = [];
                OrganizationCtrl.ePage.Masters.ActiveTabIndex = 0;
                OrganizationCtrl.ePage.Masters.IsTabClick = false;
                OrganizationCtrl.ePage.Masters.IsNewOrgClicked = false;

                OrganizationCtrl.ePage.Masters.AddTab = AddTab;
                OrganizationCtrl.ePage.Masters.RemoveTab = RemoveTab;
                OrganizationCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
                OrganizationCtrl.ePage.Masters.CreateNew = CreateNew;
                OrganizationCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

                OrganizationCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

                GetMastersDropDownList();
            } catch (ex) {
                console.log(ex);
            }
        }

        function GetMastersDropDownList() {
            CfxTypeList();
            GetCountryList();
            GetCompanyList();
            GetDepartmentList();
        }

        function CfxTypeList() {
            var _cfxTypeCodeList = ["LANGUAGE", "ADDRTYPE", "JOBCATEGORY", "ROLE"];
            var _dynamicFindAllInput = [];

            _cfxTypeCodeList.map(function (value, key) {
                _dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                };
            });
            var _input = {
                "searchInput": _dynamicFindAllInput,
                "FilterID": organizationConfig.Entities.API.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    _cfxTypeCodeList.map(function (value, key) {
                        OrganizationCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                        OrganizationCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetCountryList() {
            var _inputCountry = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.MstCountry.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstCountry.API.FindAll.Url, _inputCountry).then(function (response) {
                if (response.data.Response) {
                    OrganizationCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    OrganizationCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
                }
            });
        }

        function GetCompanyList() {
            var _inputCompany = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.CmpCompany.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CmpCompany.API.FindAll.Url, _inputCompany).then(function (response) {
                if (response.data.Response) {
                    OrganizationCtrl.ePage.Entities.Header.Meta.Company = helperService.metaBase();
                    OrganizationCtrl.ePage.Entities.Header.Meta.Company.ListSource = response.data.Response;
                }
            });
        }

        function GetDepartmentList() {
            var _inputDepartment = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.CmpDepartment.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CmpDepartment.API.FindAll.Url, _inputDepartment).then(function (response) {
                if (response.data.Response) {
                    OrganizationCtrl.ePage.Entities.Header.Meta.Department = helperService.metaBase();
                    OrganizationCtrl.ePage.Entities.Header.Meta.Department.ListSource = response.data.Response;
                }
            });
        }

        function CreateNew() {
            var _isExist = OrganizationCtrl.ePage.Masters.TabList.some(function (value) {
                return value.label === "New";
            });

            if (!_isExist) {
                OrganizationCtrl.ePage.Masters.IsNewOrgClicked = true;

                helperService.getFullObjectUsingGetById(organizationConfig.Entities.API.Org.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.OrgHeader,
                            data: response.data.Response
                        };
                        OrganizationCtrl.ePage.Masters.AddTab(_obj, true);
                        OrganizationCtrl.ePage.Masters.IsNewOrgClicked = false;
                    } else {
                        console.log("Empty Org Response");
                    }
                });
            } else {
                toastr.warning("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentTab) {
            event.preventDefault();
            event.stopPropagation();
            var _currentTab = currentTab[currentTab.label].ePage.Entities;

            $timeout(function () {
                OrganizationCtrl.ePage.Masters.TabList.splice(index, 1);
            });

            apiService.get("eAxisAPI", organizationConfig.Entities.API.Org.API.OrganizationActivityClose.Url + _currentTab.Header.Data.OrgHeader.PK).then(function (response) {});
        }

        function AddTab(currentTab, isNew) {
            OrganizationCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = OrganizationCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentTab.entity.Code)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                OrganizationCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                organizationConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    OrganizationCtrl.ePage.Masters.TabList = response;

                    if (OrganizationCtrl.ePage.Masters.TabList.length > 0) {
                        OrganizationCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.Code) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        OrganizationCtrl.ePage.Masters.ActiveTabIndex = OrganizationCtrl.ePage.Masters.TabList.length;

                        var _code = currentTab.entity.Code ? currentTab.entity.Code : "New";
                        OrganizationCtrl.ePage.Masters.CurrentActiveTab(_code);
                        OrganizationCtrl.ePage.Masters.IsTabClick = false;

                        GetValidationList(_code, _entity);
                    });
                });
            } else {
                toastr.warning('Record already opened...!');
            }
        }

        function GetValidationList(currentTab, entity) {
            var _obj = {
                ModuleName: ["Organization"],
                Code: [currentTab],
                // API: "Group",
                API: "Validation",
                FilterInput: {
                    ModuleCode: "ORG",
                    // SubModuleCode: "ORG_General",
                },
                // GroupCode: "ORGANIZATION",
                RelatedBasicDetails: [],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            OrganizationCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OrganizationCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNew();
            }
        }

        function ShowErrorWarningModal(tab) {
            $("#errorWarningContainerOrganization" + OrganizationCtrl.ePage.Masters.CurrentTab).addClass("open");
        }

        Init();
    }
})();
