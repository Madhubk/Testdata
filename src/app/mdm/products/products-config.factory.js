(function () {
    "use strict";

    angular
        .module("Application")
        .factory('productConfig', ProductConfig);

    ProductConfig.$inject = ["$location", "$q", "helperService", "apiService","toastr","appConfig"];

    function ProductConfig($location, $q, helperService, apiService,toastr,appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsProductList/GetById/"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsProductList/ProductHeaderActivityClose/",
                        },
                        "ProductBulkUpload": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ProductBulkUpload/InsertOrUpdate",
                            "FilterID":"PRDBULK",
                        },
                    },
                    "Meta": {
                    },

                }

            },

            "TabList": [],
            "ValidationValues":"",
            "SaveAndClose":false,
            "ProductUploading":false,
            "ProductUploadingText":"Product Bulk Upload",
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

        function GetTabDetails(currentProduct, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations":"",
                        "RowIndex": -1,
                        "API": {
                            "InsertProduct": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsProductList/Insert"
                            },
                            "UpdateProduct": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsProductList/Update"
                            },
                            "WMSProductParamsByWmsAndClient": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "FilterID":"WMSPPWNC",
                                    "Url": "WMSProductParamsByWmsAndClient/FindAll"
                                },
                                "Delete": {
                                    "IsAPI": "true",
                                    "HttpType": "Get",
                                    "Url": "WMSProductParamsByWmsAndClient/Delete"
                                }
                            },
                            "WMSPickFace": {
                                "FindAll": {
                                    "IsAPI": "true",
                                    "HttpType": "POST",
                                    "FilterID":"WMSPICF",
                                    "Url": "WMSPickFace/FindAll"
                                },
                                "Delete": {
                                    "IsAPI": "true",
                                    "HttpType": "Get",
                                    "Url": "WMSPickFace/Delete"
                                }
                            },
                        },

                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Product & Related Organization",
                                "Value": "Related Organization",
                                "Icon": "fa fa-users",
                                "GParentRef": "relatedorganization"
                            }, {
                                "DisplayName": "Unit Conversions",
                                "Value": "Unit Conversions",
                                "Icon": "fa fa-exchange",
                                "GParentRef": "unitconversions"
                            },{
                                "DisplayName": "Barcodes",
                                "Value": "Barcodes",
                                "Icon": "fa fa-barcode",
                                "GParentRef": "barcodes"
                            },{
                                "DisplayName": "Warehouse",
                                "Value": "Warehouse",
                                "Icon": "icomoon icon-warehouse",
                                "GParentRef": "warehouse"
                            },  {
                                "DisplayName": "BOM",
                                "Value": "BOM",
                                "Icon": "fa fa-cubes",
                                "GParentRef": "bom"
                            },{
                                "DisplayName": "Additional Details",
                                "Value": "Additional Details",
                                "Icon": "fa fa-info-circle",
                                "GParentRef": "additionaldetails"
                            }],
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "PartNum": helperService.metaBase(),
                                "Desc": helperService.metaBase(),
                                "StockKeepingUnit":helperService.metaBase(),
                                "UIOrgPartRelation":helperService.metaBase(),
                                "UIOrgPartUnit":helperService.metaBase(),
                                "UIOrgSupplierPartBarcode": helperService.metaBase(),
                                "UIWarehouse":helperService.metaBase(),
                                "UIWMSPickFace":helperService.metaBase(),
                            },
                        },
                        "GlobalVariables":{
                            "Loading":false,
                        },
                        "TableProperties":{
                            "UIOrgSupplierPartBarcode":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"barcodecheckbox",
                                    "position":'1',
                                    "width":"45",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"barcodesno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Package",
                                    "isenabled":true,
                                    "property":"package",
                                    "position":"3",
                                    "width":"350",
                                    "display":true
                                },
                                {
                                    "columnname":"Barcode",
                                    "isenabled":true,
                                    "property":"barcode",
                                    "position":"4",
                                    "width":"350",
                                    "display":true
                                }],
                                "barcodecheckbox":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"45"
                                },
                                "barcodesno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"40"
                                },
                                "package":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"350"
                                },
                                "barcode":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"350"
                                },
                            },
                            "UIOrgPartBOM":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"bomcheckbox",
                                    "position":'1',
                                    "width":"45",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"bomsno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Component",
                                    "isenabled":true,
                                    "property":"component",
                                    "position":"3",
                                    "width":"200",
                                    "display":true
                                },
                                {
                                    "columnname":"Has Children",
                                    "isenabled":true,
                                    "property":"haschildren",
                                    "position":"4",
                                    "width":"130",
                                    "display":true
                                },
                                {
                                    "columnname":"Stock Unit",
                                    "isenabled":true,
                                    "property":"stockunit",
                                    "position":"5",
                                    "width":"130",
                                    "display":true
                                },
                                {
                                    "columnname":"Component Qty",
                                    "isenabled":true,
                                    "property":"componentqty",
                                    "position":"6",
                                    "width":"130",
                                    "display":true
                                },
                                {
                                    "columnname":"Reusable",
                                    "isenabled":true,
                                    "property":"reusable",
                                    "position":"7",
                                    "width":"130",
                                    "display":true
                                }],
                                "bomcheckbox":{
                                    "isenabled":true,
                                    "property":"1",
                                    "width":"45"
                                },
                                "bomsno":{
                                    "isenabled":true,
                                    "property":"2",
                                    "width":"40"
                                },
                                "component":{
                                    "isenabled":true,
                                    "property":"3",
                                    "width":"200"
                                },
                                "haschildren":{
                                    "isenabled":true,
                                    "property":"4",
                                    "width":"130"
                                },
                                "stockunit":{
                                    "isenabled":true,
                                    "property":"5",
                                    "width":"130"
                                },
                                "componentqty":{
                                    "isenabled":true,
                                    "property":"6",
                                    "width":"130"
                                },
                                "reusable":{
                                    "isenabled":true,
                                    "property":"7",
                                    "width":"130"
                                },
                            },
                            "UIWMSPickFace":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"pickfacecheckbox",
                                    "position":'1',
                                    "width":"45",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"pickfacesno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Client",
                                    "isenabled":true,
                                    "property":"pickfaceclient",
                                    "position":"3",
                                    "width":"160",
                                    "display":true
                                },
                                {
                                    "columnname":"Warehouse",
                                    "isenabled":true,
                                    "property":"pickfacewarehouse",
                                    "position":"4",
                                    "width":"160",
                                    "display":true
                                },
                                {
                                    "columnname":"Location",
                                    "isenabled":true,
                                    "property":"location",
                                    "position":"5",
                                    "width":"160",
                                    "display":true
                                },
                                {
                                    "columnname":"Replenishment Minimum",
                                    "isenabled":true,
                                    "property":"pickfacereplenishmentminimum",
                                    "position":"6",
                                    "width":"160",
                                    "display":true
                                },
                                {
                                    "columnname":"Replenishment Maximum",
                                    "isenabled":true,
                                    "property":"replenishmentmaximum",
                                    "position":"7",
                                    "width":"160",
                                    "display":true
                                },
                                {
                                    "columnname":"Replenishment Multiple",
                                    "isenabled":true,
                                    "property":"pickfacereplenishmentmultiple",
                                    "position":"8",
                                    "width":"160",
                                    "display":true
                                }],
                                "pickfacecheckbox":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"45"
                                },
                                "pickfacesno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"40"
                                },
                                "pickfaceclient":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"160"
                                },
                                "pickfacewarehouse":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"160"
                                },
                                "location":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"160"
                                },
                                "pickfacereplenishmentminimum":{
                                    "isenabled":true,
                                    "position":"6",
                                    "width":"160"
                                },
                                "replenishmentmaximum":{
                                    "isenabled":true,
                                    "position":"7",
                                    "width":"160"
                                },
                                "pickfacereplenishmentmultiple":{
                                    "isenabled":true,
                                    "position":"8",
                                    "width":"160"
                                },
                            },
                            "UIWarehouse":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"warehousecheckbox",
                                    "position":'1',
                                    "width":"45",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"warehousesno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Client",
                                    "isenabled":true,
                                    "property":"warehouseclient",
                                    "position":"3",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Warehouse",
                                    "isenabled":true,
                                    "property":"warehouse",
                                    "position":"4",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Putaway Area",
                                    "isenabled":true,
                                    "property":"putawayarea",
                                    "position":"5",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Bom Area",
                                    "isenabled":true,
                                    "property":"bomarea",
                                    "position":"6",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Receive UQ",
                                    "isenabled":true,
                                    "property":"receiveuq",
                                    "position":"7",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Release UQ",
                                    "isenabled":true,
                                    "property":"releaseuq",
                                    "position":"8",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Stocktake Cycle",
                                    "isenabled":true,
                                    "property":"stocktakecycle",
                                    "position":"9",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Expiry Period (In Days)",
                                    "isenabled":true,
                                    "property":"expiryperiod",
                                    "position":"10",
                                    "width":"160",
                                    "display":true
                                },
                                {
                                    "columnname":"Replenishment Minimum",
                                    "isenabled":true,
                                    "property":"warehousereplenishmentminimum",
                                    "position":"11",
                                    "width":"160",
                                    "display":true
                                },
                                {
                                    "columnname":"Replenishment Multiple",
                                    "isenabled":true,
                                    "property":"warehousereplenishmentmultiple",
                                    "position":"12",
                                    "width":"160"
                                }],
                                "warehousecheckbox":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"40"
                                },
                                "warehousesno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"40"
                                },
                                "warehouseclient":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"120"
                                },
                                "warehouse":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"120"
                                },
                                "putawayarea":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"120"
                                },
                                "bomarea":{
                                    "isenabled":true,
                                    "position":"6",
                                    "width":"120"
                                },
                                "receiveuq":{
                                    "isenabled":true,
                                    "position":"7",
                                    "width":"120"
                                },
                                "releaseuq":{
                                    "isenabled":true,
                                    "position":"8",
                                    "width":"120"
                                },
                                "stocktakecycle":{
                                    "isenabled":true,
                                    "position":"9",
                                    "width":"120"
                                },
                                "expiryperiod":{
                                    "isenabled":true,
                                    "position":"10",
                                    "width":"160"
                                },
                                "warehousereplenishmentminimum":{
                                    "isenabled":true,
                                    "position":"11",
                                    "width":"160"
                                },
                                "warehousereplenishmentmultiple":{
                                    "isenabled":true,
                                    "position":"12",
                                    "width":"160"
                                },
                            },
                            "UIOrgPartRelation":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"partcheckbox",
                                    "position":'1',
                                    "width":"45",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"partsno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Client",
                                    "isenabled":true,
                                    "property":"partclient",
                                    "position":"3",
                                    "width":"200",
                                    "display":true
                                },
                                {
                                    "columnname":"Relationship Type",
                                    "isenabled":true,
                                    "property":"relationshiptype",
                                    "position":"4",
                                    "width":"120",
                                    "display":true
                                },
                                {
                                    "columnname":"Client UQ",
                                    "isenabled":true,
                                    "property":"clientuq",
                                    "position":"5",
                                    "width":"80",
                                    "display":true
                                },
                                {
                                    "columnname":"Use UDF 1",
                                    "isenabled":true,
                                    "property":"useudf1",
                                    "position":"6",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Use UDF 2",
                                    "isenabled":true,
                                    "property":"useudf2",
                                    "position":"7",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Use UDF 3",
                                    "isenabled":true,
                                    "property":"useudf3",
                                    "position":"8",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Use Packing Date",
                                    "isenabled":true,
                                    "property":"usepackingdate",
                                    "position":"9",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Use Expiry Date",
                                    "isenabled":true,
                                    "property":"useexpirydate",
                                    "position":"10",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Is UDF1 ReleaseCaptured",
                                    "isenabled":true,
                                    "property":"releasecaptured1",
                                    "position":"11",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Is UDF2 ReleaseCaptured",
                                    "isenabled":true,
                                    "property":"releasecaptured2",
                                    "position":"12",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Is UDF3 ReleaseCaptured",
                                    "isenabled":true,
                                    "property":"releasecaptured3",
                                    "position":"13",
                                    "width":"60",
                                    "display":true
                                },
                                {
                                    "columnname":"Pick Mode",
                                    "isenabled":true,
                                    "property":"pickmode",
                                    "position":"14",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Local Part Number",
                                    "isenabled":true,
                                    "property":"localpartnumber",
                                    "position":"15",
                                    "width":"100",
                                    "display":true
                                },
                                {
                                    "columnname":"Local Part Description",
                                    "isenabled":true,
                                    "property":"localpartdescription",
                                    "position":"16",
                                    "width":"100",
                                    "display":true
                                }],
                                "partcheckbox":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"45"
                                },
                                "partsno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"40"
                                },
                                "partclient":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"200"
                                },
                                "relationshiptype":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"120"
                                },
                                "clientuq":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"80"
                                },
                                "useudf1":{
                                    "isenabled":true,
                                    "position":"6",
                                    "width":"60"
                                },
                                "useudf2":{
                                    "isenabled":true,
                                    "position":"7",
                                    "width":"60"
                                },
                                "useudf3":{
                                    "isenabled":true,
                                    "position":"8",
                                    "width":"60"
                                },
                                "usepackingdate":{
                                    "isenabled":true,
                                    "position":"9",
                                    "width":"60"
                                },
                                "useexpirydate":{
                                    "isenabled":true,
                                    "position":"10",
                                    "width":"60"
                                },
                                "releasecaptured1":{
                                    "isenabled":true,
                                    "position":"11",
                                    "width":"60"
                                },
                                "releasecaptured2":{
                                    "isenabled":true,
                                    "position":"12",
                                    "width":"60"
                                },
                                "releasecaptured3":{
                                    "isenabled":true,
                                    "position":"13",
                                    "width":"60"
                                },
                                "pickmode":{
                                    "isenabled":true,
                                    "position":"14",
                                    "width":"100"
                                },
                                "localpartnumber":{
                                    "isenabled":true,
                                    "position":"15",
                                    "width":"100"
                                },
                                "localpartdescription":{
                                    "isenabled":true,
                                    "position":"16",
                                    "width":"100"
                                },
                            },
                            "UIOrgPartUnit":{
                                "HeaderProperties":[{
                                    "columnname":"Checkbox",
                                    "isenabled":true,
                                    "property":"unitcheckbox",
                                    "position":'1',
                                    "width":"45",
                                    "display":false
                                },{
                                    "columnname":"S.No",
                                    "isenabled":true,
                                    "property":"unitsno",
                                    "position":"2",
                                    "width":"40",
                                    "display":false
                                },
                                {
                                    "columnname":"Quanity In Parent",
                                    "isenabled":true,
                                    "property":"qtyinparent",
                                    "position":"3",
                                    "width":"250",
                                    "display":true
                                },
                                {
                                    "columnname":"Package",
                                    "isenabled":true,
                                    "property":"unitpackage",
                                    "position":"4",
                                    "width":"250",
                                    "display":true
                                },
                                {
                                    "columnname":"Parent Package",
                                    "isenabled":true,
                                    "property":"parentpackage",
                                    "position":"4",
                                    "width":"250",
                                    "display":true
                                }],
                                "unitcheckbox":{
                                    "isenabled":true,
                                    "position":"1",
                                    "width":"45"
                                },
                                "unitsno":{
                                    "isenabled":true,
                                    "position":"2",
                                    "width":"40"
                                },
                                "qtyinparent":{
                                    "isenabled":true,
                                    "position":"3",
                                    "width":"250"
                                },
                                "unitpackage":{
                                    "isenabled":true,
                                    "position":"4",
                                    "width":"250"
                                },
                                "parentpackage":{
                                    "isenabled":true,
                                    "position":"5",
                                    "width":"250"
                                },
                            },
                        }
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentProduct.data;
                _exports.Entities.Header.GetById = currentProduct.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentProduct.entity.PartNum,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get Consolidation details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentProduct.PK).then(function (response) {
              
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentProduct.PartNum]: {
                            ePage: _exports
                        },
                        label: currentProduct.PartNum,
                        code: currentProduct.PartNum,
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
        }


        // Validations

        function ValidationFindall(){
            var _filter = {
                "ModuleCode": "WMS",
                "SubModuleCode":"PRO"
            };     
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.Validation.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.Validation.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    exports.ValidationValues=(response.data.Response);
                }
            });
        }

        function GeneralValidation($item){
            //General Page Validation
            var _Data = $item[$item.label].ePage.Entities,
            _input = _Data.Header.Data;
           
                OnChangeValues(_input.UIProductGeneral.PartNum,'E7010',false,undefined,$item.label);
                OnChangeValues(_input.UIProductGeneral.Desc,'E7011',false,undefined,$item.label);
                OnChangeValues(_input.UIProductGeneral.StockKeepingUnit,'E7012',false,undefined,$item.label);

            // Related Organization Validation

            if(_input.UIOrgPartRelation.length==0){
                OnChangeValues(null,'E7013',false,undefined,$item.label);
            }else{
                OnChangeValues('value','E7013',false,undefined,$item.label);                
            }

            if(_input.UIOrgPartRelation.length>0){
                angular.forEach(_input.UIOrgPartRelation,function(value,key){
                    OnChangeValues(value.Client,'E7014',true,key,$item.label);

                    OnChangeValues(value.Relationship,'E7015',true,key,$item.label);

                    OnChangeValues('value','E7002',true,key,$item.label);
                });

            }
                //Check Duplicate
            if(_input.UIOrgPartRelation.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIOrgPartRelation.length;i++){
                    for(var j=i+1;j<_input.UIOrgPartRelation.length;j++){
                        if(_input.UIOrgPartRelation[i].Client && _input.UIOrgPartRelation[i].Relationship && !finishloop){
                            if(_input.UIOrgPartRelation[i].Client == _input.UIOrgPartRelation[j].Client &&_input.UIOrgPartRelation[i].Relationship == _input.UIOrgPartRelation[j].Relationship){
                                OnChangeValues(null,'E7002',true,i,$item.label);
                                OnChangeValues(null,'E7002',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            
            //Unit conversions
            if(_input.UIOrgPartUnit.length>0){
                angular.forEach(_input.UIOrgPartUnit,function(value,key){
                    OnChangeValues(value.QuantityInParent,'E7017',true,key,$item.label);

                    OnChangeValues(value.ParentPackType,'E7019',true,key,$item.label);

                    OnChangeValues(value.PackType,'E7020',true,key,$item.label);

                    if(value.QuantityInParent == '0')
                    OnChangeValues(null,'E7018',true,key,$item.label);
                    else
                    OnChangeValues('value','E7018',true,key,$item.label);

                    if(value.ParentPackType == value.PackType && value.ParentPackType && value.PackType){
                        OnChangeValues(null,'E7021',true,key,$item.label);
                        OnChangeValues(null,'E7022',true,key,$item.label);
                    }else{
                        OnChangeValues('value','E7021',true,key,$item.label);
                        OnChangeValues('value','E7022',true,key,$item.label);
                    }

                    OnChangeValues('value','E7004',true,key,$item.label);
                });
            }

             //Check Duplicate
             if(_input.UIOrgPartUnit.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIOrgPartUnit.length;i++){
                    for(var j=i+1;j<_input.UIOrgPartUnit.length;j++){
                        if(_input.UIOrgPartUnit[i].PackType && _input.UIOrgPartUnit[i].ParentPackType && !finishloop){
                            if(_input.UIOrgPartUnit[i].PackType == _input.UIOrgPartUnit[j].PackType &&_input.UIOrgPartUnit[i].ParentPackType == _input.UIOrgPartUnit[j].ParentPackType){
                                OnChangeValues(null,'E7004',true,i,$item.label);
                                OnChangeValues(null,'E7004',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //Barcode validation
            if(_input.UIOrgSupplierPartBarcode.length>0){
                angular.forEach(_input.UIOrgSupplierPartBarcode,function(value,key){
                    OnChangeValues(value.PAC_NKPackType,'E7023',true,key,$item.label);

                    OnChangeValues(value.Barcode,'E7024',true,key,$item.label);

                    OnChangeValues('value','E7009',true,key,$item.label);
                });
            }

            //Check Duplicate
            if(_input.UIOrgSupplierPartBarcode.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIOrgSupplierPartBarcode.length;i++){
                    for(var j=i+1;j<_input.UIOrgSupplierPartBarcode.length;j++){
                        if(_input.UIOrgSupplierPartBarcode[i].Barcode && !finishloop){
                            if(_input.UIOrgSupplierPartBarcode[i].Barcode == _input.UIOrgSupplierPartBarcode[j].Barcode){
                                OnChangeValues(null,'E7009',true,i,$item.label);
                                OnChangeValues(null,'E7009',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //Product Warehouse Validation
            if(_input.UIWarehouse.length>0){
                angular.forEach(_input.UIWarehouse,function(value,key){
                    OnChangeValues(value.Client,'E7025',true,key,$item.label);

                    OnChangeValues(value.Warehouse,'E7026',true,key,$item.label);

                    OnChangeValues('value','E7030',true,key,$item.label);
                });
            }
            //Check Duplicate
            if(_input.UIWarehouse.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWarehouse.length;i++){
                    for(var j=i+1;j<_input.UIWarehouse.length;j++){
                        if(_input.UIWarehouse[i].Client && _input.UIWarehouse[i].Warehouse  && !finishloop){
                            if(_input.UIWarehouse[i].Client == _input.UIWarehouse[j].Client && _input.UIWarehouse[i].Warehouse == _input.UIWarehouse[j].Warehouse){
                                OnChangeValues(null,'E7030',true,i,$item.label);
                                OnChangeValues(null,'E7030',true,j,$item.label);
                                finishloop = true;
                            }
                        }
                    }
                }
            }

            //PickFace Validation
            if(_input.UIWMSPickFace.length>0){
                angular.forEach(_input.UIWMSPickFace,function(value,key){
                    OnChangeValues(value.Client,'E7027',true,key,$item.label);

                    OnChangeValues(value.Warehouse,'E7028',true,key,$item.label);

                    OnChangeValues(value.Location,'E7029',true,key,$item.label);

                    OnChangeValues(value.ReplenishMinimum,'E7033',true,key,$item.label);

                    OnChangeValues(value.ReplenishMaximum,'E7034',true,key,$item.label);

                    OnChangeValues(null,'E7031',true,key,$item.label);
                });
            }

            //Check Duplicate
            if(_input.UIWMSPickFace.length>1){
                var finishloop = false;

                for(var i = 0;i<_input.UIWMSPickFace.length;i++){
                    for(var j=i+1;j<_input.UIWMSPickFace.length;j++){
                        if(_input.UIWMSPickFace[i].Client && _input.UIWMSPickFace[i].Warehouse && _input.UIWMSPickFace[i].Location && !finishloop){
                            if(_input.UIWMSPickFace[i].Client == _input.UIWMSPickFace[j].Client && _input.UIWMSPickFace[i].Warehouse == _input.UIWMSPickFace[j].Warehouse && _input.UIWMSPickFace[i].Location == _input.UIWMSPickFace[j].Location){
                                OnChangeValues(null,'E7031',true,i,$item.label);
                                OnChangeValues(null,'E7031',true,j,$item.label);
                                finishloop = true;
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



