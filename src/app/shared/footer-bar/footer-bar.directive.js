(function () {
    "use strict";

    angular
        .module("Application")
        .directive("footerBar", FooterBar);

    FooterBar.$inject = ["$rootScope", "$templateCache", "authService", "helperService", "APP_CONSTANT"];

    function FooterBar($rootScope, $templateCache, authService, helperService, APP_CONSTANT) {
        let _template = `<footer class="footer-bar-container">
                <div class="col-sm-4">
                    <div class="text-single-line">
                        <span data-ng-bind-html="CopyrightText" title="{{CopyrightText}}"></span>
                        <span class="ml-10" data-ng-bind="Version" title="{{Version}}"></span>
                        <span class="ml-10 danger">{{SessionExpiryCount.message}}</span>
                    </div>
                </div>
                <div class="col-sm-8 text-right">
                    <div class="text-single-line" style="direction: rtl;" data-ng-bind="RoleName + PartyName + TenantName" title="{{RoleName + PartyName + TenantName}}"></div>
                </div>
            </footer>`;
        $templateCache.put("FooterBar.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "FooterBar.html",
            scope: {},
            link: Link
        };
        return exports;

        function Link(scope, ele, attr) {
            $rootScope.SessionExpiryCheck = SessionExpiryReset;

            let _curYear = new Date().getFullYear();
            scope.CopyrightText = "Copyright &copy; " + _curYear + " Myhub Plus. All Rights Reserved.";
            if (authService.getUserInfo().Version) {
                scope.Version = "v" + authService.getUserInfo().Version;
            }

            scope.TenantName = (authService.getUserInfo().TenantName) ? authService.getUserInfo().TenantName : authService.getUserInfo().TenantCode;
            scope.PartyName = (authService.getUserInfo().PartyName) ? authService.getUserInfo().PartyName + " | " : authService.getUserInfo().PartyCode + " | ";
            scope.RoleName = (authService.getUserInfo().RoleName) ? authService.getUserInfo().RoleName + " | " : authService.getUserInfo().RoleCode + " | ";

            let _interval = null;

            function SessionExpiryReset() {
                let _localStorage = angular.copy(authService.getUserInfo());
                _localStorage.ExpiresTemp = new Date();
                authService.setUserInfo(helperService.encryptData(_localStorage));

                setTimeout(() => SessionExpiryCheck());
            }

            function SessionExpiryCheck() {
                let increaseMinutes = APP_CONSTANT.SessionExpiryTime;
                let countDownDate = new Date(authService.getUserInfo().ExpiresTemp);
                countDownDate.setMinutes((countDownDate.getMinutes() + increaseMinutes));
                clearInterval(_interval);
                _interval = setInterval(CheckTimeout, 1000);

                function CheckTimeout() {
                    let now = new Date().getTime();
                    let distance = countDownDate - now;
                    let _date = {
                        distance: distance,
                        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds: Math.floor((distance % (1000 * 60)) / 1000),
                        message: ""
                    };

                    if (distance <= 0) {
                        clearInterval(_interval);
                        _date.message = "Session Expired";
                        // console.log("Session EXPIRED");
                    } else {
                        _date.message = _date.minutes + "m " + _date.seconds + "s";
                        // console.log(_date.minutes + "m " + _date.seconds + "s ");
                    }

                    scope.SessionExpiryCount = _date;
                    scope.$apply();
                }
            }
        }
    }
})();
