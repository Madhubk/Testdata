(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationEmailGroup", OrganizationEmailGroup);

    function OrganizationEmailGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/email-group/organization-email-group.html",
            controller: "OrganizationEmailGroupController",
            controllerAs: "OrganizationEmailGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationEmailGroupController", OrganizationEmailGroupController);

    OrganizationEmailGroupController.$inject = ["helperService", "apiService", "authService", "organizationConfig"];

    function OrganizationEmailGroupController(helperService, apiService, authService, organizationConfig) {
        var OrganizationEmailGroupCtrl = this;

        function Init() {
            var currentOrganization = OrganizationEmailGroupCtrl.currentOrganization[OrganizationEmailGroupCtrl.currentOrganization.code].ePage.Entities;

            OrganizationEmailGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Email_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            InitEmailGroup();
            InitEmailAction();
        }

        function InitEmailGroup() {
            OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup = {};
            OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.OnEmailGroupClick = OnEmailGroupClick;
            OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.OnEmailGroupActionClick = OnEmailGroupActionClick;

            GetEmailGroupList();
        }

        function GetEmailGroupList() {
            OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.EmailGroupList = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.MstEmailType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstEmailType.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.EmailGroupList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        GetOrgEmailGroupMapping();
                    }
                } else {
                    OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.EmailGroupList = [];
                }
            });
        }

        function GetOrgEmailGroupMapping() {
            var _filter = {
                Access_FK: OrganizationEmailGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Access_Code: OrganizationEmailGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                MappingCode: "GRUP_ELTYP_ORG_APP_TNT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.SecMappings.API.FindAll.FilterID
            };

            apiService.post("authAPI", organizationConfig.Entities.API.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.EmailGroupList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.BasedOn_FK) {
                                    value1.IsChecked = true;
                                    value1.OrgEmailGroup = value2;
                                }
                            });
                        });
                    } else {
                        OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.EmailGroupList.map(function (value, key) {
                            value.IsChecked = false;
                        });
                    }
                }
            });
        }

        function OnEmailGroupClick($event, $item) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            if (_isChecked) {
                SaveEmailGroup($item);
            } else {
                DeleteEmailGroup($item);
            }
        }

        function SaveEmailGroup($item) {
            var _input = {
                Fk_1: OrganizationEmailGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationEmailGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                Fk_2: $item.PK,
                Code_2: $item.Key,
                MappingCode: "GRUP_ELTYP_ORG_APP_TNT",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true,
                IsActive: true
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.OrgEmailGroup = response.data.Response[0];
                        $item.IsChecked = true;
                    }
                }
            });
        }

        function DeleteEmailGroup($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Upsert.Url + $item.OrgEmailGroup.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.IsChecked = false;
                    }
                }
            });
        }

        function OnEmailGroupActionClick($item) {
            OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.ActiveEmailGroup = $item;
            OrganizationEmailGroupCtrl.ePage.Masters.EmailAction.IsShowEmailAction = true;

            GetPartyTypeList($item);
        }

        // region Email Action
        function InitEmailAction() {
            OrganizationEmailGroupCtrl.ePage.Masters.EmailAction = {};
            OrganizationEmailGroupCtrl.ePage.Masters.EmailAction.GoToEmailGroup = GoToEmailGroup;
            OrganizationEmailGroupCtrl.ePage.Masters.EmailAction.IsShowEmailAction = false;
        }

        function GetPartyTypeList($item) {
            OrganizationEmailGroupCtrl.ePage.Masters.EmailAction.MappingInput = {
                MappingCode: "GRUP_ELTYP_ORG_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_ELTYP_ORG_APP_TNT",

                AccessTo: "EMAIL",
                Access_FK: $item.PK,
                AccessCode: $item.Key,

                BasedOn: "ORG",
                BasedOn_FK: OrganizationEmailGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                BasedOnCode: OrganizationEmailGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,

                SAP_FK: authService.getUserInfo().AppPK,
                SAP_Code: authService.getUserInfo().AppCode
            };
        }

        function GoToEmailGroup() {
            OrganizationEmailGroupCtrl.ePage.Masters.EmailGroup.ActiveEmailGroup = undefined;
            OrganizationEmailGroupCtrl.ePage.Masters.EmailAction.IsShowEmailAction = false;
        }

        Init();
    }
})();
