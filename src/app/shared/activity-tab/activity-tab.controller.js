(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTabController", ActivityTabController);

    ActivityTabController.$inject = ["helperService"];

    function ActivityTabController(helperService) {
        /* jshint validthis: true */
        var ActivityTabCtrl = this;
        
        if (ActivityTabCtrl.obj.label != undefined) {
            var currentObj = ActivityTabCtrl.obj[ActivityTabCtrl.obj.label].ePage.Entities;
        } else {
            var currentObj = ActivityTabCtrl.obj;
        }
        function Init() {
            ActivityTabCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashbaord",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            ActivityTabCtrl.ePage.Masters.ActivityTab = {};
            ActivityTabCtrl.ePage.Masters.ActivityTab.List = ActivityTabCtrl.tabList;
        }
        Init();
    }
})();