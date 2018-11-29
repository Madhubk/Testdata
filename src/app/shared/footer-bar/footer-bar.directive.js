(function () {
    "use strict";

    angular
        .module("Application")
        .directive("footerBar", FooterBar);

    FooterBar.$inject = ["$templateCache", "authService"];

    function FooterBar($templateCache, authService) {
        var _template = ` <footer class="footer-bar-container">
            <div class="col-sm-4">
                <div class="text-single-line">
                    <span data-ng-bind-html="CopyrightText" title="{{CopyrightText}}"></span>
                    <span class="ml-10" data-ng-bind="Version" title="{{Version}}"></span>
                </div>
            </div>
            <div class="col-sm-8 text-right">
                <div class="text-single-line" style="direction: rtl;" data-ng-bind="RoleName + PartyName + TenantName" title="{{RoleName + PartyName + TenantName}}"></div>
            </div>
        </footer>`;
        $templateCache.put("FooterBar.html", _template);

        var exports = {
            restrict: "EA",
            templateUrl: "FooterBar.html",
            scope: {},
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            var _curYear = new Date().getFullYear();
            scope.CopyrightText = "Copyright &copy; " + _curYear + " Myhub Plus. All Rights Reserved.";
            if (authService.getUserInfo().Version) {
                scope.Version = "v" + authService.getUserInfo().Version;
            }

            scope.TenantName = (authService.getUserInfo().TenantName) ? authService.getUserInfo().TenantName : authService.getUserInfo().TenantCode;
            scope.PartyName = (authService.getUserInfo().PartyName) ? authService.getUserInfo().PartyName + " | " : authService.getUserInfo().PartyCode + " | ";
            scope.RoleName = (authService.getUserInfo().RoleName) ? authService.getUserInfo().RoleName + " | " : authService.getUserInfo().RoleCode + " | ";
        }
    }
})();
