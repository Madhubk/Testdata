(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVDeliveryOrderViewController", SRVDeliveryOrderViewController);

    SRVDeliveryOrderViewController.$inject = ["$location", "$injector", "apiService", "authService", "helperService", "toastr", "appConfig", "one_order_listConfig"];

    function SRVDeliveryOrderViewController($location, $injector, apiService, authService, helperService, toastr, appConfig, one_order_listConfig) {
        /* jshint validthis: true */
        var SRVDeliveryOrderViewCtrl = this,
            _queryString = $location.search(),
            // Entity = $location.path().split("/").pop(),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVDeliveryOrderViewCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVDeliveryOrderViewCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };
            // save
            SRVDeliveryOrderViewCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVDeliveryOrderViewCtrl.ePage.Masters.IsDisableSave = false;
            SRVDeliveryOrderViewCtrl.ePage.Masters.dataentryName = "BPOrderHeaderBuyer";
            SRVDeliveryOrderViewCtrl.ePage.Masters.IsLoading = true;

            try {
                if (_queryString.q) {
                    SRVDeliveryOrderViewCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_queryString.q));
                    SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PAR_AccessCode = "1_1";
                    if (SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.ParentEntityRefCode) {
                        SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.OrderCumSplitNo = SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.ParentEntityRefCode;
                        SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PK = SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.ParentEntityRefKey;
                    }
                    InitSRVDeliveryOrderView();
                }
            } catch (ex) {
                console.log(ex);
            }

            GetDataEntryDetails();
        }

        function InitSRVDeliveryOrderView() {
            if (one_order_listConfig.TabList.length > 0) {
                var _isExist = one_order_listConfig.TabList.some(function (value, key) {
                    return value.label === SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.OrderCumSplitNo;
                });

                if (_isExist) {
                    one_order_listConfig.TabList.map(function (value, key) {
                        if (value.label === SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.OrderCumSplitNo) {
                            SRVDeliveryOrderViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PK,
                            OrderCumSplitNo: SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.OrderCumSplitNo,
                            PAR_AccessCode: SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PAR_AccessCode
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PK,
                        OrderCumSplitNo: SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.OrderCumSplitNo,
                        PAR_AccessCode: SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PAR_AccessCode
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }

        function GetRecordDetails() {
            var _filter = {
                "PK": SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25
                // "OrderNo": SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.OrderNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerOrder.API.findall.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _curRecord = response.data.Response[0];
                    _curRecord.PAR_AccessCode = "1_1"
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
            var currentObj;
            one_order_listConfig.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVDeliveryOrderViewCtrl.ePage.Masters.Entity.OrderCumSplitNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVDeliveryOrderViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                        SRVDeliveryOrderViewCtrl.ePage.Masters.IsLoading = false;
                    });
                }
            });
        }

        function GetDataEntryDetails() {
            SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList = {};
            SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.Filter = {};
            var _filter = {
                DataEntryName: SRVDeliveryOrderViewCtrl.ePage.Masters.dataentryName,
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
                        SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.DataEntry = response.data.Response;

                        GetRelatedLookupList();

                        if (SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI) {
                            if (SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI.indexOf("@") !== -1) {
                                var _filterAPI = angular.copy(SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI).split("/");

                                _filterAPI.map(function (value, key) {
                                    if (value.indexOf("@") !== -1) {
                                        _filterAPI[key] = authService.getUserInfo()[_filterAPI[key].slice(1)];
                                    }
                                });

                                SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI = _filterAPI.join("/");
                            }
                        }

                        var _colList = [];
                        SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header.map(function (value, key) {
                            if (!value.IsVisible && value.IsMandatory) {
                                _colList.push(value);
                            } else if (value.IsVisible) {
                                _colList.push(value);
                            }
                        });
                        SRVDeliveryOrderViewCtrl.ePage.Masters.DataEntryObject = SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.DataEntry;
                    } else {
                        SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.IsEmptyDataEntryName = true;
                    }
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                PageFK: SRVDeliveryOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
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