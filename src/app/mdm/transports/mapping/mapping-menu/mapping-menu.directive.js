(function () {
    "use strict";

    angular
        .module("Application")
        .directive("mappingMenu", MappingMenu);

    MappingMenu.$inject = [];

    function MappingMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/transports/mapping/mapping-menu/mapping-menu.html",
            link: Link,
            controller: "MappingMenuController",
            controllerAs: "MappingMenuCtrl",
            scope: {
                activeMenu: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();