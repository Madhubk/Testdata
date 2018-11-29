(function () {
    "use strict";

    angular
        .module("Application")
        .directive("senderReceiverCons", SenderReceiverCons);

    SenderReceiverCons.$inject = [];

    function SenderReceiverCons() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/sender-receiver-cons/sender-receiver-cons.html",
            link: Link,
            controller: "SenderReceiverConsController",
            controllerAs: "SenderReceiverConsCtrl",
            scope: {
                currentMapping: "="
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) { }

    }

})();