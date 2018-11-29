(function () {
    "use strict";

    angular
        .module("Application")
        .directive("shipmentGeneral", ShipmentGeneral)
        .directive("contenteditable", contenteditable);
        
    ShipmentGeneral.$inject = [];

    function ShipmentGeneral() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/freight/shipment/general/shipment-general.html",
            link: Link,
            controller: "GeneralController",
            controllerAs: "GeneralCtrl",
            scope: {
                currentShipment: "=",
                bookingType:"="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
    function contenteditable() {
        return {
          require: 'ngModel',
          restrict: 'A',
          link: function(scope, elm, attr, ngModel) {
      
            function updateViewValue() {
              ngModel.$setViewValue(this.innerHTML);
            }
      
            //Or bind it to any other events
            elm.on('keyup', updateViewValue);
      
            scope.$on('$destroy', function() {
              elm.off('keyup', updateViewValue);
            });
      
            ngModel.$render = function() {
              elm.html(ngModel.$viewValue);
            }
      
          }
        }}
})();
