(function () {
    "use strict";

    angular
        .module("Application")
        .directive("outwardMenu", OutwardMenu);

    OutwardMenu.$inject = [];

    function OutwardMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/outward/outward-menu/outward-menu.html",
            link: Link,
            controller: "OutwardMenuController",
            controllerAs: "OutwardMenuCtrl",
            scope: {
                currentOutward: "=",
                dataentryObject: '=',
                isHideMenu: "=",
                hidePick: "=",
                hideDispatch: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();