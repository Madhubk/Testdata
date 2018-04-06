(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MdmHomeController", MdmHomeController);

    MdmHomeController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function MdmHomeController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var MdmHomeCtrl = this;

        function Init() {
            MdmHomeCtrl.ePage = {
                "Title": "",
                "Prefix": "Mdm_Home",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            MdmHomeCtrl.ePage.Masters.FindAll = helperService.metaBase();

            // GetUserBasedMenuList();

            MdmHomeCtrl.ePage.Masters.MenuList = [{
                "MenuName": "dashboard",
                "Description": "Dashboard",
                "Link": "#/MD/home/dashboard",
                "Icon": "fa-cubes",
                "Target": "_self"
            }, {
                "MenuName": "organization",
                "Description": "Organization",
                "Link": "#/MD/organization",
                "Icon": "fa-building",
                "Target": "_self"
            }, {
                "MenuName": "employee",
                "Description": "Employee",
                "Link": "#/MD/employee",
                "Icon": "fa-group",
                "Target": "_self"
            },  {
                "MenuName": "Branch",
                "Description": "Branch",
                "Link": "#/MD/branch",
                "Icon": "fa-group",
                "Target": "_self"
            }, {
                "MenuName": "company",
                "Description": "Company",
                "Link": "#/MD/company",
                "Icon": "fa-group",
                "Target": "_self"
            }, {
                "MenuName": "department",
                "Description": "Department",
                "Link": "#/MD/department",
                "Icon": "fa-group",
                "Target": "_self"
            }]
        };

        function GetCfxMenusList(userBasedMenuList) {
            var _filter = {
                "Code": userBasedMenuList.toString(),
                "PageType": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAllMenuWise.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAllMenuWise.Url, _input).then(function ApiCallback(response) {
                if (response.data.Response) {
                    EAxisHomeCtrl.ePage.Masters.MenuList = response.data.Response;
                }
            });
        }

        function GetUserBasedMenuList() {
            var _filter = {
                "UserName": authService.getUserInfo().UserId,
                "PropertyName": "OP_OperationName",
                "AppCode": "MD",
                "OperationType": "Menu"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AuthTrust.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("authAPI", appConfig.Entities.AuthTrust.API.GetColumnValuesWithFilters.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    GetCfxMenusList(response.data.Response);
                }
            });
        }

        Init();
    }
})();
