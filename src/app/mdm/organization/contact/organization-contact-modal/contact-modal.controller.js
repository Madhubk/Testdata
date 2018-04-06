(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgContactModalController", OrgContactModalController);

    OrgContactModalController.$inject = ["$location", "$q", "$uibModalInstance", "apiService", "helperService", "toastr", "organizationConfig", "param"];

    function OrgContactModalController($location, $q, $uibModalInstance, apiService, helperService, toastr, organizationConfig, param) {
        var OrgContactModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgContactModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Contact_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgContactModalCtrl.ePage.Masters.param = param;

            OrgContactModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgContactModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgContactModalCtrl.ePage.Masters.Save = Save;
            OrgContactModalCtrl.ePage.Masters.Cancel = Cancel;

            OrgContactModalCtrl.ePage.Masters.Config = organizationConfig;
            OrgContactModalCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            OrgContactModalCtrl.ePage.Masters.Validation = Validation;
            OrgContactModalCtrl.ePage.Masters.OnChangeJob = OnChangeJob;

            OrgContactModalCtrl.ePage.Masters.Mpattern = Mpattern;
            OrgContactModalCtrl.ePage.Masters.MailPattern = MailPattern;

            if (OrgContactModalCtrl.ePage.Masters.param.Type === "address") {
                GetAddressCapabilityList();
            }

            InitOrgHeader();
            InitOrgAddress();
            InitOrgContact();
            InitRemoveError();
            
        }

        // ========================OrgHeader Start========================

        function InitRemoveError(){
            OnChangeValues('value','E9008');
            OnChangeValues('value','E9023');
        }

        function InitOrgHeader() {
            OrgContactModalCtrl.ePage.Masters.OrgHeader = {};
            OrgContactModalCtrl.ePage.Masters.OrgHeader.FormView = {};

            if (OrgContactModalCtrl.ePage.Entities.Header.Data.OrgHeader) {
                OrgContactModalCtrl.ePage.Masters.OrgHeader.FormView = angular.copy(OrgContactModalCtrl.ePage.Entities.Header.Data.OrgHeader);
            }
        }
        function OnChangeValues(fieldvalue,code) { 
            angular.forEach(OrgContactModalCtrl.ePage.Masters.Config.ValidationValues,function(value,key){
                if(value.Code.trim() === code){
                    GetErrorMessage(fieldvalue,value);                   
                }
            });
        }

        function GetErrorMessage(fieldvalue,value){
            if (!fieldvalue) {
                OrgContactModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code,value.Message,"E",true,value.CtrlKey,OrgContactModalCtrl.ePage.Masters.param.Entity.label,false,undefined,undefined,undefined,undefined,value.GParentRef);
            } else {
                OrgContactModalCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code,"E",value.CtrlKey,OrgContactModalCtrl.ePage.Masters.param.Entity.label);
            }
        }

        // ========================OrgHeader End========================

        // ========================Address Start========================

        function InitOrgAddress() {
            OrgContactModalCtrl.ePage.Masters.OnCheckboxChange = OnCheckboxChange;
            OrgContactModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            OrgContactModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            
            OrgContactModalCtrl.ePage.Masters.OrgAddress = {};
            OrgContactModalCtrl.ePage.Masters.OrgAddress.FormView = {};

            if (OrgContactModalCtrl.ePage.Masters.param.Item) {
                OrgContactModalCtrl.ePage.Masters.OrgAddress.FormView = angular.copy(OrgContactModalCtrl.ePage.Masters.param.Item);
            }

            OrgContactModalCtrl.ePage.Masters.OrgAddress.HeaderLabelList = [{
                "fieldName": "IsActive",
                "displayName": "Is Active"
            }, {
                "fieldName": "IsNationalAccount",
                "displayName": "Is National Account"
            }, {
                "fieldName": "IsGlobalAccount",
                "displayName": "Is Global Account"
            }, {
                "fieldName": "IsTempAccount",
                "displayName": "Is Temp Account"
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
                "displayName": "Is Warehouse Client"
            }, {
                "fieldName": "IsWarehouse",
                "displayName": "Is Warehouse"
            }, {
                "fieldName": "IsCarrier",
                "displayName": "Is Carrier"
            }, {
                "fieldName": "IsForwarder",
                "displayName": "Is Forwarder"
            }, {
                "fieldName": "IsBroker",
                "displayName": "Is Broker"
            }, {
                "fieldName": "IsService",
                "displayName": "Is Service"
            }, {
                "fieldName": "IsCompetitor",
                "displayName": "Is Competitor"
            }, {
                "fieldName": "IsSalesLead",
                "displayName": "Is SalesLead"
            }];
        }

        function GetAddressCapabilityList() {
            if (!OrgContactModalCtrl.ePage.Masters.param.Item) {
                OrgContactModalCtrl.ePage.Masters.param.Item = {};
                OrgContactModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgContactModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
            } else {
                if (OrgContactModalCtrl.ePage.Masters.param.Item.AddressCapability) {
                    OrgContactModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource.map(function (value1, key1) {
                        var _isExist = OrgContactModalCtrl.ePage.Masters.param.Item.AddressCapability.some(function (val, index) {
                            return val.AddressType == value1.AddressType;
                        });

                        if (!_isExist) {
                            OrgContactModalCtrl.ePage.Masters.param.Item.AddressCapability.push(value1);
                        }
                    });
                } else {
                    OrgContactModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgContactModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
                }
            }
        }

        function OnCheckboxChange($index) {
            OrgContactModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].IsModified = true;
            OrgContactModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].IsValid = true;
            OrgContactModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].OAD_FK = OrgContactModalCtrl.ePage.Masters.OrgAddress.FormView.PK;
        }

        function SelectedLookupData($item) {
            console.log($item);
        }

        function AutoCompleteOnSelect($item) {
            console.log($item);
        }

        function OnChangeJob(item){
            console.log(item);
        }
        // ========================Address End========================

        // ========================Contact Start========================

        function InitOrgContact() {
            OrgContactModalCtrl.ePage.Masters.OrgContact = {};
            OrgContactModalCtrl.ePage.Masters.OrgContact.FormView = {};

            if (OrgContactModalCtrl.ePage.Masters.param.Item) {
                OrgContactModalCtrl.ePage.Masters.OrgContact.FormView = angular.copy(OrgContactModalCtrl.ePage.Masters.param.Item);
            }
        }

        // ========================Contact End========================
        function Validation($item,type) {
            console.log(OrgContactModalCtrl.ePage.Masters.param);
            var _index = organizationConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.OrgHeader.PK
            }).indexOf(OrgContactModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK);
            $item.label = OrgContactModalCtrl.ePage.Masters.param.Entity.label;
            //console.log(_Data.Header.Meta.ErrorWarning.GlobalErrorWarningList);
            // var _Data = $item.Entities,
            //     _input = _Data.Header.Data,
               var _errorcount = OrgContactModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList;
                
                var con_index = OrgContactModalCtrl.ePage.Entities.Header.Data.OrgContact.map(function (value, key) {
                    return value.PK
                }).indexOf($item.PK); 

                OrgContactModalCtrl.ePage.Entities.Header.Data.OrgContact[con_index] = $item;
                OrgContactModalCtrl.ePage.Masters.Config.GeneralValidation(OrgContactModalCtrl.ePage,type,con_index);
                if(OrgContactModalCtrl.ePage.Entities.Header.Validations){
                    OrgContactModalCtrl.ePage.Masters.Config.RemoveApiErrors(OrgContactModalCtrl.ePage.Entities.Header.Validations,$item.label); 
                }

            if(_errorcount.length==0){ 
                Save($item,type);
            }else{
                OrgContactModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgContactModalCtrl.ePage.Masters.param.Entity);
            }
        }

        function Save(obj, type) {
            var _isEmpty = angular.equals(obj, {});

            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                obj.IsModified = true;
                if (type !== "OrgHeader") {
                    var _isExist = OrgContactModalCtrl.ePage.Entities.Header.Data[type].some(function (value, key) {
                        return value.PK === obj.PK;
                    });

                    if (!_isExist) {
                        OrgContactModalCtrl.ePage.Entities.Header.Data[type].push(obj);
                    } else {
                        var _index = OrgContactModalCtrl.ePage.Entities.Header.Data[type].map(function (value, key) {
                            if (value.PK === obj.PK) {
                                OrgContactModalCtrl.ePage.Entities.Header.Data[type][key] = obj;
                            }
                        });
                    }
                } else if (type === "OrgHeader") {
                    OrgContactModalCtrl.ePage.Entities.Header.Data[type] = obj;
                }

                OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgContactModalCtrl.ePage.Masters.IsDisableSave = true;

                if(type !== "OrgHeader")
                {
                    OrgContactModalCtrl.ePage.Masters.param.Entity.isNew = false;   
                }
                helperService.SaveEntity(OrgContactModalCtrl.ePage.Masters.param.Entity, 'Organization').then(function (response) {
                    if (response.Status === "success") {
                        var _exports = {
                            data: response.Data,
                            type: type
                        };
                        $uibModalInstance.close(_exports);
                        Cancel();
                        OrgContactModalCtrl.ePage.Masters.Config.refreshgrid();
                    } else if (response.Status === "failed") {
                        Cancel();
                    }
                    OrgContactModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgContactModalCtrl.ePage.Masters.IsDisableSave = false;

                    OrgContactModalCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                    OrgContactModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), OrgContactModalCtrl.ePage.Masters.param.Entity.label, false, undefined, undefined, undefined, undefined, undefined);
                });
                    if(response.Validations != null){
                        OrgContactModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgContactModalCtrl.ePage.Entities);
                    }
                
                });
            }
        }

        function Cancel() {
            OrgContactModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            $uibModalInstance.dismiss("cancel");
        }
        //pattern-Validation
        function Mpattern(item){
            if(item == undefined){
                toastr.warning("!Mobile No is Empty|+xxx xxx xxxx|Note:Not a Mandatory Field");
            }
            if(item){
                OrgContactModalCtrl.ePage.Masters.IsDisableSave = false; 
                var len = item.length - 1;
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
                                
                            }
                            else
                            {
                                toastr.warning("!check your Mobile No|Alphabets are NotAllowed ");
                                //OrgContactModalCtrl.ePage.Masters.IsDisableSave = true;
                                OrgContactModalCtrl.ePage.Masters.OrgContact.FormView.Mobile = "";
                                return false;
                            }
                        }
                        else if(item.charCodeAt(i)== 32)
                        {
                            if(count <= 1)
                            {
                                console.log("valid");
                            }
                            else
                            {
                                toastr.warning("!check your Mobile No|Morethan 2 whitespace is NotAllowed|+xx xxxx..");               
                                //OrgContactModalCtrl.ePage.Masters.IsDisableSave = true;
                                OrgContactModalCtrl.ePage.Masters.OrgContact.FormView.Mobile="";
                                return false;
                            }
                            count++;
                        }
                        else
                        {
                            toastr.warning("!check your Mobile No|Alphabets are NotAllowed");
                            //OrgContactModalCtrl.ePage.Masters.IsDisableSave = true;
                            OrgContactModalCtrl.ePage.Masters.OrgContact.FormView.Mobile="";
                            return false;
                        }
                    }                
                }
                else
                {
                    toastr.warning("!check your Mobile No|First digit must be Plus(+)|+xx xxxx..");
                    //OrgContactModalCtrl.ePage.Masters.IsDisableSave = true;
                    OrgContactModalCtrl.ePage.Masters.OrgContact.FormView.Mobile="";
                    return false;
                }
            }
        }
        function MailPattern(item){
            if (item == undefined) 
            {
                toastr.warning("!Not a Valid Email ID|test@domain.com");
                OrgContactModalCtrl.ePage.Masters.OrgContact.FormView.Email = "";
            }
        }
        Init();
    }
})();
