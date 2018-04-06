(function () {
    "use strict";

    angular
        .module("Application")
        .controller("EmployeeDetailsController", EmployeeDetailsController);

    EmployeeDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "employeeConfig", "helperService", "$filter","$uibModal","toastr"];

    function EmployeeDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService,employeeConfig, helperService, $filter,$uibModal,toastr) {
        /* jshint validthis: true */
        var EmployeeDetailsCtrl = this;

        function Init() {


            var currentEmployee = EmployeeDetailsCtrl.currentEmployee[EmployeeDetailsCtrl.currentEmployee.label].ePage.Entities;
       
            EmployeeDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Employee_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentEmployee
            };
          

            EmployeeDetailsCtrl.ePage.Masters.OpenBasicsModel= OpenBasicsModel;

    };


    function OpenBasicsModel() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "basics-edit right",
                scope: $scope,
                templateUrl: "app/mdm/employee/employee-details/emp-edit-details/employee-details-modal.html",
                controller: 'EmployeeModalController as EmployeeModalCtrl',
                bindToController: true,
                resolve: {
                    param: function() {
                        var exports = {
                            "CurrentEmployee": EmployeeDetailsCtrl.ePage.Entities
                        };
                        return exports;
                    }
                }
            }).result.then(
                function(response) {    
             if (response.Data!=undefined)
             {
                    var _isEmpty = angular.equals(response.Data, {});

                    if (!_isEmpty) {
                        
                        

                        
                            EmployeeDetailsCtrl.ePage.Entities.EmployeeHeader.Data=response.Data;
                            toastr.success("Record Added Successfully...!")
                       
                    } else {
                        toastr.warnig("Value Should not be Empty...!");
                    }
             }
             else
             {
                EmployeeDetailsCtrl.ePage.Entities.EmployeeHeader.Data = response;
             }
                },
                function() {
                    console.log("Cancelled");
                }
                );
        };




        Init();
    }
})();
