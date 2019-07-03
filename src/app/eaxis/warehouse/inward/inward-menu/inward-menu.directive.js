(function () {
    "use strict";

    angular
        .module("Application")
        .directive("inwardMenu", InwardMenu)
        .directive("inwardMenuGeneral", InwardMenuGeneral)
        .directive("inwardMenuLines", InwardMenuLines);

    InwardMenu.$inject = [];
    InwardMenuGeneral.$inject = [];
    InwardMenuLines.$inject = [];

    function InwardMenu() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-menu/inward-menu.html",
            link: Link,
            controller: "InwardMenuController",
            controllerAs: "InwardMenuCtrl",
            scope: {
                currentInward: "=",
                dataentryObject: '=',
                isHideMenu: "=",
                hideAsnLine: "=",
                hideInwardLine: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

    function InwardMenuGeneral() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-menu/inward-menu-general.html",
            link: Link,
            controller: "InwardMenuController",
            controllerAs: "InwardMenuCtrl",
            scope: {
                currentInward: "=",
                dataentryObject: '=',
                isHideMenu: "=",
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

    function InwardMenuLines() {

        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/warehouse/inward/inward-menu/inward-menu-receive-lines.html",
            link: Link,
            controller: "InwardMenuController",
            controllerAs: "InwardMenuCtrl",
            scope: {
                currentInward: "=",
                enableAdd: "=",
                enableCopy: "=",
                enableDelete: "=",
                enableCustomize: "=",
                enableBulkUpload: "=",
                enableAllocateLocation: "=",
                enableUnitCalculation: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }
    }

})();