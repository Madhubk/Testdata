(function () {
    "use strict";

    angular
    .module("Application")
    .controller("EditableController", EditableController);

    EditableController.$inject = ["$uibModalInstance","param","helperService","organizationConfig","apiService","authService","toastr","$timeout","confirmation"];
    
    function EditableController($uibModalInstance,param,helperService,organizationConfig,apiService,authService,toastr,$timeout,confirmation) {

        var EditableCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            EditableCtrl.ePage = {
                "Title": "",
                "Prefix": "Editable Mode",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": angular.copy(currentOrganization)
            };

            EditableCtrl.ePage.Masters.param = angular.copy(param);

            //General Functions
            EditableCtrl.ePage.Masters.SaveButtonText = "Save";
            EditableCtrl.ePage.Masters.Cancel = Cancel;
            EditableCtrl.ePage.Masters.Validation = Validation;
            EditableCtrl.ePage.Masters.Save = Save;
            EditableCtrl.ePage.Masters.DropDownMasterList = {}

            //Receive
            EditableCtrl.ePage.Masters.SelectAll = false;
            EditableCtrl.ePage.Masters.EnableDeleteButton = false;
            EditableCtrl.ePage.Masters.EnableCopyButton = false;
            EditableCtrl.ePage.Masters.Enable = true;
            EditableCtrl.ePage.Masters.selectedRow = -1;

            EditableCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            EditableCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            EditableCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            EditableCtrl.ePage.Masters.AddNewRow = AddNewRow;
            EditableCtrl.ePage.Masters.CopyRow = CopyRow;
            EditableCtrl.ePage.Masters.RemoveRow = RemoveRow;

            EditableCtrl.ePage.Masters.UpdatingReceivingValue = UpdatingReceivingValue;
            EditableCtrl.ePage.Masters.OverridingSystemSetting = OverridingSystemSetting;

            //Picking
            EditableCtrl.ePage.Masters.UpdatingPickingValue = UpdatingPickingValue;


            GetDropDownList();
            CreatingPickingSequence();
            CreatingReceivingSequence();
            GetBarcodeValues();
        }
        
        //#region Receive

        function CreatingReceivingSequence(){
            EditableCtrl.ePage.Masters.ReceivingSequence= [
                {
                    "displayvalue":0,
                    "disabled":false
                },
                {
                    "displayvalue":1,
                    "disabled":false
                }, 
                {
                    "displayvalue":2,
                    "disabled":false
                },
                {
                    "displayvalue":3,
                    "disabled":false
                },
                {
                    "displayvalue":4,
                    "disabled":false
                } 
            ]
            EditableCtrl.ePage.Masters.ReceivingSequence.map(function(value){
                if(value.displayvalue!=0){
                    if(value.displayvalue== EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToLocation 
                        || value.displayvalue== EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToPickFace
                        || value.displayvalue== EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToClientArea
                        || value.displayvalue== EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToProductArea)
                    value.disabled = true;
                }
            });
        }

        function UpdatingReceivingValue(value,field){
            if(field=="LOCATION"){
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToLocation = value; 
            }else if(field=="PICKFACE"){
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToPickFace = value;
            }else if(field=="CLIENTAREA"){
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToClientArea = value;
            }else if(field=="PRODUCTAREA"){
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToProductArea = value;
            }

            CreatingReceivingSequence();
        }

        function OverridingSystemSetting(data){
            if(!data){
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToLocation = 0;
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToPickFace = 0;
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToClientArea = 0;
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPutawayToProductArea = 0;
            }
        }

         //#region Add,copy,delete row

         function SelectAllCheckBox(){
            angular.forEach(EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse, function (value, key) {
            if (EditableCtrl.ePage.Masters.SelectAll){
                value.SingleSelect = true;
                EditableCtrl.ePage.Masters.EnableDeleteButton = true;
                EditableCtrl.ePage.Masters.EnableCopyButton = true;
            }
            else{
                value.SingleSelect = false;
                EditableCtrl.ePage.Masters.EnableDeleteButton = false;
                EditableCtrl.ePage.Masters.EnableCopyButton = false;
            }
            });
        }
         function SingleSelectCheckBox() {
            var Checked = EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                EditableCtrl.ePage.Masters.SelectAll = false;
            } else {
                EditableCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                EditableCtrl.ePage.Masters.EnableDeleteButton = true;
                EditableCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                EditableCtrl.ePage.Masters.EnableDeleteButton = false;
                EditableCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

         function setSelectedRow(index){
            EditableCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "WAA_FK": "",
                "WAR_FK":"",
                "WarehouseCode":"",
                "WarehouseName":"",
                "AreaName":"",
                "AreaType": "",
                "IsDeleted": false,
            };
            EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.push(obj);
            EditableCtrl.ePage.Masters.selectedRow = EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("EditableCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
        };

        function CopyRow() {
            for(var i = EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.length -1; i >= 0; i--){
                if(EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[i].SingleSelect){
                    var obj = angular.copy(EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.splice(i + 1, 0, obj);
                }
            }
            EditableCtrl.ePage.Masters.selectedRow = -1;
            EditableCtrl.ePage.Masters.SelectAll = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {

                    angular.forEach(EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", EditableCtrl.ePage.Entities.Header.API.AreaDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.length -1; i >= 0; i--){
                            if(EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse[i].SingleSelect==true)
                            EditableCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse.splice(i,1);
                        }
                        EditableCtrl.ePage.Masters.Config.GeneralValidation(EditableCtrl.currentWarehouse);
                    }
                    toastr.success('Record Removed Successfully');
                    EditableCtrl.ePage.Masters.selectedRow = -1;
                    EditableCtrl.ePage.Masters.SelectAll = false;
                    EditableCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    EditableCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
            });
        }
        //#endregion Add,copy,delete row

        
        //#endregion

        //#region Picking

        function CreatingPickingSequence(){
            
            EditableCtrl.ePage.Masters.PickingSequence= [
                {
                    "displayvalue":0,
                    "disabled":false
                },
                {
                    "displayvalue":1,
                    "disabled":false
                }, 
                {
                    "displayvalue":2,
                    "disabled":false
                } 
            ]
            EditableCtrl.ePage.Masters.PickingSequence.map(function(value){
                if(value.displayvalue!=0){
                    if(value.displayvalue== EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPickFromDefaultFIFO || value.displayvalue== EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPickSortExpiryDate)
                    value.disabled = true;
                }
            });
        }

        function UpdatingPickingValue(value,field){
            if(field=="FIFO"){
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPickFromDefaultFIFO = value; 
            }else if(field=="EXPIRY"){
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.WmsPickSortExpiryDate = value;
            }
            CreatingPickingSequence();
        }

        //#endregion

        //#region Barcode

        function GetBarcodeValues(){
            angular.forEach(EditableCtrl.ePage.Entities.Header.Data.OrgBarcode,function(value,key){
                if(value.Key=="BarcodeType")
                EditableCtrl.ePage.Masters.BarcodeType = value.Value;

                if(value.Key=="BarcodeRule")
                EditableCtrl.ePage.Masters.BarcodeRule = value.Value;

                if(value.Key=="PackingDateRule")
                EditableCtrl.ePage.Masters.PackingDateRule = value.Value;

                if(value.Key=="ExpiryDateRule")
                EditableCtrl.ePage.Masters.ExpiryDateRule = value.Value;
            });
        }

        //#endregion

        //#region General Function

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["IncoTerms", "Orderby", "PartAttrType", "PickOption", "Fulfill", "PickMode", "DGContact", "AnalysisPeriod", "AnalysisMethod", "INW_LINE_UQ","Date_Format"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": organizationConfig.Entities.API.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", organizationConfig.Entities.API.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        EditableCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        EditableCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
        

        function Cancel() {
            $uibModalInstance.close();
        }

        function Validation(CurrentEntity){
            var DontSave = false;

            if(CurrentEntity=='OrgMiscServ'){
                if ((EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib1Name && !EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib1Type) ||
                    (EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib2Name && !EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib2Type) ||
                    (EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib3Name && !EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib3Type) ||
                    (!EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib1Name && EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib1Type) ||
                    (!EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib2Name && EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib2Type) ||
                    (!EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib3Name && EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ.IMPartAttrib3Type)) {   
                        toastr.warning ("UDF Type or Name is Missed");
                        DontSave = true;
                }
            }

            //#region Barcode Configuration Data Preparation
            if(CurrentEntity == 'OrgBarcode'){
                var obj = {
                    "IsJson" : false,
                    "IsModified":false,
                    "Key":"",
                    "ORG_FK":EditableCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                    "PK":"",
                    "TypeCode":"",
                    "Value":""
                };

                //Barcode
                if(EditableCtrl.ePage.Masters.BarcodeType){
                    var BarcodeType = EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.some(function(value,key){
                         if(value.Key == "BarcodeType"){
                             value.Value = EditableCtrl.ePage.Masters.BarcodeType;
                             return true;
                         }else{
                             return false;
                         }
                    });

                    if(!BarcodeType){
                        var data = angular.copy(obj);
                        data.Key = "BarcodeType",
                        data.TypeCode = "Barcode",
                        data.Value = EditableCtrl.ePage.Masters.BarcodeType;
                        EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.push(data);
                    }
                }else{
                    EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.map(function(v,k){
                        if(v.TypeCode=="Barcode"){
                            v.IsDeleted = true;
                        }
                    });
                }

                //Barcode Rule
                if(EditableCtrl.ePage.Masters.BarcodeRule){
                    var BarcodeRule = EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.some(function(value,key){
                        if(value.Key == "BarcodeRule"){
                            value.Value = EditableCtrl.ePage.Masters.BarcodeRule;
                            return true;
                        }else{
                            return false;
                        }
                    });

                    if(!BarcodeRule){
                        var data = angular.copy(obj);
                        data.Key = "BarcodeRule",
                        data.TypeCode = "Barcode",
                        data.Value = EditableCtrl.ePage.Masters.BarcodeRule;
                        EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.push(data);
                    }
                }else{
                    EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.map(function(v,k){
                        if(v.TypeCode=="Barcode"){
                            v.IsDeleted = true;
                        }
                    });
                }

                //Packing Date Rule
                if(EditableCtrl.ePage.Masters.PackingDateRule){
                    var PackingDateRule = EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.some(function(value,key){
                        if(value.Key == "PackingDateRule"){
                            value.Value = EditableCtrl.ePage.Masters.PackingDateRule;
                            return true;
                        }else{
                            return false;
                        }
                    });

                    if(!PackingDateRule){
                        var data = angular.copy(obj);
                        data.Key = "PackingDateRule",
                        data.TypeCode = "PackingDate",
                        data.Value = EditableCtrl.ePage.Masters.PackingDateRule;
                        EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.push(data);
                    }
                }else{
                    EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.map(function(v,k){
                        if(v.TypeCode=="PackingDate"){
                            v.IsDeleted = true;
                        }
                    });
                }

                //Expiry Date Rule
                if(EditableCtrl.ePage.Masters.ExpiryDateRule){
                    var ExpiryDateRule = EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.some(function(value,key){
                        if(value.Key == "ExpiryDateRule"){
                            value.Value = EditableCtrl.ePage.Masters.ExpiryDateRule;
                            return true;
                        }else{
                            return false;
                        }
                    });

                    if(!ExpiryDateRule){
                        var data = angular.copy(obj);
                        data.Key = "ExpiryDateRule",
                        data.TypeCode = "ExpiryDate",
                        data.Value = EditableCtrl.ePage.Masters.ExpiryDateRule;
                        EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.push(data);
                    }
                }else{
                    EditableCtrl.ePage.Entities.Header.Data.OrgBarcode.map(function(v,k){
                        if(v.TypeCode=="ExpiryDate"){
                            v.IsDeleted = true;
                        }
                    });
                }
            }
            //#endregion
        
            if(!DontSave){
                Save(CurrentEntity)
            }
        }

        function Save(CurrentEntity){

            EditableCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            EditableCtrl.ePage.Masters.IsDisableSave = true;

            if(CurrentEntity=='WmsClientParameterByWarehouse'){
                EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ = filterObjectUpdate(EditableCtrl.ePage.Entities.Header.Data.OrgMiscServ, "IsModified");
            }
            EditableCtrl.ePage.Entities.Header.Data[CurrentEntity] = filterObjectUpdate(EditableCtrl.ePage.Entities.Header.Data[CurrentEntity], "IsModified");
            
            EditableCtrl.ePage.Masters.param.Entity[EditableCtrl.ePage.Masters.param.Entity.label].ePage.Entities.Header.Data = EditableCtrl.ePage.Entities.Header.Data;
            helperService.SaveEntity(EditableCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
                if (response.Status === "success") {
                    if (response.Data) {
                        var _exports = {
                            data: response.Data
                        };
                        $uibModalInstance.close(_exports);
                    }
                } else if (response.Status == "ValidationFailed" || response.Status == "failed") {
                    if (response.Validations && response.Validations.length > 0) {
                        response.Validations.map(function (value, key) {
                            toastr.error(value.Message);
                        });
                    } else {
                        toastr.warning("Failed to Save...!");
                    }
                    EditableCtrl.ePage.Masters.SaveButtonText = "Save";
                    EditableCtrl.ePage.Masters.IsDisableSave = false;
                    $uibModalInstance.close();
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

       //#endregion

        Init();
    }

})();