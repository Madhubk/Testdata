(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompanyListController", CompanyListController);

    CompanyListController.$inject = ["$location", "$timeout", "authService", "apiService", "helperService", "trustCenterConfig"];

    function CompanyListController($location, $timeout, authService, apiService, helperService, trustCenterConfig) {
        /* jshint validthis: true */
        var CompanyListCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            CompanyListCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_CompanyList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            CompanyListCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            CompanyListCtrl.ePage.Masters.emptyText = "-";

            try {
                CompanyListCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (CompanyListCtrl.ePage.Masters.QueryString.AppPk) {
                    InitCompanyCode();
                    InitCompanyList();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // // ============== Company List Type Code=========== //
        function InitCompanyCode() {
            CompanyListCtrl.ePage.Masters.CompanyListType = {};
            CompanyListCtrl.ePage.Masters.CompanyListType.OnCompanyCodeClick = OnCompanyCodeClick;

            GetCompanyCode();
        }

        function GetCompanyCode() {
            var _filter = {
                "PropertyName": "ORG_Code",
                "USR_FK": CompanyListCtrl.ePage.Masters.QueryString.UserPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.OrgEmployeeAssignments.API.GetColumnValuesWithFilters.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.OrgEmployeeAssignments.API.GetColumnValuesWithFilters.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    CompanyListCtrl.ePage.Masters.CompanyListType.ListSource = response.data.Response;

                    if (CompanyListCtrl.ePage.Masters.CompanyListType.ListSource.length > 0) {
                        OnCompanyCodeClick(CompanyListCtrl.ePage.Masters.CompanyListType.ListSource[0]);
                    } else {
                        OnCompanyCodeClick();
                    }
                } else {
                    CompanyListCtrl.ePage.Masters.CompanyListType.ListSource = [];
                    CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments.GridData = [];
                }
            });
        }

        function OnCompanyCodeClick($item) {
            CompanyListCtrl.ePage.Masters.CompanyListType.ActiveCompanyListType = $item;

            if ($item) {
                GetCompanyList();
            } else {
                CompanyListCtrl.ePage.Masters.CompanyListTypeList.ListSource = [];
                CompanyListCtrl.ePage.Masters.CompanyListTypeList.ActiveCompanyListTypeList = undefined;
                CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments.GridData = [];
            }
        }

        function InitCompanyList() {
            CompanyListCtrl.ePage.Masters.CompanyListTypeList = {};
            CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments = trustCenterConfig.Entities.OrgEmployeeAssignments;

            // Grid
            CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments.gridConfig = CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments.Grid.GridConfig;
            CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments.gridConfig.columnDef = CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments.Grid.ColumnDef;
        }

        function GetCompanyListDetails() {
            CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments.GridData = undefined;

            $timeout(function () {
                CompanyListCtrl.ePage.Masters.OrgEmployeeAssignments.GridData = CompanyListCtrl.ePage.Masters.CompanyListTypeList.ListSource;
            });
        }

        function GetCompanyList() {
            var _filter = {
                "OrgCode": CompanyListCtrl.ePage.Masters.CompanyListType.ActiveCompanyListType,
                "USR_FK": CompanyListCtrl.ePage.Masters.QueryString.UserPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": trustCenterConfig.Entities.API.OrgEmployeeAssignments.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", trustCenterConfig.Entities.API.OrgEmployeeAssignments.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    CompanyListCtrl.ePage.Masters.CompanyListTypeList.ListSource = response.data.Response;
                } else {
                    CompanyListCtrl.ePage.Masters.CompanyListTypeList.ListSource = [];
                }
                GetCompanyListDetails();
            });
        }

        Init();
    }
})();
