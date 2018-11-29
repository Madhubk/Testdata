(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVReceiveLinesController", SRVReceiveLinesController);

    SRVReceiveLinesController.$inject = ["$rootScope", "$scope", "$location", "$timeout", "$injector", "APP_CONSTANT", "authService", "apiService", "helperService", "toastr", "appConfig"];

    function SRVReceiveLinesController($rootScope, $scope, $location, $timeout, $injector, APP_CONSTANT, authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SRVReceiveLinesCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("manifestConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVReceiveLinesCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVReceiveLinesCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVReceiveLinesCtrl.ePage.Masters.TempEntity = angular.copy(SRVReceiveLinesCtrl.ePage.Masters.Entity);
            SRVReceiveLinesCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SRVReceiveLinesCtrl.ePage.Masters.IsLoading = false;
            SRVReceiveLinesCtrl.ePage.Masters.Norecord = false;

            try {
                if (SRVReceiveLinesCtrl.ePage.Masters.Entity.PK == null) {
                    // OpenNewManifestItem();
                } else {
                    InitManifestItem(SRVReceiveLinesCtrl.ePage.Masters.Entity, false);
                }
            } catch (error) {
                console.log(error);
            }

            SRVReceiveLinesCtrl.ePage.Masters.emptyText = "-";

            SRVReceiveLinesCtrl.ePage.Masters.GetManifestDetails = GetManifestDetails;
            SRVReceiveLinesCtrl.ePage.Masters.Save = Save;
        }

        function GetManifestDetails(ManifestNumber) {
            Config.TabList = [];
            SRVReceiveLinesCtrl.ePage.Masters.CurrentObj = undefined;
            SRVReceiveLinesCtrl.ePage.Masters.IsLoading = true;

            var _filter = {
                "ManifestNumber": ManifestNumber
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSMAN"
            };
            apiService.post("eAxisAPI", "TmsManifest/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        SRVReceiveLinesCtrl.ePage.Masters.Entity = {
                            "PK": response.data.Response[0].PK,
                            "ManifestNumber": response.data.Response[0].ManifestNumber
                        }
                        InitManifestItem(SRVReceiveLinesCtrl.ePage.Masters.Entity, false);
                        SRVReceiveLinesCtrl.ePage.Masters.Norecord = false;
                    } else {
                        SRVReceiveLinesCtrl.ePage.Masters.IsLoading = false;
                        SRVReceiveLinesCtrl.ePage.Masters.Norecord = true;
                    }
                }
            });
        }

        function Save(receiveline) {
            var $item = SRVReceiveLinesCtrl.ePage.Masters.CurrentObj;
            var _Data = SRVReceiveLinesCtrl.ePage.Masters.CurrentObj[SRVReceiveLinesCtrl.ePage.Masters.CurrentObj.label].ePage.Entities,
                _input = _Data.Header.Data;

            _input.TmsManifestItem = receiveline;

            var count = 0;

            angular.forEach(_input.TmsManifestItem, function (value, key) {
                if (value.DeliveryDateTime) {
                    count = count + 1;
                }
            });
            if (count == _input.TmsManifestItem.length) {
                _input.TmsManifestHeader.ActualDeliveryDate = new Date();
            }
            var item = filterObjectUpdate(_input, "IsModified");
            apiService.post("eAxisAPI", 'TmsManifestList/Update', _input).then(function (response) {
                if (response.data.Response) {
                    GetManifestDetails(response.data.Response.Response.TmsManifestHeader.ManifestNumber);
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function InitManifestItem(currentManifest, IsNew) {
            SRVReceiveLinesCtrl.ePage.Masters.currentManifest = undefined;

            var _isExist = Config.TabList.some(function (value) {
                if (!IsNew) {
                    return value.label === SRVReceiveLinesCtrl.ePage.Masters.Entity.ManifestNumber;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                SRVReceiveLinesCtrl.ePage.Masters.IsTabClick = true;
                var _currentManifest = undefined;
                if (!IsNew) {
                    _currentManifest = currentManifest;
                } else {
                    _currentManifest = currentManifest;
                }
                GetTabDetails(_currentManifest, IsNew)
            } else {
                toastr.info('Item already opened ');
            }
        }
        // Get DataEntryNameList 
        function GetDynamicLookupConfig() {
            var _filter = {
                pageName: 'OrganizationList,TransportItem'
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

        function GetTabDetails(curRecord, IsNew) {

            GetDynamicLookupConfig();
            var currentObj;
            Config.GetTabDetails(curRecord, IsNew).then(function (response) {
                SRVReceiveLinesCtrl.ePage.Masters.TabList = response;
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVReceiveLinesCtrl.ePage.Masters.Entity.ManifestNumber) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVReceiveLinesCtrl.ePage.Masters.CurrentObj = value;
                            SRVReceiveLinesCtrl.ePage.Masters.ProcessInfo = SRVReceiveLinesCtrl.ePage.Masters.CurrentObj[SRVReceiveLinesCtrl.ePage.Masters.CurrentObj.label].ePage.Entities.Header.Data.ProcessInfo[0];
                            SRVReceiveLinesCtrl.ePage.Masters.TmsManifestItem = SRVReceiveLinesCtrl.ePage.Masters.CurrentObj[SRVReceiveLinesCtrl.ePage.Masters.CurrentObj.label].ePage.Entities.Header.Data.TmsManifestItem;
                            SRVReceiveLinesCtrl.ePage.Masters.IsLoading = false;
                        }
                    });
                }
            });
        }
        Init();
    }
})();
