/*
    Page : Cargo Pickup
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InformationSummaryController", InformationSummaryController);

    InformationSummaryController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "$filter"];

    function InformationSummaryController($scope, apiService, helperService, appConfig, myTaskActivityConfig, $filter) {
        var InformationSummaryCtrl = this;

        function Init() {
            InformationSummaryCtrl.ePage = {
                "Title": "",
                "Prefix": "Information_Summary",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            
            InformationSummaryCtrl.ePage.Masters.emptyText = "-";
            if (myTaskActivityConfig.Entities.Shipment)
                InformationSummaryCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
            if (myTaskActivityConfig.Entities.Consol)
                InformationSummaryCtrl.ePage.Entities.Header.ConsolData = myTaskActivityConfig.Entities.Consol[myTaskActivityConfig.Entities.Consol.label].ePage.Entities.Header.Data;
            if (myTaskActivityConfig.Entities.Inward)
                InformationSummaryCtrl.ePage.Entities.Header.InwardData = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;

            InformationSummaryCtrl.ePage.Masters.DataEntryDetails = $filter('filter')(myTaskActivityConfig.Entities.TaskConfigData, { Category: 'Summary' })
            if (InformationSummaryCtrl.ePage.Masters.DataEntryDetails.length > 0)
                GetDynamicControl();
        }

        function GetDynamicControl() {
            // Get Dynamic filter controls
            InformationSummaryCtrl.ePage.Masters.DynamicControl = undefined;

            var _filter = {
                DataEntryName: InformationSummaryCtrl.ePage.Masters.DataEntryDetails[0].Code
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    InformationSummaryCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    if (myTaskActivityConfig.Entities.TaskObj.EntitySource == "SHP")
                        InformationSummaryCtrl.ePage.Masters.DynamicControl.Entities[0].Data = InformationSummaryCtrl.ePage.Entities.Header.Data.UIShipmentHeader;
                    if (myTaskActivityConfig.Entities.TaskObj.EntitySource == "CON")
                        InformationSummaryCtrl.ePage.Masters.DynamicControl.Entities[0].Data = InformationSummaryCtrl.ePage.Entities.Header.ConsolData.UIConConsolHeader;
                    if (myTaskActivityConfig.Entities.TaskObj.EntitySource == "INW" || myTaskActivityConfig.Entities.TaskObj.EntitySource == "WMS")
                        InformationSummaryCtrl.ePage.Masters.DynamicControl.Entities[0].Data = InformationSummaryCtrl.ePage.Entities.Header.InwardData.UIWmsInwardHeader;
                }
            });
        }
        Init();
    }
})();