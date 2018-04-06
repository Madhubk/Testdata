(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackContainerDirectiveController", TrackContainerDirectiveController);

    TrackContainerDirectiveController.$inject = ["$location", "helperService", "appConfig", "apiService"];

    function TrackContainerDirectiveController($location, helperService, appConfig, apiService) {
        var TrackContainerDirectiveCtrl = this;

        function Init() {
            var currentContainer = TrackContainerDirectiveCtrl.currentContainer[TrackContainerDirectiveCtrl.currentContainer.label].ePage.Entities;
            TrackContainerDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Container_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentContainer
            };

            InitTrackContainers();
        }
        
        function InitTrackContainers() {
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer = {};
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.Data = TrackContainerDirectiveCtrl.ePage.Entities.Header.Data;

            // JobPackLines List
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.JobPackLines = {};
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.JobPackLines.GridData = [];

            // shipment list and grid config
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList = {};
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.GridData = [];
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.gridConfig = TrackContainerDirectiveCtrl.ePage.Entities.ShipmentHeader.gridConfig;
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.gridConfig.columnDef = TrackContainerDirectiveCtrl.ePage.Entities.ShipmentHeader.gridConfig.columnDef;
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.SelectedShipmentRow = SelectedShipmentRow;
            
            // Order list and grid config
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList = {};
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.GridData = [];
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.gridConfig = TrackContainerDirectiveCtrl.ePage.Entities.OrderHeader.gridConfig;
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.gridConfig.columnDef = TrackContainerDirectiveCtrl.ePage.Entities.OrderHeader.gridConfig.columnDef;
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.SelectedOrderRow = SelectedOrderRow;
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.Action = Action;
            
            TrackContainerPackage();
        }

        function Action(item) {
            if (item != null && undefined) {
                TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.selectedShipmentNo = item.ShipmentNo;
                GetShipmentDetails(item.PK);
            }
        }

        function TrackContainerPackage() {
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.TrackContainerPackage = {};
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.TrackContainerPackage.GridData = [];

            var _filter = {
                CNT_PK : TrackContainerDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer.PK
            }
            var _input = {
                "searchInput" : helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PkgCntMapping.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.PkgCntMapping.API.FindAll.Url, _input).then(function (response) {
                if(response.data.Response){
                    if (response.data.Response.length > 0 ) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.TrackContainerPackage.GridData = response.data.Response;
                        var _jobPackLineInput = CommaSeperatedFieldValueFromList(TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.TrackContainerPackage.GridData,'PKG')
                        JobPackLinesCall(_jobPackLineInput);
                    } 
                }           
            });
        }

        function JobPackLinesCall(input) {
            var _filter = {
                PK : input
            }
            var _input = {
                "searchInput" : helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if(response.data.Response){
                    if (response.data.Response.length > 0 ) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.JobPackLines.GridData = response.data.Response;
                        var _shipmentHeaderCallInput = CommaSeperatedFieldValueFromList(TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.JobPackLines.GridData,'SHP_FK')
                        ShipmentHeaderCall(_shipmentHeaderCallInput);
                    }
                }
            });
        }

        function GetShipmentDetails(shp_pk) {
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentGetList = {};

            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + shp_pk).then(function (response) {
                if (response.data.Response) {
                    TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentGetList = response.data.Response;
                }
            });
        }

        function ShipmentHeaderCall(shp_Fk) {
            var _filter = {
                PK : shp_Fk
            }
            var _input = {
                "searchInput" : helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                if(response.data.Response){
                    if (response.data.Response.length > 0) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.GridData = response.data.Response;
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.selectedShipmentNo = response.data.Response[0].ShipmentNo;
                        var _orderHeaderCallInput = CommaSeperatedFieldValueFromList(TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.GridData,'PK')
                        OrderDetails(_orderHeaderCallInput);
                        GetShipmentDetails(response.data.Response[0].PK);
                    } 
                }
            });
        }

        function OrderDetails(_orderPK) {
            var _filter = {
                SHP_FK : _orderPK
            }
            var _input = {
                "searchInput" : helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if(response.data.Response){
                    if (response.data.Response.length > 0) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.GridData = response.data.Response;
                    }
                }
            });
        }

        function CommaSeperatedFieldValueFromList(item,fieldName){
            var field = "";
            item.map(function(val,key){
                field +=val[fieldName]+','
            });
            return field.substring(0,field.length-1);
        }

        function SelectedShipmentRow(item) {
            _queryString = {
                entity : item.data
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path('EA/smart-track/track-shipments').search({item :_queryString});
        }

        function SelectedOrderRow(item) {
            _queryString = {
                entity : item.data
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path('EA/smart-track/track-orders').search({item :_queryString});
        }

        Init();
    }
})();
