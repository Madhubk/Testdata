(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardViewDetailCustom1Controller", InwardViewDetailCustom1Controller);

    InwardViewDetailCustom1Controller.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "helperService", "apiService", "$filter","appConfig"];

    function InwardViewDetailCustom1Controller($rootScope, $scope, $state, $q, $location, helperService, apiService, $filter,appConfig) {

        var InwardViewDetailCustom1Ctrl = this;

        function Init() {

            var currentInwardViewDetail = InwardViewDetailCustom1Ctrl.currentInwardViewDetail[InwardViewDetailCustom1Ctrl.currentInwardViewDetail.label].ePage.Entities;

            InwardViewDetailCustom1Ctrl.ePage = {
                "Title": "",
                "Prefix": "InwardView_Detail_Custom1",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInwardViewDetail,
            };
        }
        
        Init();
    }

})();