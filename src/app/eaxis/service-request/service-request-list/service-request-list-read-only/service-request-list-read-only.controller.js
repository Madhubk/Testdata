(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ServiceRequestListReadOnlyController", ServiceRequestListReadOnlyController);

    ServiceRequestListReadOnlyController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "serviceRequestListConfig", "helperService", "$window", "$uibModal"];

    function ServiceRequestListReadOnlyController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, serviceRequestListConfig, helperService, $window, $uibModal) {

        var ServiceRequestListReadOnlyCtrl = this;

        function Init() {

            var currentServiceRequestListReadOnly = ServiceRequestListReadOnlyCtrl.currentServiceRequestListReadOnly[ServiceRequestListReadOnlyCtrl.currentServiceRequestListReadOnly.label].ePage.Entities;

            ServiceRequestListReadOnlyCtrl.ePage = {
                "Title": "",
                "Prefix": "ServiceRequestList_ReadOnly",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentServiceRequestListReadOnly,
            };
            
            ServiceRequestListReadOnlyCtrl.ePage.Entities.Header.Data.AppObj = {};
            ServiceRequestListReadOnlyCtrl.ePage.Entities.Header.Data.SrqArea = {};

            var strAddtionalInfo = JSON.parse(ServiceRequestListReadOnlyCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.AddtionalInfo);

            ServiceRequestListReadOnlyCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
            ServiceRequestListReadOnlyCtrl.ePage.Entities.Header.Data.SrqArea = strAddtionalInfo.Purpose;
            ServiceRequestListReadOnlyCtrl.ePage.Entities.Header.Data.Sno = 0;

        }
        
        Init();
    }

})();