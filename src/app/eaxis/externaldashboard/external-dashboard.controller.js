(function () {
    "use strict";

    angular
        .module("Application")
        .controller("externalDashboardController", ExternalDashboardController);

    ExternalDashboardController.$inject = ["$window", "authService", "apiService", "helperService", "appConfig", "externalDashboardConfig", "$location"];

    function ExternalDashboardController($window, authService, apiService, helperService, appConfig, externalDashboardConfig, $location) {
        /* jshint validthis: true */
        var ExternalDashboardCtrl = this;

        function Init() {
            ExternalDashboardCtrl.ePage = {
                "Title": "",
                "Prefix": "Custom_Dashboard",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": externalDashboardConfig.Entities
            };

            ExternalDashboardCtrl.ePage.Masters.Import = {};
            ExternalDashboardCtrl.ePage.Masters.Export = {};
            ExternalDashboardCtrl.ePage.Masters.WareHouse = {};
            // functions
            ExternalDashboardCtrl.ePage.Masters.Import.UploadPurchaseOrder = UploadPurchaseOrder;

            // date & week calculation
            ExternalDashboardCtrl.ePage.Masters.ThisWeekStart = helperService.DateFilter('@@@ThisWeek_From');
            ExternalDashboardCtrl.ePage.Masters.ThisWeekEnd = helperService.DateFilter('@@@ThisWeek_To');
            ExternalDashboardCtrl.ePage.Masters.NextWeekStart = helperService.DateFilter('@@@NextWeek_From');
            ExternalDashboardCtrl.ePage.Masters.NextWeekEnd = helperService.DateFilter('@@@NextWeek_To');
            ExternalDashboardCtrl.ePage.Masters.LastWeekStart = helperService.DateFilter('@@@LastWeek_From');
            ExternalDashboardCtrl.ePage.Masters.LastWeekEnd = helperService.DateFilter('@@@LastWeek_To');
            console.log(ExternalDashboardCtrl.ePage.Entities)

            ImportDepart()
            ImportArrival()
            // ShipmentHaederFind()

            CFXMenuVisible()
            CheckUserBasedMenuVisibleType()
        }
        // ------------------Import Shipment Departed/Departing start---------------------
        function ImportDepart() {
            // body...
            ExternalDashboardCtrl.ePage.Masters.Import.Depart = {};
            ExternalDashboardCtrl.ePage.Masters.Import.Depart.LastWeekCount = 0;
            ExternalDashboardCtrl.ePage.Masters.Import.Depart.ThisWeekCount = 0;
            ExternalDashboardCtrl.ePage.Masters.Import.Depart.NextWeekCount = 0;

            LastWeekDeptImportCount()
            ThisWeekDeptImportCount()
            NextWeekDeptImportCount()
        }

        function UploadPurchaseOrder() {
            // body...
            $location.path('/EA/pobatchupload');
        }
        // Departure Last Week Count Function
        function LastWeekDeptImportCount() {
            // body...
            var _filter = {
                "ETDFrom" : ExternalDashboardCtrl.ePage.Masters.LastWeekStart,
                "ETDTo" : ExternalDashboardCtrl.ePage.Masters.LastWeekEnd,
                "ATDFrom" : ExternalDashboardCtrl.ePage.Masters.LastWeekStart,
                "ATDTo" : ExternalDashboardCtrl.ePage.Masters.LastWeekEnd
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExternalDashboardCtrl.ePage.Masters.Import.Depart.LastWeekCount = response.data.Response;
                }
            });
        }
        /*function ShipmentHaederFind() {
            // body...
            // Get Shipment Details
            var _inputPackType = {
                "searchInput": [],
                "FilterID": ExternalDashboardCtrl.ePage.Entities.Header.API.FindAll.FilterID
            };
            apiService.post('eAxisAPI', ExternalDashboardCtrl.ePage.Entities.Header.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    
                }
            });
        }*/
        // Departure This Week Count Function
        function ThisWeekDeptImportCount() {
            // body...
            var _filter = {
                "ETDFrom" : ExternalDashboardCtrl.ePage.Masters.ThisWeekStart,
                "ETDTo" : ExternalDashboardCtrl.ePage.Masters.ThisWeekEnd,
                "ATDFrom" : ExternalDashboardCtrl.ePage.Masters.ThisWeekStart,
                "ATDTo" : ExternalDashboardCtrl.ePage.Masters.ThisWeekEnd
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExternalDashboardCtrl.ePage.Masters.Import.Depart.ThisWeekCount = response.data.Response;
                }
            });
            
        }
        // Departure Next Week Count Function
        function NextWeekDeptImportCount(){
            // body
            var _filter = {
                "ETDFrom" : ExternalDashboardCtrl.ePage.Masters.NextWeekStart,
                "ETDTo" : ExternalDashboardCtrl.ePage.Masters.NextWeekEnd,
                "ATDFrom" : ExternalDashboardCtrl.ePage.Masters.NextWeekStart,
                "ATDTo" : ExternalDashboardCtrl.ePage.Masters.NextWeekEnd
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExternalDashboardCtrl.ePage.Masters.Import.Depart.NextWeekCount = response.data.Response;
                }
            });
        }
        // ------------ end --------------

        // ------------Import Shipment Arriver/Arrival start-------------------
        function ImportArrival() {
            // body...
            ExternalDashboardCtrl.ePage.Masters.Import.Arrival = {};
            ExternalDashboardCtrl.ePage.Masters.Import.Arrival.LastWeekCount = 0;
            ExternalDashboardCtrl.ePage.Masters.Import.Arrival.ThisWeekCount = 0;

            ThisWeekArrivalCount()
            LastWeekArrivalCount()
        }
        // Arrival This Week Count Function
        function ThisWeekArrivalCount() {
            // body...
            var _filter = {
                "ETAFrom" : ExternalDashboardCtrl.ePage.Masters.ThisWeekStart,
                "ETATo" : ExternalDashboardCtrl.ePage.Masters.ThisWeekEnd,
                "ATAFrom" : ExternalDashboardCtrl.ePage.Masters.ThisWeekStart,
                "ATATo" : ExternalDashboardCtrl.ePage.Masters.ThisWeekEnd
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    console.log(response.data.Response)
                    ExternalDashboardCtrl.ePage.Masters.Import.Arrival.ThisWeekCount = response.data.Response;
                }
            });
        }
        // Arrival Last Week Count Function
        function LastWeekArrivalCount() {
            // body...
            var _filter = {
                "ETAFrom" : ExternalDashboardCtrl.ePage.Masters.LastWeekStart,
                "ETATo" : ExternalDashboardCtrl.ePage.Masters.LastWeekEnd,
                "ATAFrom" : ExternalDashboardCtrl.ePage.Masters.LastWeekStart,
                "ATATo" : ExternalDashboardCtrl.ePage.Masters.LastWeekEnd
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.FilterID
            }
            apiService.post('eAxisAPI', ExternalDashboardCtrl.ePage.Entities.Header.API.FindCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExternalDashboardCtrl.ePage.Masters.Import.Arrival.LastWeekCount = response.data.Response;
                }
            });
        }
        function CFXMenuVisible() {
            // body...

            var _filter = {
                "USR_TenantCode": authService.getUserInfo().TenantCode,
                "USR_UserName": authService.getUserInfo().UserId,
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "PageType": "ShortCut"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "CFXMENU"
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    for (i=0; i < response.data.Response.length; i++) {
                            if (response.data.Response[i].Code === "EA_EXTERNAL_DASHBOARD") {
                                console.log(response.data.Response[i].MenuList)
                                ExternalDashboardCtrl.ePage.Masters.ShortCutVisible = response.data.Response[i].MenuList;
                                ExternalDashboardCtrl.ePage.Masters.ShortCutVisible.map(function (value , key) {
                                    // body...
                                    if (value.MenuName === "importdashboard") {
                                        ExternalDashboardCtrl.ePage.Masters.ImportDashboard = value.Description;
                                    }
                                    if (value.MenuName === "exportdashboard") {
                                        ExternalDashboardCtrl.ePage.Masters.ExportDashboard = value.Description;
                                    }
                                    if (value.MenuName === "warehousedashboard") {
                                        ExternalDashboardCtrl.ePage.Masters.WarehouseDashboard = value.Description;
                                    }                                
                                });
                            }
                        }
                }
            });
        }
        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                // "EntitySource": "USER",
                "AppCode": authService.getUserInfo().AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _value = JSON.parse(response.data.Response[0].Value);
                        ExternalDashboardCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        Init();
    }

})();
