(function() {
    "use strict";
    angular
        .module("Application")
        .controller("CompanyDetailsController", CompanyDetailsController);

    CompanyDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "companyConfig", "helperService", "$filter", "$uibModal", "toastr"];

    function CompanyDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, companyConfig, helperService, $filter, $uibModal, toastr) {
        /* jshint validthis: true */
        var CompanyDetailsCtrl = this;

        function Init() {
            var currentCompany = CompanyDetailsCtrl.currentCompany[CompanyDetailsCtrl.currentCompany.label].ePage.Entities;
            CompanyDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Department_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCompany
            };

            CompanyDetailsCtrl.ePage.Masters.OpenBasicsModel = OpenBasicsModel;
        }

        function OpenBasicsModel() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "basics-edit right",
                scope: $scope,
                templateUrl: "app/mdm/company/company-details/company-edit-details/company-details-modal.html",
                controller: 'CompanyEditModalController as CompEditModalCtrl',
                bindToController: true,
                resolve: {
                    param: function() {
                        var exports = {
                            "CurrentCompany": CompanyDetailsCtrl.ePage.Entities.CompanyHeader.Data
                        };
                        return exports;
                    }
                }
            }).result.then(
                function(response) {
                    if(response.Data != undefined){
                    var _isEmpty = angular.equals(response.Data, {});
                    if (!_isEmpty) {

                        // if (response.CurrComments.Comments.Description === "Detailed Goods Description") {
                        CompanyDetailsCtrl.ePage.Entities.CompanyHeader.Data = response.Data;
                        toastr.success("Record Added Successfully...!")

                    } else {
                        toastr.warnig("Value Should not be Empty...!");
                    }
                }
                else
                {
                 CompanyDetailsCtrl.ePage.Entities.CompanyHeader.Data = response;   
                }
                },
                function() {
                    console.log("Cancelled");
                }
            );
        }

        Init();
    }
})();
