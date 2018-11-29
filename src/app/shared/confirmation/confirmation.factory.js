(function () {
    "use strict";

    angular
        .module("Application")
        .factory("confirmation", Confirmation);

    Confirmation.$inject = ["$uibModal", "$templateCache"];

    function Confirmation($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
        <h5>{{modalOptions.headerText}}</h5>
        </div>
        <div class="modal-body">
            <p>{{modalOptions.bodyText}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-sm" ng-if="modalOptions.closeButtonVisible" data-ng-click="modalOptions.close()">{{modalOptions.closeButtonText}}</button>
            <button class="btn btn-primary btn-sm" data-ng-click="modalOptions.ok();">{{modalOptions.actionButtonText}}</button>
        </div>`;
        $templateCache.put("Confirmation.html", _template);

        var modalDefaults = {
            backdrop: false,
            keyboard: false,
            modalFade: true,
            templateUrl: 'Confirmation.html'
        };
        var modalOptions = {
            closeButtonText: 'Close',
            closeButtonVisible: true,
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };
        var exports = {
            showModal: ShowModal,
            show: Show
        };
        return exports;

        function ShowModal(customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            // customModalDefaults.backdrop = 'static';
            // customModalDefaults.keyboard = false;
            customModalDefaults.animation = true;
            customModalDefaults.windowClass = "confirmation";
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
