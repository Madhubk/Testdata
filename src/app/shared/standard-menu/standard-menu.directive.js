(function () {
    "use strict";

    angular
        .module("Application")
        .directive("standardMenu", StandardMenu);

    StandardMenu.$inject = ["$templateCache"];

    function StandardMenu($templateCache) {
        let _template = `<div class="clearfix standard-menu-wrapper">
            <div class="eaxis-footer-left">
                <ul>
                    <li class="position-relative" data-ng-repeat="x in StandardMenuCtrl.ePage.Masters.MenuList" data-ng-if="StandardMenuCtrl.ePage.Masters.StandardMenuInput.Config[x.Name]">
                        <a href="javascript:void(0);" compile-dynamic-directive-standard-menu obj="x" input="StandardMenuCtrl.ePage.Masters.StandardMenuInput" on-close-modal="StandardMenuCtrl.ePage.Masters.OnCloseModal($item)"></a>
                        <span class="sm-count" data-ng-bind="x.Count" data-ng-if="x.IsShowCount && x.Count != undefined"></span>
                        <span class="sm-count fa fa-spin fa-spinner" data-ng-if="x.IsShowCount && x.Count == undefined"></span>
                    </li>
                </ul>
            </div>
        </div>`;
        $templateCache.put("StandardMenu.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "StandardMenu.html",
            controller: "StandardMenuController",
            controllerAs: "StandardMenuCtrl",
            bindToController: true,
            scope: {
                input: "=",
                dataentryObject: "=",
                onCloseModal: "&"
            },
        };
        return exports;
    }

    angular
        .module('Application')
        .directive('compileDynamicDirectiveStandardMenu', CompileDynamicDirectiveStandardMenu);

    function CompileDynamicDirectiveStandardMenu($compile) {
        let exports = {
            restrict: 'A',
            scope: {
                obj: '=',
                input: "=",
                onCloseModal: "&"
            },
            link: Link
        };
        return exports;

        function Link(scope, elem, attrs) {
            scope.OnCloseModal = OnCloseModal;
            let _directiveName = scope.obj.Name;
            let template = `<a href="javascript:void(0);" ${_directiveName}-modal input="input" mode="1" type="" on-close-modal="OnCloseModal($item)">
                <i class="eaxis-footer-icon {{obj.Icon}}"></i>
                <span class="eaxis-footer-text" data-ng-bind="obj.DisplayName"></span>
            </a>`;
            let _element = angular.element(template);
            let _template = $compile(_element)(scope);
            elem.replaceWith(_template);

            function OnCloseModal($item) {
                scope.onCloseModal({
                    $item: $item
                });
            }
        }
    }
})();
