(function () {
    "use strict";

    angular
        .module("Application")
        .factory('companyConfig', companyConfig);

    companyConfig.$inject = ["$q", "apiService", "appConfig", "helperService"];

    function companyConfig($q, apiService, appConfig, helperService) {

        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "FindConfig": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindConfig",
                            "FilterID": "DYNDAT"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "Post",
                            "Url": "CmpCompany/FindAll",
                            "FilterID": "CMPCOMP"
                        },
                        "DataEntry": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CurrencyUpliftList/GetById/",
                            "FilterID": "CURCFXCOMLI"
                        },
                        "ValidateCompany": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "AccMastersValidate/FindAll",
                            "FilterID": "ACCMSTVALID"
                        }
                    },
                    "Meta": {
                    }
                }
            },
            "TabList": [],
            "AddCompany": AddCompany,
            "ValidationValues": "",
            "ValidationFindall": ValidationFindall,
            "GeneralValidation": GeneralValidation,
            "PushErrorWarning": PushErrorWarning,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "RemoveErrorWarning": RemoveErrorWarning,
            "RemoveApiErrors": RemoveApiErrors
        };
        return exports;

        function AddCompany(currentCompany, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "UpdateCompany": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "CurrencyUpliftList/Update",
                                "FilterID": "CURCFXCOMLI"
                            },
                            "InsertCompany": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "CurrencyUpliftList/Insert",
                                "FilterID": "CURCFXCOMLI"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Basic Details",
                                "Value": "Basics",
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address"
                            }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "Code": helperService.metaBase(),
                                "Name": helperService.metaBase(),
                                "PostCode": helperService.metaBase(),
                                "LocalCurrency": helperService.metaBase(),
                                "Email": helperService.metaBase(),
                                "BusinessRegNo": helperService.metaBase(),
                                "CountryCode": helperService.metaBase(),
                                "ReportingCurrency": helperService.metaBase(),
                                "Address1": helperService.metaBase()
                            }
                        },
                        "GlobalVariables": {
                            "SelectAll": false,
                            "IsDisablePost": true
                        },
                        "TableProperties": {
                            "UICurrencyUplift": {
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
                                    "columnname": "Job Type",
                                    "isenabled": true,
                                    "property": "cjobtype",
                                    "position": '2',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Business Type",
                                    "isenabled": true,
                                    "property": "cbusinesstype",
                                    "position": '3',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Mode of Transport",
                                    "isenabled": true,
                                    "property": "cmodeoftransport",
                                    "position": '4',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "Currency",
                                    "isenabled": true,
                                    "property": "ccurrency",
                                    "position": '5',
                                    "width": "155",
                                    "display": false
                                }, {
                                    "columnname": "CFX %",
                                    "isenabled": true,
                                    "property": "ccfx",
                                    "position": '6',
                                    "width": "150",
                                    "display": false
                                }, {
                                    "columnname": "CFX Min.",
                                    "isenabled": true,
                                    "property": "ccfxmin",
                                    "position": '7',
                                    "width": "150",
                                    "display": false
                                }],
                                "ccheckbox": {
                                    "isenabled": true,
                                    "position": '1',
                                    "width": "40"
                                },
                                "csno": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "50"
                                },
                                "cjobtype": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "155"
                                },
                                "cbusinesstype": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "155"
                                },
                                "cmodeoftransport": {
                                    "isenabled": true,
                                    "position": '5',
                                    "width": "155"
                                },
                                "ccurrency": {
                                    "isenabled": true,
                                    "position": '6',
                                    "width": "155"
                                },
                                "ccfx": {
                                    "isenabled": true,
                                    "position": '7',
                                    "width": "150"
                                },
                                "ccfxmin": {
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
                _exports.Entities.Header.Data = currentCompany.data;
                if (currentCompany.entity.UICmpCompany.Code == null) {
                    var obj = {
                        New: {
                            ePage: _exports
                        },
                        label: 'New',
                        code: "",
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                }

            } else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentCompany.entity.PK).then(function (response) {
                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentCompany.entity.Code]: {
                            ePage: _exports
                        },
                        label: currentCompany.entity.Code,
                        code: currentCompany.entity.Code,
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
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            /* UICurrencyMaster Validations */ 
            OnChangeValues(_input.UICmpCompany.Code, 'E1330', false, undefined, $item.label);
            OnChangeValues(_input.UICmpCompany.Name, 'E1331', false, undefined, $item.label);
            OnChangeValues(_input.UICmpCompany.Email, 'E1332', false, undefined, $item.label);
            OnChangeValues(_input.UICmpCompany.BusinessRegNo, 'E1333', false, undefined, $item.label);
            OnChangeValues(_input.UICmpCompany.PostCode, 'E1334', false, undefined, $item.label);
            OnChangeValues(_input.UICmpCompany.CountryCode, 'E1335', false, undefined, $item.label);
            OnChangeValues(_input.UICmpCompany.LocalCurrency, 'E1336', false, undefined, $item.label);
            OnChangeValues(_input.UICmpCompany.Address1, 'E1337', false, undefined, $item.code);
            OnChangeValues(_input.UICmpCompany.ReportingCurrency, 'E1338', false, undefined, $item.label);
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
                    return value.label;
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
            $("#errorWarningContainer" + EntityObject.label).toggleClass("open");
        }

        function RemoveErrorWarning(Code, MessageType, MetaObject, EntityObject, IsArray, RowIndex, ColIndex) {
            if (Code) {
                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
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
