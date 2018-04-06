(function () {
    "use strict";

    angular
        .module("Application")
        .directive("standardMenu", StandardMenu);

    StandardMenu.$inject = [];

    function StandardMenu() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/shared/standard-menu/standard-menu.html",
            controller: "StandardMenuController",
            controllerAs: "StandardMenuCtrl",
            bindToController: true,
            scope: {
                input: "=",
                entityName: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {}
    }

    angular
        .module('Application')
        .directive('compileDynamicDirectiveStandardMenu', CompileDynamicDirectiveStandardMenu);

    function CompileDynamicDirectiveStandardMenu($compile) {
        var exports = {
            restrict: 'A',
            scope: {
                obj: '=',
                input: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, elem, attrs) {
            var template = '<a href="javascript:void(0);" ' + scope.obj.Name + '-modal input="input" mode="1" type=""><i class="eaxis-footer-icon {{obj.Icon}}"></i><span class="eaxis-footer-text" data-ng-bind="obj.DisplayName"></span> </a>';
            var _element = angular.element(template);
            var _template = $compile(_element)(scope);
            elem.replaceWith(_template);
        }
    }
})();
