(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardViewDetailCustom1Controller", OutwardViewDetailCustom1Controller);

    OutwardViewDetailCustom1Controller.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "helperService", "apiService", "$filter","appConfig"];

    function OutwardViewDetailCustom1Controller($rootScope, $scope, $state, $q, $location, helperService, apiService, $filter,appConfig) {

        var OutwardViewDetailCustom1Ctrl = this;

        function Init() {

            var currentOutwardViewDetail = OutwardViewDetailCustom1Ctrl.currentOutwardViewDetail[OutwardViewDetailCustom1Ctrl.currentOutwardViewDetail.label].ePage.Entities;

            OutwardViewDetailCustom1Ctrl.ePage = {
                "Title": "",
                "Prefix": "OutwardView_Detail_Custom1",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutwardViewDetail,
            };
        }
        Init();

    }

})();