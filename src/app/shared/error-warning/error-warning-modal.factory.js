(function () {
    "use strict";

    angular
        .module("Application")
        .factory("errorWarning", ErrorWarning);

    ErrorWarning.$inject = ["$uibModal", "$templateCache"];

    function ErrorWarning($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
            <button type="button" class="close" ng-click="modalOptions.close()">&times;</button>
            <h5 class="modal-title" id="modal-title">
                <strong>Errors & Warnings</strong>
            </h5>
        </div>
        <div class="modal-body">
            <div class="clearfix" data-ng-if="modalOptions.list.length>0">
                <div class="clearfix">
                    <div class="ew-title">Error</div>
                    <div class="p-5" data-ng-repeat="x in modalOptions.list | filter: {'MessageType' : 'E'}">
                        <span data-ng-bind="x.Code + ' - ' + x.Message"></span>
                    </div>
                </div>
                <div class="ea-section-divider mt-10 mb-10"></div>
                <div class="clearfix">
                    <div class="ew-title">Warning</div>
                    <div class="p-5" data-ng-repeat="x in modalOptions.list | filter: {'MessageType' : 'W'}">
                        <span data-ng-bind="x.Code + ' - ' + x.Message"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-sm pull-right" data-ng-click="modalOptions.close()">Close</button>
        </div>`;
        $templateCache.put("ErrorWarning.html", _template);

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'ErrorWarning.html'
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
