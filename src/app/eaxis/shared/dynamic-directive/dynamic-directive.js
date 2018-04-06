(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicDirective", DynamicDirective)
        .directive("initiatejob", Initiatejob)
        .directive("confirmlinerpayment", Confirmlinerpayment)
        .directive("trackandconfirmarrival", Trackandconfirmarrival)
        .directive("portclearance", Portclearance);

    DynamicDirective.$inject = ["$compile"];
    Initiatejob.$inject = ["$window", "helperService"];
    Confirmlinerpayment.$inject = ["$window"];
    Trackandconfirmarrival.$inject = ["$window"];
    Portclearance.$inject = ["$window"];

    function DynamicDirective($compile) {
        var exports = {
            restrict: "EA",
            scope: {
                obj: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            var _templateName = scope.obj.WorkStepName.replace(/ +/g, "").toLowerCase();
            scope.templateDir = '<' + _templateName + ' obj="obj" />'
            var newDirective = angular.element(scope.templateDir);
            var view = $compile(newDirective)(scope);
            ele.append(view);

        }
    }

    function Initiatejob($window, helperService) {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/to-do/to-do-template/Initiatejob.html",
            scope: {
                obj: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {
            scope.redirect = function (obj) {
                var _queryString = {
                    "PK": obj.ModuleObject.SHP_FK,
                    "Code": obj.ModuleKey,
                    "QuickView": true,
                    "Pkey": obj.ProcessInstanceId,
                    "WorkitemID": obj.WorkItemId,
                    "WorkStepName": obj.WorkStepName
                };
                _queryString = helperService.encryptData(_queryString);
                $window.open("#/EA/single-record-view/shipment/" + _queryString, "_blank");
            };
        }
    }

    function Confirmlinerpayment($window) {
        var exports = {
            restrict: "EA",
            template: "<initiatejob obj='obj'></initiatejob>",
            scope: {
                obj: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {

        }
    }

    function Trackandconfirmarrival($window) {
        var exports = {
            restrict: "EA",
            template: "<initiatejob obj='obj'></initiatejob>",
            scope: {
                obj: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {

        }
    }

    function Portclearance($window) {
        var exports = {
            restrict: "EA",
            template: "<initiatejob obj='obj'></initiatejob>",
            scope: {
                obj: "="
            },
            link: Link,
        };
        return exports;

        function Link(scope, ele, attr) {

        }
    }
})();
