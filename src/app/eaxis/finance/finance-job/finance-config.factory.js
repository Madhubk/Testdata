(function () {
    "use strict";

    angular.module("Application")
        .factory("financeConfig", FinanceConfig);

    FinanceConfig.$inject = ["$q", "apiService", "appConfig", "helperService", "toastr"];

    function FinanceConfig($q, apiService, appConfig, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {},
                },
            },
            "API": {
                "JobHeaderList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobHeaderList/GetById/"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "Get",
                            "Url": "JobHeaderList/Delete/"
                        },
                        "JobHeaderListActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "JobHeaderList/JobHeaderListActivityClose/"
                        }
                    }
                },
                "UIJobCharge": {
                    "RowIndex": -1,
                    "API": {
                        "JobChargeDelete": {
                            "IsAPI": "true",
                            "HttpType": "Get",
                            "Url": "JobCharge/Delete/"
                        }
                    }
                },
                "JobHeader": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "Post",
                            "Url": "JobHeader/FindAll",
                            "FilterID": "JOBHEAD"
                        }
                    }
                },
                "CfxTypes": {
                    "RowIndex": -1,
                    "API": {
                        "DynamicFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cfxtypes/DynamicFindAll/",
                            "FilterID": "CFXTYPE"
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
            "DataentryName": "FreightJobList",
            "DataentryTitle": "Freight Finance"
        };
        return exports;

        function GetTabDetails(currentJobHeader, isNew) {
            /*  Set configuration object to individual Finance invoice */
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},

                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertJobHeader": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobHeaderList/Insert"
                            },
                            "UpdateJobHeader": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobHeaderList/Update"
                            }
                        },
                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "LocalOrg_Code": helperService.metaBase(),
                                "AgentOrg_Code": helperService.metaBase(),
                                "BranchCode": helperService.metaBase(),
                                "DeptCode": helperService.metaBase(),
                                "Status": helperService.metaBase(),
                                "UIJobCharge": helperService.metaBase()
                            }
                        },
                        "GlobalVariables": {
                            "SelectAll": false,
                            "IsDisablePost": true
                        },
                        "TableProperties": {
                            "UIJobCharge": {
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "ccheckbox",
                                    "position": '1',
                                    "width": "40",
                                    "display": false
                                }, {
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "csno",
                                    "position": '2',
                                    "width": "40",
                                    "display": false
                                }, {
                                    "columnname": "Charge Code",
                                    "isenabled": true,
                                    "property": "cchargecode",
                                    "position": '3',
                                    "width": "113",
                                    "display": false
                                }, {
                                    "columnname": "Description",
                                    "isenabled": true,
                                    "property": "cdescription",
                                    "position": '4',
                                    "width": "135",
                                    "display": false
                                }, {
                                    "columnname": "Branch",
                                    "isenabled": true,
                                    "property": "cbranch",
                                    "position": '6',
                                    "width": "110",
                                    "display": false
                                }, {
                                    "columnname": "Dept",
                                    "isenabled": true,
                                    "property": "cdept",
                                    "position": '7',
                                    "width": "110",
                                    "display": false
                                }, {
                                    "columnname": "Creditor",
                                    "isenabled": true,
                                    "property": "ccreditor",
                                    "position": '8',
                                    "width": "120",
                                    "display": false
                                }, {
                                    "columnname": "Inv.No",
                                    "isenabled": true,
                                    "property": "ccostinvno",
                                    "position": '9',
                                    "width": "100",
                                    "display": false
                                }, {
                                    "columnname": "Inv.Date",
                                    "isenabled": true,
                                    "property": "ccostinvdate",
                                    "position": '10',
                                    "width": "140",
                                    "display": false
                                }, {
                                    "columnname": "Post",
                                    "isenabled": true,
                                    "property": "ccostpost",
                                    "position": '11',
                                    "width": "45",
                                    "display": false
                                }, {
                                    "columnname": "Currency",
                                    "isenabled": true,
                                    "property": "ccostcurrency",
                                    "position": '13',
                                    "width": "90",
                                    "display": false
                                }, {
                                    "columnname": "Est.Cost",
                                    "isenabled": true,
                                    "property": "cestcost",
                                    "position": '14',
                                    "width": "95",
                                    "display": false
                                }, {
                                    "columnname": "Act.Cost",
                                    "isenabled": true,
                                    "property": "cactcost",
                                    "position": '15',
                                    "width": "95",
                                    "display": false
                                }, {
                                    "columnname": "Lolcal cost AMT",
                                    "isenabled": true,
                                    "property": "ccostlocalamt",
                                    "position": '17',
                                    "width": "95",
                                    "display": false
                                }, {
                                    "columnname": "Debeitor",
                                    "isenabled": true,
                                    "property": "cdebitor",
                                    "position": '20',
                                    "width": "120",
                                    "display": false
                                }, {
                                    "columnname": "Post",
                                    "isenabled": true,
                                    "property": "crevenuepost",
                                    "position": '24',
                                    "width": "45",
                                    "display": false
                                }, {
                                    "columnname": "Currency",
                                    "isenabled": true,
                                    "property": "crevenuecurrency",
                                    "position": '26',
                                    "width": "90",
                                    "display": false
                                }, {
                                    "columnname": "Est.Revenue",
                                    "isenabled": true,
                                    "property": "cestrevenue",
                                    "position": '27',
                                    "width": "90",
                                    "display": false
                                }, {
                                    "columnname": "Act.Revenue",
                                    "isenabled": true,
                                    "property": "cactrevenue",
                                    "position": '28',
                                    "width": "90",
                                    "display": false
                                }, {
                                    "columnname": "Local Sell AMT",
                                    "isenabled": true,
                                    "property": "cselllocalamt",
                                    "position": '30',
                                    "width": "90",
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
                                    "width": "40"
                                },
                                "cchargecode": {
                                    "isenabled": true,
                                    "position": '3',
                                    "width": "113"
                                },
                                "cdescription": {
                                    "isenabled": true,
                                    "position": '4',
                                    "width": "135"
                                },
                                "cbranch": {
                                    "isenabled": true,
                                    "position": '6',
                                    "width": "110"
                                },
                                "cdept": {
                                    "isenabled": true,
                                    "position": '7',
                                    "width": "110"
                                },
                                "ccreditor": {
                                    "isenabled": true,
                                    "position": '8',
                                    "width": "120"
                                },
                                "ccostinvno": {
                                    "isenabled": true,
                                    "position": '9',
                                    "width": "100"
                                },
                                "ccostinvdate": {
                                    "isenabled": true,
                                    "position": '10',
                                    "width": "140"
                                },
                                "ccostpost": {
                                    "isenabled": true,
                                    "position": '11',
                                    "width": "45"
                                },
                                "ccostcurrency": {
                                    "isenabled": true,
                                    "position": '13',
                                    "width": "90"
                                },
                                "cestcost": {
                                    "isenabled": true,
                                    "position": '14',
                                    "width": "95"
                                },
                                "cactcost": {
                                    "isenabled": true,
                                    "position": '15',
                                    "width": "95"
                                },
                                "ccostlocalamt": {
                                    "isenabled": true,
                                    "position": '17',
                                    "width": "95"
                                },
                                "cdebitor": {
                                    "isenabled": true,
                                    "position": '20',
                                    "width": "120"
                                },
                                "crevenuepost": {
                                    "isenabled": true,
                                    "position": '24',
                                    "width": "45"
                                },
                                "crevenuecurrency": {
                                    "isenabled": true,
                                    "position": '26',
                                    "width": "90"
                                },
                                "cestrevenue": {
                                    "isenabled": true,
                                    "position": '27',
                                    "width": "95"
                                },
                                "cactrevenue": {
                                    "isenabled": true,
                                    "position": '28',
                                    "width": "95"
                                },
                                "cselllocalamt": {
                                    "isenabled": true,
                                    "position": '30',
                                    "width": "95"
                                },
                            }
                        }
                    },

                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentJobHeader.data;
                var _code = currentJobHeader.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentJobHeader.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                helperService.getFullObjectUsingGetById(exports.API.JobHeaderList.API.GetById.Url, currentJobHeader.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var _code = currentJobHeader.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentJobHeader.JobNo,
                        code: _code,
                        pk: currentJobHeader.PK,
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

        function GeneralValidation($item, type) {
            var _Data = $item[$item.code].ePage.Entities,
                _input = _Data.Header.Data;

            //UIJobHeader Validations 
            OnChangeValues(_input.UIJobHeader.LocalOrg_Code, 'E1300', false, undefined, $item.code);
            OnChangeValues(_input.UIJobHeader.AgentOrg_Code, 'E1301', false, undefined, $item.code);
            OnChangeValues(_input.UIJobHeader.BranchCode, 'E1302', false, undefined, $item.code);
            OnChangeValues(_input.UIJobHeader.DeptCode, 'E1303', false, undefined, $item.code);
            OnChangeValues(_input.UIJobHeader.Status, 'E1304', false, undefined, $item.code);

            //UIJobcharge Validations
            if (_input.UIJobCharge.length > 0) {
                angular.forEach(_input.UIJobCharge, function (value, key) {
                    OnChangeValues(value.ACCCode, 'E1191', true, key, $item.code);
                    OnChangeValues(value.BranchCode, 'E1305', true, key, $item.code);
                    OnChangeValues(value.DeptCode, 'E1306', true, key, $item.code);
                    if (value.ChargeType != "REV") {
                        OnChangeValues(value.VendorCode, 'E1310', true, key, $item.code);
                        OnChangeValues(value.APInvoiceNum, 'E1312', true, key, $item.code);
                        OnChangeValues(value.APInvoiceDate, 'E1313', true, key, $item.code);
                        OnChangeValues(value.RX_NKCostCurrency, 'E1307', true, key, $item.code);
                        OnChangeValues(value.EstimatedCost, 'E1194', true, key, $item.code);
                        OnChangeValues(value.OSCostAmt, 'E1196', true, key, $item.code);
                        OnChangeValues(value.LocalCostAmt, 'E1308', true, key, $item.code);
                        OnChangeValues(value.OSSellAmt, 'E1197', true, key, $item.code);
                        OnChangeValues(value.LocalSellAmt, 'E1309', true, key, $item.code);
                    }
                    else if (type == 'PostRevenue' || type == 'Post') {
                        OnChangeValues(value.OSSellAmt, 'E1197', true, key, $item.code);
                        OnChangeValues(value.LocalSellAmt, 'E1309', true, key, $item.code);
                    }
                    OnChangeValues(value.CustomerCode, 'E1311', true, key, $item.code);
                    OnChangeValues(value.RX_NKSellCurrency, 'E1193', true, key, $item.code);
                    OnChangeValues(value.EstimatedRevenue, 'E1195', true, key, $item.code);
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
        //#endregion Validation
    }
})();