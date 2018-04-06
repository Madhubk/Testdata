(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CreateConsignGeneralController", CreateConsignGeneralController);

    CreateConsignGeneralController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "createConsignConfig", "helperService", "$window", "$uibModal", "dynamicLookupConfig"];

    function CreateConsignGeneralController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, createConsignConfig, helperService, $window, $uibModal, dynamicLookupConfig) {

        var CreateConGenCtrl = this;

        function Init() {

            var currentConsignment = CreateConGenCtrl.currentConsignment[CreateConGenCtrl.currentConsignment.label].ePage.Entities;

            CreateConGenCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment,
            };

            CreateConGenCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            CreateConGenCtrl.ePage.Masters.Config = createConsignConfig;
            CreateConGenCtrl.ePage.Masters.IsDisabledSender = true;

            CreateConGenCtrl.ePage.Masters.DropDownMasterList = {};

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
                    CreateConGenCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }

})();