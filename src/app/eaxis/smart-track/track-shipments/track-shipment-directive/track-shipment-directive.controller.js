(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackShipmentDirectiveController", TrackShipmentDirectiveController);

    TrackShipmentDirectiveController.$inject = ["$location", "helperService", "appConfig", "apiService"];

    function TrackShipmentDirectiveController($location, helperService, appConfig, apiService) {
        var TrackShipmentDirectiveCtrl = this;

        function Init() {
            var currentShipment = TrackShipmentDirectiveCtrl.currentShipment[TrackShipmentDirectiveCtrl.currentShipment.label].ePage.Entities;
            TrackShipmentDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_Shipments_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            InitTrackShipment();
        }

        function InitTrackShipment() {
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment = {};
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.Data = TrackShipmentDirectiveCtrl.ePage.Entities.Header.Data;

            // Order Grid Config
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder = {};
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder.gridConfig = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentOrder.Grid.GridConfig;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder.gridConfig.columnDef = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentOrder.Grid.ColumnDef;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder.GridData = [];
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder.SelectedOrder = SelectedOrder;

            // Container Grid Config
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer = {};
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer.gridConfig = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentContainer.Grid.GridConfig;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer.gridConfig.columnDef = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentContainer.Grid.ColumnDef;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer.SelectedContaierRow = SelectedContaierRow;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer.GridData = [];

            // Consol Grid Config OR Routing Legs
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol = {};
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.gridConfig = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentConsol.Grid.GridConfig;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.gridConfig.columnDef = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentConsol.Grid.ColumnDef;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.GridData = [];

            TrackShipmentOrder();
            TrackShipmentConsolMapping();
            TrackShipmentPackage();
        }

        function TrackShipmentPackage() {
            // Package Grid Config
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentPackage = {};
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentPackage.gridConfig = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentPackage.Grid.GridConfig;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentPackage.gridConfig.columnDef = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentPackage.Grid.ColumnDef;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentPackage.GridData = [];

            var _filter = {
                SHP_FK: TrackShipmentDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if(response.data.Response.length > 0) {
                        TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentPackage.GridData = response.data.Response;
                    }
                }
            });
        }

        function TrackShipmentConsolMapping() {
            var _filter = {
                SHP_FK: TrackShipmentDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol = {};
                TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.GridData = [];
                if(response.data.Response){
                    if (response.data.Response.length > 0) {
                        TrackShipmentConsol(response.data.Response);
                    }
                }
            });
        }

        function TrackShipmentConsol(data) {
            // Consol Grid Config
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol = {};
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.gridConfig = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentConsol.Grid.GridConfig;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.gridConfig.columnDef = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentConsol.Grid.ColumnDef;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.GridData = [];

            var _filter = {
                PK: data[0].CON_FK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ConConsolHeader.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.ConConsolHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.GridData = response.data.Response;
                        TrackShipmentContainer(response.data.Response);
                        TrackShipmentRouting(response.data.Response);
                    }
                }
            });
        }

        function TrackShipmentRouting(data) {
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.Routing = appConfig.Entities.JobRoutes;

            var _filter = {
                EntityRefKey: data[0].PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "JOBROUT"
            }

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if(response.data.Response){
                    if (response.data.Response.length > 0) {
                        for (i = 0; i < response.data.Response.length; i++) {
                            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentConsol.GridData.map(function (value, key) {
                                if (value.PK == response.data.Response[i].EntityRefKey) {
                                    value.ATA = response.data.Response[i].ATA;
                                    value.ATD = response.data.Response[i].ATD;
                                    value.ETA = response.data.Response[i].ETA;
                                    value.ETD = response.data.Response[i].ETD;
                                    value.ETA = response.data.Response[i].ETA;
                                    value.LegOrder = response.data.Response[i].LegOrder;
                                    value.TransportType = response.data.Response[i].TransportType;
                                    value.Vessel = response.data.Response[i].Vessel;
                                    value.VoyageFlight = response.data.Response[i].VoyageFlight;
                                }
                            })
                        }
                    }
                }
            });
        }

        function TrackShipmentContainer(data) {
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer = {};
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer.gridConfig = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentContainer.Grid.GridConfig;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer.gridConfig.columnDef = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentContainer.Grid.ColumnDef;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer.GridData = [];
            var _filter = {
                CON_FK: data[0].PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentContainer.GridData = response.data.Response;
                }
            });
        }

        function TrackShipmentOrder() {
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder = {};
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder.gridConfig = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentOrder.Grid.GridConfig;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder.gridConfig.columnDef = TrackShipmentDirectiveCtrl.ePage.Entities.TrackShipmentOrder.Grid.ColumnDef;
            TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder.GridData = [];

            var _filter = {
                SHP_FK: TrackShipmentDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TrackShipmentDirectiveCtrl.ePage.Masters.TrackShipment.TrackShipmentOrder.GridData = response.data.Response;
                }
            });
        }

        function SelectedOrder(item) {
            debugger
            _queryString = {
                entity: item
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path("EA/smart-track/track-orders").search({ item: _queryString });
        }

        function SelectedContaierRow(item) {
            _queryString = {
                entity: item.data
            };
            var _queryString = helperService.encryptData(_queryString);
            $location.path("EA/smart-track/track-containers").search({ item: _queryString });
        }

        Init();
    }
})();
