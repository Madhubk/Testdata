(function () {
    "use strict";

    angular
        .module("Application")
        .factory('cycleCountConfig', CycleCountConfig);

    CycleCountConfig.$inject = ["$location", "$q", "helperService", "apiService","appConfig"];

    function CycleCountConfig($location, $q, helperService, apiService,appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsCycleCountList/GetById/"
                        }
                    },
                    "Meta": {
                    }
                }
            },

            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ValidationValues": "",
            "SaveAndClose":false,
            "GeneralValidation": GeneralValidation,
            "RemoveApiErrors": RemoveApiErrors,
            "PushErrorWarning": PushErrorWarning,
            "RemoveErrorWarning": RemoveErrorWarning,
            "GetErrorWarningCountParent": GetErrorWarningCountParent,
            "ShowErrorWarningModal": ShowErrorWarningModal,
            "ValidationFindall": ValidationFindall,

        };

        return exports;

        function GetTabDetails(currentCycleCount, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "Validations": "",
                        "API": {
                            "InsertCycleCount": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsCycleCountList/Insert"
                            },
                            "UpdateCycleCount": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsCycleCountList/Update"
                            },
                            "Inventory":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            },
                            "WmsInventoryByProductAttributesWithLocation":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventoryByProductAttributesWithLocation/FindAll",
                                "FilterID": "WMSINVPL"
                            },
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsCycleCountLine/Delete/"
                            },
                            "WmsStockmovementsSummary":{
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsStockmovementsSummary/FindAll",
                                "FilterID": "WMSSMS"
                            },
                        },

                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "General",
                                "Value": "General",
                                "Icon": "fa fa-file",
                                "GParentRef": "general"
                            }, {
                                "DisplayName": "Lines",
                                "Value": "Lines",
                                "Icon": "glyphicon glyphicon-saved",
                                "GParentRef": "lines"
                            }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "Warehouse": helperService.metaBase(),
                                "UIWmsCycleCountLine":helperService.metaBase(),
                            },
                        },
                        "GlobalVariables": {
                            "StockLoad":false,
                            "Loading":false,
                            "CloseLinesClicked":false,
                            "PartiallyNonEditable":false,
                            "NonEditable":false,
                            "FinalizedDate":"",
                        },
                        "TableProperties":{
                            "UIWmsCycleCountLine":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"checkbox",
                                    "position":'1',
                                    "width":"45",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"sno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Client",
                                    "isenabled":true,
                                    "property":"client",
                                    "position":"3",
                                    "width":"200",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Code",
                                    "isenabled":true,
                                    "property":"productcode",
                                    "position":"4",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Description",
                                    "isenabled":true,
                                    "property":"productdescription",
                                    "position":"5",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Commodity",
                                    "isenabled":true,
                                    "property":"commodity",
                                    "position":"6",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Condition",
                                    "isenabled":true,
                                    "property":"productcondition",
                                    "position":"7",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Pallet ID",
                                    "isenabled":true,
                                    "property":"palletid",
                                    "position":"8",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Location",
                                    "isenabled":true,
                                    "property":"location",
                                    "position":"9",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Area",
                                    "isenabled":true,
                                    "property":"area",
                                    "position":"10",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Row",
                                    "isenabled":true,
                                    "property":"row",
                                    "position":"11",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"System Units",
                                    "isenabled":true,
                                    "property":"systemunits",
                                    "position":"12",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Last Count",
                                    "isenabled":true,
                                    "property":"lastcount",
                                    "position":"13",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Count 1",
                                    "isenabled":true,
                                    "property":"count1",
                                    "position":"14",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Date Verified",
                                    "isenabled":true,
                                    "property":"dateverified",
                                    "position":"15",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Comment",
                                    "isenabled":true,
                                    "property":"comment",
                                    "position":"16",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Status",
                                    "isenabled":true,
                                    "property":"status",
                                    "position":"17",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Date Closed",
                                    "isenabled":true,
                                    "property":"dateclosed",
                                    "position":"18",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Inventory Status",
                                    "isenabled":true,
                                    "property":"inventorystatus",
                                    "position":"19",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 1",
                                    "isenabled":true,
                                    "property":"udf1",
                                    "position":"20",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 2",
                                    "isenabled":true,
                                    "property":"udf2",
                                    "position":"21",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 3",
                                    "isenabled":true,
                                    "property":"udf3",
                                    "position":"22",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Packing Date",
                                    "isenabled":true,
                                    "property":"packingdate",
                                    "position":"23",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Expiry Date",
                                    "isenabled":true,
                                    "property":"expirydate",
                                    "position":"24",
                                    "width":"100",
                                    "display":true
                                }],
                                "checkbox":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"45"
                                },
                                "sno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"40"
                                },
                                "client":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"200"
                                },
                                "productcode":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"150"
                                },
                                "productdescription":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"100"
                                },
                                "commodity":{
                                    "isenabled":true,
                                    "position":"6",
                                    "width":"100"
                                },
                                "productcondition":{
                                    "isenabled":true,
                                    "position":"7",
                                    "width":"150"
                                },
                                "palletid":{
                                    "isenabled":true,
                                    "position":"8",
                                    "width":"100"
                                },
                                "location":{
                                    "isenabled":true,
                                    "position":"9",
                                    "width":"100"
                                },
                                "area":{
                                    "isenabled":true,
                                    "position":"10",
                                    "width":"100"
                                },
                                "row":{
                                    "isenabled":true,
                                    "position":"11",
                                    "width":"100"
                                },
                                "systemunits":{
                                    "isenabled":true,
                                    "position":"12",
                                    "width":"100"
                                },
                                "lastcount":{
                                    "isenabled":true,
                                    "position":"13",
                                    "width":"100"
                                },
                                "count1":{
                                    "isenabled":true,
                                    "position":"14",
                                    "width":"100"
                                },
                                "dateverified":{
                                    "isenabled":true,
                                    "position":"15",
                                    "width":"120"
                                },
                                "comment":{
                                    "isenabled":true,
                                    "position":"16",
                                    "width":"120"
                                },
                                "status":{
                                    "isenabled":true,
                                    "position":"17",
                                    "width":"100"
                                },
                                "dateclosed":{
                                    "isenabled":true,
                                    "position":"18",
                                    "width":"100"
                                },
                                "inventorystatus":{
                                    "isenabled":true,
                                    "position":"19",
                                    "width":"100"
                                },
                                "udf1":{
                                    "isenabled":true,
                                    "position":"20",
                                    "width":"100"
                                },
                                "udf2":{
                                    "isenabled":true,
                                    "position":"21",
                                    "width":"100"
                                },
                                "udf3":{
                                    "isenabled":true,
                                    "position":"22",
                                    "width":"100"
                                },
                                "packingdate":{
                                    "isenabled":true,
                                    "position":"23",
                                    "width":"100"
                                },
                                "expirydate":{
                                    "isenabled":true,
                                    "position":"24",
                                    "width":"100"
                                },
                            }
                        }
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentCycleCount.data;
                _exports.Entities.Header.GetById = currentCycleCount.data;
        
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentCycleCount.entity.StocktakeNumber,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentCycleCount.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentCycleCount.StocktakeNumber]: {
                            ePage: _exports
                        },
                        label: currentCycleCount.StocktakeNumber,
                        code: currentCycleCount.StocktakeNumber,
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
                    _obj.Message = Message+' In Line No '+ (RowIndex+1);
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
            if (EntityObject[EntityObject.label].ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList.length == 0) {
                $("#errorWarningContainer" + EntityObject.label).removeClass("open");
            }
        }

        // Validations
        function ValidationFindall() {
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode":"CYL"
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

        //General Validation
        function GeneralValidation($item){
             //General Page Validation
             var _Data = $item[$item.label].ePage.Entities,
             _input = _Data.Header.Data;
             
            OnChangeValues(_input.UIWmsCycleCountHeader.Warehouse, 'E13001', false, undefined, $item.label);

            //CycleCount Lines Validation
            if (_input.UIWmsCycleCountLine.length > 0) {
                angular.forEach(_input.UIWmsCycleCountLine, function (value, key) {
                    OnChangeValues(value.ClientFullName, 'E13002', true, key, $item.label);

                    OnChangeValues(value.ProductCode, 'E13003', true, key, $item.label);

                    OnChangeValues(value.Location, 'E13004', true, key, $item.label);

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


