(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVContainerViewController", SRVContainerViewController);

    SRVContainerViewController.$inject = ["$scope", "$location", "$injector", "apiService", "authService", "helperService", "toastr", "appConfig", "$uibModal", "three_TrackcontainerConfig", "confirmation", "freightApiConfig"];

    function SRVContainerViewController($scope, $location, $injector, apiService, authService, helperService, toastr, appConfig, $uibModal, three_TrackcontainerConfig, confirmation, freightApiConfig) {
        /* jshint validthis: true */
        var SRVContainerViewCtrl = this,
            _queryString = $location.search(),
            // Entity = $location.path().split("/").pop(),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVContainerViewCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVContainerViewCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };
            // save
            SRVContainerViewCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVContainerViewCtrl.ePage.Masters.IsDisableSave = false;
            SRVContainerViewCtrl.ePage.Masters.dataentryName = "TrackContainer";

            try {
                if (_queryString.q) {
                    SRVContainerViewCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_queryString.q));
                    InitSRVContainerView();
                }
            } catch (ex) {
                console.log(ex);
            }
        }

        function InitSRVContainerView() {
            // if (three_TrackcontainerConfig.TabList.length > 0) {
            //     var _isExist = three_TrackcontainerConfig.TabList.some(function (value, key) {
            //         return value.label === SRVContainerViewCtrl.ePage.Masters.Entity.ContainerNo;
            //     });

            //     if (_isExist) {
            //         three_TrackcontainerConfig.TabList.map(function (value, key) {
            //             if (value.label === SRVContainerViewCtrl.ePage.Masters.Entity.ContainerNo) {
            //                 SRVContainerViewCtrl.ePage.Masters.CurrentObj = value;
            //             }
            //         });
            //     } else {
            //         if (!SRVContainerViewCtrl.ePage.Masters.Entity.PK) {
            //             GetRecordDetails();
            //         } else {
            //             var _curRecord = {
            //                 PK: SRVContainerViewCtrl.ePage.Masters.Entity.PK
            //             };
            //             GetTabDetails(_curRecord);
            //         }
            //     }
            // } else {
            //     if (!SRVContainerViewCtrl.ePage.Masters.Entity.PK) {
            //         GetRecordDetails();
            //     } else {
            //         var _curRecord = {
            //             PK: SRVContainerViewCtrl.ePage.Masters.Entity.PK
            //         };
            //         GetTabDetails(_curRecord);
            //     }
            // }
            GetRecordDetails()
            GetDataEntryDetails();
        }

        function GetRecordDetails() {

            helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerCntContainer.API.GetById.Url, SRVContainerViewCtrl.ePage.Masters.Entity.PK).then(function (response) {
                if (response.data.Messages) {
                    response.data.Messages.map(function (value, key) {
                        if (value.Type === "Warning" && value.MessageDesc !== "") {
                            toastr.info(value.MessageDesc);
                        }
                    });
                }
                console.log(response.data)
                three_TrackcontainerConfig.Entities.Header.Data = response.data.Response.Response;

                var obj = {
                    [SRVContainerViewCtrl.ePage.Masters.Entity.ContainerNo]: {
                        ePage: three_TrackcontainerConfig
                    },
                    label: SRVContainerViewCtrl.ePage.Masters.Entity.ContainerNo,
                    isNew: false
                };
                SRVContainerViewCtrl.ePage.Masters.CurrentObj = obj;
                console.log(SRVContainerViewCtrl.ePage.Masters.CurrentObj)
            });
            // var _filter = {
            //     "PK": SRVContainerViewCtrl.ePage.Masters.Entity.PK,
            //     "SortColumn": "POH_OrderNo",
            //     "SortType": "DESC",
            //     "PageNumber": "1",
            //     "PageSize": 25,
            //     "OrderNo": SRVContainerViewCtrl.ePage.Masters.Entity.OrderNo
            // };
            // var _input = {
            //     "searchInput": helperService.createToArrayOfObject(_filter),
            //     "FilterID": appConfig.Entities.BuyerOrder.API.findall.FilterID
            // };

            // apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.findall.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         var _curRecord = response.data.Response[0];
            //         _curRecord.PAR_AccessCode = "1_1"
            //         GetTabDetails(_curRecord);
            //     } else {
            //         toastr.error("Empty Response");
            //     }
            // });
        }

        function GetTabDetails(curRecord) {
            // GetRelatedLookupList();

            var currentObj;
            three_TrackcontainerConfig.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVContainerViewCtrl.ePage.Masters.Entity.ContainerNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVContainerViewCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                }
            });
        }

        function GetDataEntryDetails() {
            SRVContainerViewCtrl.ePage.Masters.DynamicList = {};
            SRVContainerViewCtrl.ePage.Masters.DynamicList.Filter = {};
            var _filter = {
                DataEntryName: SRVContainerViewCtrl.ePage.Masters.dataentryName,
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
                        SRVContainerViewCtrl.ePage.Masters.DynamicList.DataEntry = response.data.Response;

                        GetRelatedLookupList();

                        if (SRVContainerViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI) {
                            if (SRVContainerViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI.indexOf("@") !== -1) {
                                var _filterAPI = angular.copy(SRVContainerViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI).split("/");

                                _filterAPI.map(function (value, key) {
                                    if (value.indexOf("@") !== -1) {
                                        _filterAPI[key] = authService.getUserInfo()[_filterAPI[key].slice(1)];
                                    }
                                });

                                SRVContainerViewCtrl.ePage.Masters.DynamicList.DataEntry.FilterAPI = _filterAPI.join("/");
                            }
                        }

                        var _colList = [];
                        SRVContainerViewCtrl.ePage.Masters.DynamicList.DataEntry.GridConfig.Header.map(function (value, key) {
                            if (!value.IsVisible && value.IsMandatory) {
                                _colList.push(value);
                            } else if (value.IsVisible) {
                                _colList.push(value);
                            }
                        });
                        SRVContainerViewCtrl.ePage.Masters.DataEntryObject = SRVContainerViewCtrl.ePage.Masters.DynamicList.DataEntry;
                    } else {
                        SRVContainerViewCtrl.ePage.Masters.DynamicList.IsEmptyDataEntryName = true;
                    }
                }
            });
        }

        function GetRelatedLookupList() {
            var _filter = {
                PageFK: SRVContainerViewCtrl.ePage.Masters.DynamicList.DataEntry.DataEntry_PK,
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