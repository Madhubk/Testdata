(function () {
    "use strict";

    angular
        .module("Application")
        .factory("FreightShpConfirmation", FreightShpConfirmation);

    FreightShpConfirmation.$inject = ["$uibModal", "$templateCache"];

    function FreightShpConfirmation($uibModal, $templateCache) {
        var _template = `<div class="modal-header">
        <h5>{{modalOptions.headerText}}</h5>
        </div>
        <div class="modal-body">
            <p>{{modalOptions.bodyText}}</p>
            <table>
  <tr>
  <th></th>
    <th>Weight</th>
    <th>Volume</th>
  </tr>
  <tr>
  <td><label class="control-label text-single-line">Old Shipment</label></td>
    <td>{{modalOptions.bodyData.Weight}}</td>
    <td>{{modalOptions.bodyData.Volume}}</td>
  </tr>
  <tr>
   <td><label class="control-label text-single-line">New Shipment</label></td>
    <td><input type="text" class="form-control input-sm" placeholder="Weight" max-length="100"
    ng-model="NewShipment.Weight" /></td>
    <td><input type="text" class="form-control input-sm" placeholder="Volume" max-length="100"
    ng-model="NewShipment.Volume" /></td>
  </tr>
  <tr>
  <td><label class="control-label text-single-line">Balance</label></td>
  <td>{{modalOptions.bodyData.Weight-NewShipment.Weight}}</td>
  <td>{{modalOptions.bodyData.Volume-NewShipment.Volume}}</td>
</tr>
</table>
        </div>
        <br><br><br>
        <div class="modal-footer">
            <button type="button" class="btn btn-sm" ng-if="modalOptions.closeButtonVisible" data-ng-click="modalOptions.close()">{{modalOptions.closeButtonText}}</button>
            <button class="btn btn-primary btn-sm" data-ng-click="modalOptions.ok(NewShipment);">{{modalOptions.actionButtonText}}</button>
        </div>`;
        $templateCache.put("FreightShpConfirmation.html", _template);

        var modalDefaults = {
            backdrop: false,
            keyboard: false,
            modalFade: true,
            templateUrl: 'FreightShpConfirmation.html'
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
            customModalDefaults.windowClass = "FreightShpConfirmation";
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
                    $scope.modalOptions.ok = function (NewShipment) {
                        $uibModalInstance.close(NewShipment);
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
