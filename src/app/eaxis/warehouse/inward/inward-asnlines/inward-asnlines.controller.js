(function() {
    "use strict";

    angular
        .module("Application")
        .controller("InwardAsnLinesController", InwardAsnLinesController);

    InwardAsnLinesController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "$state", "$filter", "$q"];

    function InwardAsnLinesController($scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, toastr, confirmation, $state, $filter, $q) {

        var InwardAsnLinesCtrl = this;
        function Init() {

            var currentInward;
            if (InwardAsnLinesCtrl.currentInward.label) {
                currentInward = InwardAsnLinesCtrl.currentInward[InwardAsnLinesCtrl.currentInward.label].ePage.Entities;
            } else {
                currentInward = {
                    "Header": {
                        "Data": InwardAsnLinesCtrl.currentInward
                    }
                }
            }
            InwardAsnLinesCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_AsnLine",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward,
            };

            // DatePicker
            InwardAsnLinesCtrl.ePage.Masters.DatePicker = {};
            InwardAsnLinesCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            InwardAsnLinesCtrl.ePage.Masters.DatePicker.isOpen = [];
            InwardAsnLinesCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InwardAsnLinesCtrl.ePage.Masters.ActiveMenu = InwardAsnLinesCtrl.activeMenu;
            InwardAsnLinesCtrl.ePage.Masters.DropDownMasterList = {};
            InwardAsnLinesCtrl.ePage.Masters.emptyText = '-'
            InwardAsnLinesCtrl.ePage.Masters.selectedRow = -1;
            InwardAsnLinesCtrl.ePage.Masters.Lineslist = true;
            InwardAsnLinesCtrl.ePage.Masters.HeaderName = '';
            InwardAsnLinesCtrl.ePage.Masters.localvar = 'Copy Of Line';
            InwardAsnLinesCtrl.ePage.Masters.OrgPartRelationCount = 0;

            InwardAsnLinesCtrl.ePage.Masters.Edit = Edit;
            InwardAsnLinesCtrl.ePage.Masters.AddNewRow = AddNewRow;
            InwardAsnLinesCtrl.ePage.Masters.CopyRow = CopyRow;
            InwardAsnLinesCtrl.ePage.Masters.RemoveRow = RemoveRow;
            InwardAsnLinesCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            InwardAsnLinesCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            InwardAsnLinesCtrl.ePage.Masters.Back = Back;
            InwardAsnLinesCtrl.ePage.Masters.Done = Done;
            InwardAsnLinesCtrl.ePage.Masters.ConvertReceipt = ConvertReceipt;
            InwardAsnLinesCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            InwardAsnLinesCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            InwardAsnLinesCtrl.ePage.Masters.Config = inwardConfig;


            //Order By
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine = $filter('orderBy')(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, 'CreatedDateTime');
            
            GetProductDetails();
            GetMastersList();
            getMenu();
        }

        function getMenu() {
            if (InwardAsnLinesCtrl.ePage.Masters.ActiveMenu != undefined) {
                if (InwardAsnLinesCtrl.ePage.Masters.ActiveMenu.DisplayName == "ASN Lines") {
                    InwardAsnLinesCtrl.ePage.Masters.ShowBtnConvert = true;
                } else {
                    InwardAsnLinesCtrl.ePage.Masters.ShowBtnConvert = false;
                }
            } else {
                InwardAsnLinesCtrl.ePage.Masters.ShowBtnConvert = false;
            }
        }


        function ConvertReceipt(AsnLineDetails) {
            var TempLineDetails = [];
            if(AsnLineDetails.length == 0){
                toastr.info("ASN Line is empty");
            }else{
                if (!InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ArrivalDate){
                    OnChangeValues(null, "E3034", false, undefined);
                    InwardAsnLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardAsnLinesCtrl.currentInward);
                }else{
                    angular.forEach(AsnLineDetails, function(value, key) {
                        var obj = {
                            "LineNo": value.LineNo,
                            "SubLineNo": value.SubLineNo,
                            "Units": value.Quantity,
                            "Packs": value.Packs,
                            "PAC_PackType": value.PAC_PackType,
                            "WOD_FK": value.WOD_FK,
                            "PRO_FK": value.POR_FK,
                            "PalletID": value.PalletId,
                            "PartAttrib1": value.PartAttrib1,
                            "PartAttrib2": value.PartAttrib2,
                            "PartAttrib3": value.PartAttrib3,
                            "PackingDate": value.PackingDate,
                            "ExpiryDate": value.ExpiryDate,
                            "IsModified": value.IsModified,
                            "IsDeleted": value.IsDeleted,
                            "ProductCode": value.ProductCode,
                            "ProductDescription": value.ProductDescription,
                            "Commodity": value.Commodity,
                            "Product": value.Product,
                            "StockKeepingUnit": value.StockKeepingUnit,
                            "MCC_NKCommodityCode": value.MCC_NKCommodityCode,
                            "MCC_NKCommodityDesc": value.MCC_NKCommodityDesc,
                            "Client_FK": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
                            "ORG_ClientCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_ClientCode,
                            "ORG_ClientName": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_ClientName,
                            "WAR_WarehouseCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode,
                            "WAR_WarehouseName": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName,
                            "WAR_FK": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK,
                            "UseExpiryDate": value.UseExpiryDate,
                            "UsePackingDate": value.UsePackingDate,
                            "UsePartAttrib1": value.UsePartAttrib1,
                            "UsePartAttrib2": value.UsePartAttrib2,
                            "UsePartAttrib3": value.UsePartAttrib3,
                            "IsPartAttrib1ReleaseCaptured": value.IsPartAttrib1ReleaseCaptured,
                            "IsPartAttrib2ReleaseCaptured": value.IsPartAttrib2ReleaseCaptured,
                            "IsPartAttrib3ReleaseCaptured": value.IsPartAttrib3ReleaseCaptured,
                        }
                        if(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client){
                            obj.Client = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                            obj.ClientRelationship = "OWN";
                        }
                        TempLineDetails.push(obj);
                    });
                }
            }

            if(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length == 0){
                InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = [];
            }

            if(TempLineDetails.length>0){
                InwardAsnLinesCtrl.ePage.Masters.ShowAlert = true;
                angular.forEach(TempLineDetails,function(value,key){
                    var myData = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function(value1,key1){
                        if((value.PRO_FK == value1.PRO_FK) && (value.Units ==value1.Units) && (value.Packs==value1.Packs) && (value.PAC_PackType==value1.PAC_PackType) && (value.PartAttrib1==value1.PartAttrib1) &&(value.PartAttrib2==value1.PartAttrib2) && (value.PartAttrib3==value1.PartAttrib3) && (value.PackingDate==value1.PackingDate)&&(value.ExpiryDate == value1.ExpiryDate) && (value.PalletID==value1.PalletID))
                        return true;
                    });
                    if(!myData){
                        if(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && value.UsePartAttrib1 || InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && value.UsePartAttrib2 || InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && value.UsePartAttrib3){
                            if(parseFloat(value.Units) > 1){
                                var num = value.Units;
                                value.PAC_PackType = value.StockKeepingUnit;
                                value.Packs = 1;
                                value.Units = 1;

                                if(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && value.UsePartAttrib1){
                                    value.PartAttrib1='';
                                }
                                if(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && value.UsePartAttrib2){
                                    value.PartAttrib2='';
                                }
                                if(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && value.UsePartAttrib3){
                                    value.PartAttrib3='';
                                }

                                InwardAsnLinesCtrl.ePage.Masters.ShowAlert = false;
                                for(var i=0;i<parseInt(num, 10);i++){
                                    var temp = [];
                                    temp[i]=angular.copy(value);
                                    InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(temp[i]);
                                }
                            }else if(parseInt(value.Units, 10) == 1){
                                InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(value);
                                InwardAsnLinesCtrl.ePage.Masters.ShowAlert = false;
                            }
                        }else{
                            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(value);
                            InwardAsnLinesCtrl.ePage.Masters.ShowAlert = false;
                        }
                    }
                });
            }
            if(InwardAsnLinesCtrl.ePage.Masters.ShowAlert){
                toastr.info("Product Details Already Exist in Receive Lines");
            }else if(InwardAsnLinesCtrl.ePage.Masters.ShowAlert==false){
                Validation(InwardAsnLinesCtrl.currentInward);
                InwardAsnLinesCtrl.ePage.Entities.Header.CheckPoints.Receiveline = true;   
            }
            InwardAsnLinesCtrl.ePage.Masters.ShowAlert = undefined;
            $timeout(function() {
                InwardAsnLinesCtrl.ePage.Entities.Header.CheckPoints.Receiveline = false;
            }, 2000);
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function(value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response) {
                if (response.data.Response) {
                    typeCodeList.map(function(value, key) {
                        InwardAsnLinesCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        InwardAsnLinesCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetProductDetails() {
            //Get Product Details
            angular.forEach(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, function(value, key) {
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

                value.ORG_ClientCode = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                value.ORG_ClientName = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
                value.Client_FK = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK;

                if(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client){
                    value.Client = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }
            });
            GetOrgPartRelationValues();
        }

        function GetOrgPartRelationValues() {
            if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length > 0) {
                InwardAsnLinesCtrl.ePage.Masters.OrgPartRelationBlur = true;
                var myData = _.groupBy(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, "POR_FK")
                for (var prop in myData) {
                    if (prop && prop != 'null') {
                        if (myData.hasOwnProperty(prop)) {
                            var _filter = {
                                "ORG_FK": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
                                "OSP_FK": prop
                            };

                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": InwardAsnLinesCtrl.ePage.Entities.Header.API.OrgPartRelation.FilterID
                            };

                            apiService.post("eAxisAPI", InwardAsnLinesCtrl.ePage.Entities.Header.API.OrgPartRelation.Url, _input).then(function(response) {
                                if (response.data.Response) {
                                    angular.forEach(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, function(value, key) {
                                        if (value.POR_FK == response.data.Response[0].OSP_FK) {
                                            InwardAsnLinesCtrl.ePage.Masters.OrgPartRelationCount++
                                            value.UseExpiryDate = response.data.Response[0].UseExpiryDate;
                                            value.UsePackingDate = response.data.Response[0].UsePackingDate;
                                            value.UsePartAttrib1 = response.data.Response[0].UsePartAttrib1;
                                            value.UsePartAttrib2 = response.data.Response[0].UsePartAttrib2;
                                            value.UsePartAttrib3 = response.data.Response[0].UsePartAttrib3;
                                            value.IsPartAttrib1ReleaseCaptured = response.data.Response[0].IsPartAttrib1ReleaseCaptured;
                                            value.IsPartAttrib2ReleaseCaptured = response.data.Response[0].IsPartAttrib2ReleaseCaptured;
                                            value.IsPartAttrib3ReleaseCaptured = response.data.Response[0].IsPartAttrib3ReleaseCaptured;
                                            if (InwardAsnLinesCtrl.ePage.Masters.OrgPartRelationCount == InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length) {
                                                InwardAsnLinesCtrl.ePage.Masters.OrgPartRelationBlur = false;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            }
        }
        function FetchQuantity(item, index) {
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Quantity = item.Packs;
                OnChangeValues(item.Quantity, "E3030", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.POR_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.POR_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    apiService.post("eAxisAPI", InwardAsnLinesCtrl.ePage.Entities.Header.API.FetchQuantity.Url, _input).then(function(response) {
                        if (response.data.Response) {
                            item.Quantity = response.data.Response;
                            OnChangeValues(item.Quantity, "E3030", true, index);
                        }
                    });
                }
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            InwardAsnLinesCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function SelectedLookupProduct(item, index) {
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].Product = item.ProductCode+' - '+ item.ProductDescription;
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].POR_FK = item.OSP_FK;


            if(item.MCC_NKCommodityCode==null)
                item.MCC_NKCommodityCode = '';

            if(item.MCC_NKCommodityDesc==null)
            item.MCC_NKCommodityDesc = '';

            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].Commodity = item.MCC_NKCommodityCode+' - '+item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].PartAttrib1='';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].PartAttrib2='';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].PartAttrib3='';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].PackingDate='';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].ExpiryDate='';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].Quantity = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].Packs;

            OnChangeValues(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].Product, 'E3005', true, index);
            OnChangeValues(item.StockKeepingUnit, "E3031", true, index);
        }

        
        
       

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(InwardAsnLinesCtrl.ePage.Masters.Config.ValidationValues, function(value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                InwardAsnLinesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardAsnLinesCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                InwardAsnLinesCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, InwardAsnLinesCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        // ------- Error Validation While onchanges-----//

        function setSelectedRow(index) {
            InwardAsnLinesCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length;i++){
                OnChangeValues('value', "E3005", true, i);
                OnChangeValues('value', "E3006", true, i);
                OnChangeValues('value', "E3007", true, i);
                OnChangeValues('value', "E3030", true, i);
                OnChangeValues('value', "E3031", true, i);
                OnChangeValues('value', "E3040", true, i);
           }
            return true;
        }
        
        function Back() {

            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                InwardAsnLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardAsnLinesCtrl.currentInward);
            }

            InwardAsnLinesCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (InwardAsnLinesCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function() {
                        var objDiv = document.getElementById("InwardAsnLinesCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(InwardAsnLinesCtrl.currentInward);
                InwardAsnLinesCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Edit(index, name) {
            InwardAsnLinesCtrl.ePage.Masters.selectedRow = index;
            InwardAsnLinesCtrl.ePage.Masters.Lineslist = false;
            InwardAsnLinesCtrl.ePage.Masters.HeaderName = name;
            $timeout(function() { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function(e) {
            if (InwardAsnLinesCtrl.ePage.Masters.selectedRow != -1) {
                if (InwardAsnLinesCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (InwardAsnLinesCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        InwardAsnLinesCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (InwardAsnLinesCtrl.ePage.Masters.selectedRow == InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length - 1) {
                            return;
                        }
                        InwardAsnLinesCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var obj = angular.copy(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[InwardAsnLinesCtrl.ePage.Masters.selectedRow]);
            obj.PK = '';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.splice(InwardAsnLinesCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            InwardAsnLinesCtrl.ePage.Masters.Edit(InwardAsnLinesCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[InwardAsnLinesCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function(result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", InwardAsnLinesCtrl.ePage.Entities.Header.API.AsnLinesDelete.Url + item.PK).then(function(response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.splice(InwardAsnLinesCtrl.ePage.Masters.selectedRow, 1);                   
                        InwardAsnLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardAsnLinesCtrl.currentInward);
                    }
                    toastr.success('Record Removed Successfully');
                    InwardAsnLinesCtrl.ePage.Masters.Lineslist = true;
                    InwardAsnLinesCtrl.ePage.Masters.selectedRow = InwardAsnLinesCtrl.ePage.Masters.selectedRow - 1;
                }, function() {
                    console.log("Cancelled");
                });

        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "Client_FK":InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
                "ORG_ClientCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode,
                "ORG_ClientName": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName,
                "ClientRelationship":InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientRelationship,
                "ProductCode": "",
                "ProductDescription": "",
                "Product": "",
                "POR_FK": "",
                "MCC_NKCommodityCode": "",
                "MCC_NKCommodityDesc": "",
                "Commodity": "",
                "Packs": "",
                "PAC_PackType": "",
                "Quantity": "",
                "StockKeepingUnit": "",
                "PalletId": "",
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
                "IsDeleted":false,
            };
            if(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client){
                obj.Client = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                obj.ClientRelationship = "OWN";
            }

            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.push(obj);
            InwardAsnLinesCtrl.ePage.Masters.Edit(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length - 1, 'New List');
        };

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            //Validation Call
            InwardAsnLinesCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (InwardAsnLinesCtrl.ePage.Entities.Header.Validations) {
                InwardAsnLinesCtrl.ePage.Masters.Config.RemoveApiErrors(InwardAsnLinesCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                InwardAsnLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardAsnLinesCtrl.currentInward);
            }
        }

        function SaveList($item) {
            InwardAsnLinesCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'Inward').then(function(response) {
                if (response.Status === "success") {
                    var _index = inwardConfig.TabList.map(function(value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(InwardAsnLinesCtrl.currentInward[InwardAsnLinesCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        inwardConfig.TabList[_index][inwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        inwardConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/inward") {
                            helperService.refreshGrid();
                        }
                        $timeout(function() {
                            InwardAsnLinesCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                    InwardAsnLinesCtrl.ePage.Entities.Header.CheckPoints.PercentageValues = true;
                    InwardAsnLinesCtrl.ePage.Masters.Config.ProductSummary(InwardAsnLinesCtrl.ePage.Entities.Header);
                } else if (response.Status === "failed") {
                    InwardAsnLinesCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    InwardAsnLinesCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function(value, key) {
                        InwardAsnLinesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardAsnLinesCtrl.currentInward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (InwardAsnLinesCtrl.ePage.Entities.Header.Validations != null) {
                        InwardAsnLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardAsnLinesCtrl.currentInward);
                    }
                }
                InwardAsnLinesCtrl.ePage.Masters.Config.ProductSummary(InwardAsnLinesCtrl.ePage.Entities.Header);
                InwardAsnLinesCtrl.ePage.Entities.Header.CheckPoints.Receiveline = false;
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