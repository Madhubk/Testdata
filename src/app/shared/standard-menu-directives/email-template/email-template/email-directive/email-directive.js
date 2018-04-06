(function () {
    "use strict";

    angular
        .module("Application")
        .directive("emailTemplateDirective", EmailTemplateDirective);

    EmailTemplateDirective.$inject = ["$compile", "$http", "$templateCache", "$timeout"];

    function EmailTemplateDirective($compile, $http, $templateCache, $timeout) {
        var exports = {
            restrict: "EA",
            scope: {
                templateName: "=",
                obj: "=",
                tempHtml: "="
            },
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            var _loader = GetTemplate(scope.templateName);

            var promise = _loader.success(function (html) {
                ele.html(html);
            }).then(function (response) {
                var el = angular.element(response.data);
                ele.empty();
                ele.append(el);
                $compile(el)(scope);
                $timeout(function () {
                    scope.tempHtml = ele.html();
                    ele.empty();
                });
            });
        }

        function GetTemplate($item) {
            var _baseUrl = 'app/shared/standard-menu-directives/email-template/email-template/template/';

            var _templateUrl = _baseUrl + $item + ".html";
            var _templateName = $http.get(_templateUrl, {
                cache: $templateCache
            });

            return _templateName;
        }
    }
})();
