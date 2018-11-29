(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVOrderViewController", SRVOrderViewController);

    SRVOrderViewController.$inject = ["$scope", "$location", "$injector", "apiService", "authService", "helperService", "toastr", "appConfig", "$uibModal", "one_order_listConfig", "confirmation"];

    function SRVOrderViewController($scope, $location, $injector, apiService, authService, helperService, toastr, appConfig, $uibModal, one_order_listConfig, confirmation) {
        /* jshint validthis: true */
        var SRVOrderViewCtrl = this,
            Entity = $location.path().split("/").pop(),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVOrderViewCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVOrderViewCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVOrderViewCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };
            // save
            SRVOrderViewCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVOrderViewCtrl.ePage.Masters.IsDisableSave = false;
            SRVOrderViewCtrl.ePage.Masters.dataentryName = "OrderHeaderBuyer";

            InitSRVOrderView();
        }

        function InitSRVOrderView() {
            if (one_order_listConfig.TabList.length > 0) {
                var _isExist = one_order_listConfig.TabList.some(function (value, key) {
                    return value.label === SRVOrderViewCtrl.ePage.Masters.Entity.OrderNo;
                });

                if (_isExist) {
                    one_order_listConfig.TabList.map(function (value, key) {
                        if (value.label === SRVOrderViewCtrl.ePage.Masters.Entity.OrderNo) {
                            SRVOrderViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVOrderViewCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVOrderViewCtrl.ePage.Masters.Entity.PK,
                            OrderCumSplitNo: SRVOrderViewCtrl.ePage.Masters.Entity.OrderNo,
                            PAR_AccessCode: SRVOrderViewCtrl.ePage.Masters.Entity.PAR_AccessCode
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVOrderViewCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVOrderViewCtrl.ePage.Masters.Entity.PK,
                        OrderCumSplitNo: SRVOrderViewCtrl.ePage.Masters.Entity.OrderNo,
                        PAR_AccessCode: SRVOrderViewCtrl.ePage.Masters.Entity.PAR_AccessCode
                    };
                    GetTabDetails(_curRecord);
                }
            }
            GetDataEntryDetails();
        }

        function GetRecordDetails() {
            var _filter = {
                "PK": SRVOrderViewCtrl.ePage.Masters.Entity.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "OrderNo": SRVOrderViewCtrl.ePage.Masters.Entity.OrderNo
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
            // GetRelatedLookupList();

            var currentObj;
            one_order_listConfig.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVOrderViewCtrl.ePage.Masters.Entity.OrderNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVOrderViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        function GetDataEntryDetails() {
            SRVOrderViewCtrl.ePage.Masters.DynamicList = {};
            SRVOrderViewCtrl.ePage.Masters.DynamicList.Filter = {};
            var _filter = {
                DataEntryName: SRVOrderViewCtrl.ePage.Masters.dataentryName,
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
                        SRVOrderViewCtrl.ePage.Masters.DynamicList.DataEntry = response.data.Response;

                        GetRelatedLookupList();

                        if (SRVOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI) {
                            if (SRVOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI.indexOf("@") !== -1) {
                                var _filterAPI = angular.copy(SRVOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI).split("/");

                                _filterAPI.map(function (value, key) {
                                    if (value.indexOf("@") !== -1) {
                                        _filterAPI[key] = authService.getUserInfo()[_filterAPI[key].slice(1)];
                                    }
                                });

                                SRVOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI = _filterAPI.join("/");
                            }
                        }

                        var _colList = [];
                        SRVOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header.map(function (value, key) {
                            if (!value.IsVisible && value.IsMandatory) {
                                _colList.push(value);
                            } else if (value.IsVisible) {
                                _colList.push(value);
                            }
                        });
                        SRVOrderViewCtrl.ePage.Masters.DataEntryObject = SRVOrderViewCtrl.ePage.Masters.DynamicList.DataEntry;
                    } else {
                        SRVOrderViewCtrl.ePage.Masters.DynamicList.IsEmptyDataEntryName = true;
                    }
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                PageFK: SRVOrderViewCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
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