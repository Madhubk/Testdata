(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreatemanifestGeneralController", CreatemanifestGeneralController);

    CreatemanifestGeneralController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "createmanifestConfig", "helperService", "$window", "$uibModal", "dynamicLookupConfig"];

    function CreatemanifestGeneralController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, createmanifestConfig, helperService, $window, $uibModal, dynamicLookupConfig) {

        var CreatemanifestGeneralCtrl = this;

        function Init() {

            var currentManifest = CreatemanifestGeneralCtrl.currentManifest[CreatemanifestGeneralCtrl.currentManifest.label].ePage.Entities;

            CreatemanifestGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            CreatemanifestGeneralCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            CreatemanifestGeneralCtrl.ePage.Masters.Config = createmanifestConfig;
            CreatemanifestGeneralCtrl.ePage.Masters.IsDisabledSender = true;

            CreatemanifestGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            GetDynamicLookupConfig();

        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    CreatemanifestGeneralCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }

})();