(function () {
    "use strict";

    angular
        .module("Application")
        .directive("parties", Parties);

    Parties.$inject = [];

    function Parties() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu-directives/parties/parties/parties.html",
            controller: 'PartiesController',
            controllerAs: 'PartiesCtrl',
            bindToController: true,
            scope: {
                input: "=",
                mode: "=",
                type: "=",
                closeModal: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }
})();
