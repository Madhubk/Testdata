(function () {
    "use strict";

    angular
        .module("Application")
        .directive("addressWrapper", AddressWrapper);

        AddressWrapper.$inject = [];

    function AddressWrapper() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/shared/address-wrapper/address-wrapper.html",
            link: Link,
            controller: "addressWrapperController",
            controllerAs: "addressWrapperCtrl",
            scope: {
                obj: "=",
                type:"@",
                listSource:"@",
                selected:"=",
                onAddressChange:"&",
                onAddressEdit:"&"
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();
