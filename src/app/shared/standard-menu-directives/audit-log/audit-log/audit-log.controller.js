(function () {
    "use strict";

    angular
        .module("Application")
        .filter('toArray', function () {
            return function (obj) {
                if (!(obj instanceof Object)) return obj;
                return _.map(obj, function (val, key) {
                    return Object.defineProperty(val, '$key', {
                        __proto__: null,
                        value: key
                    });
                });
            }
        });


    angular
        .module("Application")
        .controller("AuditLogController", AuditLogController);

    AuditLogController.$inject = ["$filter", "authService", "apiService", "helperService", "appConfig", "auditLogConfig"];

    function AuditLogController($filter, authService, apiService, helperService, appConfig, auditLogConfig) {
        /* jshint validthis: true */
        var AuditLogCtrl = this;

        function Init() {
            AuditLogCtrl.ePage = {
                "Title": "",
                "Prefix": "Audit Log",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": AuditLogCtrl.input
            };

            if (AuditLogCtrl.ePage.Entities) {
                InitAuditLog();
            }
        }

        function InitAuditLog() {
            AuditLogCtrl.ePage.Masters.EmptyText = '-';
            AuditLogCtrl.ePage.Masters.AuditLog = {};
            AuditLogCtrl.ePage.Masters.AuditLog.Entity = AuditLogCtrl.entity;

            AuditLogCtrl.ePage.Masters.AuditLog.Fields = {};
            AuditLogCtrl.ePage.Masters.AuditLog.History = {};

            AuditLogCtrl.ePage.Masters.AuditLog.OnFieldClick = OnFieldClick;
            AuditLogCtrl.ePage.Masters.AuditLog.RelatedDetails = {};
            AuditLogCtrl.ePage.Masters.AuditLog.OnRelatedDetailsClick = OnRelatedDetailsClick;
            AuditLogCtrl.ePage.Masters.AuditLog.Refresh = Refresh;

            if (AuditLogCtrl.ePage.Masters.AuditLog.Entity) {
                AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity = AuditLogCtrl.ePage.Masters.AuditLog.Entity;

                GetFieldList();
            }
        }

        function GetFieldList() {
            AuditLogCtrl.ePage.Masters.AuditLog.Fields.ListSource = undefined;
            AuditLogCtrl.ePage.Masters.AuditLog.RelatedDetails.ListSource = undefined;
            AuditLogCtrl.ePage.Masters.AuditLog.History.ListSource = undefined;
            var _filter = {
                "ClassSource": AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.ClassSource,
                "ConfigType": "Audit",
                "EntitySource": AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.EntitySource,
                "EntityRefKey": AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.EntityRefKey,
                "EntityRefCode": AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.EntityRefCode
            };

            if (AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.IsParentEntityRefKey) {
                _filter.ParentEntityRefKey = AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.ParentEntityRefKey;
                _filter.ParentEntitySource = AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.ParentEntitySource;
                _filter.ParentEntityRefCode = AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.ParentEntityRefCode;
            }

            if (AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.IsAdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = AuditLogCtrl.ePage.Masters.AuditLog.Entity.ActiveEntity.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataConfig.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataConfig.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    if (_list.length > 0) {
                        _list.map(function (val, key) {
                            val.Fields = JSON.parse(val.Fields).Fields;
                            var _obj = {
                                "UIField": "All",
                                "DbField": undefined,
                                "IsCaptureDateTime": "false",
                                "RelatedDetails": []
                            };
                            val.Fields.push(_obj);
                            val.Fields.splice(0, 0, val.Fields.splice(val.Fields.length - 1, 1)[0]);
                        });
                        AuditLogCtrl.ePage.Masters.AuditLog.Fields.ListSource = _list[0].Fields;
                        AuditLogCtrl.ePage.Masters.AuditLog.Fields.FieldParent = _list[0];
                        OnFieldClick(AuditLogCtrl.ePage.Masters.AuditLog.Fields.ListSource[0]);
                    } else {
                        AuditLogCtrl.ePage.Masters.AuditLog.Fields.ListSource = [];
                        AuditLogCtrl.ePage.Masters.AuditLog.RelatedDetails.ListSource = [];
                        AuditLogCtrl.ePage.Masters.AuditLog.History.ListSource = [];
                    }
                } else {
                    AuditLogCtrl.ePage.Masters.AuditLog.Fields.ListSource = [];
                    AuditLogCtrl.ePage.Masters.AuditLog.RelatedDetails.ListSource = [];
                    AuditLogCtrl.ePage.Masters.AuditLog.History.ListSource = [];
                }
            });
        }

        function OnFieldClick($item) {
            AuditLogCtrl.ePage.Masters.AuditLog.Fields.ActiveField = $item;

            GetHistoryList(AuditLogCtrl.ePage.Masters.AuditLog.Fields.ActiveField);
        }

        function OnRelatedDetailsClick($item) {
            AuditLogCtrl.ePage.Masters.AuditLog.RelatedDetails.ActiveRelatedDetails = $item;

            GetHistoryList(AuditLogCtrl.ePage.Masters.AuditLog.RelatedDetails.ActiveRelatedDetails);
        }

        function Refresh(){
            GetHistoryList(AuditLogCtrl.ePage.Masters.AuditLog.Fields.ActiveField);
        }

        function GetHistoryList($item) {
            AuditLogCtrl.ePage.Masters.AuditLog.RelatedDetails.ListSource = undefined;
            AuditLogCtrl.ePage.Masters.AuditLog.History.ListSource = undefined;
            AuditLogCtrl.ePage.Masters.AuditLog.HistoryFields = undefined;

            var _filter = {
                "FieldName": $item.DbField,
                "ClassSource": AuditLogCtrl.ePage.Masters.AuditLog.Fields.FieldParent.ClassSource,
                "ConfigType": "Audit",
                "EntitySource": AuditLogCtrl.ePage.Entities.EntitySource,
                "EntityRefKey": AuditLogCtrl.ePage.Entities.EntityRefKey,
                "EntityRefCode": AuditLogCtrl.ePage.Entities.EntityRefCode
            };

            if (AuditLogCtrl.ePage.Masters.AuditLog.Fields.FieldParent.IsParentEntityRefKey) {
                _filter.ParentEntityRefKey = $item.ParentEntityRefKey;
                _filter.ParentEntitySource = $item.ParentEntitySource;
                _filter.ParentEntityRefCode = $item.ParentEntityRefCode;
            }

            if (AuditLogCtrl.ePage.Masters.AuditLog.Fields.FieldParent.IsAdditionalEntityRefKey) {
                _filter.AdditionalEntityRefKey = $item.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = $item.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = $item.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataAudit.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataAudit.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AuditLogCtrl.ePage.Masters.AuditLog.History.ListSource = response.data.Response;

                    if (AuditLogCtrl.ePage.Masters.AuditLog.History.ListSource.length > 0) {
                        var _groupBy = GroupByDate(angular.copy(AuditLogCtrl.ePage.Masters.AuditLog.History.ListSource), 'CreatedDateTime');
                        AuditLogCtrl.ePage.Masters.AuditLog.HistoryFields = _.groupBy(_groupBy, 'FormatedDate');
                    }
                } else {
                    AuditLogCtrl.ePage.Masters.AuditLog.History.ListSource = [];
                }
            });
        }

        function GroupByDate(arr, field) {
            if (arr) {
                arr.map(function (val, key) {
                    val.FormatedDate = $filter('date')(new Date(val[field]), 'dd-MMM-yyyy');
                });
            }
            return arr;
        }

        Init();
    }
})();
