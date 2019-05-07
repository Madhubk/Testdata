(function () {
    "use strict";

    angular.module("Application")
        .controller("DepartmentDetailsController", DepartmentDetailsController);

    DepartmentDetailsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "departmentConfig", "helperService", "$filter", "$uibModal", "toastr"];

    function DepartmentDetailsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, departmentConfig, helperService, $filter, $uibModal, toastr) {
        
        var DepartmentDetailsCtrl = this;

        function Init() {
            var currentDepartment = DepartmentDetailsCtrl.currentDepartment[DepartmentDetailsCtrl.currentDepartment.code].ePage.Entities;
            
            DepartmentDetailsCtrl.ePage = {
                "Title": "",
                "Prefix": "Department_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDepartment
            };
           
            DepartmentDetailsCtrl.ePage.Masters.Config = departmentConfig;

             /* Function */
             DepartmentDetailsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

             InitDepartment();
        }

        //#region Department
        function InitDepartment(){
            if (DepartmentDetailsCtrl.currentDepartment.isNew) {
                DepartmentDetailsCtrl.ePage.Entities.Header.Data.IsActive = true;
            }
        }
        //#endregion


        //#region ErrorWarning Alert Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(DepartmentDetailsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                DepartmentDetailsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DepartmentDetailsCtrl.currentDepartment.code, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                DepartmentDetailsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DepartmentDetailsCtrl.currentDepartment.code, IsArray, RowIndex, value.ColIndex);
            }
        }
        //#endregion 
        Init();
    }
})();
