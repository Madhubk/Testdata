(function () {
    "use strict"
    angular
        .module("Application")
        .directive("inwardViewDirective", InwardViewDirective);

    InwardViewDirective.$inject = ["$compile", "$injector", "$filter", "inwardViewConfig"];

    function InwardViewDirective($compile, $injector, $filter, inwardViewConfig) {
        var exports = {
            restrict: "EA",
            scope: {
                selectedDataEntry: "=",
                currentInwardViewDetail:"=",
                inwardViewDetail:"="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            var TempDetails = scope.selectedDataEntry.GridConfig.DetailURL.split('-');
            for (var i = 0; i < TempDetails.length; i++) {
                if (i != 0) {
                    TempDetails[i] = TempDetails[i].charAt(0).toUpperCase() + TempDetails[i].slice(1);
                }
            }
            TempDetails = TempDetails.join('');
            var _isExist = $injector.has(TempDetails + "Directive");
            if (_isExist) {
                scope.templateDir = '<' + scope.selectedDataEntry.GridConfig.DetailURL + ' current-inward-view-detail="currentInwardViewDetail"/>';
                var newDirective = angular.element(scope.templateDir);
                var view = $compile(newDirective)(scope);
                ele.append(view);
            }else {
                scope.templateDir = '<' + 'inward-view-detail ="inwardViewDetail"' + ' current-inward-view-detail="currentInwardViewDetail"/>';
                var newDirective = angular.element(scope.templateDir);
                var view = $compile(newDirective)(scope);
                ele.append(view);
            }
        }
    }

})();
