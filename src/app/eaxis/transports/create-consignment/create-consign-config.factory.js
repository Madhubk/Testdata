(function () {
    "use strict";

    angular
        .module("Application")
        .factory("createConsignConfig", CreateConsignConfig);

    CreateConsignConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr"];

    function CreateConsignConfig($location, $q, helperService, apiService, toastr) {
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
                        "DataEntry": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsConsignmentList/GetById/"
                        },
                        "Validationapi": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID": "VALIDAT"
                        },
                    },
                    "Meta": {

                    },
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,
        };

        return exports;

        function GetTabDetails(currentConsignment, isNew) {
            var deferred = $q.defer();

            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "OrgAddress": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/FindAll",
                                "FilterID": "ORGADDR"
                            },
                            "InsertConsignment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsConsignmentList/Insert"
                            },
                            "UpdateConsignment": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsConsignmentList/Update"
                            },
                            "OrgHeader": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgHeader/FindAll",
                                "FilterID": "ORGHEAD"
                            },
                            "TmsJourney": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsJourney/FindAll",
                                "FilterID": "TMSJNY"
                            },
                            "TmsJourneyLeg": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsJourneyLeg/FindAll",
                                "FilterID": "TMSJNL"
                            },
                            "CfxMapping": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxMapping/FindAll",
                                "FilterID": "CFXMAPP"
                            },
                            "ItemDetails": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "TmsItem/FindAll",
                                "FilterID": "TMSITE"
                            },
                            "CfxOrgMapping": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxOrgMapping/FindAll",
                                "FilterID": "CFXORMAP"
                            },

                        },
                        "Meta": {
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "SenderCode": helperService.metaBase(),
                                "ReceiverCode": helperService.metaBase(),
                                "ServiceType": helperService.metaBase(),
                                "SenderCarrierCode": helperService.metaBase(),
                                "Item Duplicate": helperService.metaBase(),
                                "ExpectedPickupDateTime": helperService.metaBase(),
                                "TmsConsignmentItem": helperService.metaBase(),
                            },
                        },
                        "CheckPoints": {
                            "DisableSave": false,
                            "DisableAllocate": false,
                            "SaveAndClose": false,
                            "CurrentLocationCode": "",
                            "IsStore":false
                        },

                    },
                }
            }

            if (isNew) {
                _exports.Entities.Header.Data = currentConsignment.data;

                var obj = {
                    [currentConsignment.entity.ConsignmentNumber]: {
                        ePage: _exports
                    },
                    label: currentConsignment.entity.ConsignmentNumber,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentConsignment.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentConsignment.ConsignmentNumber]: {
                            ePage: _exports
                        },
                        label: currentConsignment.ConsignmentNumber,
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
                }

                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                if (_index !== -1) {
                    var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                        return value.Code === Code;
                    });

                    if (!_isExistGlobal) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.push(_obj);
                    }

                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsArray = IsArray;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ParentRef = ParentRef;
                    exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].GParentRef = GParentRef;

                    if (MessageType === "W") {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].IsWarning = true;

                        // var _isExistWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.some(function (val, key) {
                        //     return val.Code === Code;
                        // });
                        var _indexWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (val, key) {
                            return val.Code;
                        }).indexOf(Code);

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

                        // var _isExistError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.some(function (val, key) {
                        //     return val.Code === Code;
                        // });
                        var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                            return val.Code;
                        }).indexOf(Code);

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

        function RemoveErrorWarning(Code, MessageType, MetaObject, EntityObject) {
            if (Code) {
                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                if (_index !== -1) {
                    var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                        return value.Code;
                    }).indexOf(Code);

                    if (_indexGlobal !== -1) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.splice(_indexGlobal, 1);
                    }

                    if (MessageType === "E") {
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
                    } else if (MessageType === "W") {
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
            $("#errorWarningContainernew").toggleClass("open");
        }

        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "TMS",
                "SubModuleCode": "CON"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": exports.Entities.Header.API.Validationapi.FilterID
            };
            apiService.post("eAxisAPI", exports.Entities.Header.API.Validationapi.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues = (response.data.Response);
                }
            });
        }

        function GeneralValidation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

                OnChangeValues(_input.TmsConsignmentHeader.SenderCode, 'E5516', false, undefined, $item.label);

                OnChangeValues(_input.TmsConsignmentHeader.ReceiverCode, 'E5517', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsConsignmentHeader.ServiceType, 'E5518', false, undefined, $item.label);
            
                OnChangeValues(_input.TmsConsignmentHeader.SenderCarrierCode, 'E5519', false, undefined, $item.label);
            
            // if (!_input.TmsConsignmentHeader.JourneyTitle || _input.TmsConsignmentHeader.JourneyTitle) {
            //     OnChangeValues(_input.TmsConsignmentHeader.JourneyTitle, 'E5520', false, undefined, $item.label);
            // }
            if (_input.TmsConsignmentHeader.ServiceType == "STS" || _input.TmsConsignmentHeader.ServiceType == "PRF") {
                OnChangeValues(_input.TmsConsignmentHeader.ExpectedPickupDateTime, 'E5521', false, undefined, $item.label);
            }
            //TmsConsignmentItem Validation
            if (_input.TmsConsignmentItem.length > 0) {
                angular.forEach(_input.TmsConsignmentItem, function (value, key) {
                    if (!value.TIT_ItemCode || value.TIT_ItemCode)
                        OnChangeValues(value.TIT_ItemCode, 'E5547', true, key, $item.label);

                    if (!value.TIT_ItemRef_ID || value.TIT_ItemRef_ID)
                        OnChangeValues(value.TIT_ItemRef_ID, 'E5548', true, key, $item.label);
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
    }

})();