(function () {
    "use strict";

    angular
        .module("Application")
        .factory("outwardConfig", OutwardConfig);

    OutwardConfig.$inject = ["$location", "$q", "helperService", "apiService","toastr"];

    function OutwardConfig($location, $q, helperService, apiService,toastr) {
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
                            "Url": "WmsOutwardList/GetById/",
                            "FilterID": "WMSWORK"
                        },
                        "Warehouse":{
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWarehouse/FindAll",
                            "FilterID":"WMSWARH"
                        },
                        "Summary":{
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutwardSummary/FindAll",
                            "FilterID":"WMSOUTSUM"
                        },
                        "GetOutwardByDate": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/GetOutwardByDate",
                            "FilterID": "WMSOUT"
                        },
                        "GetOutwardByClient": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/GetOutwardByClient",
                            "FilterID": "WMSOUT"
                        },
                        "Validationapi":{
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Validation/FindAll",
                            "FilterID":"VALIDAT"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsOutwardList/OutwardHeaderActivityClose/",
                        },
                    },
                    "Meta": {

                    },
                    "Message":false
                }

            },
            "TabList": [],
            "ValidationValues":"",
            "SaveAndClose":false,
            "GetTabDetails": GetTabDetails,
            "GeneralValidation":GeneralValidation,
            "RemoveApiErrors":RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall":ValidationFindall,
        };

        return exports;

        function GetTabDetails(currentOutward, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertOutward": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsOutwardList/Insert"
                            },
                            "UpdateOutward": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsOutwardList/Update"
                            },
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
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
                            "Containers": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderContainer/FindAll",
                                "FilterID": "WMSWORKC"
                            },
                            "Transport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsTransportList/GetById/",
                                "FilterID": "WMSTRAN"
                            },
                            "ContainerDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderContainer/Delete/"
                            },
                            "ReferenceDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderReference/Delete/"
                            },
                            "ServiceDelete":{
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "JobService/Delete/"
                            }, 
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsOutwardWorkOrderLine/Delete/"
                            },
                            "OrgAddress":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgAddress/FindAll",
                                "FilterID":"ORGADDR"
                            },
                            "OrgMiscServ":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "OrgMiscServ/FindAll",
                                "FilterID":"ORGMISC"
                            },
                            "LineSummary":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderLineSummary/FindAll",
                                "FilterID":"WMSWLS"
                            },
                            "FetchQuantity":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FetchQuantity",
                            },
                            "OrgPartRelation":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductRelatedParty/FindAll",
                                "FilterID": "ORGPRL"
                            },
                            "GenerateReport": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "Communication/GenerateReport",
                            },
                            "UnitConversation": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PrdProductUnit/FindAll",
                                "FilterID": "ORGPARTU"
                            },
                        },

                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa fa-file",
                                "GParentRef": "general"
                            }, {
                                "DisplayName": "Line",
                                "Value": "Line",
                                "Icon": "glyphicon glyphicon-list-alt",
                                "GParentRef": "line"
                            } ,{
                                "DisplayName": "Pick",
                                "Value": "Pick",
                                "Icon": "icomoon icon-pick",
                                "GParentRef": "pick"
                            } ,{
                                "DisplayName": "Containers",
                                "Value": "Containers",
                                "Icon": "fa fa-truck",
                                "GParentRef": "containers"
                            }, {
                                "DisplayName": "References & Services",
                                "Value": "References & Services",
                                "Icon": "fa fa-pencil-square-o",
                                "GParentRef": "referencesandserivces"
                            }, {
                                "DisplayName": "Documents",
                                "Value": "Documents",
                                "Icon": "fa fa-file-pdf-o"

                            }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "Client": helperService.metaBase(),
                                "Warehouse": helperService.metaBase(),
                                "RequiredDate":helperService.metaBase(),
                                "UIWmsWorkOrderLine":helperService.metaBase(),
                                "UIWmsWorkOrderContainer":helperService.metaBase(),
                                "UIWmsWorkOrderReference":helperService.metaBase(),
                                "UIJobServices":helperService.metaBase(),
                            },
                        },
                        "CheckPoints":{
                            "DisableSave":false,
                            "Checkpointhidden":true,
                            "HideindexReferences":false,
                            "HideindexServices":false,
                            "PercentageValues":false,
                            "NotFinaliseStage":true,
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentOutward.data;
                
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentOutward.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentOutward.PK).then(function (response) {
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentOutward.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentOutward.WorkOrderID,
                        code: currentOutward.WorkOrderID,
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

        function ValidationFindall(){
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode":"OUT"
            };     
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": exports.Entities.Header.API.Validationapi.FilterID
            };
            apiService.post("eAxisAPI", exports.Entities.Header.API.Validationapi.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues=(response.data.Response);
                }
            });
        }

        function GeneralValidation($item){
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
            _input = _Data.Header.Data;
           
            if(!_input.UIWmsOutwardHeader.Client || _input.UIWmsOutwardHeader.Client){
                OnChangeValues(_input.UIWmsOutwardHeader.Client,'E3501',false,undefined,$item.label);
            }
            if(!_input.UIWmsOutwardHeader.Warehouse || _input.UIWmsOutwardHeader.Warehouse){
                OnChangeValues(_input.UIWmsOutwardHeader.Warehouse,'E3502',false,undefined,$item.label);
            }
            if(!_input.UIWmsOutwardHeader.RequiredDate || _input.UIWmsOutwardHeader.RequiredDate){
                OnChangeValues(_input.UIWmsOutwardHeader.RequiredDate,'E3503',false,undefined,$item.label);
            }


            //Receive Lines Validation
            if(_input.UIWmsWorkOrderLine.length>0){
                angular.forEach(_input.UIWmsWorkOrderLine,function(value,key){
                    if(!value.Product || value.Product)
                    OnChangeValues(value.Product,'E3504',true,key,$item.label);

                    if(!parseFloat(value.Packs) || parseFloat(value.Packs))
                    OnChangeValues(parseFloat(value.Packs),'E3505',true,key,$item.label);

                    if(!value.PAC_PackType || value.PAC_PackType)
                    OnChangeValues(value.PAC_PackType,'E3506',true,key,$item.label);

                    if(!parseFloat(value.Units) || parseFloat(value.Units))
                    OnChangeValues(parseFloat(value.Units),'E3520',true,key,$item.label);

                    if(!value.StockKeepingUnit || value.StockKeepingUnit)
                    OnChangeValues(value.StockKeepingUnit,'E3521',true,key,$item.label);

                });
            }

            //Containers Validation
            if(_input.UIWmsWorkOrderContainer.length>0){
                angular.forEach(_input.UIWmsWorkOrderContainer,function(value,key){
                    if(!value.ContainerNumber || value.ContainerNumber)
                    OnChangeValues(value.ContainerNumber,'E3013',true,key,$item.label);

                    if(!value.Type || value.Type)
                    OnChangeValues(value.Type,'E3014',true,key,$item.label);

                });
            }

             //Containers Validation
             if(_input.UIWmsWorkOrderReference.length>0){
                angular.forEach(_input.UIWmsWorkOrderReference,function(value,key){
                    if(!value.RefType || value.RefType)
                    OnChangeValues(value.RefType,'E3015',true,key,$item.label);

                    if(!value.Reference || value.Reference)
                    OnChangeValues(value.Reference,'E3016',true,key,$item.label);

                });
            }

             //Services Validation
             if(_input.UIJobServices.length>0){
                angular.forEach(_input.UIJobServices,function(value,key){
                    if(!value.ServiceCode || value.ServiceCode)
                    OnChangeValues(value.ServiceCode,'E3017',true,key,$item.label);
                });
            }


        }

        function OnChangeValues(fieldvalue,code,IsArray,RowIndex,label) { 
            angular.forEach(exports.ValidationValues,function(value,key){
                if(value.Code.trim() === code){
                    GetErrorMessage(fieldvalue,value,IsArray,RowIndex,label);
                }
            });
        }

        function GetErrorMessage(fieldvalue,value,IsArray,RowIndex,label){
            if(!IsArray){
                if (!fieldvalue) {
                    PushErrorWarning(value.Code,value.Message,"E",false,value.CtrlKey,label,undefined,undefined,undefined,undefined,undefined,value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code,"E",value.CtrlKey,label);
                }
            }else{
                if (!fieldvalue) {
                    PushErrorWarning(value.Code,value.Message,"E",false,value.CtrlKey,label,IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    RemoveErrorWarning(value.Code,"E",value.CtrlKey,label,IsArray, RowIndex, value.ColIndex);
                }
            }
        }
        
        function RemoveApiErrors(item,label){
            angular.forEach(item,function(value,key){
                RemoveErrorWarning(value.Code,"E",value.CtrlKey,label);
            });
        }
    }
})();


