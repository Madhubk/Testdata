(function () {
    "use strict";

    angular.module("Application")
        .factory("exchangerateConfig", ExchangerateConfig);

    ExchangerateConfig.$inject = ["$q", "apiService", "appConfig", "helperService", "toastr", "errorWarningService"];

    function ExchangerateConfig($q, apiService, appConfig, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {},
                },
                "API": {
                    "ExchangerateMaster": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MstExchangeRate/GetById/"
                            },
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "Post",
                                "Url": "MstRecentExchangeRate/FindAll",
                                "FilterID": "MSTRECEXC"
                            },
                            "ExRateList": {
                                "IsAPI": "true",
                                "HttpType": "Post",
                                "Url": "MstExchangeRateListdata/FindAll",
                                "FilterID": "MSTEXCHRLIS"
                            },
                            "CurrencyActivityTabClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MstExchangeRate/MstExchangeRateActivityClose/"
                            }
                        }
                    }
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "ValidationFindall": ValidationFindall,
            "GeneralValidation": GeneralValidation,
            "PushErrorWarning": PushErrorWarning,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "RemoveErrorWarning": RemoveErrorWarning,
            "RemoveApiErrors": RemoveApiErrors,
            "DataentryName": "MstCurrencyExchange",
            "DataentryTitle": "ExchangeRate Master"
        };
        return exports;

        function GetTabDetails(currentExchangeRate, isNew) {
            /*  Set configuration object to individual Finance invoice */
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertExchangeRate": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstExchangeRate/Insert"
                            },
                            "UpdateExchangeRate": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstExchangeRate/Update"
                            }
                        },
                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "FromCurrency": helperService.metaBase(),
                                "RX_NKExCurrency": helperService.metaBase(),
                                "ExRateType": helperService.metaBase(),
                                "RateSubType": helperService.metaBase(),
                                "Rate": helperService.metaBase(),
                                "ExpiryDate": helperService.metaBase(),
                                "StartDate": helperService.metaBase()
                            }
                        },
                        "GlobalVariables": {
                            "SelectAll": false,
                            "IsDisablePost": true
                        },
                        "TableProperties": {
                            "lstUIMstExchangeRate": {
                                "TableHeight": {
                                    "isEnabled": true,
                                    "height": 300
                                },
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "ccheckbox",
                                    "position": '1',
                                    "width": "40",
                                    "display": false
                                }, {
                                    "columnname": "Start Date",
                                    "isenabled": true,
                                    "property": "cstartdate",
                                    "position": '2',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "cexpirydate",
                                    "position": '3',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Rate Type",
                                    "isenabled": true,
                                    "property": "cexratetype",
                                    "position": '4',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Rate Sub Type",
                                    "isenabled": true,
                                    "property": "cratesubtype",
                                    "position": '5',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Rate",
                                    "isenabled": true,
                                    "property": "crate",
                                    "position": '6',
                                    "width": "150",
                                    "display": false
                                }, {
                                    "columnname": "Ex. Rate From A to B",
                                    "isenabled": true,
                                    "property": "cratefromatob",
                                    "position": '7',
                                    "width": "150",
                                    "display": false
                                }, {
                                    "columnname": "Ex. Rate From B to A",
                                    "isenabled": true,
                                    "property": "cratefrombtoa",
                                    "position": '8',
                                    "width": "150",
                                    "display": false
                                }],
                                "ccheckbox": {
                                    "isenabled": true,
                                    "position": '1',
                                    "width": "40"
                                },
                                "cstartdate": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "155"
                                },
                                "cexpirydate": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "155"
                                },
                                "cexratetype": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "155"
                                },
                                "cratesubtype": {
                                    "isenabled": true,
                                    "position": '5',
                                    "width": "155"
                                },
                                "crate": {
                                    "isenabled": true,
                                    "position": '6',
                                    "width": "150"
                                },
                                "cratefromatob": {
                                    "isenabled": true,
                                    "position": '7',
                                    "width": "150"
                                },
                                "cratefrombtoa": {
                                    "isenabled": true,
                                    "position": '8',
                                    "width": "150"
                                }
                            }
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentExchangeRate.data;
                var _code = currentExchangeRate.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentExchangeRate.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                helperService.getFullObjectUsingGetById(exports.Entities.API.ExchangerateMaster.API.GetById.Url, currentExchangeRate.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;
                    var _code = currentExchangeRate.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentExchangeRate.FromCurrency,
                        code: _code,
                        pk: currentExchangeRate.PK,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "Finance",
                "SubModuleCode": "JBA"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues = (response.data.Response);
                }
            });
        }

        function GeneralValidation($item) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data.UIMstExchangeRate;
            /* UICurrencyMaster Validations  */
            OnChangeValues(_input.FromCurrency, 'E1324', false, undefined, $item.code);
            OnChangeValues(_input.RX_NKExCurrency, 'E1329', false, undefined, $item.code);
            OnChangeValues(_input.ExRateType, 'E1325', false, undefined, $item.code);
            OnChangeValues(_input.RateSubType, 'E1326', false, undefined, $item.code);
            OnChangeValues(_input.Rate, 'E1327', false, undefined, $item.code);
            OnChangeValues(_input.ExpiryDate, 'E1328', false, undefined, $item.code);
            OnChangeValues(_input.StartDate, 'E1319', false, undefined, $item.code);
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex, label) {
            angular.forEach(exports.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label);
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex, label) {
            if (!IsArray) {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, undefined, undefined, undefined, undefined, undefined, undefined);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
                }
            } else {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        function PushErrorWarning(Code, Message, MessageType, IsAlert, MetaObject, EntityObject, IsArray, RowIndex, ColIndex, DisplayName, ParentRef, GParentRef) {
            if (Code) {
                var _obj = {
                    "Code": Code,
                    "Message": Message,
                    "MessageType": MessageType,
                    "IsAlert": IsAlert,
                    "MetaObject": MetaObject,
                    "ParentRef": ParentRef,
                    "GParentRef": GParentRef
                };

                if (IsArray) {
                    _obj.RowIndex = RowIndex;
                    _obj.ColIndex = ColIndex;
                    _obj.DisplayName = DisplayName;
                    _obj.Message = Message + ' In Line No ' + (RowIndex + 1);
                }

                var _index = exports.TabList.map(function (value, key) {
                    return value.code;
                }).indexOf(EntityObject);

                if (_index !== -1) {

                    if (!IsArray) {
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            return value.Code == Code;
                        });
                    } else {
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            if (value.Code == Code && value.RowIndex == RowIndex && value.ColIndex == ColIndex)
                                return true;
                        });
                    }

                    if (!_isExistGlobal) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.push(_obj);
                    }
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsArray = IsArray;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ParentRef = ParentRef;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].GParentRef = GParentRef;

                    if (MessageType === "W") {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = true;

                        if (!IsArray) {
                            var _indexWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        } else {
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                if (val.Code == Code && val.RowIndex == RowIndex && val.ColIndex == ColIndex)
                                    return val.Code;
                            }).indexOf(Code);
                        }

                        if (_indexWarning === -1) {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.push(_obj);
                        } else {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING[_indexWarning] = _obj;
                        }

                        if (IsAlert) {
                            toastr.warning(Code, Message);
                        }
                    } else if (MessageType === "E") {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = true;

                        if (!IsArray) {
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        } else {
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                if (val.Code == Code && val.RowIndex == RowIndex && val.ColIndex == ColIndex)
                                    return val.Code;
                            }).indexOf(Code);
                        }

                        if (_indexError === -1) {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.push(_obj);
                        } else {
                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR[_indexError] = _obj;
                        }

                        if (IsAlert) {
                            toastr.error(Code, Message);
                        }
                    }
                }
            }
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.code).toggleClass("open");
        }

        function RemoveErrorWarning(Code, MessageType, MetaObject, EntityObject, IsArray, RowIndex, ColIndex) {
            if (Code) {
                var _index = exports.TabList.map(function (value, key) {
                    return value.code;
                }).indexOf(EntityObject);

                if (_index !== -1) {
                    if (!IsArray) {
                        var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                            return value.Code;
                        }).indexOf(Code);
                    } else {
                        var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                            if (value.Code == Code && value.RowIndex == RowIndex && value.ColIndex == ColIndex)
                                return value.Code;
                        }).indexOf(Code);
                    }


                    if (_indexGlobal !== -1) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.splice(_indexGlobal, 1);
                    }

                    if (MessageType === "E") {
                        if (!IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (value, key) {
                                    if (value.Code === Code) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.splice(key, 1);

                                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length === 0) {
                                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                        }
                                    }
                                });
                            } else {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR = [];
                            }
                        } else if (IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (value, key) {
                                    if (value.Code == Code && value.ColIndex == ColIndex && value.RowIndex == RowIndex) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.splice(key, 1);

                                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.length === 0) {
                                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                        }
                                    }
                                });
                            } else {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsError = false;
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR = [];
                            }
                        }
                    } else if (MessageType === "W") {
                        if (!IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (value, key) {
                                    if (value.Code == Code) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.splice(key, 1);

                                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length === 0) {
                                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                        }
                                    }
                                });
                            } else {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING = [];
                            }
                        } else if (IsArray) {
                            if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length > 0) {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (value, key) {
                                    if (value.Code == Code && value.ColIndex == ColIndex && value.RowIndex == RowIndex) {
                                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.splice(key, 1);

                                        if (exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.length === 0) {
                                            exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                        }
                                    }
                                });
                            } else {
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = false;
                                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING = [];
                            }
                        }
                    }
                }
            }
        }

        function RemoveApiErrors(item, label) {
            angular.forEach(item, function (value, key) {
                RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
            });
        }
    }
})();