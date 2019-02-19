(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVShipmentViewController", SRVShipmentViewController);

    SRVShipmentViewController.$inject = ["$location", "$injector", "apiService", "authService", "helperService", "toastr", "appConfig", "three_TrackshipmentConfig", "freightApiConfig"];

    function SRVShipmentViewController($location, $injector, apiService, authService, helperService, toastr, appConfig, three_TrackshipmentConfig, freightApiConfig) {
        /* jshint validthis: true */
        var SRVShipmentViewCtrl = this,
            _queryString = $location.search(),
            // Entity = $location.path().split("/").pop(),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVShipmentViewCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVShipmentViewCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };
            SRVShipmentViewCtrl.ePage.Masters.dataentryName = "BPShipmentSearch";
            try {
                if (_queryString.q) {
                    SRVShipmentViewCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_queryString.q));
                    if (SRVShipmentViewCtrl.ePage.Masters.Entity.ParentEntityRefCode) {
                        SRVShipmentViewCtrl.ePage.Masters.Entity.ShipmentNo = SRVShipmentViewCtrl.ePage.Masters.Entity.ParentEntityRefCode;
                        SRVShipmentViewCtrl.ePage.Masters.Entity.PK = SRVShipmentViewCtrl.ePage.Masters.Entity.ParentEntityRefKey;
                    }
                    if (SRVShipmentViewCtrl.ePage.Masters.Entity.EntityRefCode) {
                        SRVShipmentViewCtrl.ePage.Masters.Entity.ShipmentNo = SRVShipmentViewCtrl.ePage.Masters.Entity.EntityRefCode;
                        SRVShipmentViewCtrl.ePage.Masters.Entity.PK = SRVShipmentViewCtrl.ePage.Masters.Entity.EntityRefKey;
                    }
                    InitSRVShipmentView();
                }
            } catch (ex) {
                console.log(ex);
            }

            GetDataEntryDetails();
        }

        function InitSRVShipmentView() {
            if (three_TrackshipmentConfig.TabList.length > 0) {
                var _isExist = three_TrackshipmentConfig.TabList.some(function (value, key) {
                    return value.label === SRVShipmentViewCtrl.ePage.Masters.Entity.ShipmentNo;
                });

                if (_isExist) {
                    three_TrackshipmentConfig.TabList.map(function (value, key) {
                        if (value.label === SRVShipmentViewCtrl.ePage.Masters.Entity.ShipmentNo) {
                            SRVShipmentViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVShipmentViewCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVShipmentViewCtrl.ePage.Masters.Entity.PK,
                            ShipmentNo: SRVShipmentViewCtrl.ePage.Masters.Entity.ShipmentNo
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVShipmentViewCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVShipmentViewCtrl.ePage.Masters.Entity.PK,
                        ShipmentNo: SRVShipmentViewCtrl.ePage.Masters.Entity.ShipmentNo
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }

        function GetRecordDetails() {
            var _filter = {
                "PK": SRVShipmentViewCtrl.ePage.Masters.Entity.PK,
                "SortColumn": "SHP_ShipmentNo",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25
                // "ShipmentNo": SRVShipmentViewCtrl.ePage.Masters.Entity.ShipmentNo
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
                        if (value.label === SRVShipmentViewCtrl.ePage.Masters.Entity.ShipmentNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVShipmentViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        function GetDataEntryDetails() {
            SRVShipmentViewCtrl.ePage.Masters.DynamicList = {};
            SRVShipmentViewCtrl.ePage.Masters.DynamicList.Filter = {};
            var _filter = {
                DataEntryName: SRVShipmentViewCtrl.ePage.Masters.dataentryName,
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
                        SRVShipmentViewCtrl.ePage.Masters.DynamicList.DataEntry = response.data.Response;

                        GetRelatedLookupList();

                        if (SRVShipmentViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI) {
                            if (SRVShipmentViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI.indexOf("@") !== -1) {
                                var _filterAPI = angular.copy(SRVShipmentViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI).split("/");

                                _filterAPI.map(function (value, key) {
                                    if (value.indexOf("@") !== -1) {
                                        _filterAPI[key] = authService.getUserInfo()[_filterAPI[key].slice(1)];
                                    }
                                });

                                SRVShipmentViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI = _filterAPI.join("/");
                            }
                        }

                        var _colList = [];
                        SRVShipmentViewCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header.map(function (value, key) {
                            if (!value.IsVisible && value.IsMandatory) {
                                _colList.push(value);
                            } else if (value.IsVisible) {
                                _colList.push(value);
                            }
                        });
                        SRVShipmentViewCtrl.ePage.Masters.DataEntryObject = SRVShipmentViewCtrl.ePage.Masters.DynamicList.DataEntry;
                    } else {
                        SRVShipmentViewCtrl.ePage.Masters.DynamicList.IsEmptyDataEntryName = true;
                    }
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                PageFK: SRVShipmentViewCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
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