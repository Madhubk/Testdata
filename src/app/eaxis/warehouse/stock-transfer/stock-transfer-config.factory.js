(function () {
    "use strict";

    angular
        .module("Application")
        .factory('stocktransferConfig', StocktransferConfig);

    StocktransferConfig.$inject = ["$location", "$q", "helperService", "apiService","appConfig"];

    function StocktransferConfig($location, $q, helperService, apiService,appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsStockTransferList/GetById/",
                            "FilterID": "WMSSTK"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsStockTransferList/StockTransferHeaderActivityClose/",
                        },
                    },
                    "Meta": {
                    }
                }
            },

            "TabList": [],
            "ValidationValues":"",
            "SaveAndClose":false,
            "EnableFinaliseValidation":false,
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

        function GetTabDetails(currentStockTransfer, isNew) {
            console.log(currentStockTransfer)
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations":"",
                        "RowIndex": -1,
                        "API": {
                            "InsertStockTransfer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsStockTransferList/Insert"
                            },
                            "UpdateStockTransfer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsStockTransferList/Update"
                            },
                            "GetInventoryList": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsInventory/FindAll",
                                "FilterID": "WMSINV"
                            },
                            "LineDelete": {
                                "IsAPI": "true",
                                "HttpType": "Get",
                                "Url": "WmsWorkOrderLine/Delete/"
                            },
                            "InsertLine": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsUploadLineItems/Insert"
                            },
                        },

                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "UIWmsStockTransferLine": helperService.metaBase(),
                                "Warehouse": helperService.metaBase(),
                                "Client": helperService.metaBase(),
                            },
                        },
                        "GlobalVariables":{
                            "Loading":false,
                            "NonEditable":false,
                        },
                        "TableProperties":{
                            "UIWmsStockTransferLine":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"rcheckbox",
                                    "position":'1',
                                    "width":"45",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"rsno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Product Code",
                                    "isenabled":true,
                                    "property":"rproductcode",
                                    "position":"3",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Description",
                                    "isenabled":true,
                                    "property":"rproductdescription",
                                    "position":"4",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Commodity",
                                    "isenabled":true,
                                    "property":"rcommodity",
                                    "position":"5",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Pack",
                                    "isenabled":true,
                                    "property":"rpack",
                                    "position":"6",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Pack UQ",
                                    "isenabled":true,
                                    "property":"rpackuq",
                                    "position":"7",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Quantity",
                                    "isenabled":true,
                                    "property":"rquantity",
                                    "position":"8",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Quantity UQ",
                                    "isenabled":true,
                                    "property":"rquantityuq",
                                    "position":"9",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Condition",
                                    "isenabled":true,
                                    "property":"rproductcondition",
                                    "position":"10",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Arrival Date",
                                    "isenabled":true,
                                    "property":"rarrivaldate",
                                    "position":"11",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Location Source",
                                    "isenabled":true,
                                    "property":"rlocationsource",
                                    "position":"12",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Location Destination",
                                    "isenabled":true,
                                    "property":"rlocationdestination",
                                    "position":"13",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Pallet ID Source",
                                    "isenabled":true,
                                    "property":"rpalletidsource",
                                    "position":"14",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Pallet ID Destination",
                                    "isenabled":true,
                                    "property":"rpalletiddestination",
                                    "position":"15",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Destination Location Status",
                                    "isenabled":true,
                                    "property":"rlocationstatus",
                                    "position":"16",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 1",
                                    "isenabled":true,
                                    "property":"rudf1",
                                    "position":"17",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 2",
                                    "isenabled":true,
                                    "property":"rudf2",
                                    "position":"18",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 3",
                                    "isenabled":true,
                                    "property":"rudf3",
                                    "position":"19",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Packing Date",
                                    "isenabled":true,
                                    "property":"rpackingdate",
                                    "position":"20",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Expiry Date",
                                    "isenabled":true,
                                    "property":"rexpirydate",
                                    "position":"21",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Picked Time",
                                    "isenabled":true,
                                    "property":"rpickedtime",
                                    "position":"22",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Putaway Time",
                                    "isenabled":true,
                                    "property":"rputawaytime",
                                    "position":"23",
                                    "width":"150",
                                    "display":true
                                }],
                                "rcheckbox":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"45"
                                },
                                "rsno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"40"
                                },
                                "rproductcode":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"150"
                                },
                                "rproductdescription":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"100"
                                },
                                "rcommodity":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"100"
                                },
                                "rpack":{
                                    "isenabled":true,
                                    "position":"6",
                                    "width":"100"
                                },
                                "rpackuq":{
                                    "isenabled":true,
                                    "position":"7",
                                    "width":"150"
                                },
                                "rquantity":{
                                    "isenabled":true,
                                    "position":"8",
                                    "width":"100"
                                },
                                "rquantityuq":{
                                    "isenabled":true,
                                    "position":"9",
                                    "width":"100"
                                },
                                "rproductcondition":{
                                    "isenabled":true,
                                    "position":"10",
                                    "width":"150"
                                },
                                "rarrivaldate":{
                                    "isenabled":true,
                                    "position":"11",
                                    "width":"150"
                                },
                                "rlocationsource":{
                                    "isenabled":true,
                                    "position":"12",
                                    "width":"100"
                                },
                                "rlocationdestination":{
                                    "isenabled":true,
                                    "position":"13",
                                    "width":"100"
                                },
                                "rpalletidsource":{
                                    "isenabled":true,
                                    "position":"14",
                                    "width":"120"
                                },
                                "rpalletiddestination":{
                                    "isenabled":true,
                                    "position":"15",
                                    "width":"120"
                                },
                                "rlocationstatus":{
                                    "isenabled":true,
                                    "position":"16",
                                    "width":"100"
                                },
                                "rudf1":{
                                    "isenabled":true,
                                    "position":"17",
                                    "width":"150"
                                },
                                "rudf2":{
                                    "isenabled":true,
                                    "position":"18",
                                    "width":"150"
                                },
                                "rudf3":{
                                    "isenabled":true,
                                    "position":"19",
                                    "width":"150"
                                },
                                "rpackingdate":{
                                    "isenabled":true,
                                    "position":"20",
                                    "width":"150"
                                },
                                "rexpirydate":{
                                    "isenabled":true,
                                    "position":"21",
                                    "width":"150"
                                },
                                "rpickedtime":{
                                    "isenabled":true,
                                    "position":"22",
                                    "width":"150"
                                },
                                "rputawaytime":{
                                    "isenabled":true,
                                    "position":"23",
                                    "width":"150"
                                },
                            },
                            "Inventory":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"icheckbox",
                                    "position":'1',
                                    "width":"30",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"isno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Product Code",
                                    "isenabled":true,
                                    "property":"iproductcode",
                                    "position":"3",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Product Description",
                                    "isenabled":true,
                                    "property":"iproductdescription",
                                    "position":"4",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Receipt Reference",
                                    "isenabled":true,
                                    "property":"ireceiptreference",
                                    "position":"5",
                                    "width":"100",
                                    "display":true    
                                },
                                {
                                    "columnname":"Inventory Status",
                                    "isenabled":true,
                                    "property":"istatus",
                                    "position":"6",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Available To Pick",
                                    "isenabled":true,
                                    "property":"iavailabletopick",
                                    "position":"7",
                                    "width":"80",
                                    "display":true
                                },
                                {
                                    "columnname":"In Location Qty",
                                    "isenabled":true,
                                    "property":"iinlocationqty",
                                    "position":"8",
                                    "width":"80",
                                    "display":true
                                },
                                {
                                    "columnname":"Committed Qty",
                                    "isenabled":true,
                                    "property":"icommittedqty",
                                    "position":"9",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"In Transit Qty",
                                    "isenabled":true,
                                    "property":"iintransitqty",
                                    "position":"10",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Reserved Qty",
                                    "isenabled":true,
                                    "property":"ireservedqty",
                                    "position":"11",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Total Qty",
                                    "isenabled":true,
                                    "property":"itotalqty",
                                    "position":"12",
                                    "width":"80",
                                    "display":true
                                },
                                {
                                    "columnname":"Arrival Date",
                                    "isenabled":true,
                                    "property":"iarrivaldate",
                                    "position":"13",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Location",
                                    "isenabled":true,
                                    "property":"ilocation",
                                    "position":"14",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Location Status",
                                    "isenabled":true,
                                    "property":"ilocationstatus",
                                    "position":"15",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Pallet ID",
                                    "isenabled":true,
                                    "property":"ipalletid",
                                    "position":"16",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 1",
                                    "isenabled":true,
                                    "property":"iudf1",
                                    "position":"17",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 2",
                                    "isenabled":true,
                                    "property":"iudf2",
                                    "position":"18",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"UDF 3",
                                    "isenabled":true,
                                    "property":"iudf3",
                                    "position":"19",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Packing Date",
                                    "isenabled":true,
                                    "property":"ipackingdate",
                                    "position":"20",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Expiry Date",
                                    "isenabled":true,
                                    "property":"iexpirydate",
                                    "position":"21",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Client",
                                    "isenabled":true,
                                    "property":"iclient",
                                    "position":"22",
                                    "width":"150",
                                    "display":true
                                },
                                {
                                    "columnname":"Warehouse",
                                    "isenabled":true,
                                    "property":"iwarehouse",
                                    "position":"23",
                                    "width":"150",
                                    "display":true
                                }],
                                "icheckbox":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"30"
                                },
                                "isno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"40"
                                },
                                "iproductcode":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"100"
                                },
                                "iproductdescription":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"100"
                                },
                                "ireceiptreference":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"100"
                                },
                                "istatus":{
                                    "isenabled":true,
                                    "position":"6",
                                    "width":"100"
                                },
                                "iavailabletopick":{
                                    "isenabled":true,
                                    "position":"7",
                                    "width":"80"
                                },
                                "iinlocationqty":{
                                    "isenabled":true,
                                    "position":"8",
                                    "width":"80"
                                },
                                "icommittedqty":{
                                    "isenabled":true,
                                    "position":"9",
                                    "width":"100"
                                },
                                "iintransitqty":{
                                    "isenabled":true,
                                    "position":"10",
                                    "width":"100"
                                },
                                "ireservedqty":{
                                    "isenabled":true,
                                    "position":"11",
                                    "width":"100"
                                },
                                "itotalqty":{
                                    "isenabled":true,
                                    "position":"12",
                                    "width":"80"
                                },
                                "iarrivaldate":{
                                    "isenabled":true,
                                    "position":"13",
                                    "width":"100"
                                },
                                "ilocation":{
                                    "isenabled":true,
                                    "position":"14",
                                    "width":"120"
                                },
                                "ilocationstatus":{
                                    "isenabled":true,
                                    "position":"15",
                                    "width":"100"
                                },
                                "ipalletid":{
                                    "isenabled":true,
                                    "position":"16",
                                    "width":"150"
                                },
                                "iudf1":{
                                    "isenabled":true,
                                    "position":"17",
                                    "width":"150"
                                },
                                "iudf2":{
                                    "isenabled":true,
                                    "position":"18",
                                    "width":"150"
                                },
                                "iudf3":{
                                    "isenabled":true,
                                    "position":"19",
                                    "width":"150"
                                },
                                "ipackingdate":{
                                    "isenabled":true,
                                    "position":"20",
                                    "width":"150"
                                },
                                "iexpirydate":{
                                    "isenabled":true,
                                    "position":"21",
                                    "width":"150"
                                },
                                "iclient":{
                                    "isenabled":true,
                                    "position":"22",
                                    "width":"150"
                                },
                                "iwarehouse":{
                                    "isenabled":true,
                                    "position":"23",
                                    "width":"150"
                                },
                            },
                        }
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentStockTransfer.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentStockTransfer.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentStockTransfer.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentStockTransfer.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentStockTransfer.WorkOrderID,
                        code: currentStockTransfer.WorkOrderID,
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

        function ValidationFindall(){
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode":"TFR"
            };     
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID":appConfig.Entities.Validation.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues=(response.data.Response);
                }
            });
        }
        function GeneralValidation($item){
            var _Data = $item[$item.label].ePage.Entities,
            _input = _Data.Header.Data;
           
            OnChangeValues(_input.UIWmsStockTransferHeader.Client, 'E11011', false, undefined, $item.label);
            
            OnChangeValues(_input.UIWmsStockTransferHeader.Warehouse, 'E11012', false, undefined, $item.label);

            if (_input.UIWmsStockTransferLine.length > 0) {
                angular.forEach(_input.UIWmsStockTransferLine, function (value, key) {
                    OnChangeValues(value.ProductCode, 'E11004', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Packs), 'E11005', true, key, $item.label);

                    OnChangeValues(parseFloat(value.Units), 'E11006', true, key, $item.label);

                    OnChangeValues(value.StockKeepingUnit, 'E11007', true, key, $item.label);

                    OnChangeValues(value.ProductCondition, 'E11031', true, key, $item.label);

                    if (!value.WLO_Location &&exports.EnableFinaliseValidation == true || value.WLO_Location && exports.EnableFinaliseValidation == true)
                        OnChangeValues(value.WLO_Location, 'E11009', true, key, $item.label);

                    if (!value.WLO_TransferFrom || value.WLO_TransferFrom)
                        OnChangeValues(value.WLO_TransferFrom, 'E11008', true, key, $item.label);

                    if (!value.PAC_PackType || value.PAC_PackType)
                        OnChangeValues(value.PAC_PackType, 'E11010', true, key, $item.label);

                    if (!value.PRO_FK && value.ProductCode|| value.PRO_FK && value.ProductCode)
                        OnChangeValues(value.PRO_FK, 'E11027', true, key, $item.label);

                    if (!value.WLO_FK && value.WLO_Location|| value.WLO_FK && value.WLO_Location)
                        OnChangeValues(value.WLO_FK, 'E11028', true, key, $item.label);

                    if (!value.WLO_TransferFrom_FK && value.WLO_TransferFrom|| value.WLO_TransferFrom_FK && value.WLO_TransferFrom)
                        OnChangeValues(value.WLO_TransferFrom_FK, 'E11029', true, key, $item.label);

                    if (value.WLO_Location == value.WLO_TransferFrom && value.WLO_Location && value.WLO_TransferFrom){
                        OnChangeValues(null, 'E11013', true, key, $item.label); 
                        OnChangeValues(null, 'E11014', true, key, $item.label); 
                    } else{
                        OnChangeValues('value', 'E11013', true, key, $item.label); 
                        OnChangeValues('value', 'E11014', true, key, $item.label);
                    } 
                    if (!value.AdjustmentArrivalDate || value.AdjustmentArrivalDate)
                    OnChangeValues(value.AdjustmentArrivalDate, 'E11015', true, key, $item.label);

                    if ((_input.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" && value.UsePartAttrib1 && !value.IsPartAttrib1ReleaseCaptured) || (_input.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" && value.UsePartAttrib2 && !value.IsPartAttrib2ReleaseCaptured) || (_input.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" && value.UsePartAttrib3 && !value.IsPartAttrib3ReleaseCaptured)){
                        if (parseFloat(value.Units) != 1) {
                            OnChangeValues(null, 'E11017', true, key, $item.label);
                        } else {
                            OnChangeValues('value', 'E11017', true, key, $item.label);
                        }
                    }

                    if(!value.IsPartAttrib1ReleaseCaptured && exports.EnableFinaliseValidation == true){
                        if (_input.UIWmsStockTransferHeader.IMPartAttrib1Type == 'SER' && value.UsePartAttrib1 || _input.UIWmsStockTransferHeader.IMPartAttrib1Type == 'MAN' && value.UsePartAttrib1 || _input.UIWmsStockTransferHeader.IMPartAttrib1Type == 'BAT' && value.UsePartAttrib1) {
                            if (!value.PartAttrib1  || value.PartAttrib1)
                                OnChangeValues(value.PartAttrib1, 'E11018', true, key, $item.label);
                        }
                    }    

                    if(!value.IsPartAttrib2ReleaseCaptured && exports.EnableFinaliseValidation == true){
                        if (_input.UIWmsStockTransferHeader.IMPartAttrib2Type == 'SER' && value.UsePartAttrib2 || _input.UIWmsStockTransferHeader.IMPartAttrib2Type == 'MAN' && value.UsePartAttrib2 || _input.UIWmsStockTransferHeader.IMPartAttrib2Type == 'BAT' && value.UsePartAttrib2) {
                            if (!value.PartAttrib2 || value.PartAttrib2)
                                OnChangeValues(value.PartAttrib2, 'E11019', true, key, $item.label);
                        }
                    }

                    if(!value.IsPartAttrib3ReleaseCaptured && exports.EnableFinaliseValidation == true){
                        if (_input.UIWmsStockTransferHeader.IMPartAttrib3Type == 'SER' && value.UsePartAttrib3 || _input.UIWmsStockTransferHeader.IMPartAttrib3Type == 'MAN' && value.UsePartAttrib3 || _input.UIWmsStockTransferHeader.IMPartAttrib3Type == 'BAT' && value.UsePartAttrib3) {
                            if (!value.PartAttrib3 || value.PartAttrib3)
                                OnChangeValues(value.PartAttrib3, 'E11020', true, key, $item.label);
                        }
                    }

                    if (value.UsePackingDate && exports.EnableFinaliseValidation == true) {
                        if (!value.PackingDate || value.PackingDate)
                            OnChangeValues(value.PackingDate, 'E11021', true, key, $item.label);
                    }

                    if (value.UseExpiryDate && exports.EnableFinaliseValidation == true) {
                        if (!value.ExpiryDate || value.ExpiryDate)
                            OnChangeValues(value.ExpiryDate, 'E11022', true, key, $item.label);
                    }

                    if ((_input.UIWmsStockTransferHeader.IMPartAttrib1Type == "SER" &&(value.UsePartAttrib1 || value.IsPartAttrib1ReleaseCaptured)) || (_input.UIWmsStockTransferHeader.IMPartAttrib2Type == "SER" &&(value.UsePartAttrib2 || value.IsPartAttrib2ReleaseCaptured)) || (_input.UIWmsStockTransferHeader.IMPartAttrib3Type == "SER" &&(value.UsePartAttrib3 || value.IsPartAttrib3ReleaseCaptured))) {
                        if ((parseFloat(value.Units)%1) != 0) {
                            OnChangeValues(null, "E11036", true, key , $item.label);
                        } else  {
                            OnChangeValues('value', "E11036", true, key, $item.label);
                        }
                    }

                    OnChangeValues('value','E11023',true,key, $item.label);
                    OnChangeValues('value','E11024',true,key, $item.label);
                    OnChangeValues('value','E11025',true,key, $item.label);
                });
            }
            
            //Check Duplicate
            if(_input.UIWmsStockTransferLine.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWmsStockTransferLine.length;i++){
                    for(var j=i+1;j<_input.UIWmsStockTransferLine.length;j++){
                        if(!finishloop){
                            if(!_input.UIWmsStockTransferLine[j].IsPartAttrib1ReleaseCaptured && _input.UIWmsStockTransferLine[j].UsePartAttrib1 && _input.UIWmsStockTransferHeader.IMPartAttrib1Type =='SER'){
                                if(_input.UIWmsStockTransferLine[j].PartAttrib1){
                                    if((_input.UIWmsStockTransferLine[i].PartAttrib1 == _input.UIWmsStockTransferLine[j].PartAttrib1)&&(_input.UIWmsStockTransferLine[i].PRO_FK == _input.UIWmsStockTransferLine[j].PRO_FK)){
                                        OnChangeValues(null,'E11023',true,i,$item.label);
                                        OnChangeValues(null,'E11023',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsStockTransferLine[j].IsPartAttrib2ReleaseCaptured && _input.UIWmsStockTransferLine[j].UsePartAttrib2 && _input.UIWmsStockTransferHeader.IMPartAttrib2Type =='SER'){
                                if(_input.UIWmsStockTransferLine[j].PartAttrib2){
                                    if((_input.UIWmsStockTransferLine[i].PartAttrib2 == _input.UIWmsStockTransferLine[j].PartAttrib2)&&(_input.UIWmsStockTransferLine[i].PRO_FK == _input.UIWmsStockTransferLine[j].PRO_FK)){
                                        OnChangeValues(null,'E11024',true,i,$item.label);
                                        OnChangeValues(null,'E11024',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                            if(!_input.UIWmsStockTransferLine[j].IsPartAttrib3ReleaseCaptured && _input.UIWmsStockTransferLine[j].UsePartAttrib3 && _input.UIWmsStockTransferHeader.IMPartAttrib3Type =='SER'){
                                if(_input.UIWmsStockTransferLine[j].PartAttrib3){
                                    if((_input.UIWmsStockTransferLine[i].PartAttrib3 == _input.UIWmsStockTransferLine[j].PartAttrib3)&&(_input.UIWmsStockTransferLine[i].PRO_FK == _input.UIWmsStockTransferLine[j].PRO_FK)){
                                        OnChangeValues(null,'E11025',true,i,$item.label);
                                        OnChangeValues(null,'E11025',true,j,$item.label);
                                        finishloop = true;
                                    }
                                }
                            }
                        }
                    }
                }
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
            if (!IsArray) {
                if (!fieldvalue) {
                    PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, label, IsArray, undefined, undefined, undefined, undefined, undefined);
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
        
        function RemoveApiErrors(item,label){
            angular.forEach(item,function(value,key){
                RemoveErrorWarning(value.Code,"E",value.CtrlKey,label);
            });
        }
    }
})();


