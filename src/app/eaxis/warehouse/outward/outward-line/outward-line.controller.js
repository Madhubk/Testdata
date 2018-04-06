(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardLineController", OutwardLineController);

    OutwardLineController.$inject = ["$scope", "$state", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "$injector", "$window", "toastr", "confirmation","$filter"];

    function OutwardLineController($scope, $state, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, $injector, $window, toastr, confirmation,$filter) {

        var OutwardLineCtrl = this;

        function Init() {

            var currentOutward = OutwardLineCtrl.currentOutward[OutwardLineCtrl.currentOutward.label].ePage.Entities;
            OutwardLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward,
            };

            // DatePicker
            OutwardLineCtrl.ePage.Masters.DatePicker = {};
            OutwardLineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OutwardLineCtrl.ePage.Masters.DatePicker.isOpen = [];
            OutwardLineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            OutwardLineCtrl.ePage.Masters.DropDownMasterList = {};
            OutwardLineCtrl.ePage.Masters.emptyText = '-';
            OutwardLineCtrl.ePage.Masters.ProductCode_Desc = [];
            OutwardLineCtrl.ePage.Masters.selectedRow = -1;
            OutwardLineCtrl.ePage.Masters.Linesave = true;
            OutwardLineCtrl.ePage.Masters.IsDisableEnter = false;
            OutwardLineCtrl.ePage.Masters.Lineslist = true;
            OutwardLineCtrl.ePage.Masters.HeaderName = '';
            OutwardLineCtrl.ePage.Masters.OrgPartRelationCount = 0;

            // function 
            OutwardLineCtrl.ePage.Masters.Edit = Edit;
            OutwardLineCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            OutwardLineCtrl.ePage.Masters.CopyRow = CopyRow;
            OutwardLineCtrl.ePage.Masters.RemoveRow = RemoveRow;
            OutwardLineCtrl.ePage.Masters.AddNewRow = AddNewRow;
            OutwardLineCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            OutwardLineCtrl.ePage.Masters.Back = Back;
            OutwardLineCtrl.ePage.Masters.Done = Done;
            OutwardLineCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            OutwardLineCtrl.ePage.Masters.Config = outwardConfig;
            OutwardLineCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            OutwardLineCtrl.ePage.Masters.GetPercentageValues = GetPercentageValues;

            //Order By
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = $filter('orderBy')(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, 'CreatedDateTime');


            GetMastersList();
            getLinesList();
            GetPercentageValues();
        }


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            OutwardLineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetPercentageValues() {
            OutwardLineCtrl.ePage.Masters.TotalLineUnits = 0;
            OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent = 0;
            OutwardLineCtrl.ePage.Masters.TotalLineWeight = 0;
            OutwardLineCtrl.ePage.Masters.TotalLineVolume = 0;
            OutwardLineCtrl.ePage.Masters.LineWeight = 0;
            OutwardLineCtrl.ePage.Masters.LineVolume = 0;

            angular.forEach(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                OutwardLineCtrl.ePage.Masters.TotalLineUnits = OutwardLineCtrl.ePage.Masters.TotalLineUnits + parseFloat(value.Units);
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent = OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent + parseFloat(value.Packs);
                OutwardLineCtrl.ePage.Masters.LineWeight = parseFloat(value.Weight) * parseFloat(value.Units);
                OutwardLineCtrl.ePage.Masters.LineVolume = parseFloat(value.Volume) * parseFloat(value.Units);
                OutwardLineCtrl.ePage.Masters.TotalLineWeight = OutwardLineCtrl.ePage.Masters.TotalLineWeight + OutwardLineCtrl.ePage.Masters.LineWeight;
                OutwardLineCtrl.ePage.Masters.TotalLineVolume = OutwardLineCtrl.ePage.Masters.TotalLineVolume + OutwardLineCtrl.ePage.Masters.LineVolume;
            });
            //To find Percentage for Units
            if (parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits) > parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits)) {
                OutwardLineCtrl.ePage.Masters.TotalLineUnitsPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalUnitsPercentage = ((parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits) / parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits)) * 100)
            }
            else if (parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits) > parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits)) {
                OutwardLineCtrl.ePage.Masters.TotalUnitsPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalLineUnitsPercentage = ((parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits) / parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits)) * 100)
            }
            else if ((parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits) == parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits)) && parseFloat(OutwardLineCtrl.ePage.Masters.TotalLineUnits) != 0) {
                OutwardLineCtrl.ePage.Masters.TotalUnitsPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalLineUnitsPercentage = 100;
            }
            else {
                OutwardLineCtrl.ePage.Masters.TotalUnitsPercentage = 0;
                OutwardLineCtrl.ePage.Masters.TotalLineUnitsPercentage = 0;
            }

            //To find Percentage for Packages
            if (parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent) > parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent)) {
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalPackagesSentPercentage = ((parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent) / parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent)) * 100)
            }
            else if (parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent) > parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent)) {
                OutwardLineCtrl.ePage.Masters.TotalPackagesSentPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSentPercentage = ((parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent) / parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent)) * 100)
            }
            else if ((parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent) == parseFloat(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent)) && parseFloat(OutwardLineCtrl.ePage.Masters.TotalLinePackagesSent) != 0) {
                OutwardLineCtrl.ePage.Masters.TotalPackagesSentPercentage = 100;
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 100;
            }
            else {
                OutwardLineCtrl.ePage.Masters.TotalPackagesSentPercentage = 0;
                OutwardLineCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 0;
            }

            OutwardLineCtrl.ePage.Entities.Header.CheckPoints.PercentageValues = false;
        }

        // line grid
        function getLinesList() {
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLineUnits = 0;
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLinePallets = 0;
            angular.forEach(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLineUnits = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLineUnits + value.TotalUnits;
                OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLinePallets = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.TotalLinePallets + value.PalletID;
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

                value.ORG_ClientCode = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode;
                value.ORG_ClientName = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName;
                value.Client_FK = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode;
                value.WAR_WarehouseName = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName;
                value.WAR_FK = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK;

                if(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client){
                    value.Client = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }
            });
            GetOrgPartRelationValues();
        }

        function GetOrgPartRelationValues() {
            if (OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length > 0) {
                OutwardLineCtrl.ePage.Masters.OrgPartRelationBlur = true;
                var myData = _.groupBy(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, "PRO_FK")
                for (var prop in myData) {
                    if (prop && prop != 'null') {
                        if (myData.hasOwnProperty(prop)) {
                            var _filter = {
                                "OSP_FK": prop
                            };

                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": OutwardLineCtrl.ePage.Entities.Header.API.OrgPartRelation.FilterID
                            };

                            apiService.post("eAxisAPI", OutwardLineCtrl.ePage.Entities.Header.API.OrgPartRelation.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    angular.forEach(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                                        if (value.PRO_FK == response.data.Response[0].OSP_FK) {
                                            OutwardLineCtrl.ePage.Masters.OrgPartRelationCount++;
                                            value.UseExpiryDate = response.data.Response[0].UseExpiryDate;
                                            value.UsePackingDate = response.data.Response[0].UsePackingDate;
                                            value.UsePartAttrib1 = response.data.Response[0].UsePartAttrib1;
                                            value.UsePartAttrib2 = response.data.Response[0].UsePartAttrib2;
                                            value.UsePartAttrib3 = response.data.Response[0].UsePartAttrib3;
                                            value.IsPartAttrib1ReleaseCaptured = response.data.Response[0].IsPartAttrib1ReleaseCaptured;
                                            value.IsPartAttrib2ReleaseCaptured = response.data.Response[0].IsPartAttrib2ReleaseCaptured;
                                            value.IsPartAttrib3ReleaseCaptured = response.data.Response[0].IsPartAttrib3ReleaseCaptured;
                                            if (OutwardLineCtrl.ePage.Masters.OrgPartRelationCount == OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length) {
                                                OutwardLineCtrl.ePage.Masters.OrgPartRelationBlur = false;
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

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ", "WMSYESNO"];
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
                        OutwardLineCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OutwardLineCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }


        function SelectedLookupProduct(item, index) {
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Product = item.ProductCode + " - " + item.ProductDescription;
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PRO_FK = item.OSP_FK;

            if(item.MCC_NKCommodityCode==null)
            item.MCC_NKCommodityCode = '';

            if(item.MCC_NKCommodityDesc==null)
            item.MCC_NKCommodityDesc = '';

            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Commodity = item.MCC_NKCommodityCode+' - '+item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib1='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib2='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib3='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PackingDate='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].ExpiryDate='';
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Units = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Packs;
            
            OnChangeValues(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Product, 'E3504', true, index);
            OnChangeValues(item.StockKeepingUnit, 'E3521', true, index);
        }

        function FetchQuantity(item, index) {
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                OnChangeValues(item.Units, "E3520", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    apiService.post("eAxisAPI", OutwardLineCtrl.ePage.Entities.Header.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            OnChangeValues(item.Units, "E3520", true, index);
                        }
                    });
                }
            }
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(OutwardLineCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                OutwardLineCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OutwardLineCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                OutwardLineCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OutwardLineCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        // ------- Error Validation While onchanges-----//

        function setSelectedRow(index) {
            OutwardLineCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length;i++){
                OnChangeValues('value', "E3504", true, i);
                OnChangeValues('value', "E3505", true, i);
                OnChangeValues('value', "E3506", true, i);
                OnChangeValues('value', "E3520", true, i);
                OnChangeValues('value', "E3521", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                OutwardLineCtrl.ePage.Masters.Config.GeneralValidation(OutwardLineCtrl.currentOutward);
            }
            OutwardLineCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (OutwardLineCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("OutwardLineCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(OutwardLineCtrl.currentOutward);
                OutwardLineCtrl.ePage.Masters.Lineslist = true;
            } 
        }

        function Edit(index, name) {
            OutwardLineCtrl.ePage.Masters.selectedRow = index;
            OutwardLineCtrl.ePage.Masters.Lineslist = false;
            OutwardLineCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (OutwardLineCtrl.ePage.Masters.selectedRow != -1) {
                if (OutwardLineCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (OutwardLineCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        OutwardLineCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (OutwardLineCtrl.ePage.Masters.selectedRow == OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length - 1) {
                            return;
                        }
                        OutwardLineCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var item = angular.copy(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[OutwardLineCtrl.ePage.Masters.selectedRow]);
            var obj = {
                "PK": "",
                "ProductCode":item.ProductCode,
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
                "PartAttrib1": item.PartAttrib1,
                "PartAttrib2": item.PartAttrib2,
                "PartAttrib3": item.PartAttrib3,
                "LineComment": item.LineComment,
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
                "ORG_ClientCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode,
                "ORG_ClientName": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName,
                "Client_FK": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK,

                "WAR_WarehouseCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode,
                "WAR_WarehouseName": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName,
                "WAR_FK": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK,
            };
            if(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client){
                obj.Client = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode;
                obj.ClientRelationship = "OWN";
            }
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(OutwardLineCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            OutwardLineCtrl.ePage.Masters.Edit(OutwardLineCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[OutwardLineCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", OutwardLineCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(OutwardLineCtrl.ePage.Masters.selectedRow, 1);                   
                        OutwardLineCtrl.ePage.Masters.Config.GeneralValidation(OutwardLineCtrl.currentOutward);
                    }
                    toastr.success('Record Removed Successfully');
                    OutwardLineCtrl.ePage.Masters.Lineslist = true;
                    OutwardLineCtrl.ePage.Masters.selectedRow = OutwardLineCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
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
                "PartAttrib1": "",
                "PartAttrib2": "",
                "PartAttrib3": "",
                "QtyMet": "",
                "ReservedUnit": "",
                "ShortQty": "",
                "LineComment": "",
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
                "ORG_ClientCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode,
                "ORG_ClientName": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName,
                "Client_FK": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK,

                "WAR_WarehouseCode": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode,
                "WAR_WarehouseName": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName,
                "WAR_FK": OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK,
            };
            if(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client){
                obj.Client = OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode;
                obj.ClientRelationship = "OWN";
            }
            
            OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(obj);
            OutwardLineCtrl.ePage.Masters.Edit(OutwardLineCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length - 1, 'New List');
        };

        function Validation($item, index) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            //Validation Call
            OutwardLineCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (OutwardLineCtrl.ePage.Entities.Header.Validations) {
                OutwardLineCtrl.ePage.Masters.Config.RemoveApiErrors(OutwardLineCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                OutwardLineCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardLineCtrl.currentOutward);
            }
        }

        function SaveList($item) {
            OutwardLineCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'Outward').then(function (response) {
                if (response.Status === "success") {
                    var _index = outwardConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(OutwardLineCtrl.currentOutward[OutwardLineCtrl.currentOutward.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        outwardConfig.TabList[_index][outwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        outwardConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/outward") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            OutwardLineCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    OutwardLineCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    OutwardLineCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        OutwardLineCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OutwardLineCtrl.currentOutward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (OutwardLineCtrl.ePage.Entities.Header.Validations != null) {
                        OutwardLineCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardLineCtrl.currentOutward);
                    }
                }
                GetPercentageValues();
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