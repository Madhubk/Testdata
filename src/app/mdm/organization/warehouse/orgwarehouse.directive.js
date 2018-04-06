(function(){
    "use strict";

    angular
         .module("Application")
         .directive("organizationWarehouse",OrganizationWarehouse);

    OrganizationWarehouse.$inject = [];

    function OrganizationWarehouse(){
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/warehouse/orgwarehouse.html",
            link: Link,
            controller: "OrgWarehouseController",
            controllerAs: "OrgWarehouseCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true

        };
        return exports;

        function Link(scope, elem, attr) {}
        
    }

})();