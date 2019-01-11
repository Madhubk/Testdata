(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVOrganizationController", SRVOrganizationController);

    SRVOrganizationController.$inject = ["$location", "$timeout", "apiService", "authService", "helperService", "errorWarningService", "organizationConfig", "dynamicLookupConfig", "appConfig"];

    function SRVOrganizationController($location, $timeout, apiService, authService, helperService, errorWarningService, organizationConfig, dynamicLookupConfig, appConfig) {
        /* jshint validthis: true */
        var SRVOrganizationCtrl = this,
            _queryString = $location.search();

        function Init() {
            SRVOrganizationCtrl.ePage = {
                "Title": "",
                "Prefix": "SRV_Organization",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": organizationConfig.Entities
            };

            try {
                if (_queryString.q) {
                    SRVOrganizationCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_queryString.q));
                    SRVOrganizationCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

                    if (!SRVOrganizationCtrl.ePage.Masters.Entity.PK) {
                        CreateNew();
                    } else {
                        var _curRecord = {
                            PK: SRVOrganizationCtrl.ePage.Masters.Entity.PK,
                            Code: SRVOrganizationCtrl.ePage.Masters.Entity.Code
                        };
                        GetTabDetails(_curRecord, false);
                    }

                    GetRelatedLookupList();
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        function GetRelatedLookupList() {
            var _filter = {
                pageName: "OrganizationList",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        function CreateNew() {
            helperService.getFullObjectUsingGetById(SRVOrganizationCtrl.ePage.Entities.API.Org.API.GetById.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.OrgHeader,
                        data: response.data.Response
                    };
                    GetTabDetails(_obj, true);
                } else {
                    console.log("Empty Org Response");
                }
            });
        }

        function GetTabDetails(curRecord, isNew) {
            organizationConfig.GetTabDetails(curRecord, isNew).then(function (response) {
                if (response) {
                    var _code = SRVOrganizationCtrl.ePage.Masters.Entity.PK.split("-").join("");
                    response.map(function (value, key) {
                        if (value.code === _code) {
                            GetValidationList(_code, value);
                        }
                    });
                }
            });
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

            $timeout(function () {
                SRVOrganizationCtrl.ePage.Masters.CurrentObj = entity;
                GetMastersDropDownList();
            });
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
                        SRVOrganizationCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                        SRVOrganizationCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
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
                    SRVOrganizationCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    SRVOrganizationCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
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
                    SRVOrganizationCtrl.ePage.Entities.Header.Meta.Company = helperService.metaBase();
                    SRVOrganizationCtrl.ePage.Entities.Header.Meta.Company.ListSource = response.data.Response;
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
                    SRVOrganizationCtrl.ePage.Entities.Header.Meta.Department = helperService.metaBase();
                    SRVOrganizationCtrl.ePage.Entities.Header.Meta.Department.ListSource = response.data.Response;
                }
            });
        }

        Init();
    }
})();
