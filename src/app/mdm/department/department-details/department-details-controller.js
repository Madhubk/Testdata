(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DepartmentDetailsController", DepartmentDetailsController);

    DepartmentDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "departmentConfig", "helperService", "$filter", "$uibModal", "toastr"];

    function DepartmentDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, departmentConfig, helperService, $filter, $uibModal, toastr) {
        /* jshint validthis: true */
        var DepartmentDetailsCtrl = this;

        function Init() {
            var currentDepartment = DepartmentDetailsCtrl.currentDepartment[DepartmentDetailsCtrl.currentDepartment.label].ePage.Entities;
            DepartmentDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Department_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDepartment
            };
            DepartmentDetailsCtrl.ePage.Masters.OpenBasicsModel = OpenBasicsModel;
        }

        function OpenBasicsModel() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "basics-edit right",
                scope: $scope,
                templateUrl: "app/mdm/department/department-details/department-edit-basics/department-basics-modal.html",
                controller: 'DeptEditModalController as DeptEditModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "CurrentDepartment": DepartmentDetailsCtrl.ePage.Entities
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    if(response.Data != undefined){
                    var _isEmpty = angular.equals(response.Data, {});
                    if (!_isEmpty) {
                        DepartmentDetailsCtrl.ePage.Entities.DepartmentHeader.Data = response.Data;
                        toastr.success("Record Added Successfully...!")
                    } else {
                        toastr.warnig("Value Should not be Empty...!");
                    }
                }
                else
                {
                   DepartmentDetailsCtrl.ePage.Entities.DepartmentHeader.Data = response; 
                }
                },

                function () {
                    console.log("Cancelled");
                }
            );
        };
        Init();
    }
})();
