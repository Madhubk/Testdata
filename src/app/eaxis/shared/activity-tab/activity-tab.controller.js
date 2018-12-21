(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTabController", ActivityTabController);

    ActivityTabController.$inject = ["helperService", "authService"];

    function ActivityTabController(helperService, authService) {
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
            ActivityTabCtrl.ePage.Masters.ActivityTab.List = ActivityTabCtrl.taskList;

            ActivityTabCtrl.ePage.Masters.EditActivity = EditActivity;
            ActivityTabCtrl.ePage.Masters.AssignStartCompleteResponse = AssignStartCompleteResponse;
            ActivityTabCtrl.ePage.Masters.IsShowEditActivityPage = false;
            ActivityTabCtrl.ePage.Masters.OnTaskComplete = Close;
        }

        function EditActivity($item) {
            ActivityTabCtrl.ePage.Masters.EditActivityItem = $item;
            ActivityTabCtrl.ePage.Masters.IsShowEditActivityPage = true;
        }

        function Close($item) {
            ActivityTabCtrl.ePage.Masters.IsShowEditActivityPage = false;      
            var y=$item;
            if (y.IsCompleted) {
                var _index = ActivityTabCtrl.ePage.Masters.ActivityTab.List.map(function (value, key) {
                    return value.PK;
                }).indexOf(y.Item.PK);
                if (_index != -1) {
                    ActivityTabCtrl.ePage.Masters.ActivityTab.List.splice(_index, 1);
                    ActivityTabCtrl.ePage.Masters.ActivityTab.ListCount = ActivityTabCtrl.ePage.Masters.ActivityTab.ListCount - 1;
                }
            }
            
           }

        function AssignStartCompleteResponse($item, y) {
            for (var x in $item) {
                if ($item[x] != null && $item[x] != undefined) {
                    if (x == "OtherConfig" || x == "RelatedProcess") {
                        if (typeof $item[x] == "string") {
                            $item[x] = JSON.parse($item[x]);
                        }
                    }
                    y[x] = $item[x];
                }
            }

            // Remove From List.. When Task Assigned to Others
            if (y.Status == "ASSIGNED" && y.Performer != authService.getUserInfo().UserId) {
                var _index = ActivityTabCtrl.ePage.Masters.ActivityTab.List.map(function (value, key) {
                    return value.PK;
                }).indexOf(y.PK);
                if (_index != -1) {
                    ActivityTabCtrl.ePage.Masters.ActivityTab.List.splice(_index, 1);
                    ActivityTabCtrl.ePage.Masters.ActivityTab.ListCount = ActivityTabCtrl.ePage.Masters.ActivityTab.ListCount - 1;
                }
            }

            y.IsChanged = true;
        }

        Init();
    }
})();
