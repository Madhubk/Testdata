(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QuickViewController", QuickViewController);

    QuickViewController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "toastr", "dynamicLookupConfig", "$injector"];

    function QuickViewController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, toastr, dynamicLookupConfig, $injector) {
        /* jshint validthis: true */
        var QuickViewCtrl = this;

        function Init() {
            var currentObj = QuickViewCtrl.obj[QuickViewCtrl.obj.label].ePage.Entities;
            QuickViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_QuickView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            GetDynamicControl()


        }

        function GetDynamicControl() {
            // Get Dynamic filter controls
            var _filter = {
                TaskName: "ArrangePickup",
                ProcessName: "ArrangePickup",
                // AppCode: appName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log('Empty Dynamic Control response');
                } else {
                    QuickViewCtrl.ePage.Masters.DynamicControl = response.data.Response;
                }
            });
        }



        Init();
    }
})();
