(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardMyTaskController", OutwardMyTaskController);

    OutwardMyTaskController.$inject = ["helperService", "appConfig", "apiService", "authService"];

    function OutwardMyTaskController(helperService, appConfig, apiService, authService) {
        /* jshint validthis: true */
        var OutwardMyTaskCtrl = this;

        function Init() {
            var currentObj = OutwardMyTaskCtrl.currentOutward[OutwardMyTaskCtrl.currentOutward.label].ePage.Entities;

            OutwardMyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentObj
            };
            OutwardMyTaskCtrl.ePage.Masters.MyTask = {};

            GetTaskList();
        }

        function GetTaskList() {

            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                Status: "AVAILABLE,ASSIGNED",
                EntityRefKey: OutwardMyTaskCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: OutwardMyTaskCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OutwardMyTaskCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    angular.forEach(OutwardMyTaskCtrl.ePage.Masters.MyTask.ListSource, function (value, key) {
                        var _arr = [];
                        if (value.OtherConfig) {
                            if (typeof value.OtherConfig == "string") {
                                value.OtherConfig = JSON.parse(value.OtherConfig);
                            }
                            if (value.OtherConfig) {
                                if (value.OtherConfig.Directives) {
                                    var _index = value.OtherConfig.Directives.ListPage.indexOf(",");
                                    if (_index != -1) {
                                        var _split = value.OtherConfig.Directives.ListPage.split(",");

                                        if (_split.length > 0) {
                                            _split.map(function (value, key) {
                                                var _index = _arr.map(function (value1, key1) {
                                                    return value1;
                                                }).indexOf(value);
                                                if (_index == -1) {
                                                    _arr.push(value);
                                                }
                                            });
                                        }
                                    } else {
                                        var _index = _arr.indexOf(value.OtherConfig.Directives.ListPage);
                                        if (_index == -1) {
                                            _arr.push(value.OtherConfig.Directives.ListPage);
                                        }
                                    }
                                }
                            }
                        }
                    });
                } else {
                    OutwardMyTaskCtrl.ePage.Masters.MyTask.ListSource = [];
                }
            });
        }

        Init();
    }
})();
