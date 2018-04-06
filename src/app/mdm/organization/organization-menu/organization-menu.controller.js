(function () {
    "use strict";
    angular
        .module("Application")
        .controller("OrganizationMenuController", OrganizationMenuController);

    OrganizationMenuController.$inject = ["$rootScope", "$scope", "$timeout", "APP_CONSTANT", "apiService", "authService", "organizationConfig", "helperService", "appConfig"];

    function OrganizationMenuController($rootScope, $scope, $timeout, APP_CONSTANT, apiService, authService, organizationConfig, helperService, appConfig) {
        var OrganizationMenuCtrl = this;

        function Init() {
            var currentOrganization = OrganizationMenuCtrl.currentOrganization[OrganizationMenuCtrl.currentOrganization.label].ePage.Entities;
            OrganizationMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "OrganizationMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrganizationMenuCtrl.ePage.Masters.OrganizationMenu = {};
            // Standard Menu Configuration and Data
            // OrganizationMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.organization;
            // OrganizationMenuCtrl.ePage.Masters.StandardMenuInput.obj = OrganizationMenuCtrl.currentOrganization;

            OrganizationMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            OrganizationMenuCtrl.ePage.Masters.Config = organizationConfig;


            GetMenuList();
        }

        function GetMenuList() {
            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_UserName": authService.getUserInfo().UserId,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "TabMenu",
                "ParentMenu": "Organization"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAllMenuWise.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAllMenuWise.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = angular.copy(response.data.Response);

                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.map(function (value, key) {
                        if (value.Icon) {
                            value.Icon = JSON.parse(value.Icon);
                        }
                        if (value.OtherConfig) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                        }
                    });

                    if (OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.length > 0) {
                        if (!OrganizationMenuCtrl.ePage.Entities.Header.Data.OrgHeader.IsConsignee) {
                            var _consigneeIndex = OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.map(function (value, key) {
                                return value.MenuName;
                            }).indexOf("Consignee");

                            if (_consigneeIndex != -1) {
                                OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.splice(_consigneeIndex, 1);
                            }
                        }
                        if (!OrganizationMenuCtrl.ePage.Entities.Header.Data.OrgHeader.IsConsignor) {
                            var _consignorIndex = OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.map(function (value, key) {
                                return value.MenuName;
                            }).indexOf("Consignor");

                            if (_consignorIndex != -1) {
                                OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource.splice(_consignorIndex, 1);
                            }
                        }
                    }
                } else {
                    OrganizationMenuCtrl.ePage.Masters.OrganizationMenu.ListSource = [];
                }
            });
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            if (!_input.FullName) {
                OrganizationMenuCtrl.ePage.Masters.Config.PushErrorWarning("E9002", "FullName is Mandatory", "E", false, "FullName", OrganizationMenuCtrl.currentOrganization.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                OrganizationMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E9002", "E", "FullName", OrganizationMenuCtrl.currentOrganization.label);
            }
            if (!_input.Code) {
                OrganizationMenuCtrl.ePage.Masters.Config.PushErrorWarning("E9001", "Code is Mandatory", "E", false, "Code", OrganizationMenuCtrl.currentOrganization.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                OrganizationMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E9001", "E", "Code", OrganizationMenuCtrl.currentOrganization.label);
            }
            if (!_input.Address1) {
                OrganizationMenuCtrl.ePage.Masters.Config.PushErrorWarning("E9003", "Address1 is Mandatory", "E", false, "Address1", OrganizationMenuCtrl.currentOrganization.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                OrganizationMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E9003", "E", "Address1", OrganizationMenuCtrl.currentOrganization.label);
            }
            if (!_input.City) {
                OrganizationMenuCtrl.ePage.Masters.Config.PushErrorWarning("E9004", "City is Mandatory", "E", false, "City", OrganizationMenuCtrl.currentOrganization.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                OrganizationMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E9004", "E", "City", OrganizationMenuCtrl.currentOrganization.label);
            }
            if (!_input.RelatedPortCode) {
                OrganizationMenuCtrl.ePage.Masters.Config.PushErrorWarning("E9005", "RelatedPortCode is Mandatory", "E", false, "RelatedPortCode", OrganizationMenuCtrl.currentOrganization.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                OrganizationMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E9005", "E", "RelatedPortCode", OrganizationMenuCtrl.currentOrganization.label);
            }
            if (!_input.PostCode) {
                OrganizationMenuCtrl.ePage.Masters.Config.PushErrorWarning("E9006", "PostCode is Mandatory", "E", false, "PostCode", OrganizationMenuCtrl.currentOrganization.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                OrganizationMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E9006", "E", "PostCode", OrganizationMenuCtrl.currentOrganization.label);
            }
            if (!_input.Language) {
                OrganizationMenuCtrl.ePage.Masters.Config.PushErrorWarning("E9007", "Language is Mandatory", "E", false, "Language", OrganizationMenuCtrl.currentOrganization.label, false, undefined, undefined, undefined, undefined, undefined);
            } else {
                OrganizationMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E9007", "E", "Language", OrganizationMenuCtrl.currentOrganization.label);
            }
            if (_errorcount.length == 0) {
                Save($item);
            } else {
                OrganizationMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrganizationMenuCtrl.currentOrganization);
            }
        }

        function OnMenuClick($item) {
            if ($item.Value == "Visibility") {
                $rootScope.GetUserList();
            }
        }

        Init();
    }
})();
