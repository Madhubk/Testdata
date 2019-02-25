(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreateManifestViewController", CreateManifestViewController);

    CreateManifestViewController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "$filter", "toastr"];

    function CreateManifestViewController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, $filter, toastr) {

        var CreateManifestViewCtrl = this;

        function Init() {

            var currentManifest = CreateManifestViewCtrl.currentManifest[CreateManifestViewCtrl.currentManifest.label].ePage.Entities;

            CreateManifestViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Create_Manifest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            CreateManifestViewCtrl.ePage.Masters.Config = dmsManifestConfig;

            GetMenuBasedOnSender();
        }

        function GetMenuBasedOnSender() {
            var _filter = {
                "PK": CreateManifestViewCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": CreateManifestViewCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.FilterID
            };

            apiService.post("eAxisAPI", CreateManifestViewCtrl.ePage.Entities.Header.API.OrgHeaderWarehouse.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    CreateManifestViewCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient = response.data.Response[0].Code;
                    CreateManifestViewCtrl.ePage.Entities.Header.CheckPoints.IsWarehouseClient = true;

                    if (CreateManifestViewCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                        CreateManifestViewCtrl.ePage.Masters.MenuList = CreateManifestViewCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
                    } else {
                        CreateManifestViewCtrl.ePage.Masters.MenuList = CreateManifestViewCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
                    }
                }
            });
        }

        Init();
    }
})();