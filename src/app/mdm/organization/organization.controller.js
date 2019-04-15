(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationController", OrganizationController);

    OrganizationController.$inject = ["$timeout", "apiService", "authService", "helperService", "organizationConfig", "toastr", "errorWarningService"];

    function OrganizationController($timeout, apiService, authService, helperService, organizationConfig, toastr, errorWarningService) {
        let OrganizationCtrl = this;

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
                OrganizationCtrl.ePage.Masters.Config = organizationConfig;
                OrganizationCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

                OrganizationCtrl.ePage.Masters.ActiveTabIndex = 0;
                OrganizationCtrl.ePage.Masters.IsTabClick = false;
                OrganizationCtrl.ePage.Masters.IsNewOrgClicked = false;

                OrganizationCtrl.ePage.Masters.AddTab = AddTab;
                OrganizationCtrl.ePage.Masters.RemoveTab = RemoveTab;
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
            let _cfxTypeCodeList = ["LANGUAGE", "ADDRTYPE", "JOBCATEGORY", "ROLE"];
            let _dynamicFindAllInput = [];

            _cfxTypeCodeList.map((value, key) => {
                _dynamicFindAllInput[key] = {
                    FieldName: "TypeCode",
                    value
                };
            });
            let _input = {
                "searchInput": _dynamicFindAllInput,
                "FilterID": organizationConfig.Entities.API.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(response => {
                if (response.data.Response) {
                    _cfxTypeCodeList.map(value => {
                        OrganizationCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                        OrganizationCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetCountryList() {
            let _inputCountry = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.MstCountry.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstCountry.API.FindAll.Url, _inputCountry).then(response => {
                if (response.data.Response) {
                    OrganizationCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    OrganizationCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
                }
            });
        }

        function GetCompanyList() {
            let _inputCompany = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.CmpCompany.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CmpCompany.API.FindAll.Url, _inputCompany).then(response => {
                if (response.data.Response) {
                    OrganizationCtrl.ePage.Entities.Header.Meta.Company = helperService.metaBase();
                    OrganizationCtrl.ePage.Entities.Header.Meta.Company.ListSource = response.data.Response;
                }
            });
        }

        function GetDepartmentList() {
            let _inputDepartment = {
                "searchInput": [],
                "FilterID": organizationConfig.Entities.API.CmpDepartment.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CmpDepartment.API.FindAll.Url, _inputDepartment).then(response => {
                if (response.data.Response) {
                    OrganizationCtrl.ePage.Entities.Header.Meta.Department = helperService.metaBase();
                    OrganizationCtrl.ePage.Entities.Header.Meta.Department.ListSource = response.data.Response;
                }
            });
        }

        function CreateNew() {
            OrganizationCtrl.ePage.Masters.IsNewOrgClicked = true;

            helperService.getFullObjectUsingGetById(organizationConfig.Entities.API.Org.API.GetById.Url, 'null').then(response => {
                if (response.data.Response) {
                    let _activityPK = null;
                    if (response.data.Messages && response.data.Messages.length > 0) {
                        response.data.Messages.map(value => {
                            if(value.Type == "ActivityPK"){
                                _activityPK = value.MessageDesc;
                            }
                        });
                    }
                    let _obj = {
                        entity: response.data.Response.OrgHeader,
                        data: response.data.Response,
                        activityPK: _activityPK
                    };
                    OrganizationCtrl.ePage.Masters.AddTab(_obj, true);
                    OrganizationCtrl.ePage.Masters.IsNewOrgClicked = false;
                } else {
                    console.log("Empty Org Response");
                }
            });
        }

        function RemoveTab(event, index, currentTab) {
            event.preventDefault();
            event.stopPropagation();
            let _currentTab = currentTab[currentTab.code].ePage.Entities;

            $timeout(() => OrganizationCtrl.ePage.Masters.Config.TabList.splice(index, 1));

            apiService.get("eAxisAPI", organizationConfig.Entities.API.Org.API.OrganizationActivityClose.Url + _currentTab.Header.Data.OrgHeader.PK).then(response => {});
        }

        function AddTab(currentTab, isNew) {
            let _isExist = OrganizationCtrl.ePage.Masters.Config.TabList.some(value => value.pk == currentTab.entity.PK);

            if (!_isExist) {
                OrganizationCtrl.ePage.Masters.IsTabClick = true;
                let _currentTab = !isNew ? currentTab.entity : currentTab;

                organizationConfig.GetTabDetails(_currentTab, isNew).then(response => {
                    let _entity = {};
                    if (response.length > 0) {
                        response.map(value => {
                            if (value.code == currentTab.entity.Code) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    OrganizationCtrl.ePage.Masters.Config.TabList = response;

                    $timeout(() => {
                        OrganizationCtrl.ePage.Masters.ActiveTabIndex = OrganizationCtrl.ePage.Masters.Config.TabList.length;
                        OrganizationCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning('Record already opened...!');
            }
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OrganizationCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNew();
            }
        }

        function ShowErrorWarningModal(tab) {
            $("#errorWarningContainerOrganization" + tab.code).addClass("open");
        }

        Init();
    }
})();
