(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationCommentGroup", OrganizationCommentGroup);

    function OrganizationCommentGroup() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/access-rights/comment-group/organization-comment-group.html",
            controller: "OrganizationCommentGroupController",
            controllerAs: "OrganizationCommentGroupCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrganizationCommentGroupController", OrganizationCommentGroupController);

    OrganizationCommentGroupController.$inject = ["helperService", "apiService", "authService", "organizationConfig"];

    function OrganizationCommentGroupController(helperService, apiService, authService, organizationConfig) {
        let OrganizationCommentGroupCtrl = this;

        function Init() {
            let currentOrganization = OrganizationCommentGroupCtrl.currentOrganization[OrganizationCommentGroupCtrl.currentOrganization.code].ePage.Entities;

            OrganizationCommentGroupCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Comment_Group",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            InitCommentsGroup();
            InitCommentsAction();
        }

        function InitCommentsGroup() {
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup = {};
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.OnCommentsGroupClick = OnCommentsGroupClick;
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.OnCommentsGroupActionClick = OnCommentsGroupActionClick;

            GetCommentsGroupList();
        }

        function GetCommentsGroupList() {
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.CommentsGroupList = undefined;
            let _filter = {};
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.MstCommentType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.MstCommentType.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.CommentsGroupList = response.data.Response;
                    GetOrgCommentsGroupMapping();
                } else {
                    OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.CommentsGroupList = [];
                }
            });
        }

        function GetOrgCommentsGroupMapping() {
            let _filter = {
                Fk_1: OrganizationCommentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationCommentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                MappingCode: "ORG_COMMENTS"
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": organizationConfig.Entities.API.EntitiesMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.CommentsGroupList.map(value1 => {
                        response.data.Response.map(value2 => {
                            if (value1.PK === value2.Fk_2) {
                                value1.IsChecked = true;
                                value1.OrgCommentsGroup = value2;
                            }
                        });
                    });
                } else {
                    OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.CommentsGroupList.map(value => {
                        value.IsChecked = false;
                        value.CommentsGroupMappingList = [];
                    });
                }
            });
        }

        function OnCommentsGroupClick($event, $item) {
            let _checkbox = $event.target,
                _isChecked = _checkbox.checked;

            _isChecked ? SaveCommentsGroup($item) : DeleteCommentsGroup($item);
        }

        function SaveCommentsGroup($item) {
            let _input = {
                Fk_1: OrganizationCommentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                Code_1: OrganizationCommentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,
                Fk_2: $item.PK,
                Code_2: $item.Key,
                MappingCode: "ORG_COMMENTS",
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode,
                IsModified: true,
                IsActive: true
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Insert.Url, [_input]).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    $item.OrgCommentsGroup = response.data.Response[0];
                    $item.IsChecked = true;
                }
            });
        }

        function DeleteCommentsGroup($item) {
            apiService.get("eAxisAPI", organizationConfig.Entities.API.EntitiesMapping.API.Delete.Url + $item.OrgCommentsGroup.PK).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    $item.CommentsGroupMappingList = [];
                    $item.IsChecked = false;
                }
            });
        }

        function OnCommentsGroupActionClick($item) {
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.ActiveCommentsGroup = $item;
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsAction.IsShowCommentsAction = true;

            GetPartyTypeList();
        }

        // region Comments Action
        function InitCommentsAction() {
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsAction = {};
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsAction.GoToCommentsGroup = GoToCommentsGroup;
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsAction.IsShowCommentsAction = false;
        }

        function GetPartyTypeList() {
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsAction.MappingInput = {
                MappingCode: "GRUP_CTYP_ORG_APP_TNT",
                ChildMappingCode: "GRUP_ROLE_CTYP_ORG_APP_TNT",

                AccessTo: "COMMENT",
                Access_FK: OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.ActiveCommentsGroup.PK,
                AccessCode: OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.ActiveCommentsGroup.TypeCode,

                BasedOn: "ORG",
                BasedOn_FK: OrganizationCommentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                BasedOnCode: OrganizationCommentGroupCtrl.ePage.Entities.Header.Data.OrgHeader.Code,

                SAP_FK: authService.getUserInfo().AppPK,
                SAP_Code: authService.getUserInfo().AppCode,
                PartyMappingAPI: "GroupCommentTypeOrganisation",
                PartyRoleMappingAPI: "GroupRoleCommentTypeOrganisation"
            };
        }

        function GoToCommentsGroup() {
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsGroup.ActiveCommentsGroup = undefined;
            OrganizationCommentGroupCtrl.ePage.Masters.CommentsAction.IsShowCommentsAction = false;
        }

        Init();
    }
})();
