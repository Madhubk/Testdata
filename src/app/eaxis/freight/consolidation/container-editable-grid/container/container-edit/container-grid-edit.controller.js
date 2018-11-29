(function () {
    "use strict"
    angular.module("Application")
        .controller("ContainerGridPopUpController", ContainerGridPopUpController)
    ContainerGridPopUpController.$inject = ["$rootScope", "$scope", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "param", "$uibModalInstance"];

    function ContainerGridPopUpController($rootScope, $scope, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, param, $uibModalInstance) {
        var ContainerGridPopUpCtrl = this;
        function Init() {
            ContainerGridPopUpCtrl.ePage = {
                "Title": "",
                "Prefix": "ContainerModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            ContainerGridPopUpCtrl.ePage = param.ParentObj;
            ContainerGridPopUpCtrl.ePage.Masters.Close = Close;
            ContainerGridPopUpCtrl.ePage.Masters.SaveButton = "Save";
            ContainerGridPopUpCtrl.ePage.Masters.SaveButtonDisable = false;

        }

        function Close() {
            $uibModalInstance.dismiss('cancel')
        }
        Init();
    }
})();