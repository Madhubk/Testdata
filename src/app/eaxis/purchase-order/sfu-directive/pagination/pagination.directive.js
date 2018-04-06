(function () {
    "use strict";

    angular
        .module("Application")
        .directive("pagination", Pagination);

    Pagination.$inject = [];

    function Pagination() {
        var exports = {
            restrict: "E",
            templateUrl: "app/eaxis/purchase-order/sfu-directive/pagination/pagination.html",
            link: Link,
            controller: "paginationController",
            controllerAs: "PaginationCtrl",
            scope: {
                numPages: '=',
                currentPage: '=',
                totalCount: '=',
                onSelectPage: '&'
            },
            bindToController: true
        };
        return exports;

        function Link(scope, elem, attr) {}
    }
})();