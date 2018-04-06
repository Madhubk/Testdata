(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardProductsummaryController", InwardProductsummaryController);

    InwardProductsummaryController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "$state", "$q"];

    function InwardProductsummaryController($scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, toastr, confirmation, $state, $q) {

        var InwardProductsummaryCtrl = this;
        function Init() {

            var currentInward = InwardProductsummaryCtrl.currentInward[InwardProductsummaryCtrl.currentInward.label].ePage.Entities;
            InwardProductsummaryCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward,
            };

            InwardProductsummaryCtrl.ePage.Masters.emptyText = '-';
            InwardProductsummaryCtrl.ePage.Masters.Config= inwardConfig;
            InwardProductsummaryCtrl.ePage.Masters.Config.ProductSummary(InwardProductsummaryCtrl.ePage.Entities.Header);   
            
        }
        

        Init();
    }

})();