(function () {
    "use strict";

    angular
        .module("Application")
        .factory('deliveryConfig', DeliveryRequestConfig);

    DeliveryRequestConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "appConfig"];

    function DeliveryRequestConfig($location, $q, helperService, apiService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsDeliveryList/GetById/"
                        }
                    },
                    "Meta": {

                    },
                    "Message": false
                }

            },

            "TabList": [],
            "ValidationValues": "",
            "SaveAndClose": false,
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,
            "TempOutwardPK": "",
            "CallOutwardFunction": false
        };

        return exports;

        function GetTabDetails(currentDelivery, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "InsertDelivery": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsDeliveryList/Insert"
                            },
                            "UpdateDelivery": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsDeliveryList/Update"
                            },
                            "GetByID": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "WmsDeliveryList/GetById/",
                            },
                        },
                        "Meta": {
                            "MenuList": [
                                {
                                    "DisplayName": "My Task",
                                    "Value": "MyTask",
                                    "Icon": "menu-icon icomoon icon-my-task",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "General",
                                    "Value": "General",
                                    "Icon": "fa fa-file",
                                    "GParentRef": "general",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Delivery Line",
                                    "Value": "DeliveryLine",
                                    "Icon": "glyphicon glyphicon-indent-left",
                                    "GParentRef": "deliverylines",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Delivery Orders",
                                    "Value": "DeliveryOrders",
                                    "Icon": "glyphicon glyphicon-saved",
                                    "GParentRef": "deliveryorders",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Delivery Details",
                                    "Value": "DeliveryDetails",
                                    "Icon": "glyphicon glyphicon-list-alt",
                                    "IsDisabled": false
                                }, 
                                // {
                                //     "DisplayName": "Document",
                                //     "Value": "Documents",
                                //     "Icon": "glyphicon glyphicon-list-alt",
                                //     "IsDisabled": false
                                // }
                            ],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "ClientCode": helperService.metaBase(),
                                "WarehouseCode": helperService.metaBase(),
                                "ConsigneeCode": helperService.metaBase(),
                                "ConsigneeCode": helperService.metaBase(),
                                "RequestMode": helperService.metaBase(),
                                "ResponseType": helperService.metaBase(),
                                "Requester": helperService.metaBase(),
                                "RequesterContactNo": helperService.metaBase(),
                                "AdditionalRef1Code": helperService.metaBase(),
                                "AdditionalRef2Code": helperService.metaBase(),
                                "DeliveryRequestedDateTime": helperService.metaBase(),
                                "AcknowledgedPerson": helperService.metaBase(),
                                "AcknowledgementDateTime": helperService.metaBase(),
                                "UIWmsDeliveryLine": helperService.metaBase(),
                            },
                        },
                        "GlobalVariables": {
                            "Loading": false,
                            "NonEditable": false
                        },
                        "TableProperties": {
                            "UIWmsDeliveryLine": {
                                "HeaderProperties": [{
                                    "columnname": "Checkbox",
                                    "isenabled": true,
                                    "property": "rcheckbox",
                                    "position": '1',
                                    "width": "45",
                                    "display": false
                                }, {
                                    "columnname": "S.No",
                                    "isenabled": true,
                                    "property": "rsno",
                                    "position": "2",
                                    "width": "40",
                                    "display": false
                                },
                                {
                                    "columnname": "CSR No",
                                    "isenabled": true,
                                    "property": "rcsrno",
                                    "position": "3",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Code",
                                    "isenabled": true,
                                    "property": "rproductcode",
                                    "position": "4",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Description",
                                    "isenabled": true,
                                    "property": "rproductdescription",
                                    "position": "5",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Commodity",
                                    "isenabled": true,
                                    "property": "rcommodity",
                                    "position": "6",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Pack",
                                    "isenabled": true,
                                    "property": "rpack",
                                    "position": "7",
                                    "width": "100", "display": true
                                },
                                {
                                    "columnname": "Pack UQ",
                                    "isenabled": true,
                                    "property": "rpackuq",
                                    "position": "8",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Quantity",
                                    "isenabled": true,
                                    "property": "rquantity",
                                    "position": "9",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Quantity UQ",
                                    "isenabled": true,
                                    "property": "rquantityuq",
                                    "position": "10",
                                    "width": "100",
                                    "display": true
                                },
                                {
                                    "columnname": "Product Condition",
                                    "isenabled": true,
                                    "property": "rproductcondition",
                                    "position": "11",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 1",
                                    "isenabled": true,
                                    "property": "rudf1",
                                    "position": "12",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 2",
                                    "isenabled": true,
                                    "property": "rudf2",
                                    "position": "13",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "UDF 3",
                                    "isenabled": true,
                                    "property": "rudf3",
                                    "position": "14",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Packing Date",
                                    "isenabled": true,
                                    "property": "rpackingdate",
                                    "position": "15",
                                    "width": "150",
                                    "display": true
                                },
                                {
                                    "columnname": "Expiry Date",
                                    "isenabled": true,
                                    "property": "rexpirydate",
                                    "position": "16",
                                    "width": "150",
                                    "display": true
                                }],
                                "rcheckbox": {
                                    "isenabled": true,
                                    "position": "1",
                                    "width": "45"
                                },
                                "rsno": {
                                    "isenabled": true,
                                    "position": "2",
                                    "width": "40"
                                },
                                "rcsrno": {
                                    "isenabled": true,
                                    "position": "3",
                                    "width": "150"
                                },
                                "rproductcode": {
                                    "isenabled": true,
                                    "position": "4",
                                    "width": "150"
                                },
                                "rproductdescription": {
                                    "isenabled": true,
                                    "position": "5",
                                    "width": "100"
                                },
                                "rcommodity": {
                                    "isenabled": true,
                                    "position": "6",
                                    "width": "100"
                                },
                                "rpack": {
                                    "isenabled": true,
                                    "position": "7",
                                    "width": "100"
                                },
                                "rpackuq": {
                                    "isenabled": true,
                                    "position": "8",
                                    "width": "100"
                                },
                                "rquantity": {
                                    "isenabled": true,
                                    "position": "9",
                                    "width": "100"
                                },
                                "rquantityuq": {
                                    "isenabled": true,
                                    "position": "10",
                                    "width": "100"
                                },
                                "rproductcondition": {
                                    "isenabled": true,
                                    "position": "11",
                                    "width": "150"
                                },
                                "rudf1": {
                                    "isenabled": true,
                                    "position": "12",
                                    "width": "150"
                                },
                                "rudf2": {
                                    "isenabled": true,
                                    "position": "13",
                                    "width": "150"
                                },
                                "rudf3": {
                                    "isenabled": true,
                                    "position": "14",
                                    "width": "150"
                                },
                                "rpackingdate": {
                                    "isenabled": true,
                                    "position": "15",
                                    "width": "150"
                                },
                                "rexpirydate": {
                                    "isenabled": true,
                                    "position": "16",
                                    "width": "150"
                                }
                            }
                        },
                    },
                }
            }
            if (isNew) {
                _exports.Entities.Header.Data = currentDelivery.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentDelivery.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentDelivery.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentDelivery.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentDelivery.WorkOrderID,
                        code: currentDelivery.WorkOrderID,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
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

        function GetErrorWarningCountParent(ParentId, EntityObject, Type, ParentType) {
            var _parentList = [];
            var _index = exports.TabList.map(function (value, key) {
                return value.label;
            }).indexOf(EntityObject);

            if (_index !== -1) {
                exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value1, key1) {
                    // ParentIdList.map(function (value2, key2) {
                    if (ParentType == "GParent") {
                        if (value1.GParentRef === ParentId && value1.MessageType === Type) {
                            _parentList.push(value1);
                        }
                    } else if (ParentType == "Parent") {
                        if (value1.ParentRef === ParentId && value1.MessageType === Type) {
                            _parentList.push(value1);
                        }
                    }
                    // });
                });
            }
            return _parentList;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.label).toggleClass("open");
            if (EntityObject[EntityObject.label].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.length == 0) {
                $("#errorWarningContainer" + EntityObject.label).removeClass("open");
            }
        }

        // Validations
        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode": "DEL"
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
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            OnChangeValues(_input.UIWmsDelivery.ClientCode, 'E3050', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsDelivery.WarehouseCode, 'E3051', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsDelivery.ConsigneeCode, 'E3052', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.RequestMode, 'E3053', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.ResponseType, 'E3054', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.Requester, 'E3055', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.RequesterContactNo, 'E3056', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.AdditionalRef1Code, 'E3083', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.AdditionalRef2Code, 'E3105', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.DeliveryRequestedDateTime, 'E3106', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.AcknowledgedPerson, 'E3107', false, undefined, $item.label);
            OnChangeValues(_input.UIWmsWorkorderReport.AcknowledgementDateTime, 'E3108', false, undefined, $item.label);

            //Delivery Lines Validation
            if (_input.UIWmsDeliveryLine.length > 0) {
                angular.forEach(_input.UIWmsDeliveryLine, function (value, key) {
                    OnChangeValues(value.ProductCode, 'E3086', true, key, $item.label);
                    // Packs should be 1
                    if (value.Packs) {
                        if (value.Packs != "1")
                            OnChangeValues(value.Pack, 'E3091', true, key, $item.label);
                        else
                            OnChangeValues(value.Packs, 'E3091', true, key, $item.label);
                    }
                    OnChangeValues(parseFloat(value.Packs), 'E3087', true, key, $item.label);
                    OnChangeValues(value.PAC_PackType, 'E3088', true, key, $item.label);
                    OnChangeValues(parseFloat(value.Units), 'E3089', true, key, $item.label);
                    OnChangeValues(value.StockKeepingUnit, 'E3090', true, key, $item.label);
                    OnChangeValues(value.ProductCondition, 'E3085', true, key, $item.label);
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
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, undefined, undefined, undefined, undefined, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
                }
            } else {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code, "E", value.CtrlKey, label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        function RemoveApiErrors(item, label) {
            angular.forEach(item, function (value, key) {
                RemoveErrorWarning(value.Code, "E", value.CtrlKey, label);
            });
        }

        //Get Product SummaryList
        function ProductSummary(item) {
            var _filter = {
                "WOD_FK": item.Data.PK
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": item.API.LineSummary.FilterID
            };

            apiService.post("eAxisAPI", item.API.LineSummary.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var myvalue = angular.copy(item.Data.PK);
                    exports.ProductSummaryList[myvalue] = response.data.Response;
                }
            });
        }
    }
})();


