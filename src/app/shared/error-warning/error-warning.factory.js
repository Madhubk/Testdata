(function () {
    "use strict";

    angular
        .module("Application")
        .factory("errorWarning", ErrorWarning);

    ErrorWarning.$inject = ["$uibModal"];

    function ErrorWarning($uibModal) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'app/shared/error-warning/error-warning.html'
        };
        var modalOptions = {
            headerText: 'Warning',
            list: []
        };
        var exports = {
            showModal: ShowModal,
            show: Show
        };
        return exports;

        function ShowModal(customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            // customModalDefaults.backdrop = 'static';
            customModalDefaults.keyboard = true;
            customModalDefaults.animation = true;
            customModalDefaults.windowClass = "error-warning-modal";
            return exports.show(customModalDefaults, customModalOptions);
        }

        function Show(customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function () {
                        $uibModalInstance.close(modalOptions.actionButtonText);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                };
            }

            return $uibModal.open(tempModalDefaults).result;
        }
    }
})();
