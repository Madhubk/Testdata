(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerListDirectiveController", ContainerListDirectiveController);

        ContainerListDirectiveController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "toastr", "$uibModal"];

    function ContainerListDirectiveController($rootScope, $scope, state, $timeout, $location, $q, APP_CONSTANT, authService, apiService, helperService, appConfig, toastr, $uibModal) {
        var ContainerListDirectiveCtrl = this;

        function Init() {
            var currentContainer = ContainerListDirectiveCtrl.currentContainer[ContainerListDirectiveCtrl.currentContainer.label].ePage.Entities;
            ContainerListDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "ConatainerList",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentContainer
            };
        }

        Init();
    }
})();