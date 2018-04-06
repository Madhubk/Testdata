(function () {
    "use strict";
    angular
        .module("Application")
        .controller("EmployeeModalController", EmployeeModalController);

    EmployeeModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "employeeConfig", "helperService", "param"];

    function EmployeeModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, employeeConfig
        , helperService, param) {
        var EmployeeModalCtrl = this;

        function Init() {
            EmployeeModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Address",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": param.CurrentEmployee
            };

       
            EmployeeModalCtrl.ePage.Masters.FormView = {};
            EmployeeModalCtrl.ePage.Masters.param = param;
            EmployeeModalCtrl.ePage.Masters.FormView = param.CurrentEmployee.EmployeeHeader.Data;
            EmployeeModalCtrl.ePage.Masters.FormViewTemp = angular.copy(param.CurrentEmployee.EmployeeHeader.Data);
            EmployeeModalCtrl.ePage.Masters.Save = Save;
            EmployeeModalCtrl.ePage.Masters.Cancel = Cancel;
           

            
           var _filter = {
                "TypeCode": "LANGUAGE"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": EmployeeModalCtrl.ePage.Entities.EmployeeHeader.API.CfxTypes.FilterID
            };

            apiService.post("eAxisAPI", EmployeeModalCtrl.ePage.Entities.EmployeeHeader.API.CfxTypes.Url + authService.getUserInfo().SapPK, _input).then(function (response) {
                if (response.data.Response) {
                    // RelatedShipmentCtrl.ePage.Entities.ShipmentHeader.Data.UIRelatedShipments = response.data.Response;
              
                   EmployeeModalCtrl.ePage.Entities.EmployeeHeader.Meta.Language.ListSource = response.data.Response;

                }
            });

        }

        function Save() {
            var _exports = {
                Data: EmployeeModalCtrl.ePage.Masters.FormView,
         };

            
            $uibModalInstance.close(_exports);
        };

        function Cancel() {
            $uibModalInstance.close(EmployeeModalCtrl.ePage.Masters.FormViewTemp);
        };

        Init();
    }
})();
