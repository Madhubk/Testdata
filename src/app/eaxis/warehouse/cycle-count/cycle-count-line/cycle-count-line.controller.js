(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CycleCountLineController", CycleCountLineController);

    CycleCountLineController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "cycleCountConfig", "helperService", "toastr", "$document","confirmation","$filter"];

    function CycleCountLineController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, cycleCountConfig, helperService, toastr, $document,confirmation,$filter) {

        var CycleCountLineCtrl = this;

        function Init() {

            var currentCycleCount = CycleCountLineCtrl.currentCycleCount[CycleCountLineCtrl.currentCycleCount.label].ePage.Entities;

            CycleCountLineCtrl.ePage = {
                "Title": "",
                "Prefix": "CycleCount_Line",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentCycleCount,
            };
             // DatePicker
             CycleCountLineCtrl.ePage.Masters.DatePicker = {};
             CycleCountLineCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
             CycleCountLineCtrl.ePage.Masters.DatePicker.isOpen = [];
             CycleCountLineCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

             CycleCountLineCtrl.ePage.Masters.DropDownMasterList = {};
             CycleCountLineCtrl.ePage.Masters.emptyText = '-'
             CycleCountLineCtrl.ePage.Masters.selectedRow = -1;
             CycleCountLineCtrl.ePage.Masters.Lineslist = true;
             CycleCountLineCtrl.ePage.Masters.HeaderName = '';
             

             CycleCountLineCtrl.ePage.Masters.AddNewRow = AddNewRow;
             CycleCountLineCtrl.ePage.Masters.RemoveRow = RemoveRow;
             CycleCountLineCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
             CycleCountLineCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
             CycleCountLineCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
             CycleCountLineCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
             CycleCountLineCtrl.ePage.Masters.OrgPartRelationValues = OrgPartRelationValues;
             CycleCountLineCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
             CycleCountLineCtrl.ePage.Masters.Config = cycleCountConfig;
             CycleCountLineCtrl.ePage.Masters.ChangeDateVerified = ChangeDateVerified;
             CycleCountLineCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
             CycleCountLineCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox

             //Order By
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine = $filter('orderBy')(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine, 'CreatedDateTime');

             GetLineList();
             GetMastersList();
        }

        function GetLineList(){
            angular.forEach(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine,function(value,key){
                if(value.ProductCode==null){
                    value.ProductCode = ''
                }
                if(value.ProductDesc ==null){
                    value.ProductDesc = '';
                }
                value.Product=value.ProductCode+' - '+value.ProductDesc;

                if(value.ClientCode==null){
                    value.ClientCode = '';
                }
                if(value.ClientName==null){
                    value.ClientName = '';
                }
                value.ClientFullName = value.ClientCode+' - '+value.ClientName;

                value.ClientCode = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                value.ClientName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
                value.ORG_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK;

                value.WarehouseCode = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseCode;
                value.WarehouseName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WarehouseName;
                value.WAR_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WAR_FK;
                value.SingleSelect = false;
                
                if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client){
                    value.Client = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                    
                }
            });
        }
        
        function SingleSelectCheckBox() {
            var Checked = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.some(function (value, key) {
                return value.SingleSelect == false;
            });
            if (Checked) {
                CycleCountLineCtrl.ePage.Masters.SelectAll = false;
            } else {
                CycleCountLineCtrl.ePage.Masters.SelectAll = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine, function (value, key) {
                if (CycleCountLineCtrl.ePage.Masters.SelectAll)
                    value.SingleSelect = true;
                else
                    value.SingleSelect = false;
            });
        }
        
        function ChangeDateVerified(item,index){
            if(parseInt(item, 10)>=0){
                CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].DateVerified = new Date(); 
            }else{
                CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].DateVerified = ""; 
            }
        }
         // DatePicker
         function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            CycleCountLineCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
      
        function SelectedLookupProduct(item,index){
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Product = item.ProductCode+' - '+ item.ProductDescription;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].OSP_FK = item.OSP_FK;
            OnChangeValues(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Product,'E13003',true,index);
        }

        function SelectedLookupDataClient(item,index){
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ClientFullName = item.Code+' - '+item.FullName;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Client = item.Code;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ClientRelationship = 'OWN';
            OnChangeValues(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ClientFullName,'E13002',true,index);
        }

        function SelectedLookupLocation(item,index){
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Location = item.Location;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].WLO_FK = item.Pk;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].AreaName = item.WAA_Name;
            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].RowName = item.WRO_Name;
            OnChangeValues(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Location,'E13004',true,index);
        }

        function OrgPartRelationValues(index){
            if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Client && CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].Product ){
                CycleCountLineCtrl.ePage.Entities.Header.CheckPoints.PageBlur = true;
                var _filter = {
                    "ORG_FK": CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].ORG_FK,
                    "OSP_FK": CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].OSP_FK
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": CycleCountLineCtrl.ePage.Entities.Header.API.OrgPartRelation.FilterID
                };
                apiService.post("eAxisAPI", CycleCountLineCtrl.ePage.Entities.Header.API.OrgPartRelation.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UseExpiryDate = response.data.Response[0].UseExpiryDate;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePackingDate = response.data.Response[0].UsePackingDate;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib1 = response.data.Response[0].UsePartAttrib1;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib2 = response.data.Response[0].UsePartAttrib2;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].UsePartAttrib3 = response.data.Response[0].UsePartAttrib3;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].IsPartAttrib1ReleaseCaptured = response.data.Response[0].IsPartAttrib1ReleaseCaptured;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].IsPartAttrib2ReleaseCaptured = response.data.Response[0].IsPartAttrib2ReleaseCaptured;
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[index].IsPartAttrib3ReleaseCaptured = response.data.Response[0].IsPartAttrib3ReleaseCaptured;
                        CycleCountLineCtrl.ePage.Entities.Header.CheckPoints.PageBlur = false;
                    }
                });
            }
        }

         // ------- Error Validation While onchanges-----//
         function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(CycleCountLineCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                CycleCountLineCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, CycleCountLineCtrl.currentCycleCount.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
            } else {
                CycleCountLineCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, CycleCountLineCtrl.currentCycleCount.label, IsArray, RowIndex, value.ColIndex);
            }
        }
        
        function setSelectedRow(index) {
            CycleCountLineCtrl.ePage.Masters.selectedRow = index;            
        }

        $document.bind('keydown', function (e) {
            if (CycleCountLineCtrl.ePage.Masters.selectedRow != -1) {
                if(CycleCountLineCtrl.ePage.Masters.Lineslist == true){
                    if (e.keyCode == 38) {
                        if (CycleCountLineCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        CycleCountLineCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (CycleCountLineCtrl.ePage.Masters.selectedRow == CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length - 1) {
                            return;
                        }
                        CycleCountLineCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
    
                }
            }
        });

        function RemoveAllLineErrors() {
            for (var i = 0; i < CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length; i++) {
                OnChangeValues('value', "E13002", true, i);
                OnChangeValues('value', "E13003", true, i);
                OnChangeValues('value', "E13004", true, i);
            }
            return true;
        }

        function RemoveRow() {
            var item = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine[CycleCountLineCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", CycleCountLineCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.splice(CycleCountLineCtrl.ePage.Masters.selectedRow, 1);
                        CycleCountLineCtrl.ePage.Masters.Config.GeneralValidation(CycleCountLineCtrl.currentCycleCount);
                    }
                    toastr.success('Record Removed Successfully');
                    CycleCountLineCtrl.ePage.Entities.Header.CheckPoints.PercentageValues = true;
                    CycleCountLineCtrl.ePage.Masters.Lineslist = true;
                    CycleCountLineCtrl.ePage.Masters.selectedRow = CycleCountLineCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK":"",
                "ClientCode": "",
                "ClientName": "",
                "ClientFullName": "",
                "Client":"",
                "ClientRelationship":"",
                "ORG_FK":"",
                "ProductCode": "",
                "ProductDesc": "",
                "Product":"",
                "OSP_FK":"",
                "Commodity": "",
                "PalletID": "",
                "Location": "",
                "WLO_FK":"",
                "AreaName": "",
                "RowName": "",
                "SystemUnits": "",
                "LastCount": "",
                "CurrentCount":"",
                "DateVerified": "",
                "LineComment": "",
                "Status": "",
                "DateClosed": "",
                "PickMethod": "",
                "InventoryStatus": "",
                "ExpiryDate": "",
                "PackingDate":"",
                "PartAttrib1":"",
                "PartAttrib2":"",
                "PartAttrib3":"",
                "UseExpiryDate": false,
                "UsePackingDate": false,
                "UsePartAttrib1": false,
                "UsePartAttrib2": false,
                "UsePartAttrib3": false,
                "IsPartAttrib1ReleaseCaptured": false,
                "IsPartAttrib2ReleaseCaptured": false,
                "IsPartAttrib3ReleaseCaptured": false,
                "IsDeleted": false,
                "IsManuallyAdded":true,
            };

            if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Client){
                obj.ClientFullName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode+' - '+CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
                obj.ClientCode = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                obj.ClientName = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientName;
                obj.ORG_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ORG_FK;
                obj.Client = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.ClientCode;
                obj.ClientRelationship = "OWN";
            }

            if(CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location){
                obj.Location = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.Location;
                obj.WLO_FK = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountHeader.WLO_FK;
            }

            CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.push(obj);
            CycleCountLineCtrl.ePage.Masters.selectedRow = CycleCountLineCtrl.ePage.Entities.Header.Data.UIWmsCycleCountLine.length-1;
            $timeout(function() {
                var objDiv = document.getElementById("CycleCountLineCtrl.ePage.Masters.your_div");
                objDiv.scrollTop = objDiv.scrollHeight;
            });
          };

          function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["InventoryStatus"];
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
                        CycleCountLineCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        CycleCountLineCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        
        Init();
    }
})();