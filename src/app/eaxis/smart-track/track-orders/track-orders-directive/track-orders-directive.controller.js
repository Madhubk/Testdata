(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackOrderDirectiveController", TrackOrderDirectiveController);

    TrackOrderDirectiveController.$inject = ["$location", "helperService", "appConfig", "apiService"];

    function TrackOrderDirectiveController($location, helperService, appConfig, apiService) {
        var TrackOrderDirectiveCtrl = this;

        function Init() {
            var currentOrder = TrackOrderDirectiveCtrl.currentOrder[TrackOrderDirectiveCtrl.currentOrder.label].ePage.Entities;
            TrackOrderDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Orders_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };
            
            InitTrackOrders();
        }
        
        function InitTrackOrders() {
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder = {};
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.Data = TrackOrderDirectiveCtrl.ePage.Entities.Header.Data;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.SelectedShipmentRow = SelectedShipmentRow;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderShipment = TrackOrderShipment;

            TrackOrderContainer();
            TrackPorOrderLine();
        }

        function TrackPorOrderLine() {
            // OrderLine Grid Config
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackPorOrderLine = {};
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackPorOrderLine.gridConfig = TrackOrderDirectiveCtrl.ePage.Entities.TrackPorOrderLine.gridConfig;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackPorOrderLine.gridConfig.columnDef = TrackOrderDirectiveCtrl.ePage.Entities.TrackPorOrderLine.gridConfig.columnDef;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackPorOrderLine.GridData = [];

            apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url+TrackOrderDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                if (response.data.Response) {
                    TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackPorOrderLine.GridData = response.data.Response.UIPorOrderLines;
                    TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackPorOrderLine.GridData.map(function (value , key) {
                        value.RemainingQuantity = value.Quantity - value.RecievedQuantity;
                    })
                }
            });
        }
        
        function TrackOrderContainer() {
            // Container Grid Config
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer = {};
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer.gridConfig = TrackOrderDirectiveCtrl.ePage.Entities.TrackOrderContainer.gridConfig;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer.gridConfig.columnDef = TrackOrderDirectiveCtrl.ePage.Entities.TrackOrderContainer.gridConfig.columnDef;
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer.GridData = [];
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer.SelectedContainerRow = SelectedContainerRow;

            var _filter = {
                OrderRefKey : TrackOrderDirectiveCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.PK
            }
            var _input = {
                "searchInput" : helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderContainer.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderContainer.GridData = response.data.Response;
                }
            });
        }

        function SelectedContainerRow(item) {
            _queryString = {
                entity : item.data
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path('EA/smart-track/track-containers').search({item: _queryString});
        }

        function SelectedShipmentRow(SHP_FK) {
            TrackOrderDirectiveCtrl.ePage.Masters.TrackOrder.TrackOrderShipment = {};
            apiService.get("eAxisAPI", TrackOrderDirectiveCtrl.ePage.Entities.TrackOrderShipment.API.GetByID.Url + SHP_FK).then(function (response) {
                if (response.data.Response) {
                    TrackOrderShipment(response.data.Response);
                }
            })
        }

        function TrackOrderShipment(item) {
            _queryString = {
                entity : item
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path('EA/smart-track/track-shipments').search({item :_queryString});
        }

        Init();
    }
})();
