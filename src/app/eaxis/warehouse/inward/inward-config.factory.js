(function () {
    "use strict";

    angular
        .module("Application")
        .factory('inwardConfig', InwardConfig);

    InwardConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr"];

    function InwardConfig($location, $q, helperService, apiService, toastr) {
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
                            "Url": "WmsInwardList/GetById/",
                            "FilterID": "WMSWORK"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/InwardHeaderActivityClose/",
                        },
                        "Warehouse": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWarehouse/FindAll",
                            "FilterID": "WMSWARH"
                        },
                        "Summary": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardSummary/FindAll",
                            "FilterID": "WMSINSUM"
                        },
                        "InwardSummary": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInventoryByProduct/FindAll",
                            "FilterID": "INVBPRO"
                        },
                        "GetInwardByDate": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/GetInwardByDate",
                            "FilterID": "WMSINW"
                        },
                        "GetInwardByClient": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/GetInwardByClient",
                            "FilterID": "WMSINW"
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
                    "Message": false
                }

            },

            "TabList": [],
            "ValidationValues": "",
            "SaveAndClose":false,
            "ProductSummaryList": {},
            "GetTabDetails": GetTabDetails,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,
            "ProductSummary": ProductSummary,
        };

        return exports;

        function GetTabDetails(currentInward, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "InsertInward": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInwardList/Insert"
                            },
                            "UpdateInward": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInwardList/Update"
                            },
                            "UpdateInwardProcess": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInwardList/ProcessUpdate"
                            },
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            "Containers": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderContainer/FindAll",
                                "FilterID": "WMSWORKC"
                            },
                            "References": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderReference/FindAll",
                                "FilterID": "WMSWORKR"
                            },
                            "Services": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobService/FindAll",
                                "FilterID": "JOBSERV"
                            },
                            "Transport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsTransportList/FindAll",
                                "FilterID": "WMSTRAN"
                            },
                            "AllocateLocation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInwardWorkOrderLine/WmsInwardLineWithLocation/FindAll"
                            },
                            "Address": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "JobAddress/DynamicFindAll",
                                "FilterID": "JOBADDR"
                            },
                            "OrgAddress": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/FindAll",
                                "FilterID": "ORGADDR"
                            },
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsInwardWorkOrderLine/Delete/"
                            },
                            "ContainerDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderContainer/Delete/"
                            },
                            "ReferenceDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderReference/Delete/"
                            },
                            "ServiceDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "JobService/Delete/"
                            },
                            "OrgMiscServ": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgMiscServ/FindAll",
                                "FilterID": "ORGMISC"
                            },
                            "AsnLines": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsAsnLine/FindAll",
                                "FilterID": "WMSASNL"
                            },
                            "AsnLinesDelete": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsAsnLine/Delete/",
                                "FilterID": "WMSASNL"
                            },
                            "LineSummary": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsLineSummary/FindAll",
                                "FilterID": "WMSLNSM"
                            },
                            "Product": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProduct/FindAll  ",
                                "FilterID": "ORGSUPP"
                            },
                            "FetchQuantity": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FetchQuantity",
                            },
                            "Inventory": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            },
                            "Putaway": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WMSProductParamsByWmsAndClient/FindAll",
                                "FilterID": "WMSPPWNC"
                            },
                            "Validationapi": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Validation/FindAll",
                                "FilterID": "VALIDAT"
                            },
                            "Appsettings": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AppSettings/FindAll/",
                                "FilterID": "APPSETT"
                            },
                            "GenerateReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Communication/GenerateReport",
                            },
                            "OrgPartRelation":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductRelatedParty/FindAll",
                                "FilterID": "ORGPRL"
                            },
                            "UnitConversation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FindAll",
                                "FilterID": "ORGPARTU"
                            },

                        },

                        "Meta": {
                            "MenuList": [
                                {
                                    "DisplayName": "My Task",
                                    "Value": "MyTask",
                                    "Icon": "menu-icon icomoon icon-my-task",
                                    "IsDisabled": false
                                },
                                {
                                    "DisplayName": "General",
                                    "Value": "General",
                                    "Icon": "fa fa-file",
                                    "GParentRef": "general",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "ASN Lines",
                                    "Value": "AsnLines",
                                    "Icon": "glyphicon glyphicon-indent-left",
                                    "GParentRef": "asnlines",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Receive Lines",
                                    "Value": "ReceiveLines",
                                    "Icon": "glyphicon glyphicon-saved",
                                    "GParentRef": "receivelines",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Product Summary",
                                    "Value": "ProductSummary",
                                    "Icon": "glyphicon glyphicon-list-alt",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Containers",
                                    "Value": "Containers",
                                    "Icon": "fa fa-truck",
                                    "GParentRef": "containers",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "References & Services",
                                    "Value": "References & Services",
                                    "Icon": "fa fa-pencil-square-o",
                                    "GParentRef": "referencesandserivces",
                                    "IsDisabled": false
                                }, {
                                    "DisplayName": "Documents",
                                    "Value": "Documents",
                                    "Icon": "fa fa-file-pdf-o",
                                    "IsDisabled": false

                                }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "Client": helperService.metaBase(),
                                "Warehouse": helperService.metaBase(),
                                "ArrivalDate": helperService.metaBase(),
                                "WorkOrderSubType": helperService.metaBase(),
                                "UIWmsAsnLine": helperService.metaBase(),
                                "UIWmsWorkOrderLine": helperService.metaBase(),
                                "UIWmsWorkOrderContainer": helperService.metaBase(),
                                "UIWmsWorkOrderReference": helperService.metaBase(),
                                "UIJobServices": helperService.metaBase(),
                                "PutOrPickCompDateTime":helperService.metaBase(),
                                "PutOrPickStartDateTime":helperService.metaBase(),
                            },
                        },
                        "CheckPoints": {
                            "DisableSave": false,
                            "Receiveline": false,
                            "Checkpointhidden": true,
                            "HideindexReferences": false,
                            "HideindexServices": false,
                            "PercentageValues":false,
                            "NotFinaliseStage":true,
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentInward.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentInward.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentInward.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;
                    
                    var obj = {
                        [currentInward.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentInward.WorkOrderID,
                        code: currentInward.WorkOrderID,
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

                    if(!IsArray){
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            return value.Code == Code;
                        });  
                    }else{
                        var _isExistGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.some(function (value, key) {
                            if(value.Code == Code && value.RowIndex == RowIndex && value.ColIndex == ColIndex)
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
                        
                        if(!IsArray){
                            var _indexWarning = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].WARNING.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        }else{
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                if(val.Code == Code && val.RowIndex == RowIndex && val.ColIndex==ColIndex)
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

                        if(!IsArray){
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                return val.Code;
                            }).indexOf(Code);
                        }else{
                            var _indexError = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning[MetaObject].ERROR.map(function (val, key) {
                                if(val.Code == Code && val.RowIndex == RowIndex && val.ColIndex==ColIndex)
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

        function RemoveErrorWarning(Code, MessageType, MetaObject, EntityObject,IsArray, RowIndex, ColIndex) {
            if (Code) {
                var _index = exports.TabList.map(function (value, key) {
                    return value.label;
                }).indexOf(EntityObject);

                    if (_index !== -1) {
                        if(!IsArray){
                            var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                                return value.Code;
                            }).indexOf(Code);
                        }else{
                            var _indexGlobal = exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.map(function (value, key) {
                                if(value.Code==Code && value.RowIndex==RowIndex && value.ColIndex==ColIndex)
                                return value.Code;
                            }).indexOf(Code);
                        }


                    if (_indexGlobal !== -1) {
                        exports.TabList[_index][EntityObject].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.splice(_indexGlobal, 1);
                    }

                    if (MessageType === "E") {
                        if(!IsArray){
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
                        }else if(IsArray){
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
                        if(!IsArray){
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
                        }else if(IsArray){
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
        }


        // Validations

        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode":"INW"
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
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (!_input.UIWmsInwardHeader.Client || _input.UIWmsInwardHeader.Client) {
                OnChangeValues(_input.UIWmsInwardHeader.Client, 'E3001', false, undefined, $item.label);
            }
            if (!_input.UIWmsInwardHeader.Warehouse || _input.UIWmsInwardHeader.Warehouse) {
                OnChangeValues(_input.UIWmsInwardHeader.Warehouse, 'E3002', false, undefined, $item.label);
            }
            if (!_input.UIWmsInwardHeader.WorkOrderSubType || _input.UIWmsInwardHeader.WorkOrderSubType) {
                OnChangeValues(_input.UIWmsInwardHeader.WorkOrderSubType, 'E3004', false, undefined, $item.label);
            }

            //Asn Lines Validation
            if (_input.UIWmsAsnLine.length > 0) {
                angular.forEach(_input.UIWmsAsnLine, function (value, key) {
                    if (!value.Product || value.Product)
                        OnChangeValues(value.Product, 'E3005', true, key, $item.label);

                    if (!parseFloat(value.Packs) || parseFloat(value.Packs))
                        OnChangeValues(parseFloat(value.Packs), 'E3006', true, key, $item.label);

                    if (!value.PAC_PackType || value.PAC_PackType)
                        OnChangeValues(value.PAC_PackType, 'E3007', true, key, $item.label);

                    if (!parseFloat(value.Quantity) || parseFloat(value.Quantity))
                        OnChangeValues(parseFloat(value.Quantity), 'E3030', true, key, $item.label);

                    if (!value.StockKeepingUnit || value.StockKeepingUnit)
                        OnChangeValues(value.StockKeepingUnit, 'E3031', true, key, $item.label);

                });
            }

            //Check Duplicate
            if(_input.UIWmsAsnLine.length>1){
                var finishloop = false;
                for(var i=0;i<_input.UIWmsAsnLine.length;i++){
                    for(var j=i+1;j<_input.UIWmsAsnLine.length;j++){
                        if(!finishloop){
                            if((_input.UIWmsAsnLine[i].POR_FK == _input.UIWmsAsnLine[j].POR_FK) && (_input.UIWmsAsnLine[i].Quantity ==_input.UIWmsAsnLine[j].Quantity) && (_input.UIWmsAsnLine[i].Packs==_input.UIWmsAsnLine[j].Packs) &&(_input.UIWmsAsnLine[i].PAC_PackType==_input.UIWmsAsnLine[j].PAC_PackType) &&(_input.UIWmsAsnLine[i].PartAttrib1==_input.UIWmsAsnLine[j].PartAttrib1) &&(_input.UIWmsAsnLine[i].PartAttrib2==_input.UIWmsAsnLine[j].PartAttrib2)&&(_input.UIWmsAsnLine[i].PartAttrib3==_input.UIWmsAsnLine[j].PartAttrib3)&&(_input.UIWmsAsnLine[i].PackingDate==_input.UIWmsAsnLine[j].PackingDate)&&(_input.UIWmsAsnLine[i].ExpiryDate == _input.UIWmsAsnLine[j].ExpiryDate) && (_input.UIWmsAsnLine[i].PalletId==_input.UIWmsAsnLine[j].PalletId)){
                                OnChangeValues(null,'E3040',true,i,$item.label);
                                OnChangeValues(null,'E3040',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //Receive Lines Validation
            if (_input.UIWmsWorkOrderLine.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderLine, function (value, key) {
                    if (!value.Product || value.Product)
                        OnChangeValues(value.Product, 'E3008', true, key, $item.label);

                    if (!parseFloat(value.Packs) || value.Packs)
                        OnChangeValues(value.Packs, 'E3009', true, key, $item.label);

                    if (!value.PAC_PackType || value.PAC_PackType)
                        OnChangeValues(value.PAC_PackType, 'E3010', true, key, $item.label);

                    if (!parseFloat(value.Units) || parseFloat(value.Units))
                        OnChangeValues(parseFloat(value.Units), 'E3032', true, key, $item.label);

                    if (!value.StockKeepingUnit || value.StockKeepingUnit)
                        OnChangeValues(value.StockKeepingUnit, 'E3033', true, key, $item.label);

                    if(!value.IsPartAttrib1ReleaseCaptured){
                        if (_input.UIWmsInwardHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 || _input.UIWmsInwardHeader.IMPartAttrib1Type == 'MAN' && value.UsePartAttrib1 || _input.UIWmsInwardHeader.IMPartAttrib1Type == 'BAT' && value.UsePartAttrib1) {
                            if (!value.PartAttrib1 || value.PartAttrib1)
                                OnChangeValues(value.PartAttrib1, 'E3018', true, key, $item.label);
                        }
                    }    

                    if(!value.IsPartAttrib2ReleaseCaptured){
                        if (_input.UIWmsInwardHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2 || _input.UIWmsInwardHeader.IMPartAttrib2Type == 'MAN' && value.UsePartAttrib2 || _input.UIWmsInwardHeader.IMPartAttrib2Type == 'BAT' && value.UsePartAttrib2) {
                            if (!value.PartAttrib2 || value.PartAttrib2)
                                OnChangeValues(value.PartAttrib2, 'E3019', true, key, $item.label);
                        }
                    }

                    if(!value.IsPartAttrib3ReleaseCaptured){
                        if (_input.UIWmsInwardHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 || _input.UIWmsInwardHeader.IMPartAttrib3Type == 'MAN' && value.UsePartAttrib3 || _input.UIWmsInwardHeader.IMPartAttrib3Type == 'BAT' && value.UsePartAttrib3) {
                            if (!value.PartAttrib3 || value.PartAttrib3)
                                OnChangeValues(value.PartAttrib3, 'E3020', true, key, $item.label);
                        }
                    }

                    if (value.UsePackingDate) {
                        if (!value.PackingDate || value.PackingDate)
                            OnChangeValues(value.PackingDate, 'E3035', true, key, $item.label);
                    }

                    if (value.UseExpiryDate) {
                        if (!value.ExpiryDate || value.ExpiryDate)
                            OnChangeValues(value.ExpiryDate, 'E3036', true, key, $item.label);
                    }

                    if((_input.UIWmsInwardHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 && parseFloat(value.Units) > 1 && !value.IsPartAttrib1ReleaseCaptured) || (_input.UIWmsInwardHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2  && parseFloat(value.Units) >1  && !value.IsPartAttrib2ReleaseCaptured) || (_input.UIWmsInwardHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 && parseFloat(value.Units) > 1  && !value.IsPartAttrib3ReleaseCaptured)){
                        OnChangeValues(null, 'E3038', true, key, $item.label);
                    }else{
                        OnChangeValues('value', 'E3038', true, key, $item.label);
                    }
                });
            }


            //Check Duplicate
            if(_input.UIWmsWorkOrderLine.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWmsWorkOrderLine.length;i++){
                    for(var j=i+1;j<_input.UIWmsWorkOrderLine.length;j++){
                        if(!finishloop){
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib1ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib1 && _input.UIWmsInwardHeader.IMPartAttrib1Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib1){
                                    if(_input.UIWmsWorkOrderLine[i].PartAttrib1 == _input.UIWmsWorkOrderLine[j].PartAttrib1){
                                        OnChangeValues(null,'E3021',true,i,$item.label);
                                        OnChangeValues(null,'E3021',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib2ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib2 && _input.UIWmsInwardHeader.IMPartAttrib2Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib2){
                                    if(_input.UIWmsWorkOrderLine[i].PartAttrib2 == _input.UIWmsWorkOrderLine[j].PartAttrib2){
                                        OnChangeValues(null,'E3022',true,i,$item.label);
                                        OnChangeValues(null,'E3022',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsWorkOrderLine[j].IsPartAttrib3ReleaseCaptured && _input.UIWmsWorkOrderLine[j].UsePartAttrib3 && _input.UIWmsInwardHeader.IMPartAttrib3Type =='SER'){
                                if(_input.UIWmsWorkOrderLine[j].PartAttrib3){
                                    if(_input.UIWmsWorkOrderLine[i].PartAttrib3 == _input.UIWmsWorkOrderLine[j].PartAttrib3){
                                        OnChangeValues(null,'E3023',true,i,$item.label);
                                        OnChangeValues(null,'E3023',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //Containers Validation
            if (_input.UIWmsWorkOrderContainer.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderContainer, function (value, key) {
                    if (!value.ContainerNumber || value.ContainerNumber)
                        OnChangeValues(value.ContainerNumber, 'E3013', true, key, $item.label);

                    if (!value.Type || value.Type)
                        OnChangeValues(value.Type, 'E3014', true, key, $item.label);

                });
            }

            //Containers Validation
            if (_input.UIWmsWorkOrderReference.length > 0) {
                angular.forEach(_input.UIWmsWorkOrderReference, function (value, key) {
                    if (!value.RefType || value.RefType)
                        OnChangeValues(value.RefType, 'E3015', true, key, $item.label);

                    if (!value.Reference || value.Reference)
                        OnChangeValues(value.Reference, 'E3016', true, key, $item.label);

                });
            }

            //Services Validation
            if (_input.UIJobServices.length > 0) {
                angular.forEach(_input.UIJobServices, function (value, key) {
                    if (!value.ServiceCode || value.ServiceCode)
                        OnChangeValues(value.ServiceCode, 'E3017', true, key, $item.label);
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
                    exports.ProductSummaryList[myvalue]=response.data.Response;
                }
            });
        }
    }
})();


