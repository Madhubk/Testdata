(function () {
    'use strict';

    angular
        .module("Application")
        .factory("errorWarningService", ErrorWarningService);

    ErrorWarningService.$inject = ["$q", "helperService", "appConfig", "authService", "apiService", "toastr"];

    function ErrorWarningService($q, helperService, appConfig, authService, apiService, toastr) {
        var exports = {
            Modules: {},
            GetErrorCodeList: GetErrorCodeList,
            OnFieldValueChange: OnFieldValueChange,
            GetErrorWarningCountParent: GetErrorWarningCountParent,
            SubmitErrorLengthCheck: SubmitErrorLengthCheck,
            ValidateValue: ValidateValue
        };

        return exports;

        function GetErrorCodeList($item) {
            AddModule($item).then(function (response) {
                if ($item.API == "Validation") {
                    GetValidationListUsingValidationFindAll($item);
                } else if ($item.API == "Group") {
                    GetValidationListUsingValidationByGroup($item);
                }
            });
        }

        function AddModule($item) {
            var _deferred = $q.defer();
            var _errorWarningObj = {
                GlobalErrorWarningList: []
            };

            $item.ModuleName.map(function (value1, key1) {
                if (!exports.Modules[value1]) {
                    exports.Modules[value1] = {
                        ErrorCodeList: [],
                        Entity: {}
                    };
                }

                $item.Code.map(function (value2, key2) {
                    exports.Modules[value1].Entity[value2] = _errorWarningObj;
                });
            });

            _deferred.resolve(exports.Modules);
            return _deferred.promise;
        }

        function GetValidationListUsingValidationFindAll($item) {
            var _deferred = $q.defer();
            var _item = angular.copy($item);

            var _filter = _item.FilterInput;
            _filter.TenantCode = authService.getUserInfo().TenantCode;
            _filter.SAP_FK = authService.getUserInfo().AppPK;
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value1, key) {
                            _item.ModuleName.map(function (value2, key) {
                                if (!exports.Modules[value2].ErrorCodeList) {
                                    exports.Modules[value2].ErrorCodeList = [];
                                }

                                if (exports.Modules[value2].ErrorCodeList.length > 0) {
                                    var _isExist = exports.Modules[value2].ErrorCodeList.some(function (value3, key3) {
                                        return (value1.PK === value3.PK && value1.VLG_FK === value3.VLG_FK);
                                    });

                                    if (!_isExist) {
                                        exports.Modules[value2].ErrorCodeList.push(value1);
                                    }
                                } else {
                                    exports.Modules[value2].ErrorCodeList.push(value1);
                                }
                            });
                        });
                    }
                    _deferred.resolve(response.data.Response);
                } else {
                    _deferred.reject();
                }
            });

            return _deferred.promise;
        }

        function GetValidationListUsingValidationByGroup($item) {
            var _deferred = $q.defer();
            var _item = angular.copy($item);
            var _filter = {
                MappingCode: "VLG_VLD",
                Code_1: _item.GroupCode,
                RelatedBasicDetails: _item.RelatedBasicDetails
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.ValidationByGroup.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.ValidationByGroup.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value1, key) {
                            _item.ModuleName.map(function (value2, key) {
                                if (!exports.Modules[value2].ErrorCodeList) {
                                    exports.Modules[value2].ErrorCodeList = [];
                                }

                                if (exports.Modules[value2].ErrorCodeList.length > 0) {
                                    var _isExist = exports.Modules[value2].ErrorCodeList.some(function (value3, key3) {
                                        return (value1.PK === value3.PK && value1.VLG_FK === value3.VLG_FK);
                                    });

                                    if (!_isExist) {
                                        exports.Modules[value2].ErrorCodeList.push(value1);
                                    }
                                } else {
                                    exports.Modules[value2].ErrorCodeList.push(value1);
                                }
                            });
                        });
                    }
                    _deferred.resolve(response.data.Response);
                } else {
                    _deferred.reject();
                }
            });

            return _deferred.promise;
        }

        function ValidateValue($item) {
            var _item = angular.copy($item);
            _item.ModuleName.map(function (value1, key1) {
                if (exports.Modules[value1].ErrorCodeList.length > 0) {
                    if (_item.ErrorCode) {
                        if (_item.ErrorCode.length > 0) {
                            _item.ErrorCode.map(function (value2, key2) {
                                var _index = exports.Modules[value1].ErrorCodeList.map(function (value, key) {
                                    return value.Code;
                                }).indexOf(value2);

                                if (_index != -1) {
                                    if (exports.Modules[value1].ErrorCodeList[_index].Expression && exports.Modules[value1].ErrorCodeList[_index].IsClient) {
                                        _item.Value = exports.Modules[value1].ErrorCodeList[_index];
                                        EvaluateExpression(_item);
                                    }
                                }
                            });
                        } else {
                            if (_item.GroupCode) {
                                exports.Modules[value1].ErrorCodeList.map(function (value2, key2) {
                                    if (value2.Expression && value2.IsClient && _item.GroupCode == value2.VLG_Code) {
                                        _item.Value = value2;
                                        EvaluateExpression(_item);
                                    }
                                });
                            } else {
                                exports.Modules[value1].ErrorCodeList.map(function (value2, key2) {
                                    if (value2.Expression && value2.IsClient) {
                                        _item.Value = value2;
                                        EvaluateExpression(_item);
                                    }
                                });
                            }
                        }
                    } else {
                        if (_item.GroupCode) {
                            exports.Modules[value1].ErrorCodeList.map(function (value2, key2) {
                                if (value2.Expression && value2.IsClient && _item.GroupCode == value2.VLG_Code) {
                                    _item.Value = value2;
                                    EvaluateExpression(_item);
                                }
                            });
                        } else {
                            exports.Modules[value1].ErrorCodeList.map(function (value2, key2) {
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
            var _item = angular.copy($item);

            if (!_item.EntityObject) {
                _item.EntityObject = {};
            }
            _item.EntityObject.InputObject = authService.getUserInfo();
            _item.EntityObject.DateFilter = helperService.DateFilter;

            var _exp = _item.Value.Expression;
            var ExpressionResult = new Function("Data", "return " + _exp);
            var _evalResult = ExpressionResult(_item.EntityObject);
            _item.Value.IsValidExpression = _evalResult;

            if (_item.Value.ParameterConfig) {
                if (typeof _item.Value.ParameterConfig == "string") {
                    _item.Value.ParameterConfig = JSON.parse(_item.Value.ParameterConfig);
                    // var FieldValue = new Function("Data", "return " + _item.Value.ParameterConfig.FieldValue);
                    // _item.Value.ParameterConfig.FieldValue = FieldValue(_item.EntityObject);
                }

                _item.ModuleName.map(function (value1, key1) {
                    _item.Code.map(function (value2, key2) {
                        if (value2) {
                            var _obj = {
                                ModuleName: value1,
                                Code: value2,
                                ErrorCode: _item.Value.Code,
                                IsArray: _item.Value.ParameterConfig.IsArray,
                                IsValidExpression: _item.Value.IsValidExpression,
                                EntityPK: _item.EntityObject.PK
                            };
                            OnFieldValueChange(_obj);
                        }
                    });
                });
            }
        }

        function OnFieldValueChange($item) {
            var _item = angular.copy($item);
            exports.Modules[_item.ModuleName].ErrorCodeList.map(function (value, key) {
                if (value.Code === _item.ErrorCode) {
                    var _obj = {
                        moduleName: _item.ModuleName,
                        entityName: _item.Code,
                        value: value,
                        IsArray: _item.IsArray,
                        MessageType: value.IsError ? "E" : "W",
                        IsValidExpression: _item.IsValidExpression,
                        EntityPK: _item.EntityPK,
                        EntityCode: _item.Code,
                    };

                    GetErrorMessage(_obj);
                }
            });
        }

        function GetErrorMessage($item) {
            if ($item.IsValidExpression) {
                var _pushObj = {
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
                    EntityCode: $item.entityName,
                    ModuleCode: $item.value.ModuleCode,
                    SubModuleCode: $item.value.SubModuleCode,
                };
                PushErrorWarning(_pushObj);
            } else {
                var _removeObj = {
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
            var _obj = {
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
                var _isExistGlobal = exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.some(function (value, key) {
                    return value.Code == $item.Code;
                });
            } else {
                var _isExistGlobal = exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.some(function (value, key) {
                    if (value.Code == $item.Code && value.RowIndex == $item.RowIndex && value.ColIndex == $item.ColIndex)
                        return true;
                });
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
                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsWarning = true;

                if (!$item.IsArray) {
                    var _indexWarning = exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.map(function (val, key) {
                        return val.Code;
                    }).indexOf($item.Code);
                } else {
                    var _indexError = exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.map(function (val, key) {
                        if (val.Code == $item.Code && val.RowIndex == $item.RowIndex && val.ColIndex == $item.ColIndex)
                            return val.Code;
                    }).indexOf($item.Code);
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
                exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].IsError = true;

                if (!$item.IsArray) {
                    var _indexError = exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.map(function (val, key) {
                        return val.Code;
                    }).indexOf($item.Code);
                } else {
                    var _indexError = exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.map(function (val, key) {
                        if (val.Code == $item.Code && val.RowIndex == $item.RowIndex && val.ColIndex == $item.ColIndex)
                            return val.Code;
                    }).indexOf($item.Code);
                }

                if (_indexError === -1) {
                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.push($item);
                } else {
                    exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR[_indexError] = $item;
                }

                InsertToErrorLog($item);

                if ($item.IsAlert) {
                    toastr.error($item.Code, $item.Message);
                }
            }
        }

        function RemoveErrorWarning($item) {
            if (!$item.IsArray) {
                var _indexGlobal = exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.map(function (value, key) {
                    return value.Code;
                }).indexOf($item.Code);
            } else {
                var _indexGlobal = exports.Modules[$item.moduleName].Entity[$item.entityName].GlobalErrorWarningList.map(function (value, key) {
                    if (value.Code == $item.Code && value.RowIndex == $item.RowIndex && value.ColIndex == $item.ColIndex)
                        return value.Code;
                }).indexOf($item.Code);
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
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.map(function (value, key) {
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
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].ERROR.map(function (value, key) {
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
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.map(function (value, key) {
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
                        exports.Modules[$item.moduleName].Entity[$item.entityName][$item.MetaObject].WARNING.map(function (value, key) {
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
            var _parentList = [];

            if (exports.Modules[moduleName]) {
                if (exports.Modules[moduleName].Entity[entityName]) {
                    exports.Modules[moduleName].Entity[entityName].GlobalErrorWarningList.map(function (value1, key1) {
                        if (ParentType == "GParent") {
                            if (value1.GParentRef === ParentId && value1.MessageType === Type) {
                                _parentList.push(value1);
                            }
                        } else if (ParentType == "Parent") {
                            if (value1.ParentRef === ParentId && value1.MessageType === Type) {
                                exports.Modules;
                                moduleName, entityName, ParentId, Type, ParentType;
                                _parentList.push(value1);
                            }
                        }
                    });
                }
            }

            return _parentList;
        }

        function SubmitErrorLengthCheck(moduleName, entityName) {
            var tempArray = [];
            if (exports.Modules[moduleName]) {
                exports.Modules[moduleName].Entity[entityName].GlobalErrorWarningList.map(function (val, key) {
                    if (val.MessageType == 'E') {
                        tempArray.push(val)
                    }
                });
                if (tempArray.length > 0) {
                    return false
                } else {
                    return true
                }
            }
        }

        function InsertToErrorLog($item) {
            var _input = angular.copy($item);
            _input.EntityName = _input.entityName;
            _input.ModuleName = _input.moduleName;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.LogErrorObject.API.Insert.Url, [_input]).then(function (response) {});
        }
    }
})();
