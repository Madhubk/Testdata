(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MyRequestReadOnlyController", MyRequestReadOnlyController);

    MyRequestReadOnlyController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "myRequestConfig", "helperService", "$window", "$uibModal"];

    function MyRequestReadOnlyController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, myRequestConfig, helperService, $window, $uibModal) {

        var MyRequestReadOnlyCtrl = this;

        function Init() {

            var currentMyRequestReadOnly = MyRequestReadOnlyCtrl.currentMyRequestReadOnly[MyRequestReadOnlyCtrl.currentMyRequestReadOnly.label].ePage.Entities;

            MyRequestReadOnlyCtrl.ePage = {
                "Title": "",
                "Prefix": "MyRequest_ReadOnly",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentMyRequestReadOnly,
            };
            
            MyRequestReadOnlyCtrl.ePage.Entities.Header.Data.AppObj = {};
            MyRequestReadOnlyCtrl.ePage.Entities.Header.Data.SrqArea = {};

            var strAddtionalInfo = JSON.parse(MyRequestReadOnlyCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.AddtionalInfo);

            MyRequestReadOnlyCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
            MyRequestReadOnlyCtrl.ePage.Entities.Header.Data.SrqArea = strAddtionalInfo.Purpose;
            MyRequestReadOnlyCtrl.ePage.Entities.Header.Data.Sno = 0;

        }
        
        Init();
    }

})();