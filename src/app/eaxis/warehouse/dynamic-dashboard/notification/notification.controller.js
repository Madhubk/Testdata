(function () {
    "use strict";

    angular
        .module("Application")
        .controller("NotificationController", NotificationController);

    NotificationController.$inject = ["$rootScope", "$scope", "authService", "apiService", "appConfig", "helperService", "warehouseConfig", "dynamicDashboardConfig"];

    function NotificationController($rootScope, $scope, authService, apiService, appConfig, helperService, warehouseConfig, dynamicDashboardConfig) {

        var NotificationCtrl = this;

        function Init() {


            NotificationCtrl.ePage = {
                "Title": "",
                "Prefix": "Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": '',
            };
            NotificationCtrl.ePage.Masters.WarehouseChanged = WarehouseChanged;

            GetWarehouseValues();
            if (NotificationCtrl.selectedComponent.ComponentName == "My Task")
                GetTaskDetails();
            if (NotificationCtrl.selectedComponent.ComponentName == "Exception")
                GetExceptionDetails();
            if (NotificationCtrl.selectedComponent.ComponentName == "Asn Received Chart") {
                if (NotificationCtrl.selectedComponent.SetAsDefault) {
                    GetAsnReceivedStatusDetails();
                    NotificationCtrl.ePage.Masters.IsLoad = true;
                } else {
                    NotificationCtrl.ePage.Masters.IsLoad = false;
                }
                // GetChart();
            }

        }

        function GetAsnReceivedStatusDetails() {
            NotificationCtrl.ePage.Masters.IsLoad = true;
            var _filter = {
                "WarehouseCode": NotificationCtrl.selectedWarehouse.WarehouseCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": dynamicDashboardConfig.Entities.WmsOutward.API.GetOutBoundDetails.FilterID
            };

            apiService.post("eAxisAPI", dynamicDashboardConfig.Entities.WmsOutward.API.GetOutBoundDetails.Url, _input).then(function (response) {
                if (response.data.Response) {
                    NotificationCtrl.ePage.Masters.OpenSODetails = response.data.Response;
                    GetChart();
                }
            });
        }

        function GetChart() {
            var w = 200;
            var h = 200;
            var r = h / 2;
            var color = d3.scale.category10();

            var data = NotificationCtrl.ePage.Masters.OpenSODetails;

            var vis = d3.select('#chart').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
            var pie = d3.layout.pie().value(function (d) { return d.UnFinalisedCount; });

            // declare an arc generator function
            var arc = d3.svg.arc().outerRadius(r);

            // select paths, use arc generator to draw
            var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
            arcs.append("svg:path")
                .attr("fill", function (d, i) {
                    data[i].color = color(i);
                    return color(i);
                })
                .attr("d", function (d) {
                    // log the result of the arc generator to show how cool it is :)
                    return arc(d);
                });

            // add the text
            arcs.append("svg:text").attr("transform", function (d) {
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";
            }).attr("text-anchor", "middle").text(function (d, i) {
                return;
            }
            );

        }

        function GetWarehouseValues() {
            //Get Warehouse Details
            var _input = {
                "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID,
                "SearchInput": []
            };

            apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    NotificationCtrl.ePage.Masters.WarehouseDetails = response.data.Response;
                    NotificationCtrl.ePage.Masters.userselected = NotificationCtrl.ePage.Masters.WarehouseDetails[0];
                    WarehouseChanged();
                }
            });
        }

        function WarehouseChanged() {
            if (NotificationCtrl.selectedComponent.ComponentName == "Notification")
                GetNotificationValues();
            if (NotificationCtrl.selectedComponent.ComponentName == "KPI")
                GetKPIValues();
        }

        function GetNotificationValues() {
            NotificationCtrl.ePage.Masters.NotificationDashboardDetails = [];
            var _input = {
                "SourceEntityRefKey": "WMSDashboardNotifications",
                "RelatedDetails": [{
                    "UIField": "TGP_War_WarehouseCode",
                    "DbField": "TGP_War_WarehouseCode",
                    "Value": NotificationCtrl.ePage.Masters.userselected.WarehouseCode
                }]
            };

            apiService.post("eAxisAPI", warehouseConfig.Entities.Header.API.FindAllCommonDashboard.Url, _input).then(function (response) {
                if (response.data.Response.QOutput) {
                    NotificationCtrl.ePage.Masters.NotificationDashboardDetails = response.data.Response.QOutput;
                }
            });

        }

        function GetKPIValues() {
            NotificationCtrl.ePage.Masters.KPIDashboardDetails = [];
            var _input = {
                "SourceEntityRefKey": "WMSDashboardKPI",
                "RelatedDetails": [{
                    "UIField": "TGP_War_WarehouseCode",
                    "DbField": "TGP_War_WarehouseCode",
                    "Value": NotificationCtrl.ePage.Masters.userselected.WarehouseCode
                }]
            };

            apiService.post("eAxisAPI", warehouseConfig.Entities.Header.API.FindAllCommonDashboard.Url, _input).then(function (response) {
                if (response.data.Response.QOutput) {
                    NotificationCtrl.ePage.Masters.KPIDashboardDetails = response.data.Response.QOutput;
                }
            });
        }



        function GetTaskDetails() {
            NotificationCtrl.ePage.Masters.WorkItemList = [];
            var _filter = {
                PivotCount: "0",
                TenantCode: authService.getUserInfo().TenantCode,
                Performer: authService.getUserInfo().UserId
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllStatusCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllStatusCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    NotificationCtrl.ePage.Masters.WorkItemList = response.data.Response;
                }

            });
        }

        function GetExceptionDetails() {
            NotificationCtrl.ePage.Masters.ExceptionList = [];
            var _filter = {
                "EntitySource": 'TMS'
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobException.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobException.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    NotificationCtrl.ePage.Masters.ExceptionList = response.data.Response;
                }
            });
        }

        Init();
    }

})();