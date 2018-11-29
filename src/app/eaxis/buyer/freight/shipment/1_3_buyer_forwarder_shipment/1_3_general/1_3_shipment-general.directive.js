(function () {
  "use strict";

  angular
    .module("Application")
    .directive("oneThreeShipmentGeneral", oneThreeShipmentGeneral)
    .directive("contenteditable", contenteditable);

  oneThreeShipmentGeneral.$inject = [];

  function oneThreeShipmentGeneral() {
    var exports = {
      restrict: "EA",
      templateUrl: "app/eaxis/buyer/freight/shipment/1_3_buyer_forwarder_shipment/1_3_general/1_3_shipment-general.html",
      link: Link,
      controller: "oneThreeShipmentGeneralController",
      controllerAs: "oneThreeShipmentGeneralCtrl",
      scope: {
        currentShipment: "=",
        bookingType: "="
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
      link: function (scope, elm, attr, ngModel) {

        function updateViewValue() {
          ngModel.$setViewValue(this.innerHTML);
        }

        //Or bind it to any other events
        elm.on('keyup', updateViewValue);

        scope.$on('$destroy', function () {
          elm.off('keyup', updateViewValue);
        });

        ngModel.$render = function () {
          elm.html(ngModel.$viewValue);
        }

      }
    }
  }
})();