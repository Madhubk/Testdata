(function () {
    "use strict";

    angular.module("Application")
        .factory('chargecodeConfig', ChargecodeConfig);

    ChargecodeConfig.$inject = ["$q", "helperService", "apiService", "appConfig", "errorWarningService"];

    function ChargecodeConfig($q, helperService, apiService, appConfig, ) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {}
                },
                "API": {
                    "ChargecodeGroup": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccChargeCode/FindAll",
                                "FilterID": "ACCCHAR"
                            },
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccChargeCodeList/GetById/"
                            },
                            "ChargecodeGroupActivityClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccChargeCode/AccChargeCodeActivityClose/"
                            }
                        }
                    },
                    "AccTaxOverride": {
                        "RowIndex": -1,
                        "API": {
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "AccChargeTaxOverride/Delete/"
                            }
                        }
                    },
                    "AccGLPostingOverride": {
                        "RowIndex": -1,
                        "API": {
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "AccChargeGLPostingOverride/Delete/"
                            }
                        }
                    },
                    "AccTypeOverride":{
                        "RowIndex": -1,
                        "API": {
                            "Delete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "AccChargeTypeOverride/Delete/"
                            }
                        }
                    },
                    "CmpDepartment": {
                        "RowIndex": -1,
                        "API": {
                            "FindAll": {
                                "IsAPI": "true",
                                "HttpType": "Post",
                                "Url": "CmpDepartment/FindAll",
                                "FilterID": "CMPDEPT"
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
            "DataentryName": "AccChargeCode",
            "DataentryTitle": "Charge Code"
        };
        return exports;

        function GetTabDetails(currentChargecode, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertChargecode": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AccChargeCodeList/Insert"
                            },
                            "UpdateChargecode": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AccChargeCodeList/Update"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Charge Code Details",
                                "Value": "Details",
                                "Icon": "fa fa-money",
                                "GParentRef": "Details"
                            }, {
                                "DisplayName": "Tax Code Override",
                                "Value": "Tax",
                                "Icon": "fa fa-money",
                                "GParentRef": "Tax"
                            },
                            {
                                "DisplayName": "GL Posting Override",
                                "Value": "GL",
                                "Icon": "fa fa-money",
                                "GParentRef": "GL"
                            },
                            {
                                "DisplayName": "Invoice Override",
                                "Value": "Invoice",
                                "Icon": "fa fa-money",
                                "GParentRef": "Invoice"
                            }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "Code": helperService.metaBase(),
                                "Desc": helperService.metaBase(),
                                "Company": helperService.metaBase(),
                                "ChargeType": helperService.metaBase(),
                                "Margin": helperService.metaBase(),
                                "CostAccural": helperService.metaBase(),
                                "RevenueAccural": helperService.metaBase(),
                                "CostActual": helperService.metaBase(),
                                "RevenueActual": helperService.metaBase(),
                                "ChargeGroup": helperService.metaBase(),
                                "UIAccChargeCode": helperService.metaBase()
                            }
                        },
                        "GlobalVariables": {
                            "SelectAll": false,
                        },
                        "TableProperties": {
                            "UITaxCodeOverride": {
                                "TableHeight": {
                                    "isEnabled": true,
                                    "height": 180
                                },
                                "ccheckbox": {
                                    "isenabled": true,
                                    "position": '1',
                                    "width": "30"
                                },
                                "accountsno": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "40"
                                },
                                "accounttype": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "150"
                                },
                                "jobtype": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "150"
                                },
                                "transportmode": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "150"
                                },
                                "taxcode": {
                                    "isenabled": true,
                                    "position": '5',
                                    "width": "150"
                                }
                            },
                            "UIGLPostingOverride": {
                                "TableHeight": {
                                    "isEnabled": true,
                                    "height": 180
                                },
                                "ccheckbox": {
                                    "isenabled": true,
                                    "position": '1',
                                    "width": "30"
                                },
                                "accountsno": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "40"
                                },
                                "jobtype": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "150"
                                },
                                "transportmode": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "150"
                                },
                                "department": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "150"
                                },
                                "costaccural": {
                                    "isenabled": true,
                                    "position": '5',
                                    "width": "168"
                                },
                                "costactual": {
                                    "isenabled": true,
                                    "position": '6',
                                    "width": "168"
                                },
                                "revenueaccural": {
                                    "isenabled": true,
                                    "position": '7',
                                    "width": "173"
                                },
                                "revenueactual": {
                                    "isenabled": true,
                                    "position": '8',
                                    "width": "168"
                                },
                            },
                            "UIInvoiceOverride": {
                                "TableHeight": {
                                    "isEnabled": true,
                                    "height": 180
                                },
                                "ccheckbox": {
                                    "isenabled": true,
                                    "position": '1',
                                    "width": "40"
                                },
                                "accountsno": {
                                    "isenabled": true,
                                    "position": '2',
                                    "width": "40"
                                },
                                "jobtype": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "200"
                                },
                                "transportmode": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "200"
                                },
                                "chargetype": {
                                    "isenabled": true,
                                    "position": '5',
                                    "width": "200"
                                },
                                "invoicetype": {
                                    "isenabled": true,
                                    "position": '5',
                                    "width": "200"
                                }
                            }
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentChargecode.data;
                var _code = currentChargecode.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentChargecode.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                helperService.getFullObjectUsingGetById(exports.Entities.API.ChargecodeGroup.API.GetById.Url, currentChargecode.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var _code = currentChargecode.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentChargecode.Code,
                        code: _code,
                        pk: currentChargecode.PK,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

        //#region  Validation
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
                _input = _Data.Header.Data;

            //UIChargecode Validations 
            OnChangeValues(_input.UIAccChargeCode.Code, 'E1349', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.Desc, 'E1350', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.CMP_Code, 'E1362', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.ChargeType, 'E1351', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.MarginPercentage, 'E1352', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.AGH_AccrualAccountNum, 'E1353', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.AGH_WIPAccountNum, 'E1354', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.AGH_CostAccountNum, 'E1355', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.AGH_RevenueAccountNum, 'E1356', false, undefined, $item.code);
            OnChangeValues(_input.UIAccChargeCode.ChargeGroup, 'E1357', false, undefined, $item.code);

            //UIAccChargeCode Validations
            if (_input.UIAccChargeTypeOverride.length > 0) {
                angular.forEach(_input.UIAccChargeTypeOverride, function (value, key) {
                    OnChangeValues(value.JobType, 'E1358', true, key, $item.code);
                    OnChangeValues(value.TransportMode, 'E1359', true, key, $item.code);
                    OnChangeValues(value.ChargeType, 'E1360', true, key, $item.code);
                    OnChangeValues(value.InvoiceType, 'E1361', true, key, $item.code);
                });
            }
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
        //#endregion 
    }
})();