(function () {
    "use strict";

    angular
        .module("Application")
        .directive("organizationWarehouse", OrganizationWarehouse);

    function OrganizationWarehouse() {
        var exports = {
            restrict: "EA",
            templateUrl: "app/mdm/organization/warehouse/warehouse.html",
            controller: "OrgWarehouseController",
            controllerAs: "OrgWarehouseCtrl",
            scope: {
                currentOrganization: "="
            },
            bindToController: true

        };
        return exports;
    }

    angular
        .module("Application")
        .controller("OrgWarehouseController", OrgWarehouseController);

    OrgWarehouseController.$inject = ["$scope", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrgWarehouseController($scope, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr, confirmation) {
       
        var OrgWarehouseCtrl = this;

        function Init() {
            var currentOrganization = OrgWarehouseCtrl.currentOrganization[OrgWarehouseCtrl.currentOrganization.label].ePage.Entities;

            OrgWarehouseCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Company",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgWarehouseCtrl.ePage.Masters.EditableMode = EditableMode;
        }

        function EditableMode(type){
            $uibModal.open({

                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right warehouse-edit",
                scope: $scope,

                templateUrl: 'app/mdm/organization/warehouse/editable-pages/'+type+'.html',
                controller: 'EditableController as EditableCtrl',
                bindToController: true,
                resolve: {
                    entity: function () {
                        var exports = {
                            "Data": OrgWarehouseCtrl.ePage.Entities.Header.Data,
                        };
                        return exports;
                    }
                }
            }).result.then(function(response){
                if(response)
                OrgWarehouseCtrl.ePage.Entities.Header.Data = response;
            })
        }

        Init();
    }
})();
