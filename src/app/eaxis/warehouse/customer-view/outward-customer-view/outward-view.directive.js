(function () {
    "use strict"
    angular
        .module("Application")
        .directive("outwardViewDirective", OutwardViewDirective);

    OutwardViewDirective.$inject = ["$compile", "$injector", "$filter", "outwardViewConfig"];

    function OutwardViewDirective($compile, $injector, $filter, outwardViewConfig) {
        var exports = {
            restrict: "EA",
            scope: {
                selectedDataEntry: "=",
                currentOutwardViewDetail: "=",
                outwardViewDetail: "="
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
                scope.templateDir = '<' + scope.selectedDataEntry.GridConfig.DetailURL + ' current-Outward-view-detail="currentOutwardViewDetail"/>';
                var newDirective = angular.element(scope.templateDir);
                var view = $compile(newDirective)(scope);
                ele.append(view);
            } else {
                scope.templateDir = '<' + 'outward-view-detail = "outwardViewDetail"' + ' current-Outward-view-detail="currentOutwardViewDetail"/>';
                var newDirective = angular.element(scope.templateDir);
                var view = $compile(newDirective)(scope);
                ele.append(view);
            }
        }
    }

})();
