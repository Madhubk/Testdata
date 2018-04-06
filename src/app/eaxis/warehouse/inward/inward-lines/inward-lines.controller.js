(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardLinesController", InwardLinesController);

    InwardLinesController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "$state", "$q","$filter"];

    function InwardLinesController($scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, toastr, confirmation, $state, $q, $filter) {

        var InwardLinesCtrl = this;
        function Init() {
            var currentInward = InwardLinesCtrl.currentInward[InwardLinesCtrl.currentInward.label].ePage.Entities;
            InwardLinesCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward,
            };


            // DatePicker
            InwardLinesCtrl.ePage.Masters.DatePicker = {};
            InwardLinesCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            InwardLinesCtrl.ePage.Masters.DatePicker.isOpen = [];
            InwardLinesCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            //Variable declaration
            InwardLinesCtrl.ePage.Masters.DropDownMasterList = {};
            InwardLinesCtrl.ePage.Masters.emptyText = '-'
            InwardLinesCtrl.ePage.Masters.selectedRow = -1;
            InwardLinesCtrl.ePage.Masters.AllocateLocationText = "Allocate Location";
            InwardLinesCtrl.ePage.Masters.IsAllocate = true;
            InwardLinesCtrl.ePage.Masters.Lineslist = true;
            InwardLinesCtrl.ePage.Masters.HeaderName = '';
            InwardLinesCtrl.ePage.Masters.OrgPartRelationCount = 0;

            // function declaration 
            InwardLinesCtrl.ePage.Masters.Edit = Edit;
            InwardLinesCtrl.ePage.Masters.CopyRow = CopyRow;
            InwardLinesCtrl.ePage.Masters.AddNewRow = AddNewRow;
            InwardLinesCtrl.ePage.Masters.RemoveRow = RemoveRow;
            InwardLinesCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            InwardLinesCtrl.ePage.Masters.AllocateLocation = AllocateLocation;
            InwardLinesCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            InwardLinesCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
            InwardLinesCtrl.ePage.Masters.Back = Back;
            InwardLinesCtrl.ePage.Masters.Done = Done;
            InwardLinesCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            InwardLinesCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            InwardLinesCtrl.ePage.Masters.Config = inwardConfig;
            InwardLinesCtrl.ePage.Masters.PartAttribute = PartAttribute;
            InwardLinesCtrl.ePage.Masters.Back = Back;
            InwardLinesCtrl.ePage.Masters.GetPercentageValues = GetPercentageValues;

            //Order By
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = $filter('orderBy')(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, 'CreatedDateTime');
            
            GetMastersList();
            GetPercentageValues();
            GetAllDetails();
        }


        function GetPercentageValues() {
            InwardLinesCtrl.ePage.Masters.TotalLineUnits = 0;
            InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent = 0;
            InwardLinesCtrl.ePage.Masters.TotalLinePallets = 0;
            InwardLinesCtrl.ePage.Masters.TotalLineWeight = 0;
            InwardLinesCtrl.ePage.Masters.TotalLineVolume = 0;
            InwardLinesCtrl.ePage.Masters.LineWeight = 0;
            InwardLinesCtrl.ePage.Masters.LineVolume = 0;

            angular.forEach(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                InwardLinesCtrl.ePage.Masters.TotalLineUnits = InwardLinesCtrl.ePage.Masters.TotalLineUnits + parseInt(value.Units, 10);
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent = InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent + parseInt(value.Packs, 10);
                InwardLinesCtrl.ePage.Masters.LineWeight = parseInt(value.Weight, 10) * parseInt(value.Units, 10);
                InwardLinesCtrl.ePage.Masters.LineVolume = parseInt(value.Volume, 10) * parseInt(value.Units, 10);
                InwardLinesCtrl.ePage.Masters.TotalLineWeight = InwardLinesCtrl.ePage.Masters.TotalLineWeight + InwardLinesCtrl.ePage.Masters.LineWeight;
                InwardLinesCtrl.ePage.Masters.TotalLineVolume = InwardLinesCtrl.ePage.Masters.TotalLineVolume + InwardLinesCtrl.ePage.Masters.LineVolume;
            });

            //To find Percentage for Units
            if (parseInt(InwardLinesCtrl.ePage.Masters.TotalLineUnits, 10) > parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits, 10)) {
                InwardLinesCtrl.ePage.Masters.TotalLineUnitsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalUnitsPercentage = ((parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits, 10) / parseInt(InwardLinesCtrl.ePage.Masters.TotalLineUnits, 10)) * 100)
            }
            else if (parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits, 10) > parseInt(InwardLinesCtrl.ePage.Masters.TotalLineUnits, 10)) {
                InwardLinesCtrl.ePage.Masters.TotalUnitsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLineUnitsPercentage = ((parseInt(InwardLinesCtrl.ePage.Masters.TotalLineUnits, 10) / parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits, 10)) * 100)
            }
            else if ((parseInt(InwardLinesCtrl.ePage.Masters.TotalLineUnits, 10) == parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits, 10)) && parseInt(InwardLinesCtrl.ePage.Masters.TotalLineUnits, 10) != 0) {
                InwardLinesCtrl.ePage.Masters.TotalUnitsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLineUnitsPercentage = 100;
            }
            else {
                InwardLinesCtrl.ePage.Masters.TotalUnitsPercentage = 0;
                InwardLinesCtrl.ePage.Masters.TotalLineUnitsPercentage = 0;
            }

            //To find Percentage for Packages
            if (parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent, 10) > parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent, 10)) {
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalPackagesSentPercentage = ((parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent, 10) / parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent, 10)) * 100)
            }
            else if (parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent, 10) > parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent, 10)) {
                InwardLinesCtrl.ePage.Masters.TotalPackagesSentPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSentPercentage = ((parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent, 10) / parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent, 10)) * 100)
            }
            else if ((parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent, 10) == parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent, 10)) && parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePackagesSent, 10) != 0) {
                InwardLinesCtrl.ePage.Masters.TotalPackagesSentPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 100;
            }
            else {
                InwardLinesCtrl.ePage.Masters.TotalPackagesSentPercentage = 0;
                InwardLinesCtrl.ePage.Masters.TotalLinePackagesSentPercentage = 0;
            }

            //To find Pallet percentage and value

            var PalletValue = _.groupBy(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, "PalletID")
            for (var prop in PalletValue) {
                if (prop && prop != 'null' && prop != 'undefined') {
                    if (PalletValue.hasOwnProperty(prop)) {
                        InwardLinesCtrl.ePage.Masters.TotalLinePallets++;
                    }
                }
            }

            if (parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePallets, 10) > parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets, 10)) {
                InwardLinesCtrl.ePage.Masters.TotalLinePalletsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalPalletsPercentage = ((parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets, 10) / parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePallets, 10)) * 100)
            }
            else if (parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets, 10) > parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePallets, 10)) {
                InwardLinesCtrl.ePage.Masters.TotalPalletsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLinePalletsPercentage = ((parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePallets, 10) / parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets, 10)) * 100)
            }
            else if ((parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePallets, 10) == parseInt(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets, 10)) && parseInt(InwardLinesCtrl.ePage.Masters.TotalLinePallets, 10) != 0) {
                InwardLinesCtrl.ePage.Masters.TotalPalletsPercentage = 100;
                InwardLinesCtrl.ePage.Masters.TotalLinePalletsPercentage = 100;
            }
            else {
                InwardLinesCtrl.ePage.Masters.TotalPalletsPercentage = 0;
                InwardLinesCtrl.ePage.Masters.TotalLinePalletsPercentage = 0;
            }
            InwardLinesCtrl.ePage.Entities.Header.CheckPoints.PercentageValues = false;
        }

        function GetAllDetails() {
            angular.forEach(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                value.LocationType = 'DDA';
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

                value.ORG_ClientCode = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                value.ORG_ClientName = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
                value.Client_FK = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK;

                value.WAR_WarehouseCode = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode;
                value.WAR_WarehouseName = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName;
                value.WAR_FK = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK;

                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                    value.Client = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }
            });
            GetOrgPartRelationValues();
        }

        function GetOrgPartRelationValues() {
            if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length > 0) {
                InwardLinesCtrl.ePage.Masters.OrgPartRelationBlur = true;
                var myData = _.groupBy(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, "PRO_FK")
                for (var prop in myData) {
                    if (prop && prop != 'null') {
                        if (myData.hasOwnProperty(prop)) {
                            var _filter = {
                                "ORG_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
                                "OSP_FK": prop
                            };

                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": InwardLinesCtrl.ePage.Entities.Header.API.OrgPartRelation.FilterID
                            };

                            apiService.post("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.OrgPartRelation.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    angular.forEach(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                                        if (value.PRO_FK == response.data.Response[0].OSP_FK) {
                                            InwardLinesCtrl.ePage.Masters.OrgPartRelationCount++
                                            value.UseExpiryDate = response.data.Response[0].UseExpiryDate;
                                            value.UsePackingDate = response.data.Response[0].UsePackingDate;
                                            value.UsePartAttrib1 = response.data.Response[0].UsePartAttrib1;
                                            value.UsePartAttrib2 = response.data.Response[0].UsePartAttrib2;
                                            value.UsePartAttrib3 = response.data.Response[0].UsePartAttrib3;
                                            value.IsPartAttrib1ReleaseCaptured = response.data.Response[0].IsPartAttrib1ReleaseCaptured;
                                            value.IsPartAttrib2ReleaseCaptured = response.data.Response[0].IsPartAttrib2ReleaseCaptured;
                                            value.IsPartAttrib3ReleaseCaptured = response.data.Response[0].IsPartAttrib3ReleaseCaptured;
                                            if (InwardLinesCtrl.ePage.Masters.OrgPartRelationCount == InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length) {
                                                InwardLinesCtrl.ePage.Masters.OrgPartRelationBlur = false;
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
            if ((InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 && !item.IsPartAttrib1ReleaseCaptured) || (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 && !item.IsPartAttrib2ReleaseCaptured) || (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 && !item.IsPartAttrib3ReleaseCaptured)) {
                if (parseFloat(item.Units) > 1) {
                    OnChangeValues(null, "E3038", true, InwardLinesCtrl.ePage.Masters.selectedRow);
                } else {
                    OnChangeValues('value', "E3038", true, InwardLinesCtrl.ePage.Masters.selectedRow);
                }
            }
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Units = item.Packs;
                OnChangeValues(item.Units, "E3032", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.PRO_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.PRO_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {
                    apiService.post("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Units = response.data.Response;
                            OnChangeValues(item.Units, "E3032", true, index);
                        }
                    });
                }
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            InwardLinesCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_HELDCODE", "INW_LINE_UQ", "ProductCondition"];
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
                        InwardLinesCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        InwardLinesCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function SelectedLookupProduct(item, index) {
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Product = item.ProductCode + ' - ' + item.ProductDescription;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PRO_FK = item.OSP_FK;


            if (item.MCC_NKCommodityCode == null)
                item.MCC_NKCommodityCode = '';

            if (item.MCC_NKCommodityDesc == null)
                item.MCC_NKCommodityDesc = '';

            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Commodity = item.MCC_NKCommodityCode + ' - ' + item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib1='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib2='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PartAttrib3='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].PackingDate='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].ExpiryDate='';
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Units = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Packs;
            
            OnChangeValues(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].Product, 'E3008', true, index);
            OnChangeValues(item.StockKeepingUnit, "E3033", true, index);
        }

        function SelectedLookupLocation(item, index) {
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_FK = item.PK;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WRO_Name = item.WRO_Name;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Level = item.Level;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Column = item.Column;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WLO_Location = item.Location;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WAA_AreaType = item.WAA_AreaType;
            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[index].WAA_Name = item.WAA_Name;
        }

        function PartAttribute(item, index) {
            if (!item.IsPartAttrib1ReleaseCaptured) {
                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && item.UsePartAttrib1 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "MAN" && item.UsePartAttrib1 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "BAT" && item.UsePartAttrib1) {
                    if (!item.PartAttrib1)
                        OnChangeValues(null, 'E3018', true, index);
                    else
                        OnChangeValues('value', 'E3018', true, index);
                }
            }
            if (!item.IsPartAttrib2ReleaseCaptured) {
                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && item.UsePartAttrib2 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "MAN" && item.UsePartAttrib2 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "BAT" && item.UsePartAttrib2) {
                    if (!item.PartAttrib2)
                        OnChangeValues(null, 'E3019', true, index);
                    else
                        OnChangeValues('value', 'E3019', true, index);
                }
            }
            if (!item.IsPartAttrib3ReleaseCaptured) {
                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && item.UsePartAttrib3 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "MAN" && item.UsePartAttrib3 || InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "BAT" && item.UsePartAttrib3) {
                    if (!item.PartAttrib3)
                        OnChangeValues(null, 'E3020', true, index);
                    else
                        OnChangeValues('value', 'E3020', true, index);
                }
            }
            if (item.UsePackingDate) {
                if (!item.PackingDate)
                    OnChangeValues(null, 'E3035', true, index);
                else
                    OnChangeValues('value', 'E3035', true, index);
            }
            if (item.UseExpiryDate) {
                if (!item.ExpiryDate)
                    OnChangeValues(null, 'E3036', true, index);
                else
                    OnChangeValues('value', 'E3036', true, index);
            }

        }
        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(InwardLinesCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                InwardLinesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardLinesCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                InwardLinesCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, InwardLinesCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        // ------- Error Validation While onchanges-----//

        function setSelectedRow(index) {
            InwardLinesCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length; i++) {
                OnChangeValues('value', "E3008", true, i);
                OnChangeValues('value', "E3009", true, i);
                OnChangeValues('value', "E3010", true, i);
                OnChangeValues('value', "E3018", true, i);
                OnChangeValues('value', "E3019", true, i);
                OnChangeValues('value', "E3020", true, i);
                OnChangeValues('value', "E3021", true, i);
                OnChangeValues('value', "E3022", true, i);
                OnChangeValues('value', "E3023", true, i);
                OnChangeValues('value', "E3032", true, i);
                OnChangeValues('value', "E3033", true, i);
                OnChangeValues('value', "E3035", true, i);
                OnChangeValues('value', "E3036", true, i);
                OnChangeValues('value', "E3038", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if (ReturnValue) {
                InwardLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardLinesCtrl.currentInward);
            }

            InwardLinesCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {

            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if (ReturnValue) {
                if (InwardLinesCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("InwardLinesCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
            }
            Validation(InwardLinesCtrl.currentInward);
            InwardLinesCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index, name) {
            InwardLinesCtrl.ePage.Masters.selectedRow = index;
            InwardLinesCtrl.ePage.Masters.Lineslist = false;
            InwardLinesCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (InwardLinesCtrl.ePage.Masters.selectedRow != -1) {
                if (InwardLinesCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (InwardLinesCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        InwardLinesCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (InwardLinesCtrl.ePage.Masters.selectedRow == InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length - 1) {
                            return;
                        }
                        InwardLinesCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            if (!InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ArrivalDate) {
                OnChangeValues(null, "E3034", false, undefined);
                InwardLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardLinesCtrl.currentInward);
            } else {
                var item = angular.copy(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[InwardLinesCtrl.ePage.Masters.selectedRow]);
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
                    "ProductCondition": item.ProductCondition,
                    "PartAttrib1": item.PartAttrib1,
                    "PartAttrib2": item.PartAttrib2,
                    "PartAttrib3": item.PartAttrib3,
                    "LocationType": item.LocationType,
                    "PalletID": item.PalletID,
                  
                    "PackingDate": item.PackingDate,
                    "ExpiryDate": item.ExpiryDate,
                    "WRO_Name": item.WRO_Name,
                    "WLO_Location": item.WLO_Location,
                    "WLO_Column": item.WLO_Column,
                    "WLO_Level": item.WLO_Level,
                    "WAA_AreaType": item.WAA_AreaType,
                    "WAA_Name": item.WAA_Name,
                    "UseExpiryDate": item.UseExpiryDate,
                    "UsePackingDate": item.UsePackingDate,
                    "UsePartAttrib1": item.UsePartAttrib1,
                    "UsePartAttrib2": item.UsePartAttrib2,
                    "UsePartAttrib3": item.UsePartAttrib3,
                    "IsPartAttrib1ReleaseCaptured": item.IsPartAttrib1ReleaseCaptured,
                    "IsPartAttrib2ReleaseCaptured": item.IsPartAttrib2ReleaseCaptured,
                    "IsPartAttrib3ReleaseCaptured": item.IsPartAttrib3ReleaseCaptured,

                    "IsDeleted": false,
                    "ORG_ClientCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode,
                    "ORG_ClientName": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName,
                    "Client_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,

                    "WAR_WarehouseCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode,
                    "WAR_WarehouseName": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName,
                    "WAR_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK,
                };

                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                    obj.Client = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                    obj.ClientRelationship = "OWN";
                }
                
                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(InwardLinesCtrl.ePage.Masters.selectedRow + 1, 0, obj);
                InwardLinesCtrl.ePage.Masters.Edit(InwardLinesCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
                OnChangeValues("value", "E3034", false, undefined);
            }
        }

        function RemoveRow() {
            var item = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine[InwardLinesCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.splice(InwardLinesCtrl.ePage.Masters.selectedRow, 1);
                        InwardLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardLinesCtrl.currentInward);
                    }
                    toastr.success('Record Removed Successfully');
                    InwardLinesCtrl.ePage.Entities.Header.CheckPoints.PercentageValues = true;
                    InwardLinesCtrl.ePage.Masters.Lineslist = true;
                    InwardLinesCtrl.ePage.Masters.selectedRow = InwardLinesCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            if (!InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ArrivalDate) {
                OnChangeValues(null, "E3034", false, undefined);
                InwardLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardLinesCtrl.currentInward);
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
                    "ProductCondition": "",
                    "PartAttrib1": "",
                    "PartAttrib2": "",
                    "PartAttrib3": "",
                    "LocationType": "",
                    "PalletID": "",
                    "OriginalInventoryStatus": "",
                    "OriginalInventoryStatusDesc": "",
                    "PackingDate": "",
                    "ExpiryDate": "",
                    "WRO_Name": "",
                    "WLO_Location": "",
                    "WLO_Column": "",
                    "WLO_Level": "",
                    "WAA_AreaType": "",
                    "WAA_Name": "",
                    "TransferFromDockDoor": "",
                    "UseExpiryDate": false,
                    "UsePackingDate": false,
                    "UsePartAttrib1": false,
                    "UsePartAttrib2": false,
                    "UsePartAttrib3": false,
                    "IsPartAttrib1ReleaseCaptured": false,
                    "IsPartAttrib2ReleaseCaptured": false,
                    "IsPartAttrib3ReleaseCaptured": false,
                    "IsModified": false,

                    "IsDeleted": false,
                    "ORG_ClientCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode,
                    "ORG_ClientName": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName,
                    "Client_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,

                    "WAR_WarehouseCode": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode,
                    "WAR_WarehouseName": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName,
                    "WAR_FK": InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK,
                };

                if (InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                    obj.Client = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                    obj.ClientRelationship = "OWN";
                }

                InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(obj);
                InwardLinesCtrl.ePage.Masters.Edit(InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length - 1, 'New List');
                OnChangeValues('value', "E3034", false, undefined);
            }
        };

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            //Validation Call
            InwardLinesCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (InwardLinesCtrl.ePage.Entities.Header.Validations) {
                InwardLinesCtrl.ePage.Masters.Config.RemoveApiErrors(InwardLinesCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                InwardLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardLinesCtrl.currentInward);
            }
        }

        function SaveList($item) {
            InwardLinesCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'Inward').then(function (response) {
                if (response.Status === "success") {
                    var _index = inwardConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(InwardLinesCtrl.currentInward[InwardLinesCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        inwardConfig.TabList[_index][inwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        inwardConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/inward") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            InwardLinesCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                    InwardLinesCtrl.ePage.Entities.Header.CheckPoints.Receiveline = false;
                    InwardLinesCtrl.ePage.Entities.Header.CheckPoints.PercentageValues = true;
                    InwardLinesCtrl.ePage.Masters.Config.ProductSummary(InwardLinesCtrl.ePage.Entities.Header);
                } else if (response.Status === "failed") {
                    InwardLinesCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    InwardLinesCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        InwardLinesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardLinesCtrl.currentInward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (InwardLinesCtrl.ePage.Entities.Header.Validations != null) {
                        InwardLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardLinesCtrl.currentInward);
                    }
                }
                InwardLinesCtrl.ePage.Masters.Config.ProductSummary(InwardLinesCtrl.ePage.Entities.Header);
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

        function AllocateLocation() {
            var _input = InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine;
            angular.forEach(_input, function (value, key) {
                if (value.PK) {
                    InwardLinesCtrl.ePage.Masters.IsAllocate = true;
                }
                else {
                    InwardLinesCtrl.ePage.Masters.IsAllocate = false;
                }
            });

            if (InwardLinesCtrl.ePage.Masters.IsAllocate == true) {
                if (_input.length != 0) {
                    InwardLinesCtrl.ePage.Masters.AllocateLocationText = "Allocating...";
                    InwardLinesCtrl.ePage.Masters.IsLoadingToSave = true;

                    apiService.post("eAxisAPI", InwardLinesCtrl.ePage.Entities.Header.API.AllocateLocation.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            InwardLinesCtrl.ePage.Masters.IsLoadingToSave = false;
                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = response.data.Response;

                            InwardLinesCtrl.ePage.Masters.AllocateLocationText = "Allocate Location";

                            toastr.info(response.data.Messages[0].MessageDesc)

                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatus = "IAL"
                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickSlipDateTime = new Date();
                            InwardLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatusDesc = 'Location Allocated';
                            OnChangeValues('value','E3041',false);
                        } else {
                            toastr.error("Failed");
                            InwardLinesCtrl.ePage.Masters.IsLoadingToSave = false;
                            InwardLinesCtrl.ePage.Masters.AllocateLocationText = "Allocate Location";
                        }
                    });
                } else {
                    toastr.info("Inward Line Is Empty");
                }
            } else {
                toastr.warning("Please Save Line Before Allocating Location");
            }
        }

        Init();
    }

})();