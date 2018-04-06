(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdjustmentGeneralController", AdjustmentGeneralController);

    AdjustmentGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "adjustmentConfig", "helperService", "toastr", "$filter", "$document", "confirmation"];

    function AdjustmentGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, adjustmentConfig, helperService, toastr, $filter, $document, confirmation) {

        var AdjustmentGeneralCtrl = this;

        function Init() {
 
            var currentAdjustment = AdjustmentGeneralCtrl.currentAdjustment[AdjustmentGeneralCtrl.currentAdjustment.label].ePage.Entities;

            AdjustmentGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Adjustment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAdjustment,
            };

            AdjustmentGeneralCtrl.ePage.Masters.DataentryName = "WarehouseInventory";
            AdjustmentGeneralCtrl.ePage.Masters.TaskName = "InventorySummary";

            // DatePicker
            AdjustmentGeneralCtrl.ePage.Masters.DatePicker = {};
            AdjustmentGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AdjustmentGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            AdjustmentGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            AdjustmentGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            AdjustmentGeneralCtrl.ePage.Masters.emptyText = '-'
            AdjustmentGeneralCtrl.ePage.Masters.selectedRow = -1;
            AdjustmentGeneralCtrl.ePage.Masters.Lineslist = true;
            AdjustmentGeneralCtrl.ePage.Masters.HeaderName = '';
            AdjustmentGeneralCtrl.ePage.Masters.emptyText = '-';
            AdjustmentGeneralCtrl.ePage.Masters.OrgPartRelationCount = 0;

            AdjustmentGeneralCtrl.ePage.Masters.Edit = Edit;
            AdjustmentGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            AdjustmentGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            AdjustmentGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;
            AdjustmentGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            AdjustmentGeneralCtrl.ePage.Masters.Back = Back;
            AdjustmentGeneralCtrl.ePage.Masters.Done = Done;
            AdjustmentGeneralCtrl.ePage.Masters.Config = adjustmentConfig;

            AdjustmentGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            AdjustmentGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            AdjustmentGeneralCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            AdjustmentGeneralCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
            AdjustmentGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            AdjustmentGeneralCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            AdjustmentGeneralCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;
            AdjustmentGeneralCtrl.ePage.Masters.PartAttribute = PartAttribute;

            AdjustmentGeneralCtrl.ePage.Masters.GetFilterList = GetFilterList;
            AdjustmentGeneralCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            AdjustmentGeneralCtrl.ePage.Masters.Filter = Filter;

            AdjustmentGeneralCtrl.ePage.Masters.Addtoline = Addtoline;
            AdjustmentGeneralCtrl.ePage.Masters.select = select;
            AdjustmentGeneralCtrl.ePage.Masters.SelectedAll = SelectedAll;
            
            //New
            if(AdjustmentGeneralCtrl.currentAdjustment.isNew){
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ExternalReference = "New";    
            }
            
            //Order By
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = $filter('orderBy')(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, 'CreatedDateTime');

            // filter
            AdjustmentGeneralCtrl.ePage.Masters.Inventory = undefined;
            AdjustmentGeneralCtrl.ePage.Meta.IsLoading = false;

            DefaultFilter();
            GetMastersList();
            GeneralOperations();
            GetBindValues();
            GetLinesList();
            GetClientAddress();
            getConfigDetails();
            getPartAttributeDetails();

        }

        function CloseFilterList() {
            $('#filterSideBar' + "WarehouseInventory" + AdjustmentGeneralCtrl.currentAdjustment.label).removeClass('open');
        }
        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "WarehouseInventory" + AdjustmentGeneralCtrl.currentAdjustment.label).toggleClass('open');
            });
        }
        function getConfigDetails() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "WarehouseInventory"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    AdjustmentGeneralCtrl.ePage.Masters.DynamicControl = response.data.Response;


                    if (AdjustmentGeneralCtrl.ePage.Masters.defaultFilter !== undefined) {
                        AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = AdjustmentGeneralCtrl.ePage.Masters.defaultFilter;
                        });
                    }
                    AdjustmentGeneralCtrl.ePage.Masters.IsLoading = false;
                    AdjustmentGeneralCtrl.ePage.Masters.ViewType = 1;
                }
            });
        }

        function Filter() {
            AdjustmentGeneralCtrl.ePage.Meta.IsLoading = true;
            $(".filter-sidebar-wrapper").toggleClass("open");

            var FilterObj = {
                "ClientCode": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode,
                "WAR_WarehouseCode": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WAR_WarehouseCode,
                "AreaName": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.AreaName,
                "CurrentInventoryStatusDesc": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.CurrentInventoryStatusDesc,
                "ExternalReference": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ExternalReference,
                "Location": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.Location,
                "PalletID": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.PalletID,
                "ProductCode": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode,
                "WOL_AdjustmentArrivalDate": AdjustmentGeneralCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WOL_AdjustmentArrivalDate,
                "SortColumn": "WOL_WAR_WarehouseCode",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 500
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(FilterObj),
                "FilterID": adjustmentConfig.Entities.Header.API.Inventory.FilterID,
            };
            apiService.post("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function (response) {
                AdjustmentGeneralCtrl.ePage.Masters.Inventory = response.data.Response;
                AdjustmentGeneralCtrl.ePage.Meta.IsLoading = false;
            });
        }

        function DefaultFilter() {
            if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode && AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode){
                AdjustmentGeneralCtrl.ePage.Masters.defaultFilter = {
                    "ClientCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode,
                    "WAR_WarehouseCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode,
                    "OriginalInventoryStatus":"AVL"
                };
                AdjustmentGeneralCtrl.ePage.Masters.DynamicControl=undefined;
                getConfigDetails();
                getInventory();
            }
        }

        function GetLinesList() {

            angular.forEach(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {

                if (value.ProductCode == null)
                    value.ProductCode = '';

                if (value.ProductDescription == null)
                    value.ProductDescription = '';

                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Product = value.ProductCode + ' - ' + value.ProductDescription;
                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;

                if (value.Product == ' - ')
                    value.Product = '';

                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode;
                value.ORG_ClientName = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName;
                value.Client_FK = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode;
                value.WAR_WarehouseName = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName;
                value.WAR_FK = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WAR_FK;

                if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client){
                    value.Client = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode
                    value.ClientRelationship = "OWN";
                }
            });
            GetOrgPartRelationValues();
        }

        function GetOrgPartRelationValues() {
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length > 0) {
                AdjustmentGeneralCtrl.ePage.Masters.OrgPartRelationBlur = true;
                var myData = _.groupBy(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, "PRO_FK")
                for (var prop in myData) {
                    if (prop && prop != 'null') {
                        if (myData.hasOwnProperty(prop)) {
                            var _filter = {
                                "ORG_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK,
                                "OSP_FK": prop
                            };

                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": AdjustmentGeneralCtrl.ePage.Entities.Header.API.OrgPartRelation.FilterID
                            };

                            apiService.post("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.OrgPartRelation.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    angular.forEach(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                                        if (value.PRO_FK == response.data.Response[0].OSP_FK) {
                                            AdjustmentGeneralCtrl.ePage.Masters.OrgPartRelationCount++
                                            value.UseExpiryDate = response.data.Response[0].UseExpiryDate;
                                            value.UsePackingDate = response.data.Response[0].UsePackingDate;
                                            value.UsePartAttrib1 = response.data.Response[0].UsePartAttrib1;
                                            value.UsePartAttrib2 = response.data.Response[0].UsePartAttrib2;
                                            value.UsePartAttrib3 = response.data.Response[0].UsePartAttrib3;
                                            value.IsPartAttrib1ReleaseCaptured = response.data.Response[0].IsPartAttrib1ReleaseCaptured;
                                            value.IsPartAttrib2ReleaseCaptured = response.data.Response[0].IsPartAttrib2ReleaseCaptured;
                                            value.IsPartAttrib3ReleaseCaptured = response.data.Response[0].IsPartAttrib3ReleaseCaptured;
                                            if (AdjustmentGeneralCtrl.ePage.Masters.OrgPartRelationCount == AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length) {
                                                AdjustmentGeneralCtrl.ePage.Masters.OrgPartRelationBlur = false;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        AdjustmentGeneralCtrl.ePage.Masters.OrgPartRelationCount=0;
                    }
                }
            }
        }

        function Addtoline() {
            angular.forEach(AdjustmentGeneralCtrl.ePage.Masters.Inventory, function (value, key) {
                if (value.singleselect) {
                    var obj = {
                        "PK": "",
                        "ProductCode": value.ProductCode,
                        "ProductDescription": value.ProductName,
                        "Product": value.ProductCode + '-' + value.ProductName,
                        "PRO_FK": value.PRO_FK,
                        "MCC_NKCommodityCode": value.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": value.MCC_NKCommodityDesc,
                        "Packs": "-" + value.AvailableToPick,
                        "PAC_PackType": value.StockKeepingUnit,
                        "Units": "-" + value.AvailableToPick,
                        "StockKeepingUnit": value.StockKeepingUnit,
                        "WRO_Name": "",
                        "WLO_Location": value.Location,
                        "WLO_FK": value.WLO_FK,
                        "WLO_Column": "",
                        "WLO_Level": "",
                        "WAA_AreaType": value.AreaType,
                        "WAA_Name": value.AreaName,
                        "AdjustmentArrivalDate": value.AdjustmentArrivalDate,
                        "LineComment": value.LineComment,
                        "PalletID": value.PalletID,
                        "ReasonCode": value.ReasonCode,
                        "Description": "",
                        "OriginalInventoryStatus": "",
                        "OriginalInventoryStatusDesc": "",
                        "PartAttrib1": value.PartAttrib1,
                        "PartAttrib2": value.PartAttrib2,
                        "PartAttrib3": value.PartAttrib3,
                        "PackingDate": value.PackingDate,
                        "ExpiryDate": value.ExpiryDate,
                        "IsDeleted": false,
                        "UseExpiryDate": false,
                        "UsePackingDate": false,
                        "UsePartAttrib1": false,
                        "UsePartAttrib2": false,
                        "UsePartAttrib3": false,
                        "IsPartAttrib1ReleaseCaptured": false,
                        "IsPartAttrib2ReleaseCaptured": false,
                        "IsPartAttrib3ReleaseCaptured": false,

                        "ORG_ClientCode": value.ClientCode,
                        "ORG_ClientName": value.ClientName,
                        "Client_FK": value.ORG_FK,

                        "WAR_WarehouseCode": value.WAR_WarehouseCode,
                        "WAR_WarehouseName": value.WAR_WarehouseName,
                        "WAR_FK": value.WAR_FK,
                    }
                    if(obj.MCC_NKCommodityCode == null){
                        obj.MCC_NKCommodityCode = '';
                    }
                    if(obj.MCC_NKCommodityDesc == null){
                        obj.MCC_NKCommodityDesc = '';
                    }
                    obj.Commodity =  obj.MCC_NKCommodityCode+' - '+obj.MCC_NKCommodityDesc
                    AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(obj);

                }
                value.singleselect = false;
                AdjustmentGeneralCtrl.ePage.Masters.SelectAll = false;
            });
            GetOrgPartRelationValues();
        }


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            AdjustmentGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_HELDCODE", "INW_LINE_UQ", "AdjustmentReason", "WMSYESNO"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        AdjustmentGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        AdjustmentGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetClientAddress() {

            if (!AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader) {
                var obj = {
                    "PK": "",
                    "OAD_PK": "",
                    "OAD_Address1": "",
                    "OAD_Address2": "",
                    "OAD_State": "",
                    "OAD_PostCode": "",
                    "OAD_City": "",
                    "OAD_City": "",
                    "OAD_Fax": "",
                    "OAD_Phone": ""
                };
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader.push([obj]);
            }
        }

        function GeneralOperations() {

            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode == null) {
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode = "";
            }
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName == null) {
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName = "";
            }
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode == null) {
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode = "";
            }
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName == null) {
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName = "";
            }
            
        }

        function GetBindValues() {
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode + ' - ' + AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode + ' - ' + AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName;
            Removehyphen();
        }

        function Removehyphen() {
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client == ' - ')
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client = "";

            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse == ' - ')
                AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse = "";
        }

        function SelectedLookupClient(item) {
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK = item.PK;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client = item.Code + ' - ' + item.FullName;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            OnChangeValues(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client, 'E10001');
            DefaultFilter();
            getPartAttributeDetails();
        }

        function SelectedLookupWarehouse(item) {
            AdjustmentGeneralCtrl.ePage.Masters.DataentryName = undefined;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            OnChangeValues(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse, 'E10002')
            DefaultFilter();
        }

        function getPartAttributeDetails(){
            if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK){
                var _filter = {
                    "ORG_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK
                };
    
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": AdjustmentGeneralCtrl.ePage.Entities.Header.API.OrgMiscServ.FilterID
                };
    
                apiService.post("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.OrgMiscServ.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }

        function getInventory() {
            var _filter = {
                "ORG_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK,
                "WAR_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WAR_FK,
                "OriginalInventoryStatus":"AVL"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": AdjustmentGeneralCtrl.ePage.Entities.Header.API.Inventory.FilterID,
            };
            apiService.post("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function (response) {
                AdjustmentGeneralCtrl.ePage.Masters.Inventory = response.data.Response;
            });
        }

        function CheckFutureDate(fieldvalue, key) {
            var selectedDate = new Date(fieldvalue);
            var now = new Date();
            if (selectedDate > now) {
                OnChangeValues(null, 'E10008', true, undefined)
                OnChangeValues('value', 'E10009', true, undefined)
            } else {
                OnChangeValues('value', 'E10008', true, undefined)
                OnChangeValues('value', 'E10009', true, undefined)
            }
        }

        function SelectedLookupProduct(item, index) {
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PRO_FK = item.OSP_FK;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Product = item.ProductCode + " - " + item.ProductDescription;


            if(item.MCC_NKCommodityCode == null)
            item.MCC_NKCommodityCode = '';

            if(item.MCC_NKCommodityDesc == null)
            item.MCC_NKCommodityDesc = '';

            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Commodity = item.MCC_NKCommodityCode +' - '+item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib1='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib2='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib3='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PackingDate='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].ExpiryDate='';
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Units = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Packs;

            OnChangeValues(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Product, 'E10003', true, index);
            OnChangeValues(item.StockKeepingUnit, "E10007", true, index);
        }
        
        
        function PartAttribute(item, index) {
            if (!item.IsPartAttrib1ReleaseCaptured) {
                if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "MAN" && item.UsePartAttrib1 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "BAT" && item.UsePartAttrib1) {
                    if (!item.PartAttrib1)
                        OnChangeValues(null, 'E10016', true, index);
                    else
                        OnChangeValues('value', 'E10016', true, index);
                }
            }
            if (!item.IsPartAttrib2ReleaseCaptured) {
                if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "MAN" && item.UsePartAttrib2 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "BAT" && item.UsePartAttrib2) {
                    if (!item.PartAttrib2)
                        OnChangeValues(null, 'E10017', true, index);
                    else
                        OnChangeValues('value', 'E10017', true, index);
                }
            }
            if (!item.IsPartAttrib3ReleaseCaptured) {
                if (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "MAN" && item.UsePartAttrib3 || AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "BAT" && item.UsePartAttrib3) {
                    if (!item.PartAttrib3)
                        OnChangeValues(null, 'E10018', true, index);
                    else
                        OnChangeValues('value', 'E10018', true, index);
                }
            }
            if (item.UsePackingDate) {
                if (!item.PackingDate)
                    OnChangeValues(null, 'E10019', true, index);
                else
                    OnChangeValues('value', 'E10019', true, index);
            }
            if (item.UseExpiryDate) {
                if (!item.ExpiryDate)
                    OnChangeValues(null, 'E10020', true, index);
                else
                    OnChangeValues('value', 'E10020', true, index);
            }

        }

        function SelectedLookupLocation(item, index) {
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WRO_Name = item.WRO_Name;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Level = item.Level;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Column = item.Column;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Location = item.Location;
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_FK = item.PK;
        }

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(AdjustmentGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (IsArray) {
                if (!fieldvalue) {
                    AdjustmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    AdjustmentGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    AdjustmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label, false, undefined, undefined, undefined, undefined, undefined);
                } else {
                    AdjustmentGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label);
                }
            }
        }



        function FetchQuantity(item, index) {
            if ((AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 && !item.IsPartAttrib1ReleaseCaptured) || (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 && !item.IsPartAttrib2ReleaseCaptured) || (AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 && !item.IsPartAttrib3ReleaseCaptured)) {
                if (parseFloat(item.Units) > 1) {
                    OnChangeValues(null, "E10021", true, AdjustmentGeneralCtrl.ePage.Masters.selectedRow);
                } else {
                    OnChangeValues('value', "E10021", true, AdjustmentGeneralCtrl.ePage.Masters.selectedRow);
                }
            }
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                OnChangeValues(item.Units, "E10006", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    apiService.post("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            OnChangeValues(item.Units, "E10006", true, index);
                        }
                    });
                }
            }
        }

        function setSelectedRow(index) {
            AdjustmentGeneralCtrl.ePage.Masters.selectedRow = index;
        }
        // select common checkbox
        function SelectedAll(details) {
            if (AdjustmentGeneralCtrl.ePage.Masters.SelectAll == true) {
                angular.forEach(details, function (value, key) {
                    value.singleselect = true;
                });
            }
            else {
                angular.forEach(details, function (value, key) {
                    value.singleselect = false;
                });
            }
        }
        // select single checkbox
        function select(details, index) {
            if (details[index].singleselect == false) {
                AdjustmentGeneralCtrl.ePage.Masters.SelectAll = false;
                AdjustmentGeneralCtrl.ePage.Masters.Count--;
            }
            else {
                AdjustmentGeneralCtrl.ePage.Masters.Count++;
                var count = 0;
                for (var i in details) {
                    if (details[i].singleselect == true) {
                        count++;
                        if (details.length <= count) {
                            AdjustmentGeneralCtrl.ePage.Masters.SelectAll = true;
                        }
                        else {
                            AdjustmentGeneralCtrl.ePage.Masters.SelectAll = false;
                        }
                    }
                }
            }
        }
        function RemoveAllLineErrors(){
            for(var i=0;i<AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length;i++){
                OnChangeValues('value', "E10003", true, i);
                OnChangeValues('value', "E10004", true, i);
                OnChangeValues('value', "E10005", true, i);
                OnChangeValues('value', "E10006", true, i);
                OnChangeValues('value', "E10007", true, i);
                OnChangeValues('value', "E10009", true, i);
                OnChangeValues('value', "E10010", true, i);
                OnChangeValues('value', "E10011", true, i);
                OnChangeValues('value', "E10016", true, i);
                OnChangeValues('value', "E10017", true, i);
                OnChangeValues('value', "E10018", true, i);
                OnChangeValues('value', "E10019", true, i);
                OnChangeValues('value', "E10020", true, i);
                OnChangeValues('value', "E10021", true, i);
                OnChangeValues('value', "E10022", true, i);
                OnChangeValues('value', "E10023", true, i);
                OnChangeValues('value', "E10024", true, i);
            }
            return true;
        }

        function Back() {
            
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                AdjustmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(AdjustmentGeneralCtrl.currentAdjustment);
            }
            AdjustmentGeneralCtrl.ePage.Masters.Lineslist = true;
            AdjustmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(AdjustmentGeneralCtrl.currentAdjustment);
        }

        function Done() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (AdjustmentGeneralCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("AdjustmentGeneralCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(AdjustmentGeneralCtrl.currentAdjustment);
                AdjustmentGeneralCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Edit(index, name) {
            AdjustmentGeneralCtrl.ePage.Masters.selectedRow = index;
            AdjustmentGeneralCtrl.ePage.Masters.Lineslist = false;
            AdjustmentGeneralCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (AdjustmentGeneralCtrl.ePage.Masters.selectedRow != -1) {
                if (AdjustmentGeneralCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (AdjustmentGeneralCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        AdjustmentGeneralCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (AdjustmentGeneralCtrl.ePage.Masters.selectedRow == AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length - 1) {
                            return;
                        }
                        AdjustmentGeneralCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }

                }
            }
        });


        function CopyRow() {
            var item = angular.copy(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[AdjustmentGeneralCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "PK": "",
                "ProductCode": item.ProductCode,
                "ProductDescription": item.ProductDescription,
                "Product": item.Product,
                "PRO_FK": item.PRO_FK,
                "Commodity": item.Commodity,
                "MCC_NKCommodityCode": item.MCC_NKCommodityCode,
                "MCC_NKCommodityDesc": item.MCC_NKCommodityDesc,
                "Packs": item.Packs,
                "PAC_PackType": item.PAC_PackType,
                "Units": item.Units,
                "StockKeepingUnit": item.StockKeepingUnit,
                "WRO_Name": item.WRO_Name,
                "WLO_Location": item.WLO_Location,
                "WLO_FK": item.WLO_FK,
                "WLO_Column": item.WLO_Column,
                "WLO_Level": item.WLO_Level,
                "WAA_AreaType": item.WAA_AreaType,
                "WAA_Name": item.WAA_Name,
                "AdjustmentArrivalDate": item.AdjustmentArrivalDate,
                "LineComment": item.LineComment,
                "PalletID": item.PalletID,
                "ReasonCode": item.ReasonCode,
        
                "PartAttrib1": item.PartAttrib1,
                "PartAttrib2": item.PartAttrib2,
                "PartAttrib3": item.PartAttrib3,
                "PackingDate": item.PackingDate,
                "ExpiryDate": item.ExpiryDate,
                "UseExpiryDate": item.UseExpiryDate,
                "UsePackingDate": item.UsePackingDate,
                "UsePartAttrib1": item.UsePartAttrib1,
                "UsePartAttrib2": item.UsePartAttrib2,
                "UsePartAttrib3": item.UsePartAttrib3,
                "IsPartAttrib1ReleaseCaptured": item.IsPartAttrib1ReleaseCaptured,
                "IsPartAttrib2ReleaseCaptured": item.IsPartAttrib2ReleaseCaptured,
                "IsPartAttrib3ReleaseCaptured": item.IsPartAttrib3ReleaseCaptured,

                "IsDeleted": false,
                "ORG_ClientCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode,
                "ORG_ClientName": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName,
                "Client_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK,

                "WAR_WarehouseCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode,
                "WAR_WarehouseName": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName,
                "WAR_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WAR_FK,

                "WorkOrderLineStatus": "",
                "WorkOrderLineStatusDesc": "",
                "OriginalInventoryStatus": "",
                "OriginalInventoryStatusDesc": "",
            };
            if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client){
                obj.Client = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode
                obj.ClientRelationship = "OWN";
            }
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(AdjustmentGeneralCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            AdjustmentGeneralCtrl.ePage.Masters.Edit(AdjustmentGeneralCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[AdjustmentGeneralCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function(result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", AdjustmentGeneralCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(AdjustmentGeneralCtrl.ePage.Masters.selectedRow, 1);                   
                        AdjustmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(AdjustmentGeneralCtrl.currentAdjustment);
                    }
                    toastr.success('Record Removed Successfully');
                    AdjustmentGeneralCtrl.ePage.Masters.Lineslist = true;
                    AdjustmentGeneralCtrl.ePage.Masters.selectedRow = AdjustmentGeneralCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            if (!AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client || !AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Warehouse) {
                AdjustmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(AdjustmentGeneralCtrl.currentAdjustment);
                AdjustmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentGeneralCtrl.currentAdjustment);
            } else {
            var obj = {
                "PK": "",
                "ProductCode": "",
                "ProductDescription": "",
                "Product": "",
                "PRO_FK": "",
                "Commodity": "",
                "MCC_NKCommodityCode": "",
                "MCC_NKCommodityDesc": "",
                "Packs": "",
                "PAC_PackType": "",
                "Units": "",
                "StockKeepingUnit": "",
                "WRO_Name": "",
                "WLO_Location": "",
                "WLO_FK": "",
                "WLO_Column": "",
                "WLO_Level": "",
                "WAA_AreaType": "",
                "WAA_Name": "",
                "AdjustmentArrivalDate": "",
                "LineComment": "",
                "PalletID": "",
                "ReasonCode": "",
                "Description": "",
                "CommitedUnit": "",
                "OriginalInventoryStatus": "",
                "OriginalInventoryStatusDesc": "",
                "WHC_NKOriginalInventoryHeldCode": "",
                "PartAttrib1": "",
                "PartAttrib2": "",
                "PartAttrib3": "",
                "PackingDate": "",
                "ExpiryDate": "",
                "UseExpiryDate": false,
                "UsePackingDate": false,
                "UsePartAttrib1": false,
                "UsePartAttrib2": false,
                "UsePartAttrib3": false,
                "IsPartAttrib1ReleaseCaptured": false,
                "IsPartAttrib2ReleaseCaptured": false,
                "IsPartAttrib3ReleaseCaptured": false,

                "IsDeleted": false,
                "ORG_ClientCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode,
                "ORG_ClientName": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientName,
                "Client_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ORG_Client_FK,

                "WAR_WarehouseCode": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseCode,
                "WAR_WarehouseName": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WarehouseName,
                "WAR_FK": AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WAR_FK,
            };
            if(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.Client){
                obj.Client = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.ClientCode
                obj.ClientRelationship = "OWN";
            }
            AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(obj);
            AdjustmentGeneralCtrl.ePage.Masters.Edit(AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length - 1, 'New List');
        }
    };

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            AdjustmentGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (AdjustmentGeneralCtrl.ePage.Entities.Header.Validations) {
                AdjustmentGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(AdjustmentGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                AdjustmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentGeneralCtrl.currentAdjustment);
            }
        }
        

        function SaveList($item) {
            AdjustmentGeneralCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            _input.UIAdjustmentHeader.PK = _input.PK;

            _input.UIAdjustmentHeader.WorkOrderType = 'ADJ';
            _input.UIAdjustmentHeader.ExternalReference = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID;
            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'Adjustment').then(function (response) {
                if (response.Status === "success") {

                    adjustmentConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID) {
                                value.label = AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID;
                                value[AdjustmentGeneralCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    
                    var _index = adjustmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(AdjustmentGeneralCtrl.currentAdjustment[AdjustmentGeneralCtrl.currentAdjustment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        adjustmentConfig.TabList[_index][adjustmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        adjustmentConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/adjustment") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            AdjustmentGeneralCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    AdjustmentGeneralCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    AdjustmentGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        AdjustmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AdjustmentGeneralCtrl.currentAdjustment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    angular.forEach(response.Messages, function (value, key) {
                        if(value.Type == "NotUpdated"){
                            toastr.error(value.MessageDesc);
                        }
                    });
                    if (AdjustmentGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        AdjustmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentGeneralCtrl.currentAdjustment);
                    }
                }

            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }


        Init();

    }

})();