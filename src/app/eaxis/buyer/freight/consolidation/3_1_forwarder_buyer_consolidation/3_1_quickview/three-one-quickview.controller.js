(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneQuickViewController", ThreeOneQuickViewController);

    ThreeOneQuickViewController.$inject = ["apiService", "helperService", "appConfig"];

    function ThreeOneQuickViewController(apiService, helperService, appConfig) {
        /* jshint validthis: true */
        var ThreeOneQuickViewCtrl = this;

        function Init() {
            var currentObj = ThreeOneQuickViewCtrl.obj[ThreeOneQuickViewCtrl.obj.label].ePage.Entities;
            ThreeOneQuickViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_ThreeOneQuickView",
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
                    ThreeOneQuickViewCtrl.ePage.Masters.DynamicControl = response.data.Response;
                }
            });
        }



        Init();
    }
})();