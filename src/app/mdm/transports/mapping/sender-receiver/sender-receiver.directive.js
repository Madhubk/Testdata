(function () {
    "use strict";

    angular
        .module("Application")
        .directive("senderReceiver", SenderReceiver);

    SenderReceiver.$inject = [];

    function SenderReceiver() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/sender-receiver/sender-receiver.html",
            link: Link,
            controller: "SenderReceiverController",
            controllerAs: "SenderReceiverCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();