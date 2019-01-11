(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationDocumentGroup", OrganizationDocumentGroup);

    function OrganizationDocumentGroup() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/document-group/organization-document-group.html",
            controller: "OrganizationDocumentGroupController",
            controllerAs: "OrganizationDocumentGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationDocumentGroupController", OrganizationDocumentGroupController);

    OrganizationDocumentGroupController.$inject = ["helperService", "apiService", "authService", "organizationConfig"];

    function OrganizationDocumentGroupController(helperService, apiService, authService, organizationConfig) {
        var OrganizationDocumentGroupCtrl = this;

        function Init() {
            var currentOrganization = OrganizationDocumentGroupCtrl.currentOrganization[OrganizationDocumentGroupCtrl.currentOrganization.code].ePage.Entities;

            OrganizationDocumentGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Document_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            InitDocumentsGroup();
            InitDocumentAction();
        }

        function InitDocumentsGroup() {
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup = {};
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.OnDocumentGroupClick = OnDocumentGroupClick;
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.OnDocumentGroupActionClick = OnDocumentGroupActionClick;

            GetDocumentGroupList();
        }

        function GetDocumentGroupList() {
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.DocumentGroupList = undefined;
            var _filter = {};
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.DocumentGroupList = response.data.Response;

                    if (response.data.Response.length > 0) {
                        GetOrgDocumentGroup();
                    }
                } else {
                    OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.DocumentGroupList = [];
                }
            });
        }

        function GetOrgDocumentGroup() {
            var _filter = {
                Fk_1: OrganizationDocumentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationDocumentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                MappingCode: "ORG_DOCUMENT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.EntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.DocumentGroupList.map(function (value1, key1) {
                            response.data.Response.map(function (value2, key2) {
                                if (value1.PK === value2.Fk_2) {
                                    value1.IsChecked = true;
                                    value1.OrgDocumentGroup = value2;
                                }
                            });
                        });
                    } else {
                        OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.DocumentGroupList.map(function (value, key) {
                            value.IsChecked = false;
                        });
                    }
                }
            });
        }

        function OnDocumentGroupClick($event, $item) {
            var _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            if (_isChecked) {
                SaveDocumentGroup($item);
            } else {
                DeleteDocumentGroup($item);
            }
        }

        function SaveDocumentGroup($item) {
            var _input = {
                Fk_1: OrganizationDocumentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationDocumentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                Fk_2: $item.PK,
                Code_2: $item.DocType,
                MappingCode: "ORG_DOCUMENT",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true,
                IsActive: true
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Insert.Url, [_input]).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.OrgDocumentGroup = response.data.Response[0];
                        $item.IsChecked = true;
                    }
                }
            });
        }

        function DeleteDocumentGroup($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Delete.Url + $item.OrgDocumentGroup.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        $item.IsChecked = false;
                    }
                }
            });
        }

        function OnDocumentGroupActionClick($item) {
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.ActiveDocumentGroup = $item;
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentAction.IsShowDocumentAction = true;

            GetPartyTypeList();
        }

        function InitDocumentAction() {
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentAction = {};
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentAction.GoToDocumentGroup = GoToDocumentGroup;
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentAction.IsShowDocumentAction = false;
        }

        function GetPartyTypeList() {
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentAction.MappingInput = {
                MappingCode: "GRUP_DTYP_ORG_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_DTYP_ORG_APP_TNT",

                AccessTo: "DOCUMENT",
                Access_FK: OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.ActiveDocumentGroup.PK,
                AccessCode: OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.ActiveDocumentGroup.DocType,

                BasedOn: "ORG",
                BasedOn_FK: OrganizationDocumentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                BasedOnCode: OrganizationDocumentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,

                SAP_FK: authService.getUserInfo().AppPK,
                SAP_Code: authService.getUserInfo().AppCode,
                PartyMappingAPI: "GroupDocumentTypeOrganisation",
                PartyRoleMappingAPI: "GroupRoleDocumentTypeOrganisation"
            };
        }

        function GoToDocumentGroup() {
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentGroup.ActiveDocumentGroup = undefined;
            OrganizationDocumentGroupCtrl.ePage.Masters.DocumentAction.IsShowDocumentAction = false;
        }

        Init();
    }
})();
