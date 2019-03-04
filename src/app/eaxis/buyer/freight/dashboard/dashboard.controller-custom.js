(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BuyerCustomDashboardController", BuyerCustomDashboardController);

        BuyerCustomDashboardController.$inject = ["helperService", "authService", "apiService", "appConfig"];

    function BuyerCustomDashboardController(helperService, authService, apiService, appConfig) {
        /* jshint validthis: true */
        var BuyerCustomDashboardCtrl = this;

        function Init() {
            BuyerCustomDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Buyer_Custom_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitTab();
        }

        function InitTab() {
            BuyerCustomDashboardCtrl.ePage.Masters.Tab = {};
            BuyerCustomDashboardCtrl.ePage.Masters.Tab.ListSource =[
                {
                    "Id":"97869a78-d9d3-4118-84c3-16a13f0b2bdf",
                    "Code":"EA_MAIN_FREIGHT_BUYER",
                    "MenuName":"Buyer Customized",
                    "Description":"Buyer Customized",
                    "Link":"",
                    "Icon":{
                        "color":"#f3a175",
                        "icon":"glyphicons glyphicons-user"
                    },
                    "ParentId":"1dd30639-a34b-4c03-8b02-9c51f05471be",
                    "DisplayOrder":2.00,
                    "PageType":"Shortcut",
                    "CreatedBy":"rbesto@20cube.com",
                    "CreatedDateTime":"2018-05-17T04:14:18.867",
                    "ModifiedBy":"srajaraman@20cube.com",
                    "LoginUserID":null,
                    "ModifiedDateTime":"2018-11-24T18:35:42.277",
                    "MenuList":null,
                    "IsContainsSubMenu":false,
                    "IsMobileEnabled":null,
                    "IsModified":false,
                    "IsDeleted":false,
                    "ParentMenu":"FreightDashboard",
                    "SAP_FK":"c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                    "OtherConfig":{
                            "Controller" : "DeeconnycDashboardController as DeeconnycDashboardCtrl"},
                    "TTY_OtherConfig":null,
                    "SAP_Code":"EA",
                    "USR_FK":"ed8be3d1-161c-4abf-a08d-8a23bdde7713",
                    "USR_UserName":"dhcbuyer@gmail.com",
                    "TNT_FK":"62c15cac-fd39-4fb0-bc5b-90c42dac8ddc",
                    "TenantCode":"DHCUS",
                    "CfxMenuId":"72ad616e-c002-456b-9fec-f8c8c9d7e51c",
                    "ModuleCode":null,
                    "SubModuleCode":null,
                    "FilePath":"app/eaxis/buyer/freight/dashboard/tabs/buyer/buyer-dashboard-deeconnyc.html"
                }
            ];
        }
        function GetTabList() {
            BuyerCustomDashboard.ePage.Masters.Tab.ListSource = undefined;
            var _filter = {
                "PageType": DynMultiDashboardCtrl.pageType,
                "ParentMenu": DynMultiDashboardCtrl.parentMenu,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_UserName": authService.getUserInfo().UserId,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource = response.data.Response;
                    if (response.data.Response.length > 0) {
                        DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource.map(function (value, key) {
                            if (value.OtherConfig) {
                                if (typeof value.OtherConfig == "string") {
                                    value.OtherConfig = JSON.parse(value.OtherConfig);
                                }
                            }
                        });
                    }
                } else {
                    DynMultiDashboardCtrl.ePage.Masters.Tab.ListSource = [];
                }
            });
        }

        Init();
    }
})();
