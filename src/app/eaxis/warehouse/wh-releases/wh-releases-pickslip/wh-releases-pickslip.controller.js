(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleasesPickSlipController", ReleasesPickSlipController);


    ReleasesPickSlipController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "releaseConfig", "helperService", "appConfig", "authService", "$document", "$filter", "toastr","$window","confirmation"];

    function ReleasesPickSlipController($scope, $timeout, APP_CONSTANT, apiService, releaseConfig, helperService, appConfig, authService, $document, $filter, toastr,$window,confirmation) {

        var ReleasesPickSlipCtrl = this;

        function Init() {

            var currentRelease = ReleasesPickSlipCtrl.currentRelease[ReleasesPickSlipCtrl.currentRelease.label].ePage.Entities;


            ReleasesPickSlipCtrl.ePage = {
                "Title": "",
                "Prefix": "Release_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentRelease

            };

            ReleasesPickSlipCtrl.ePage.Masters.EnableForPickLineSummary = true;
            ReleasesPickSlipCtrl.ePage.Masters.selectedRowForPickLineSummary = -1;
            ReleasesPickSlipCtrl.ePage.Masters.SearchTableForPickLineSummary = '';
            ReleasesPickSlipCtrl.ePage.Masters.setSelectedRowForPickLineSummary = setSelectedRowForPickLineSummary;
           
            ReleasesPickSlipCtrl.ePage.Masters.SelectAllForUIWmsReleaseLine = false;
            ReleasesPickSlipCtrl.ePage.Masters.EnableDeleteButtonForUIWmsReleaseLine = false;
            ReleasesPickSlipCtrl.ePage.Masters.EnableCopyButtonForUIWmsReleaseLine = false;
            ReleasesPickSlipCtrl.ePage.Masters.EnableAddOrChooseButton = false;
            ReleasesPickSlipCtrl.ePage.Masters.EnableForUIWmsReleaseLine = true;
            ReleasesPickSlipCtrl.ePage.Masters.selectedRowForUIWmsReleaseLine = -1;
            ReleasesPickSlipCtrl.ePage.Masters.SearchTableForUIWmsReleaseLine = '';
            ReleasesPickSlipCtrl.ePage.Masters.SelectedPickLinePK = undefined;

            ReleasesPickSlipCtrl.ePage.Masters.emptyText = '-';

            ReleasesPickSlipCtrl.ePage.Masters.SelectAllCheckBoxForUIWmsReleaseLine = SelectAllCheckBoxForUIWmsReleaseLine;
            ReleasesPickSlipCtrl.ePage.Masters.SingleSelectCheckBoxForUIWmsReleaseLine = SingleSelectCheckBoxForUIWmsReleaseLine;
            ReleasesPickSlipCtrl.ePage.Masters.setSelectedRowForUIWmsReleaseLine = setSelectedRowForUIWmsReleaseLine;
            ReleasesPickSlipCtrl.ePage.Masters.AddNewRowForUIWmsReleaseLine = AddNewRowForUIWmsReleaseLine;
            ReleasesPickSlipCtrl.ePage.Masters.CopyRowForUIWmsReleaseLine = CopyRowForUIWmsReleaseLine;
            ReleasesPickSlipCtrl.ePage.Masters.RemoveRowForUIWmsReleaseLine = RemoveRowForUIWmsReleaseLine;
            ReleasesPickSlipCtrl.ePage.Masters.EnableReleaseCapturesTable = EnableReleaseCapturesTable;
            ReleasesPickSlipCtrl.ePage.Masters.UDF = UDF;
            ReleasesPickSlipCtrl.ePage.Masters.UnitValidation = UnitValidation;
            ReleasesPickSlipCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ReleasesPickSlipCtrl.ePage.Masters.Config = releaseConfig;
            ReleasesPickSlipCtrl.ePage.Masters.ShowAllFunc = ShowAllFunc;
            ReleasesPickSlipCtrl.ePage.Masters.NormalizingPickSlipTab = NormalizingPickSlipTab;
            ReleasesPickSlipCtrl.ePage.Masters.KeyEventHandling = KeyEventHandling;

            GetUserBasedGridColumListForPickLineSummary();
            GetUserBasedGridColumListForUIWmsReleaseLine();
        }
        
        function KeyEventHandling(e , textField){
            if (ReleasesPickSlipCtrl.ePage.Masters.EnableAddOrChooseButton && ReleasesPickSlipCtrl.ePage.Masters.selectedRowForUIWmsReleaseLine!=-1 && e.keyCode == 13) {
                var TotalUpdated = 0;

                ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.map(function(value,key){
                    if(ReleasesPickSlipCtrl.ePage.Masters.SelectedPickLinePK == value.WPL_FK && value.Units){
                        TotalUpdated = TotalUpdated + parseFloat(value.Units);
                    }
                });

                if(parseFloat(TotalUpdated) <= parseFloat(ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.Units)){                        
                    if(textField == 'UDF1') {
                        if(ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IsPartAttrib2ReleaseCaptured){
                            document.getElementById('UDF2').focus()
                        }else if(ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IsPartAttrib3ReleaseCaptured){
                            document.getElementById('UDF3').focus()
                        }else if(parseFloat(TotalUpdated) != parseFloat(ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.Units)){
                            AddNewRowForUIWmsReleaseLine();
                        }
                    }
                    
                    if(textField == 'UDF2') {
                        if(ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IsPartAttrib3ReleaseCaptured){
                            document.getElementById('UDF3').focus()
                        }else if(parseFloat(TotalUpdated) != parseFloat(ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.Units)){
                            AddNewRowForUIWmsReleaseLine();
                        }
                    }
                    
                    if(textField == 'UDF3' && (parseFloat(TotalUpdated) != parseFloat(ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.Units))) {
                        AddNewRowForUIWmsReleaseLine();
                    }
                }
            }
        }

        function GetUserBasedGridColumListForPickLineSummary(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_PICKLINESUMMARY",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    ReleasesPickSlipCtrl.ePage.Masters.UserValue= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ReleasesPickSlipCtrl.ePage.Entities.Header.TableProperties.UIWmsPickLineSummary = obj;
                        ReleasesPickSlipCtrl.ePage.Masters.UserHasValueForPickLineSummary =true;
                    }
                }else{
                    ReleasesPickSlipCtrl.ePage.Masters.UserValueForPickLineSummary = undefined;
                }
            })
        }

        function setSelectedRowForPickLineSummary(index){
            ReleasesPickSlipCtrl.ePage.Masters.selectedRowForPickLineSummary = index;
        }

        function GetUserBasedGridColumListForUIWmsReleaseLine(){
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "RELEASELINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
    
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function(response){
                if(response.data.Response[0]){
                    ReleasesPickSlipCtrl.ePage.Masters.UserValueForUIWmsReleaseLine= response.data.Response[0];
                    if(response.data.Response[0].Value!=''){
                        var obj = JSON.parse(response.data.Response[0].Value)
                        ReleasesPickSlipCtrl.ePage.Entities.Header.TableProperties.UIWmsReleaseLine = obj;
                        ReleasesPickSlipCtrl.ePage.Masters.UserHasValueForUIWmsReleaseLine =true;
                    }
                }else{
                    ReleasesPickSlipCtrl.ePage.Masters.UserValueForUIWmsReleaseLine = undefined;
                }
            })
        }

        function SelectAllCheckBoxForUIWmsReleaseLine(){
            angular.forEach(ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine, function (value, key) {
            if (ReleasesPickSlipCtrl.ePage.Masters.SelectAllForUIWmsReleaseLine){
                if(value.WorkOrderLineStatus!='FIN'){
                    //If Show all is disabled and enabled
                    if(!ReleasesPickSlipCtrl.ePage.Masters.ShowAllLines){
                        if(value.WPL_FK == ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.PK){
                            value.SingleSelect = true;
                            ReleasesPickSlipCtrl.ePage.Masters.EnableDeleteButtonForUIWmsReleaseLine = true;
                            ReleasesPickSlipCtrl.ePage.Masters.EnableCopyButtonForUIWmsReleaseLine = true;
                        }
                    }else {
                        value.SingleSelect = true;
                        ReleasesPickSlipCtrl.ePage.Masters.EnableDeleteButtonForUIWmsReleaseLine = true;
                        ReleasesPickSlipCtrl.ePage.Masters.EnableCopyButtonForUIWmsReleaseLine = true;
                    }
                }
                
            }
            else{
                value.SingleSelect = false;
                ReleasesPickSlipCtrl.ePage.Masters.EnableDeleteButtonForUIWmsReleaseLine = false;
                ReleasesPickSlipCtrl.ePage.Masters.EnableCopyButtonForUIWmsReleaseLine = false;
            }
            });
        }

        function SingleSelectCheckBoxForUIWmsReleaseLine() {
            var Checked = ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.some(function (value, key) {
                if(!value.SingleSelect)
                return true;
            });
            if (Checked) {
                ReleasesPickSlipCtrl.ePage.Masters.SelectAllForUIWmsReleaseLine = false;
            } else {
                ReleasesPickSlipCtrl.ePage.Masters.SelectAllForUIWmsReleaseLine = true;
            }

            var Checked1 = ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.some(function (value, key) {
                if(value.WPL_FK == ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.PK)
                return value.SingleSelect == true;
            });
            if (Checked1) {
                ReleasesPickSlipCtrl.ePage.Masters.EnableDeleteButtonForUIWmsReleaseLine = true;
                ReleasesPickSlipCtrl.ePage.Masters.EnableCopyButtonForUIWmsReleaseLine = true;
            } else {
                ReleasesPickSlipCtrl.ePage.Masters.EnableDeleteButtonForUIWmsReleaseLine = false;
                ReleasesPickSlipCtrl.ePage.Masters.EnableCopyButtonForUIWmsReleaseLine = false;
            }
        }

          //#region Add,copy,delete row

        function setSelectedRowForUIWmsReleaseLine(index){
            ReleasesPickSlipCtrl.ePage.Masters.selectedRowForUIWmsReleaseLine = index;
        }

        function AddNewRowForUIWmsReleaseLine() {
            ReleasesPickSlipCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "Units": "",
                "PartAttrib1": "",
                "PartAttrib2": "",
                "PartAttrib3": "",
                "WPK_FK":ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.WPK_FK,
                "WPL_FK":ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.PK,
                "IsPartAttrib1ReleaseCaptured":ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IsPartAttrib1ReleaseCaptured,
                "IsPartAttrib2ReleaseCaptured":ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IsPartAttrib2ReleaseCaptured,
                "IsPartAttrib3ReleaseCaptured":ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IsPartAttrib3ReleaseCaptured,
                "IMPartAttrib1Type": ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IMPartAttrib1Type,
                "IMPartAttrib2Type": ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IMPartAttrib2Type,
                "IMPartAttrib3Type": ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.IMPartAttrib3Type,
            };

            if((obj.IMPartAttrib1Type == "SER" && obj.IsPartAttrib1ReleaseCaptured) || (obj.IMPartAttrib2Type == "SER" && obj.IsPartAttrib2ReleaseCaptured) || (obj.IMPartAttrib3Type == "SER" && obj.IsPartAttrib3ReleaseCaptured)){
                obj.Units = 1;
            }else{
                obj.Units = ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.Units;
            }

            ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.push(obj);
            ReleasesPickSlipCtrl.ePage.Masters.selectedRowForUIWmsReleaseLine = ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.length-1;
        
            $timeout(function () {
                var objDiv = document.getElementById("ReleasesPickSlipCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;

                if(obj.IsPartAttrib1ReleaseCaptured){
                    document.getElementById('UDF1').focus();
                }else if(obj.IsPartAttrib2ReleaseCaptured){
                    document.getElementById('UDF2').focus();
                }else if(obj.IsPartAttrib3ReleaseCaptured){
                    document.getElementById('UDF3').focus();
                }

            }, 200);

            ReleasesPickSlipCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRowForUIWmsReleaseLine() {
            ReleasesPickSlipCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for(var i = ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.length -1; i >= 0; i--){
                if(ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine[i].SingleSelect){
                    var obj = angular.copy(ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine[i]);
                    obj.PK = '';
                    obj.CreatedDateTime = '';
                    obj.ModifiedDateTime = '';
                    obj.SingleSelect=false;
                    obj.IsCopied = true;
                    ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.splice(i + 1, 0, obj);
                }
            }
            ReleasesPickSlipCtrl.ePage.Masters.selectedRowForUIWmsReleaseLine = -1;
            ReleasesPickSlipCtrl.ePage.Masters.SelectAllForUIWmsReleaseLine = false;
            ReleasesPickSlipCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        }

        function RemoveRowForUIWmsReleaseLine() {
            var modalOptions = {
                closeButtonText: 'Cancel', 
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    ReleasesPickSlipCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine,function(value,key){
                        if(value.SingleSelect==true && value.PK){
                            apiService.get("eAxisAPI", ReleasesPickSlipCtrl.ePage.Entities.Header.API.WmsReleaseLineDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });
            
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        for (var i = ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.length -1; i >= 0; i--){
                            if(ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine[i].SingleSelect==true)
                            ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.splice(i,1);
                        }
                        ReleasesPickSlipCtrl.ePage.Masters.Config.GeneralValidation(ReleasesPickSlipCtrl.currentRelease);
                    }
                    toastr.success('Record Removed Successfully');
                    ReleasesPickSlipCtrl.ePage.Masters.selectedRowForUIWmsReleaseLine = -1;
                    ReleasesPickSlipCtrl.ePage.Masters.SelectAllForUIWmsReleaseLine = false;
                    ReleasesPickSlipCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    ReleasesPickSlipCtrl.ePage.Masters.EnableDeleteButtonForUIWmsReleaseLine = false;
                }, function () {
                    console.log("Cancelled");
            });
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < ReleasesPickSlipCtrl.ePage.Entities.Header.Data.UIWmsReleaseLine.length; i++) {
                OnChangeValues('value', "E8014", true, i);
                OnChangeValues('value', "E8015", true, i);
                OnChangeValues('value', "E8016", true, i);
                OnChangeValues('value', "E8017", true, i);
                OnChangeValues('value', "E8018", true, i);
                OnChangeValues('value', "E8019", true, i);
                OnChangeValues('value', "E8020", true, i);
                OnChangeValues('value', "E8021", true, i);
            }
            return true;
        }

        //#endregion Add,copy,delete row

        //#region Release Line Table Funcationlities       
        
        function NormalizingPickSlipTab(){
            //After finalizing normalize the pick slip tabl
            ReleasesPickSlipCtrl.ePage.Masters.selectedRowForPickLineSummary = -1;
            ReleasesPickSlipCtrl.ePage.Masters.SelectedPickLinePK =''
            ReleasesPickSlipCtrl.ePage.Masters.selectedRowForUIWmsReleaseLine = -1;
            ReleasesPickSlipCtrl.ePage.Masters.ShowAllLines = false;
            ReleasesPickSlipCtrl.ePage.Masters.EnableAddOrChooseButton = undefined;
            ReleasesPickSlipCtrl.ePage.Entities.Header.GlobalVariables.NormalingPickSlipTab = false;
        }
        
        function EnableReleaseCapturesTable(item){
            if(item.IsPartAttrib1ReleaseCaptured || item.IsPartAttrib2ReleaseCaptured || item.IsPartAttrib3ReleaseCaptured){
                if(item.WorkOrderLineStatus!='FIN'){
                    ReleasesPickSlipCtrl.ePage.Masters.EnableAddOrChooseButton = true;
                }else{
                    ReleasesPickSlipCtrl.ePage.Masters.EnableAddOrChooseButton = undefined; 
                }  
            }else{
                ReleasesPickSlipCtrl.ePage.Masters.EnableAddOrChooseButton = undefined;
            }
            ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine = item;
            if(!ReleasesPickSlipCtrl.ePage.Masters.ShowAllLines){
                ReleasesPickSlipCtrl.ePage.Masters.SelectedPickLinePK = ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.PK;
            }else{
                ReleasesPickSlipCtrl.ePage.Masters.SelectedPickLinePK = '';
            }
        }

        function ShowAllFunc(item){
            if(item){
                ReleasesPickSlipCtrl.ePage.Masters.SelectedPickLinePK = '';
            }else{
                ReleasesPickSlipCtrl.ePage.Masters.SelectedPickLinePK = ReleasesPickSlipCtrl.ePage.Masters.CurrentPickLine.PK;
            }
        }
        
        //#endregion

        function UnitValidation(item,index){
            if(item.Units){
                OnChangeValues('value', 'E8021', true, index);
                if(item.IMPartAttrib1Type == "SER" && item.Units!=1){
                    OnChangeValues(null, 'E8017', true, index); 
                }else if (item.IMPartAttrib1Type == "SER" && item.Units==1){
                    OnChangeValues('value', 'E8017', true, index);
                }
            }else{
                OnChangeValues(null, 'E8021', true, index);
                OnChangeValues('value', 'E8017', true, index);
            }
        }

        function UDF(item, index) {
            if (item.IsPartAttrib1ReleaseCaptured) {
                if (item.IMPartAttrib1Type == "SER" || item.IMPartAttrib1Type == "MAN" || item.IMPartAttrib1Type == "BAT" ) {
                    if (!item.PartAttrib1)
                        OnChangeValues(null, 'E8014', true, index);
                    else
                        OnChangeValues('value', 'E8014', true, index);
                }
            }
            if (item.IsPartAttrib2ReleaseCaptured) {
                if (item.IMPartAttrib2Type == "SER" || item.IMPartAttrib2Type == "MAN" || item.IMPartAttrib2Type == "BAT" ) {
                    if (!item.PartAttrib2)
                        OnChangeValues(null, 'E8015', true, index);
                    else
                        OnChangeValues('value', 'E8015', true, index);
                }
            }
            if (item.IsPartAttrib3ReleaseCaptured) {
                if (item.IMPartAttrib3Type == "SER" || item.IMPartAttrib3Type == "MAN" || item.IMPartAttrib3Type == "BAT" ) {
                    if (!item.PartAttrib3)
                        OnChangeValues(null, 'E8016', true, index);
                    else
                        OnChangeValues('value', 'E8016', true, index);
                }
            }

        }
        
        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ReleasesPickSlipCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ReleasesPickSlipCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ReleasesPickSlipCtrl.currentRelease.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ReleasesPickSlipCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ReleasesPickSlipCtrl.currentRelease.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        Init();

    }

})();