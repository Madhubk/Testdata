(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationExceptionGroup", OrganizationExceptionGroup);

    function OrganizationExceptionGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/exception-group/organization-exception-group.html",
            controller: "OrganizationExceptionGroupController",
            controllerAs: "OrganizationExceptionGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationExceptionGroupController", OrganizationExceptionGroupController);

    OrganizationExceptionGroupController.$inject = ["helperService", "appConfig", "apiService", "authService", "organizationConfig"];

    function OrganizationExceptionGroupController(helperService, appConfig, apiService, authService, organizationConfig) {
        var OrganizationExceptionGroupCtrl = this;

        function Init() {
            var currentOrganization = OrganizationExceptionGroupCtrl.currentOrganization[OrganizationExceptionGroupCtrl.currentOrganization.code].ePage.Entities;

            OrganizationExceptionGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Exception_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            InitExceptionGroup();
            InitExceptionAction();
        }

        function InitExceptionGroup() {
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup = {};
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.OnExceptionGroupClick = OnExceptionGroupClick;
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.OnExceptionGroupActionClick = OnExceptionGroupActionClick;

            GetExceptionGroupList();
        }

        function GetExceptionGroupList() {
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ExceptionGroupList = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.MstExceptionType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstExceptionType.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ExceptionGroupList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        GetOrgExceptionGroup();
                    }
                } else {
                    OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ExceptionGroupList = [];
                }
            });
        }

        function GetOrgExceptionGroup() {
            var _filter = {
                Fk_1: OrganizationExceptionGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationExceptionGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                MappingCode: "ORG_EXCEPTION"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.EntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ExceptionGroupList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.Fk_2) {
                                    value1.IsChecked = true;
                                    value1.OrgExceptionGroup = value2;
                                }
                            });
                        });
                    } else {
                        OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ExceptionGroupList.map(function (value, key) {
                            value.IsChecked = false;
                        });
                    }
                }
            });
        }

        function OnExceptionGroupClick($event, $item) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            if (_isChecked) {
                SaveExceptionGroup($item);
            } else {
                DeleteExceptionGroup($item);
            }
        }

        function SaveExceptionGroup($item) {
            var _input = {
                Fk_1: OrganizationExceptionGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationExceptionGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                Fk_2: $item.PK,
                Code_2: $item.Key,
                MappingCode: "ORG_EXCEPTION",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true,
                IsActive: true
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.OrgExceptionGroup = response.data.Response[0];
                        $item.IsChecked = true;
                    }
                }
            });
        }

        function DeleteExceptionGroup($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Delete.Url + $item.OrgExceptionGroup.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.IsChecked = false;
                    }
                }
            });
        }

        function OnExceptionGroupActionClick($item) {
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ActiveExceptionGroup = $item;
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionAction.IsShowExceptionAction = true;

            GetPartyTypeList();
        }

        // region Exception Action
        function InitExceptionAction() {
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionAction = {};
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionAction.GoToExceptionGroup = GoToExceptionGroup;
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionAction.IsShowExceptionAction = false;
        }

        function GetPartyTypeList() {
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionAction.MappingInput = {
                MappingCode: "GRUP_ETYP_ORG_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_ETYP_ORG_APP_TNT",

                AccessTo: "EXCEPTION",
                Access_FK: OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ActiveExceptionGroup.PK,
                AccessCode: OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ActiveExceptionGroup.TypeCode,

                BasedOn: "ORG",
                BasedOn_FK: OrganizationExceptionGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                BasedOnCode: OrganizationExceptionGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,

                SAP_FK: authService.getUserInfo().AppPK,
                SAP_Code: authService.getUserInfo().AppCode
            };
        }

        function GoToExceptionGroup() {
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionGroup.ActiveExceptinGroup = undefined;
            OrganizationExceptionGroupCtrl.ePage.Masters.ExceptionAction.IsShowExceptionAction = false;
        }

        Init();
    }
})();
