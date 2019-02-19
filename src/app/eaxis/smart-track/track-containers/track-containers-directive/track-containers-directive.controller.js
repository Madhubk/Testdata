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
            console.log(TrackContainerDirectiveCtrl.ePage.Entities);
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
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.GridData1 = [];
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.SelectedShipmentRow = SelectedShipmentRow;
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.Action = Action;

            // Order list and grid config
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList = {};
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.GridData = [];
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.SelectedOrderRow = SelectedOrderRow;
            TrackContainerPackage();
        }

        function Action(item) {
            if (item != null || undefined) {
                TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.selectedShipmentNo = item.ShipmentNo;
                GetShipmentGrid(item.PK);
            }
        }

        function TrackContainerPackage() {
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.TrackContainerPackage = {};
            TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.TrackContainerPackage.GridData = [];

            var _filter = {
                CNT_PK: TrackContainerDirectiveCtrl.ePage.Entities.Header.Data.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PkgCntMapping.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.PkgCntMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.TrackContainerPackage.GridData = response.data.Response;
                        var _jobPackLineInput = CommaSeperatedFieldValueFromList(TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.TrackContainerPackage.GridData, 'PKG')
                        JobPackLinesCall(_jobPackLineInput);
                    }
                }
            });
        }

        function JobPackLinesCall(input) {
            var _filter = {
                PKS: input
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.JobPackLines.GridData = response.data.Response;
                        var _shipmentHeaderCallInput = CommaSeperatedFieldValueFromList(TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.JobPackLines.GridData, 'SHP_FK')
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
                    GetOrderGrid(response.data.Response.UIShipmentHeader.PK);
                }
            });
        }

        function ShipmentHeaderCall(shp_Fk) {
            var _filter = {
                SHP_PKS: shp_Fk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.GridData = response.data.Response;
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.GridData1.push(response.data.Response[0]);
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.selectedShipmentNo = response.data.Response[0].ShipmentNo;
                        // var _orderHeaderCallInput = CommaSeperatedFieldValueFromList(TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.GridData, 'PK')
                        // OrderDetails(_orderHeaderCallInput);
                        // GetOrderGrid(response.data.Response[0].PK);
                        GetShipmentDetails(response.data.Response[0].PK);
                    }
                }
            });
        }

        function GetShipmentGrid(shp_Fk) {
            var _filter = {
                SHP_PKS: shp_Fk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.ShipmentList.GridData1 = response.data.Response;
                        GetShipmentDetails(response.data.Response[0].PK);
                    }
                }
            });
        }

        function GetOrderGrid(_shpPK) {
            var _filter = {
                SHP_FK: _shpPK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.GridData = response.data.Response;
                    }
                }
            });
        }

        function OrderDetails(_orderPK) {
            var _filter = {
                POH_PKS: _orderPK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackContainerDirectiveCtrl.ePage.Masters.TrackContainer.OrderList.GridData = response.data.Response;
                    }
                }
            });
        }

        function CommaSeperatedFieldValueFromList(item, fieldName) {
            var field = "";
            item.map(function (val, key) {
                field += val[fieldName] + ','
            });
            return field.substring(0, field.length - 1);
        }

        function SelectedShipmentRow(item) {
            _queryString = {
                entity: item.data
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path('EA/smart-track/track-shipments').search({
                item: _queryString
            });
        }

        function SelectedOrderRow(item) {
            _queryString = {
                entity: item.data
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path('EA/smart-track/track-orders').search({
                item: _queryString
            });
        }
        
        Init();
    }
})();