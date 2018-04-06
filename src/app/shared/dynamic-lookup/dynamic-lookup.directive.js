(function () {
    'user strict';

    angular
        .module('Application')
        .directive('dynamicLookup', DynamicLookup);

    function DynamicLookup() {
        var exports = {
            restrict: "EA",
            scope: {
                myNgModel: '=',
                obj: '=',
                config: '=',
                prefixData: '=',
                autoCompleteOnSelect: "&",
                placeholder: "@",
                isDisabled: "="
            },
            link: Link,
            bindToController: true,
            controller: "DynamicLookupController",
            controllerAs: "DynamicLookupCtrl",
            templateUrl: "app/shared/dynamic-lookup/dynamic-lookup.html"
        };

        return exports;

        function Link(scope, ele, attr) {}
    }
})();
