(function () {
    'use strict';

    angular
        .module("Application")
        .factory("errorWarningService", ErrorWarningService);

    ErrorWarningService.$inject = ["$q", "helperService", "appConfig", "authService", "apiService", "toastr", "APP_CONSTANT"];

    function ErrorWarningService($q, helperService, appConfig, authService, apiService, toastr, APP_CONSTANT) {
        let exports = {
            Modules: {},
            GetErrorCodeList: GetErrorCodeList,
            OnFieldValueChange: OnFieldValueChange,
            GetErrorWarningCountParent: GetErrorWarningCountParent,
            SubmitErrorLengthCheck: SubmitErrorLengthCheck,
            ValidateValue: ValidateValue
        };

        return exports;

        function GetErrorCodeList($item) {
            let _deferred = $q.defer();
            AddModule($item).then(response => {
                if ($item.API == "Validation") {
                    GetValidationListUsingValidationFindAll($item).then(response => {
                        _deferred.resolve(response);
                    });
                } else if ($item.API == "Group") {
                    GetValidationListUsingValidationByGroup($item).then(response => {
                        _deferred.resolve(response);
                    });
                }
            });

            return _deferred.promise;
        }

        function AddModule($item) {
            let _deferred = $q.defer();
            $item.ModuleName.map(value1 => {
                if (!exports.Modules[value1] || $item.IsReset) {
                    exports.Modules[value1] = {
                        ErrorCodeList: [],
                        Entity: {}
                    };
                }

                $item.Code.map(value2 => {
                    if (!exports.Modules[value1].Entity[value2] || $item.IsReset) {
                        exports.Modules[value1].Entity[value2] = {
                            GlobalErrorWarningList: []
                        };
                    }
                });
            });

            _deferred.resolve(exports.Modules);
            return _deferred.promise;
        }

        function GetValidationListUsingValidationFindAll($item) {
            let _deferred = $q.defer();
            let _item = angular.copy($item);
            let _filter = _item.FilterInput;
            _filter.IsClient = true;
            _filter.TenantCode = authService.getUserInfo().TenantCode;
            _filter.SAP_FK = authService.getUserInfo().AppPK;
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.FindAll.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    response.data.Response.map(value1 => {
                        _item.ModuleName.map(value2 => {
                            if (!exports.Modules[value2].ErrorCodeList) {
                                exports.Modules[value2].ErrorCodeList = [];
                            }

                            if (exports.Modules[value2].ErrorCodeList.length > 0) {
                                let _isExist = exports.Modules[value2].ErrorCodeList.some(value3 => (value1.PK === value3.PK && value1.VLG_FK === value3.VLG_FK));

                                if (!_isExist) {
                                    exports.Modules[value2].ErrorCodeList.push(value1);
                                }
                            } else {
                                exports.Modules[value2].ErrorCodeList.push(value1);
                            }
                        });
                    });
                    _deferred.resolve(response.data.Response);
                } else {
                    _deferred.resolve([]);
                }
            });

            return _deferred.promise;
        }

        function GetValidationListUsingValidationByGroup($item) {
            let _deferred = $q.defer();
            let _item = angular.copy($item);
            let _filter = {
                MappingCode: "VLG_VLD",
                Code_1: _item.GroupCode,
                RelatedBasicDetails: _item.RelatedBasicDetails,
                SAP_FK: authService.getUserInfo().AppPK,
                TenantCode: authService.getUserInfo().TenantCode
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.ValidationByGroup.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.ValidationByGroup.Url, _input).then(response => {
                if (response.data.Response && response.data.Response.length > 0) {
                    response.data.Response.map(value1 => {
                        _item.ModuleName.map(value2 => {
                            if (!exports.Modules[value2].ErrorCodeList) {
                                exports.Modules[value2].ErrorCodeList = [];
                            }

                            if (exports.Modules[value2].ErrorCodeList.length > 0) {
                                let _isExist = exports.Modules[value2].ErrorCodeList.some(value3 => (value1.PK === value3.PK && value1.VLG_FK === value3.VLG_FK));

                                if (!_isExist) {
                                    exports.Modules[value2].ErrorCodeList.push(value1);
                                }
                            } else {
                                exports.Modules[value2].ErrorCodeList.push(value1);
                            }
                        });
                    });
                    _deferred.resolve(response.data.Response);
                } else {
                    _deferred.resolve();
                }
            });

            return _deferred.promise;
        }

        function ValidateValue($item) {
            let _item = angular.copy($item);
            _item.ModuleName.map(value1 => {
                if (exports.Modules[value1].ErrorCodeList.length > 0) {
                    if (_item.ErrorCode && _item.ErrorCode.length > 0) {
                        _item.ErrorCode.map(value2 => {
                            let _index = exports.Modules[value1].ErrorCodeList.findIndex(value => value.Code === value2);

                            if (_index != -1) {
                                if (exports.Modules[value1].ErrorCodeList[_index].Expression && exports.Modules[value1].ErrorCodeList[_index].IsClient) {
                                    _item.Value = exports.Modules[value1].ErrorCodeList[_index];
                                    EvaluateExpression(_item);
                                }
                            }
                        });
                    } else {
                        if (_item.GroupCode) {
                            exports.Modules[value1].ErrorCodeList.map(value2 => {
                                if (value2.Expression && value2.IsClient && _item.GroupCode == value2.VLG_Code) {
                                    _item.Value = value2;
                                    EvaluateExpression(_item);
                                }
                            });
                        } else {
                            exports.Modules[value1].ErrorCodeList.map(value2 => {
                                if (value2.Expression && value2.IsClient) {
                                    _item.Value = value2;
                                    EvaluateExpression(_item);
                                }
                            });
                        }
                    }
                }
            });
        }

        function EvaluateExpression($item) {
            let _item = angular.copy($item);

            if (!_item.EntityObject) {
                _item.EntityObject = {
                    InputObject: authService.getUserInfo(),
                    DateFilter: helperService.DateFilter
                };
            }

            let _exp = _item.Value.Expression;
            let ExpressionResult = new Function("Data", "return " + _exp);
            let _evalResult = ExpressionResult(_item.EntityObject);
            _item.Value.IsValidExpression = _evalResult;

            if (_item.Value.ParameterConfig) {
                if (typeof _item.Value.ParameterConfig == "string") {
                    _item.Value.ParameterConfig = JSON.parse(_item.Value.ParameterConfig);
                }
            }

            _item.ModuleName.map(value1 => {
                _item.Code.map(value2 => {
                    if (value2) {
                        let _obj = {
                            ModuleName: value1,
                            Code: value2,
                            ErrorCode: _item.Value.Code,
                            IsArray: _item.Value.ParameterConfig.IsArray,
                            IsValidExpression: _item.Value.IsValidExpression,
                            // EntityPK: _item.EntityObject.PK,
                            EntityPK: _item.EntityPK,
                            EntityCode: _item.EntityCode,
                            EntityName: _item.EntityName,
                            ActivityPK: _item.ActivityPK
                        };
                        OnFieldValueChange(_obj);
                    }
                });
            });
        }

        function OnFieldValueChange($item) {
            let _item = angular.copy($item);
            exports.Modules[_item.ModuleName].ErrorCodeList.map(value => {
                if (value.Code === _item.ErrorCode) {
                    let _obj = {
                        moduleName: _item.ModuleName,
                        entityName: _item.Code,
                        value: value,
                        IsArray: _item.IsArray,
                        MessageType: value.IsError ? "E" : "W",
                        IsValidExpression: _item.IsValidExpression,
                        // EntityPK: _item.EntityPK,
                        // EntityCode: _item.Code,
                        EntityPK: _item.EntityPK,
                        EntityCode: _item.EntityCode,
                        EntityName: _item.EntityName,
                        ActivityPK: _item.ActivityPK
                    };

                    GetErrorMessage(_obj);
                }
            });
        }

        function GetErrorMessage($item) {
            if ($item.IsValidExpression) {
                let _pushObj = {
                    Code: $item.value.Code,
                    Message: $item.value.Message,
                    MessageType: $item.MessageType,
                    IsAlert: false,
                    MetaObject: $item.value.CtrlKey,
                    IsArray: $item.IsArray,
                    RowIndex: (!$item.IsArray) ? undefined : $item.value.RowIndex,
                    ColIndex: (!$item.IsArray) ? undefined : $item.value.ColIndex,
                    DisplayName: (!$item.IsArray) ? undefined : $item.value.DisplayName,
                    ParentRef: $item.value.ParentRef,
                    GParentRef: $item.value.GParentRef,
                    moduleName: $item.moduleName,
                    entityName: $item.entityName,
                    EntityPK: $item.EntityPK,
                    EntityCode: $item.EntityCode,
                    EntityName: $item.EntityName,
                    ModuleCode: $item.value.ModuleCode,
                    SubModuleCode: $item.value.SubModuleCode,
                    ActivityPK: $item.ActivityPK
                };
                PushErrorWarning(_pushObj);
            } else {
                let _removeObj = {
                    moduleName: $item.moduleName,
                    entityName: $item.entityName,
                    Code: $item.value.Code,
                    MessageType: $item.MessageType,
                    MetaObject: $item.value.CtrlKey,
                    IsArray: $item.IsArray,
                    RowIndex: (!$item.IsArray) ? undefined : $item.value.RowIndex,
                    ColIndex: (!$item.IsArray) ? undefined : $item.value.ColIndex
                };
                RemoveErrorWarning(_removeObj);
            }
        }

        function PushErrorWarning($item) {
            let _isExistGlobal;
            let _obj = {
                "Code": $item.Code,
                "Message": $item.Message,
                "MessageType": $item.MessageType,
                "IsAlert": $item.IsAlert,
                "MetaObject": $item.MetaObject,
                "ParentRef": $item.ParentRef,
                "GParentRef": $item.GParentRef
            };

            if ($item.IsArray) {
                _obj.RowIndex = $item.RowIndex;
                _obj.ColIndex = $item.ColIndex;
                _obj.DisplayName = $item.DisplayName;
            }

            if (!$item.IsArray) {
                _isExistGlobal = exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.some(value => value.Code == $item.Code);
            } else {
                _isExistGlobal = exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.some(value => (value.Code == $item.Code && value.RowIndex == $item.RowIndex && value.ColIndex == $item.ColIndex));
            }

            if (!_isExistGlobal) {
                exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.push($item);
            }

            if (!exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject]) {
                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject] = helperService.metaBase();
            }
            exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsArray = $item.IsArray;
            exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ParentRef = $item.ParentRef;
            exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].GParentRef = $item.GParentRef;

            if ($item.MessageType === "W") {
                let _indexWarning;
                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsWarning = true;

                if (!$item.IsArray) {
                    _indexWarning = exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.findIndex(val => val.Code === $item.Code);
                } else {
                    _indexWarning = exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.findIndex(val => val.Code === $item.Code);
                }

                if (_indexWarning === -1) {
                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.push($item);
                } else {
                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING[_indexWarning] = $item;
                }

                if ($item.IsAlert) {
                    toastr.warning($item.Code, $item.Message);
                }
            } else if ($item.MessageType === "E") {
                let _indexError;
                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsError = true;

                if (!$item.IsArray) {
                    _indexError = exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.findIndex(val => val.Code === $item.Code);
                } else {
                    _indexError = exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.findIndex(val => val.Code === $item.Code);
                }

                if (_indexError === -1) {
                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.push($item);
                } else {
                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR[_indexError] = $item;
                }

                if (APP_CONSTANT.IsInsertErrorLog) {
                    InsertToErrorLog($item);
                }

                if ($item.IsAlert) {
                    toastr.error($item.Code, $item.Message);
                }
            }
        }

        function RemoveErrorWarning($item) {
            let _indexGlobal;
            if (!$item.IsArray) {
                _indexGlobal = exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.findIndex(value => value.Code === $item.Code);
            } else {
                _indexGlobal = exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.findIndex(value => value.Code === $item.Code);
            }

            if (_indexGlobal !== -1) {
                exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.splice(_indexGlobal, 1);
            }

            if (!exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject]) {
                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject] = helperService.metaBase();
            }

            if ($item.MessageType === "E") {
                if (!$item.IsArray) {
                    if (exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.length > 0) {
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.map((value, key) => {
                            if (value.Code === $item.Code) {
                                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.splice(key, 1);

                                if (exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.length === 0) {
                                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsError = false;
                                }
                            }
                        });
                    } else {
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsError = false;
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR = [];
                    }
                } else if ($item.IsArray) {
                    if (exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.length > 0) {
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.map((value, key) => {
                            if (value.Code == $item.Code && value.ColIndex == $item.ColIndex && value.RowIndex == $item.RowIndex) {
                                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.splice(key, 1);

                                if (exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.length === 0) {
                                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsError = false;
                                }
                            }
                        });
                    } else {
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsError = false;
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR = [];
                    }
                }
            } else if ($item.MessageType === "W") {
                if (!$item.IsArray) {
                    if (exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.length > 0) {
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.map((value, key) => {
                            if (value.Code == $item.Code) {
                                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.splice(key, 1);

                                if (exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.length === 0) {
                                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsWarning = false;
                                }
                            }
                        });
                    } else {
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsWarning = false;
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING = [];
                    }
                } else if ($item.IsArray) {
                    if (exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.length > 0) {
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.map((value, key) => {
                            if (value.Code == $item.Code && value.ColIndex == $item.ColIndex && value.RowIndex == $item.RowIndex) {
                                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.splice(key, 1);

                                if (exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.length === 0) {
                                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsWarning = false;
                                }
                            }
                        });
                    } else {
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsWarning = false;
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING = [];
                    }
                }
            }
        }

        function GetErrorWarningCountParent(moduleName, entityName, ParentId, Type, ParentType) {
            let _parentList = [];

            if (exports.Modules[moduleName] && exports.Modules[moduleName].Entity[entityName]) {
                exports.Modules[moduleName].Entity[entityName].GlobalErrorWarningList.map(value1 => {
                    if (ParentType == "GParent") {
                        if (value1.GParentRef === ParentId && value1.MessageType === Type) {
                            _parentList.push(value1);
                        }
                    } else if (ParentType == "Parent") {
                        if (value1.ParentRef === ParentId && value1.MessageType === Type) {
                            _parentList.push(value1);
                        }
                    }
                });
            }

            return _parentList;
        }

        function SubmitErrorLengthCheck(moduleName, entityName) {
            let tempArray = [];
            if (exports.Modules[moduleName]) {
                exports.Modules[moduleName].Entity[entityName].GlobalErrorWarningList.map(val => {
                    if (val.MessageType == 'E') {
                        tempArray.push(val)
                    }
                });
                if (tempArray.length > 0) {
                    return false;
                } else {
                    return true;
                }
            }
        }

        function InsertToErrorLog($item) {
            let _input = angular.copy($item);
            _input.EntityName = _input.EntityName;
            _input.EntityCode = _input.EntityCode;
            _input.EntityPK = _input.EntityPK;
            _input.ModuleName = _input.moduleName;
            _input.SAC_FK = _input.ActivityPK;
            _input.SLH_FK = authService.getUserInfo().LoginPK;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.LogErrorObject.API.Insert.Url, [_input]).then(response => {});
        }
    }
})();
