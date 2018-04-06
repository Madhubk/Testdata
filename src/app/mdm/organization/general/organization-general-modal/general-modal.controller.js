(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgGeneralModalController", OrgGeneralModalController);

    OrgGeneralModalController.$inject = ["$location", "$q", "$uibModalInstance", "apiService", "helperService", "toastr", "organizationConfig", "param","appConfig","authService"];

    function OrgGeneralModalController($location, $q, $uibModalInstance, apiService, helperService, toastr, organizationConfig, param, appConfig, authService) {
        var OrgGeneralModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgGeneralModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };
        //  OrgGeneralModalCtrl.currentOrganization = param.Entity[param.Entity.label].Meta;
            OrgGeneralModalCtrl.ePage.Masters.param = param;
            console.log(OrgGeneralModalCtrl.ePage.Masters.param.Entity.isNew);
            OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgGeneralModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgGeneralModalCtrl.ePage.Masters.Save = Save;
            OrgGeneralModalCtrl.ePage.Masters.Cancel = Cancel;
            OrgGeneralModalCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            OrgGeneralModalCtrl.ePage.Masters.Validation = Validation;
            OrgGeneralModalCtrl.ePage.Masters.Mpattern = Mpattern;
            OrgGeneralModalCtrl.ePage.Masters.Config = organizationConfig;
            OrgGeneralModalCtrl.ePage.Masters.MailPattern = MailPattern;
            OrgGeneralModalCtrl.ePage.Masters.orgcodegen = orgcodegen;
            OrgGeneralModalCtrl.ePage.Masters.EnableCode = EnableCode;
            //OrgGeneralModalCtrl.ePage.Masters.MailPattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
            

            if (OrgGeneralModalCtrl.ePage.Masters.param.Type === "address") {
                GetAddressCapabilityList();
            }


            InitOrgHeader();
            InitOrgAddress();
            GetCfxTypeList();
            InitOrgContact();
            InitRemoveError();
            DisableCode();

            OrgGeneralModalCtrl.ePage.Masters.MobilePattern = true;
            OrgGeneralModalCtrl.ePage.Masters.MailPatterns = true;
            OrgGeneralModalCtrl.ePage.Masters.Enable = false; 
            OrgGeneralModalCtrl.ePage.Masters.OrganizationCode=false;
        }
        // ========================OrgHeader Start========================

         function InitRemoveError()
         {
            OnChangeValues('value','E9001');
            OnChangeValues('value','E9002');
            OnChangeValues('value','E9003');
            OnChangeValues('value','E9004');
            OnChangeValues('value','E9005');
            OnChangeValues('value','E9006');
            OnChangeValues('value','E9007');
            OnChangeValues('value','E9022');
            OnChangeValues('value','E9031');
        }

         function OnChangeValues(fieldvalue,code) { 
            angular.forEach(OrgGeneralModalCtrl.ePage.Masters.Config.ValidationValues,function(value,key){
                if(value.Code.trim() === code){
                    GetErrorMessage(fieldvalue,value);                   
                }
            });
        }

        function GetErrorMessage(fieldvalue,value){
            if (!fieldvalue) {
                OrgGeneralModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code,value.Message,"E",true,value.CtrlKey,OrgGeneralModalCtrl.ePage.Masters.param.Entity.label,false,undefined,undefined,undefined,undefined,value.GParentRef);
            } else {
                OrgGeneralModalCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code,"E",value.CtrlKey,OrgGeneralModalCtrl.ePage.Masters.param.Entity.label);
            }
        }

        function EnableCode(){
            if(OrgGeneralModalCtrl.ePage.Masters.Enable == true){
                OrgGeneralModalCtrl.ePage.Masters.OrganizationCode = true;
            }else{
                OrgGeneralModalCtrl.ePage.Masters.OrganizationCode = false;
            }
        }

        function GetCfxTypeList() {
            var typeCodeList = ["LANGUAGE","State"];
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
                        OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }    
            });
        }


        function InitOrgHeader() {
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader = {};
            OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView = {};

            if (OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader) {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView = angular.copy(OrgGeneralModalCtrl.ePage);
            }
            if(OrgGeneralModalCtrl.ePage.Masters.param.Entity.isNew)
            {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.IsActive = true;
                // default lang is Eng
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].Language = "en";
            }
        }

        // ========================OrgHeader End========================

        // ========================Address Start========================

        function InitOrgAddress() {
            OrgGeneralModalCtrl.ePage.Masters.OnCheckboxChange = OnCheckboxChange;
            OrgGeneralModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            //OrgGeneralModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            //OrgGeneralModalCtrl.ePage.Masters.AutoCompleteOnCountry = AutoCompleteOnCountry;
            OrgGeneralModalCtrl.ePage.Masters.SelectedLookupCountry = SelectedLookupCountry;
            OrgGeneralModalCtrl.ePage.Masters.SelectedLookupZone = SelectedLookupZone;

            OrgGeneralModalCtrl.ePage.Masters.OrgAddress = {};
            OrgGeneralModalCtrl.ePage.Masters.OrgAddress.FormView = {};

            if (OrgGeneralModalCtrl.ePage.Masters.param.Item) {
                OrgGeneralModalCtrl.ePage.Masters.OrgAddress.FormView = angular.copy(OrgGeneralModalCtrl.ePage.Masters.param.Item);
            }

            OrgGeneralModalCtrl.ePage.Masters.OrgAddress.HeaderLabelList = [{
                "fieldName": "IsActive",
                "displayName": "Is Active"
            }, {
                "fieldName": "IsConsignor",
                "displayName": "Is Consignor"
            }, {
                "fieldName": "IsConsignee",
                "displayName": "Is Consignee"
            }, {
                "fieldName": "IsTransportClient",
                "displayName": "Is Transport Client"
            }, {
                "fieldName": "IsWarehouseClient",
                "displayName": "Is Warehouse"
            }, {
                "fieldName": "IsForwarder",
                "displayName": "Is Forwarder"
            }, {
                "fieldName": "IsBroker",
                "displayName": "Is Broker"
            }, {
                "fieldName": "IsService",
                "displayName": "Is Service"
            },{
                "fieldName": "IsDistributionCentre",
                "displayName": "Is Distribution Center"
            },{
                "fieldName": "IsRoadFreightDepot",
                "displayName": "Is Depot"
            },{
                "fieldName": "IsStore",
                "displayName": "Is Store"
            }];
        }

        
        function GetAddressCapabilityList() {
            if (!OrgGeneralModalCtrl.ePage.Masters.param.Item) {
                OrgGeneralModalCtrl.ePage.Masters.param.Item = {};
                OrgGeneralModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
            } else {
                if (OrgGeneralModalCtrl.ePage.Masters.param.Item.AddressCapability) {
                    OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource.map(function (value1, key1) {
                        var _isExist = OrgGeneralModalCtrl.ePage.Masters.param.Item.AddressCapability.some(function (val, index) {
                            return val.AddressType == value1.AddressType;
                        });

                        if (!_isExist) {
                            OrgGeneralModalCtrl.ePage.Masters.param.Item.AddressCapability.push(value1);
                        }
                    });
                } else {
                    OrgGeneralModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
                }
            }
        }
        function OnCheckboxChange($index) {
            OrgGeneralModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].IsModified = true;
            OrgGeneralModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].IsValid = true;
            OrgGeneralModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].OAD_FK = OrgGeneralModalCtrl.ePage.Masters.OrgAddress.FormView.PK;
        }
        function Mpattern(item){
            if(item == undefined){
                //toastr.warning("!Mobile No is Empty|+xxx xxx xxxx|Note:Not a Mandatory Field");
            }
            if(item){
                OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = false; var len = item.length - 1;
                if(item.charAt(0)=='+')
                {
                    console.log("valid code");   
                    var count = 0;  
                    for(i=1;i<=len;i++)
                    {    
                        // number 47 to 58
                        if(item.charCodeAt(i)>47)
                        {
                            if(item.charCodeAt(i)<59)
                            {
                                console.log("valid");
                                OrgGeneralModalCtrl.ePage.Masters.MobilePattern = true;
                            }
                            else
                            {
                                toastr.warning("!check your Mobile No|Alphabets are NotAllowed ");
                                OrgGeneralModalCtrl.ePage.Masters.MobilePattern = false;
                                //OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].Mobile = "";
                                return false;    
                            }
                        }
                        else if(item.charCodeAt(i)== 32)
                        {
                            if(count <= 1)
                            {
                                console.log("valid");
                                OrgGeneralModalCtrl.ePage.Masters.MobilePattern = true;
                            }
                            else
                            {
                                toastr.warning("!check your Mobile No|Morethan 2 whitespace is NotAllowed|+xx xxxx..");               
                                OrgGeneralModalCtrl.ePage.Masters.MobilePattern = false;
                                //OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].Mobile = "";
                                return false;
                            }
                            count++;
                        }
                        else
                        {
                            toastr.warning("!check your Mobile No|Alphabets are NotAllowed");
                            OrgGeneralModalCtrl.ePage.Masters.MobilePattern = false;
                            //OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].Mobile="";
                            return false;
                        }
                    }                
                    OrgGeneralModalCtrl.ePage.Masters.MobilePattern = true;
                }
                else
                {
                    toastr.warning("!check your Mobile No|First digit must be Plus(+)|+xx xxxx..");
                    OrgGeneralModalCtrl.ePage.Masters.MobilePattern = false;
                    //OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].Mobile = "";
                }
            }
        }
        function MailPattern(item){
            if (item == undefined) 
            {
                toastr.warning("!Not a Valid Email ID|test@domain.com");
               // OrgGeneralModalCtrl.ePage.Masters.MailPatterns = false;
            }    
            // else{
            //     OrgGeneralModalCtrl.ePage.Masters.MailPattern = true;
            // }
        }
        function SelectedLookupZone(item){
            if(item.entity){
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.TMZ_FK = item.entity.PK ;
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.TMZ_Name = item.entity.Name;
            }else{
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.TMZ_FK = item.PK;
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.TMZ_Name = item.Name;
            }
        }

        function SelectedLookupCountry(item){
            if(OrgGeneralModalCtrl.ePage.Masters.CountryPK == undefined){
                    toastr.warning("!Please Choose UNLOCO Again"); 
                }
            if(item.entity){
                if(OrgGeneralModalCtrl.ePage.Masters.CountryPK == item.entity.COU_PK)
                {
                    OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode = item.entity.COU_Code;
                }
                else{
                    OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode = "";
                    toastr.warning("!CountryCode Not Match with UNLOCO");     
                }
                OnChangeValues(item.entity.Code,'E9031');
            }    
            else
            {
                if(OrgGeneralModalCtrl.ePage.Masters.CountryPK == item.COU_PK)
                {
                    OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode = item.COU_Code;
                }
                else{
                    OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode = "";
                    toastr.warning("!CountryCode Not Match with UNLOCO");
                }
                OnChangeValues(item.Code,'E9031');
            }   

                var _filter = {
                    "CountryCode": OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode,
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgAddress.API.CountryState.FilterID,
                };
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.CountryState.Url, _input).then(function (response) {
                    OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource =  response.data.Response;     
            });    
        }

        function SelectedLookupData(item) {
            if(item.entity)
            {
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode = item.entity.Code;
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode = item.entity.CountryCode;
                OrgGeneralModalCtrl.ePage.Masters.CountryPK = item.entity.CountryPK;
                OnChangeValues(item.entity.Code,'E9005');
            }
            else{
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode = item.Code;
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode = item.CountryCode;
                OrgGeneralModalCtrl.ePage.Masters.CountryPK = item.CountryPK;
                OnChangeValues(item.Code,'E9005');
            }
                OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.OAD_RelatedPortCode = OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode;
                
                
            // filter state list based on country
                var _filter = {
                    "CountryCode": OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].CountryCode,
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgAddress.API.CountryState.FilterID,
                };
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.CountryState.Url, _input).then(function (response) {
                    OrgGeneralModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource =  response.data.Response;     
            });
            
            // GET COUNTRY PK    
                var _filters = {
                    "Code": OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode,
                };

                var _inputs = {
                    "searchInput": helperService.createToArrayOfObject(_filters),
                    "FilterID": appConfig.Entities.OrgAddress.API.UNLOCO.FilterID,
                };
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.UNLOCO.Url, _inputs).then(function (response) {
                
                // OrgGeneralModalCtrl.ePage.Masters.RW_PK = response.data.Response[0].RW;
                                
                angular.forEach(response.data.Response,function(value,key){
                    if(value.Code == OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode){
                        OrgGeneralModalCtrl.ePage.Masters.RW_PK = value.RW;                                            
                    }
                });
            
            // Get particular state through portcode
                var _filter = {
                        "PK": OrgGeneralModalCtrl.ePage.Masters.RW_PK,
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.OrgAddress.API.CountryState.FilterID,
                    };
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.CountryState.Url, _input).then(function (response) {
                    OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].State =  response.data.Response[0].Code;     
                });
            });
            orgcodegen();                    
        }

        function orgcodegen(){
            if(!OrgGeneralModalCtrl.ePage.Masters.Enable){
                if(OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.FullName&&OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode){
                // Bind & form ORG Code
                var name1 = OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.FullName.split(" ")
                if(/^[a-zA-Z0-9]*$/.test(name1) == false){
                    var _SpecialCharacter = true;
                }
                if(_SpecialCharacter){
                    name1[0] = name1[0].replace(/[^a-zA-Z 0-9]+/g,'');
                    name1[1] = name1[1].replace(/[^a-zA-Z 0-9]+/g,'');
                }
                var name2 = name1[0].split("")
                    if(name2.length < 3)
                    {
                        var name8 =  OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.FullName.split("")
                        var count = 0;
                        var namearr = [];
                        angular.forEach(name8,function(value,key){
                            if(value != " ")
                            {
                                if(count < 6)
                                {
                                    namearr.push(value)  
                                    count++;    
                                }
                            }
                        });
                        for(i=0;i<=5;i++){
                            if(namearr[i] == undefined){
                               if(i==0||i==1){
                                    namearr[i] = ""; 
                               }else{
                                    namearr[i] = ""; 
                               }         
                            }
                        }
                        var name9 = namearr[0]+namearr[1]+namearr[2]+namearr[3]+namearr[4]+namearr[5];
                        //var name9 = name8[0]+name8[1]+name8[2]+name8[3]+name8[4]+name8[5];

                        var name6 = OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode.split("")
                        var name7 = name6[2]+name6[3]+name6[4];

                        OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.Code =  name9+name7;    
                    }
                    else{
                        var name3 = name2[0]+name2[1]+name2[2];
                        if(name1[1]){
                            var name4 = name1[1].split("")
                            if(3<=name4.length){
                                var name5 = name4[0]+name4[1]+name4[2];
                            }else if(name4.length==2){
                                var name5 = name4[0]+name4[1];
                            }else if(name4.length==1){
                                var name5 = name4[0];
                            }else{
                                var name5 = "";
                            }
                        }else{
                                var name5 = "";
                        }

                        var name6 = OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgAddress[0].RelatedPortCode.split("")
                        var name7 = name6[2]+name6[3]+name6[4];

                        OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.Code =  name3+name5+name7;        
                    }
                }
            }        
        }
        // ========================Address End========================

        // ========================Contact Start========================

        function InitOrgContact() {
            OrgGeneralModalCtrl.ePage.Masters.OrgContact = {};
            OrgGeneralModalCtrl.ePage.Masters.OrgContact.FormView = {};

            if (OrgGeneralModalCtrl.ePage.Masters.param.Item) {
                OrgGeneralModalCtrl.ePage.Masters.OrgContact.FormView = angular.copy(OrgGeneralModalCtrl.ePage.Masters.param.Item);
            }
        }
        // ========================Address End========================
        function Validation($item,type) {
            var _index = organizationConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.OrgHeader.PK
            }).indexOf(OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK);
            $item.label = OrgGeneralModalCtrl.ePage.Masters.param.Entity.label;
            //console.log(_Data.Header.Meta.ErrorWarning.GlobalErrorWarningList);
            var _Data = $item.Entities,
                _input = _Data.Header.Data,
                _errorcount = OrgGeneralModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList;
                OrgGeneralModalCtrl.ePage.Masters.Config.GeneralValidation($item,type);
                if(OrgGeneralModalCtrl.ePage.Entities.Header.Validations){
                    OrgGeneralModalCtrl.ePage.Masters.Config.RemoveApiErrors(OrgGeneralModalCtrl.ePage.Entities.Header.Validations,$item.label); 
                }

            if(_errorcount.length==0){
                $item.Entities.Header.Data.OrgHeader.OAD_PK = $item.Entities.Header.Data.OrgAddress[0].PK;
                var items = $item.Entities.Header.Data; 
                ValidSave(items,type);
            }else{
                if(OrgGeneralModalCtrl.ePage.Masters.param.Entity.isNew == false)
                    OrgGeneralModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgGeneralModalCtrl.ePage.Entities);                    
            }
        }
        function ValidSave(items,type){
            if(OrgGeneralModalCtrl.ePage.Masters.MailPatterns)
            {
                if(OrgGeneralModalCtrl.ePage.Masters.MobilePattern){
                    Save(items,type);   
                }else{
                    toastr.warning("!Not a Valid Mobile Number");        
                }
            }else{
                toastr.warning("!Not a Valid Email ID|test@domain.com");
            }
        }
        function Save(obj, type) {
            
            if(OrgGeneralModalCtrl.ePage.Masters.param.Entity.isNew == false)
            {
                obj.OrgHeader.IsModified = true;
            }            
            if(OrgGeneralModalCtrl.ePage.Masters.param.Entity.isNew == true)
            {
                //obj.OrgAddress[0].AddressCapability[0].IsModified = true;
                obj.OrgAddress[0].AddressCapability[0].AddressType = "OFC";
                obj.OrgAddress[0].AddressCapability[0].AddressTypeDes = "Office Address";
                obj.OrgAddress[0].AddressCapability[0].IsMainAddress = true;
                obj.OrgAddress[0].AddressCapability[0].IsMapped = true;

            }
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgHeader = obj.OrgHeader;
                OrgGeneralModalCtrl.ePage.Entities.Header.Data.OrgAddress[0] = obj.OrgAddress[0];
                
            
            var _isEmpty = angular.equals(obj, {});
            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {

                OrgGeneralModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = true;

                helperService.SaveEntity(OrgGeneralModalCtrl.ePage.Masters.param.Entity, "Organization").then(function (response) {
                    if (response.Status === "success") {
                        var _exports = {
                            data: response.Data,
                            type: type
                        };
                        organizationConfig.TabList.map(function (value, key) {
                            if (value.New) {
                                if (value.code == '') {
                                    value.label = OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.Code;
                                    value[OrgGeneralModalCtrl.ePage.Masters.OrgHeader.FormView.Entities.Header.Data.OrgHeader.Code] = value.New;
                                    delete value.New;
                                }
                            }
                        });
                    OrgGeneralModalCtrl.ePage.Masters.param.Entity.isNew = false;    
                        $uibModalInstance.close(_exports);
                    OrgGeneralModalCtrl.ePage.Masters.Config.refreshgrid();
                        Cancel();
                    } 
                    else if (response.Status === "failed") 
                    {

                    OrgGeneralModalCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                    OrgGeneralModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), OrgGeneralModalCtrl.ePage.Masters.param.Entity.label, false, undefined, undefined, undefined, undefined, undefined);
                        
                    });
                    $("#errorWarningContainer" + OrgGeneralModalCtrl.ePage.Masters.param.Entity.label).toggleClass("open");
                    Cancel();           
                    }
                    OrgGeneralModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgGeneralModalCtrl.ePage.Masters.IsDisableSave = false;   
                });
            }
        }
        function DisableCode(){
            if(OrgGeneralModalCtrl.ePage.Entities.Header.Validations){
                OrgGeneralModalCtrl.ePage.Masters.OrganizationCode = OrgGeneralModalCtrl.ePage.Entities.Header.Validations.some(function (value, key) {
                return value.Code =='E9012';
            });
            }else{
                OrgGeneralModalCtrl.ePage.Masters.OrganizationCode=false;
            } 
        }
        function Cancel() {
            //OrgGeneralModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            $uibModalInstance.dismiss("cancel");
        }

        Init();
    }
})();
