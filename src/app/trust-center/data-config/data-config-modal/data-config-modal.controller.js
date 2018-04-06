(function () {
    'use strict'
    angular.module("Application")
        .controller("DataConfigModalController", DataConfigModalController);

    DataConfigModalController.$inject = ["apiService", "helperService", "appConfig", "param", "$uibModalInstance"];

    function DataConfigModalController(apiService, helperService, appConfig, param, $uibModalInstance) {
        /* jshint validthis: true */
        var DataConfigModalCtrl = this;

        function Init() {
            DataConfigModalCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataConfigModal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            DataConfigModalCtrl.ePage.Masters.DataConfig = angular.copy(param.dataconfig);
            DataConfigModalCtrl.ePage.Masters.DataConfig.Fields = {};
            DataConfigModalCtrl.ePage.Masters.selectedFieldList = [];
            DataConfigModalCtrl.ePage.Masters.IsSelectAllFields = false;

            DataConfigModalCtrl.ePage.Masters.Cancel = Cancel;
            DataConfigModalCtrl.ePage.Masters.OK = OK;

            if (DataConfigModalCtrl.ePage.Masters.DataConfig.ConfigType === "Audit") {
                InitAudit();
            } else if (DataConfigModalCtrl.ePage.Masters.DataConfig.ConfigType === "Event") {
                InitEvent();
            }
        }

        // =========================Audit Start=============================
        function InitAudit() {
            DataConfigModalCtrl.ePage.Masters.Audit = {};

            DataConfigModalCtrl.ePage.Masters.Audit.OnAuditSelectAllFields = OnAuditSelectAllFields;
            DataConfigModalCtrl.ePage.Masters.Audit.OnAuditSingleSelectFields = OnAuditSingleSelectFields;

            GetFieldlist();
        }

        function OnAuditSelectAllFields() {
            DataConfigModalCtrl.ePage.Masters.FieldListSource.map(function (val, key) {
                var _index = DataConfigModalCtrl.ePage.Masters.selectedFieldList.map(function (value, key) {
                    return value.DBField;
                }).indexOf(val.DBField);

                if (DataConfigModalCtrl.ePage.Masters.IsSelectAllFields) {
                    DataConfigModalCtrl.ePage.Masters.FieldListSource.map(function (val, key) {
                        if (_index === -1) {
                            DataConfigModalCtrl.ePage.Masters.selectedFieldList.push(val);
                        }
                    });
                } else {
                    if (_index !== -1) {
                        DataConfigModalCtrl.ePage.Masters.selectedFieldList.splice(_index, 1)
                    }
                }
            });
        }

        function OnAuditSingleSelectFields($Event, field) {
            var checkbox = $Event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            var _index = DataConfigModalCtrl.ePage.Masters.selectedFieldList.map(function (value, key) {
                return value.DbField;
            }).indexOf(field.DbField);

            if (action === 'add' && _index === -1) {
                DataConfigModalCtrl.ePage.Masters.selectedFieldList.push(field);
            } else if (action === 'remove' && _index !== -1) {
                DataConfigModalCtrl.ePage.Masters.selectedFieldList.splice(DataConfigModalCtrl.ePage.Masters.selectedFieldList.indexOf(field), 1);
            }
        }
        // ================================Audit End===================================

        // =============================Event Start====================================
        function InitEvent() {
            DataConfigModalCtrl.ePage.Masters.Event = {};

            DataConfigModalCtrl.ePage.Masters.Event.OnEventSelectAllFields = OnEventSelectAllFields;
            DataConfigModalCtrl.ePage.Masters.Event.OnEventSingleSelect = OnEventSingleSelect;
            DataConfigModalCtrl.ePage.Masters.Event.EventActiveField = EventActiveField;

            GetFieldlist();
        }

        function OnEventSelectAllFields() {
            DataConfigModalCtrl.ePage.Masters.FieldListSource.map(function (val, key) {
                var _index = DataConfigModalCtrl.ePage.Masters.selectedFieldList.map(function (value, key) {
                    return value.DBField;
                }).indexOf(val.DBField);

                if (DataConfigModalCtrl.ePage.Masters.IsSelectAllFields) {
                    DataConfigModalCtrl.ePage.Masters.FieldListSource.map(function (val, key) {
                        if (_index === -1) {
                            DataConfigModalCtrl.ePage.Masters.selectedFieldList.push(val);
                        }
                    });
                } else {
                    if (_index !== -1) {
                        DataConfigModalCtrl.ePage.Masters.selectedFieldList.splice(_index, 1)
                    }
                }
            });
        }

        function OnEventSingleSelect($event, field) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            var _index = DataConfigModalCtrl.ePage.Masters.selectedFieldList.map(function (value, key) {
                return value.DbField;
            }).indexOf(field.DbField);
            if (action === 'add' && _index === -1) {
                DataConfigModalCtrl.ePage.Masters.selectedFieldList.push(field);
            } else if (action === 'remove' && _index !== -1) {
                DataConfigModalCtrl.ePage.Masters.selectedFieldList.splice(_index, 1);
            }
        }

        function EventActiveField(field, fieldlist) {
            fieldlist.map(function (value, key) {
                value.IsActiveField = false;
            });
            field.IsActiveField = true;
        }

        // =============================== Event End ============================

        function GetFieldlist() {
            var _filter = {
                "TableName": DataConfigModalCtrl.ePage.Masters.DataConfig.ClassSource,
                "SAP_FK": param.AppPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TableColumn.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TableColumn.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    DataConfigModalCtrl.ePage.Masters.FieldListSource = [];
                    DataConfigModalCtrl.ePage.Masters.RelatedDetails = [];

                    if (response.data.Response.length > 0) {
                        if (DataConfigModalCtrl.ePage.Masters.DataConfig.ConfigType === "Event") {
                            response.data.Response.map(function (val, key) {
                                var _eventDetails = {
                                    "UIField": val.ColumnName.substring(4),
                                    "DbField": val.ColumnName,
                                };
                                DataConfigModalCtrl.ePage.Masters.RelatedDetails.push(_eventDetails)
                            });
                        }

                        response.data.Response.map(function (val, key) {
                            if (DataConfigModalCtrl.ePage.Masters.DataConfig.ConfigType === "Event") {
                                var _event = {
                                    "UIField": val.ColumnName.substring(4),
                                    "DbField": val.ColumnName,
                                    "ISCaptureDateTime": false,
                                    "IsActiveField": false,
                                    "RelatedDetails": angular.copy(DataConfigModalCtrl.ePage.Masters.RelatedDetails)
                                };

                                DataConfigModalCtrl.ePage.Masters.FieldListSource.push(_event);
                            } else if (DataConfigModalCtrl.ePage.Masters.DataConfig.ConfigType === "Audit") {
                                var _audit = {
                                    "UIField": val.ColumnName.substring(4),
                                    "DbField": val.ColumnName,
                                    "ISCaptureDateTime": false,
                                    "IsSelected": false,
                                    "RelatedDetails": []
                                };

                                DataConfigModalCtrl.ePage.Masters.FieldListSource.push(_audit);
                            }
                        });
                    }
                }
            });
        }

        function OK() {
            var _input = [];

            if (DataConfigModalCtrl.ePage.Masters.DataConfig.ConfigType === "Event") {
                DataConfigModalCtrl.ePage.Masters.selectedFieldList.map(function (value1, key1) {
                    _input[key1] = angular.copy(value1);
                    _input[key1].RelatedDetails = [];
                    value1.RelatedDetails.map(function (value2, key2) {
                        if (value2.IsActive) {
                            _input[key1].RelatedDetails.push(value2);
                        }
                    });
                });
            } else if (DataConfigModalCtrl.ePage.Masters.DataConfig.ConfigType === "Audit") {
                _input = DataConfigModalCtrl.ePage.Masters.selectedFieldList;
            }

            DataConfigModalCtrl.ePage.Masters.DataConfig.Fields = {
                "AllFields": "false",
                "Fields": _input
            };

            DataConfigModalCtrl.ePage.Masters.DataConfig.Fields = JSON.stringify(DataConfigModalCtrl.ePage.Masters.DataConfig.Fields);

            var _exports = {
                Data: DataConfigModalCtrl.ePage.Masters.DataConfig
            };

            $uibModalInstance.close(_exports);
        }

        function Cancel() {
            $uibModalInstance.dismiss('close');
        }

        Init();
    }

})();
