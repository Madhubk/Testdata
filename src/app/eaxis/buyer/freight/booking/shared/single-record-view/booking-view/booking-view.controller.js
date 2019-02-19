(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVBookingViewController", SRVBookingViewController);

    SRVBookingViewController.$inject = ["$location", "$injector", "apiService", "authService", "helperService", "toastr", "appConfig", "three_TrackshipmentConfig", "freightApiConfig"];

    function SRVBookingViewController($location, $injector, apiService, authService, helperService, toastr, appConfig, three_TrackshipmentConfig, freightApiConfig) {
        /* jshint validthis: true */
        var SRVBookingViewCtrl = this,
            _queryString = $location.search(),
            // Entity = $location.path().split("/").pop(),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVBookingViewCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVBookingViewCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };
            SRVBookingViewCtrl.ePage.Masters.dataentryName = "BPShipmentSearch";
            try {
                if (_queryString.q) {
                    SRVBookingViewCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_queryString.q));
                    if (SRVBookingViewCtrl.ePage.Masters.Entity.ParentEntityRefCode) {
                        SRVBookingViewCtrl.ePage.Masters.Entity.ShipmentNo = SRVBookingViewCtrl.ePage.Masters.Entity.ParentEntityRefCode;
                        SRVBookingViewCtrl.ePage.Masters.Entity.PK = SRVBookingViewCtrl.ePage.Masters.Entity.ParentEntityRefKey;
                    }
                    InitSRVBookingView();
                }
            } catch (ex) {
                console.log(ex);
            }

            GetDataEntryDetails();
        }

        function InitSRVBookingView() {
            if (three_TrackshipmentConfig.TabList.length > 0) {
                var _isExist = three_TrackshipmentConfig.TabList.some(function (value, key) {
                    return value.label === SRVBookingViewCtrl.ePage.Masters.Entity.ShipmentNo;
                });

                if (_isExist) {
                    three_TrackshipmentConfig.TabList.map(function (value, key) {
                        if (value.label === SRVBookingViewCtrl.ePage.Masters.Entity.ShipmentNo) {
                            SRVBookingViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVBookingViewCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVBookingViewCtrl.ePage.Masters.Entity.PK,
                            ShipmentNo: SRVBookingViewCtrl.ePage.Masters.Entity.ShipmentNo
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVBookingViewCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVBookingViewCtrl.ePage.Masters.Entity.PK,
                        ShipmentNo: SRVBookingViewCtrl.ePage.Masters.Entity.ShipmentNo
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }

        function GetRecordDetails() {
            var _filter = {
                "PK": SRVBookingViewCtrl.ePage.Masters.Entity.PK,
                "SortColumn": "SHP_ShipmentNo",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25
                // "ShipmentNo": SRVBookingViewCtrl.ePage.Masters.Entity.ShipmentNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": freightApiConfig.Entities.shipmentheaderbuyer.API.findall.FilterID
            };

            apiService.post("eAxisAPI", freightApiConfig.Entities.shipmentheaderbuyer.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
            // GetRelatedLookupList();
            var currentObj;
            three_TrackshipmentConfig.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVBookingViewCtrl.ePage.Masters.Entity.ShipmentNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVBookingViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        function GetDataEntryDetails() {
            SRVBookingViewCtrl.ePage.Masters.DynamicList = {};
            SRVBookingViewCtrl.ePage.Masters.DynamicList.Filter = {};
            var _filter = {
                DataEntryName: SRVBookingViewCtrl.ePage.Masters.dataentryName,
                IsRoleBassed: false,
                IsAccessBased: false
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);
                    if (!_isEmpty) {
                        if (response.data.Response.LookUpList) {
                            dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response.LookUpList);
                        }
                        SRVBookingViewCtrl.ePage.Masters.DynamicList.DataEntry = response.data.Response;

                        GetRelatedLookupList();

                        if (SRVBookingViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI) {
                            if (SRVBookingViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI.indexOf("@") !== -1) {
                                var _filterAPI = angular.copy(SRVBookingViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI).split("/");

                                _filterAPI.map(function (value, key) {
                                    if (value.indexOf("@") !== -1) {
                                        _filterAPI[key] = authService.getUserInfo()[_filterAPI[key].slice(1)];
                                    }
                                });

                                SRVBookingViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI = _filterAPI.join("/");
                            }
                        }

                        var _colList = [];
                        SRVBookingViewCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header.map(function (value, key) {
                            if (!value.IsVisible && value.IsMandatory) {
                                _colList.push(value);
                            } else if (value.IsVisible) {
                                _colList.push(value);
                            }
                        });
                        SRVBookingViewCtrl.ePage.Masters.DataEntryObject = SRVBookingViewCtrl.ePage.Masters.DynamicList.DataEntry;
                    } else {
                        SRVBookingViewCtrl.ePage.Masters.DynamicList.IsEmptyDataEntryName = true;
                    }
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                PageFK: SRVBookingViewCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        Init();
    }
})();