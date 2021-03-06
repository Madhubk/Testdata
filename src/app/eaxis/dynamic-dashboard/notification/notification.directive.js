(function () {
    "use strict";

    angular
        .module("Application")
        .directive("notification", Notification)
        .directive("kpiDirective", KpiDirective)
        .directive("myTaskDashboardDirective", MyTaskDirective)
        .directive("exceptionDirective", ExceptionDirective)
        .directive("raiseCsrDirective", RaiseCsrDirective)
        .directive("asnRequestDirective", AsnRequestDirective)
        .directive("newInwardDirective", NewInwardDirective)
        .directive("trackInwardDirective", TrackInwardDirective)
        .directive("emailDirective", EmailDirective)
        .directive("userDirective", UserDirective)
        .directive("musicDirective", MusicDirective)
        .directive("videoDirective", VideoDirective)
        .directive("openSoChart", OpenSoChart)
        .directive("newGatepassDirective", NewGatepassDirective)
        .directive("newManifestDirective", NewManifestDirective);

    function OpenSoChart() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/open-so-chart.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

    function Notification() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/notification.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) { }

    }

    function KpiDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/kpi.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function MyTaskDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/my-task.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function ExceptionDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/exception.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function RaiseCsrDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/raise-csr.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function AsnRequestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/asn-request.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function NewInwardDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/new-inward.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function TrackInwardDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/track-inward.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function NewGatepassDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/new-gatepass.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function NewManifestDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/new-manifest.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function EmailDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/email.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function UserDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/user.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function MusicDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/music.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

    function VideoDirective() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/eaxis/dynamic-dashboard/notification/video.html",
            link: Link,
            controller: "NotificationController",
            controllerAs: "NotificationCtrl",
            bindToController: true,
            scope: {
                componentList: "=",
                selectedComponent: "=",
                selectedWarehouse: "=",
                selectedClient: "="
            },
            link: Link
        };

        return exports;

        function Link(scope, elem, attr) { }
    }

})();