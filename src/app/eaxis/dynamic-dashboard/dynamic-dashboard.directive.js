(function () {
    "use strict"
    angular
        .module("Application")
        .directive("dynamicDashboardDirective", DynamicDashboardDirective);

    DynamicDashboardDirective.$inject = ["$compile", "$injector", "$filter", "dynamicDashboardConfig"];

    function DynamicDashboardDirective($compile, $injector, $filter, dynamicDashboardConfig) {
        var exports = {
            restrict: "EA",
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            dynamicDashboardConfig.LoadedDirectiveCount = dynamicDashboardConfig.LoadedDirectiveCount + 1;
            if (dynamicDashboardConfig.LoadedDirectiveCount <= dynamicDashboardConfig.LoadMoreCount) {
                var TempDetails = scope.selectedComponent.DC_DSC_DirectiveName.split('-');
                for (var i = 0; i < TempDetails.length; i++) {
                    if (i != 0) {
                        TempDetails[i] = TempDetails[i].charAt(0).toUpperCase() + TempDetails[i].slice(1);
                    }
                }
                TempDetails = TempDetails.join('');
                var _isExist = $injector.has(TempDetails + "Directive");
                if (_isExist) {
                    scope.templateDir = '<' + scope.selectedComponent.DC_DSC_DirectiveName + ' component-list="componentList" selected-component="selectedComponent" selected-warehouse="selectedWarehouse" selected-client= "selectedClient" />';
                    var newDirective = angular.element(scope.templateDir);
                    var view = $compile(newDirective)(scope);
                    ele.append(view);
                }
            }
        }
    }

})();
