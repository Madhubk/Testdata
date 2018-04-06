(function () {      
    "use strict";

    angular
        .module("Application")
        .controller("OrgAddressModalController", OrgAddressModalController);

    OrgAddressModalController.$inject = ["$location", "$q", "$uibModalInstance", "apiService", "helperService", "toastr", "organizationConfig", "param", "appConfig","confirmation","$filter"];

    function OrgAddressModalController($location, $q, $uibModalInstance, apiService, helperService, toastr, organizationConfig, param, appConfig, confirmation, $filter) { 
        var OrgAddressModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgAddressModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Address_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgAddressModalCtrl.ePage.Masters.param = param;

            OrgAddressModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgAddressModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgAddressModalCtrl.ePage.Masters.Save = Save;
            OrgAddressModalCtrl.ePage.Masters.Cancel = Cancel;

            OrgAddressModalCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            OrgAddressModalCtrl.ePage.Masters.Validation = Validation;
            OrgAddressModalCtrl.ePage.Masters.Config = organizationConfig;
            OrgAddressModalCtrl.ePage.Masters.Mpattern = Mpattern;
            OrgAddressModalCtrl.ePage.Masters.MailPattern = MailPattern;
            OrgAddressModalCtrl.ePage.Masters.OnStarChange = OnStarChange;
            if (OrgAddressModalCtrl.ePage.Masters.param.Type === "address") {
                GetAddressCapabilityList();
            }

            //InitOrgHeader();
            //InitOrgContact();
            InitOrgAddress();
            InitRemoveError();
        // OrgAddressModalCtrl.ePage.Masters.Mpattern = /^\+?\s\d{0,20}$/;
        OrgAddressModalCtrl.ePage.Masters.MobilePattern = true;
        OrgAddressModalCtrl.ePage.Masters.MailPatterns = true;
        }

        // ========================OrgHeader Start========================
        function InitRemoveError(){
            OnChangeValues('value','E9024');
            OnChangeValues('value','E9025');
            OnChangeValues('value','E9026');
            OnChangeValues('value','E9027');
            OnChangeValues('value','E9028');
            OnChangeValues('value','E9029');
            OnChangeValues('value','E9032');
        }

        function InitOrgHeader() {
            OrgAddressModalCtrl.ePage.Masters.OrgHeader = {};
            OrgAddressModalCtrl.ePage.Masters.OrgHeader.FormView = {};

            if (OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgHeader) {
                OrgAddressModalCtrl.ePage.Masters.OrgHeader.FormView = angular.copy(OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgHeader);
            }
        }
        function OnChangeValues(fieldvalue,code) { 
            angular.forEach(OrgAddressModalCtrl.ePage.Masters.Config.ValidationValues,function(value,key){
                if(value.Code.trim() === code){
                    GetErrorMessage(fieldvalue,value);                   
                }
            });
        }

        function GetErrorMessage(fieldvalue,value){
            if (!fieldvalue) {
                OrgAddressModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code,value.Message,"E",true,value.CtrlKey,OrgAddressModalCtrl.ePage.Masters.param.Entity.label,false,undefined,undefined,undefined,undefined,value.GParentRef);
            } else {
                OrgAddressModalCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code,"E",value.CtrlKey,OrgAddressModalCtrl.ePage.Masters.param.Entity.label);
            }
        }

        // ========================OrgHeader End========================

        // ========================Address Start========================

        function InitOrgAddress() {
            OrgAddressModalCtrl.ePage.Masters.OnCheckboxChange = OnCheckboxChange;
            OrgAddressModalCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            OrgAddressModalCtrl.ePage.Masters.SelectedLookupCountry = SelectedLookupCountry;
            //OrgAddressModalCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;

            OrgAddressModalCtrl.ePage.Masters.OrgAddress = {};
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView = {};

            if (OrgAddressModalCtrl.ePage.Masters.param.Item) {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView = angular.copy(OrgAddressModalCtrl.ePage.Masters.param.Item);
            }
            if(OrgAddressModalCtrl.ePage.Masters.param.isNewMode == true) {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.Language = "ENG"
            }
            console.log()
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.HeaderLabelList = [{
                "fieldName": "IsActive",
                "displayName": "Is Active"
            },{
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
            if (!OrgAddressModalCtrl.ePage.Masters.param.Item) {
                OrgAddressModalCtrl.ePage.Masters.param.Item = {};
                OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
            } else {
                if (OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability) {
                    OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource.map(function (value1, key1) {
                        var _isExist = OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability.some(function (val, index) {
                            return val.AddressType == value1.AddressType;
                        });

                        if (!_isExist) {
                            OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability.push(value1);
                        }
                    });
                } else {
                    OrgAddressModalCtrl.ePage.Masters.param.Item.AddressCapability = OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.AddressCapability.ListSource;
                }
            }
        }
        function Mpattern(item){
            // if(item == undefined){
            //     toastr.warning("!Mobile No is Empty|+xxx xxx xxxx|Note:Not a Mandatory Field");
            // }
            if(item){
                OrgAddressModalCtrl.ePage.Masters.IsDisableSave = false;
                var len = item.length - 1;
                if(item.charAt(0)=='+')
                {
                    console.log("valid code");   
                    var count = 0;  
                    for(i=1;i<=len;i++)
                    {    
                        if(item.charCodeAt(i)>47)
                        {
                            if(item.charCodeAt(i)<59)
                            {
                                console.log("valid");
                                OrgAddressModalCtrl.ePage.Masters.MobilePattern = true;
                            }
                            else
                            {
                                toastr.warning("!check your Mobile No|Alphabets are NotAllowed ");
                                OrgAddressModalCtrl.ePage.Masters.MobilePattern = false;
                                return false;
                            }
                        }
                        else if(item.charCodeAt(i)== 32)
                        {
                            if(count <= 1)
                            {
                                console.log("valid");
                                OrgAddressModalCtrl.ePage.Masters.MobilePattern = true;
                            }
                            else
                            {
                                toastr.warning("!check your Mobile No|Morethan 2 whitespace is NotAllowed|+xx xxxx..");               
                                //OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;
                                OrgAddressModalCtrl.ePage.Masters.MobilePattern = false;
                                return false;
                            }
                            count++;
                        }
                        else
                        {
                            toastr.warning("!check your Mobile No|Alphabets are NotAllowed");
                            //OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;
                            OrgAddressModalCtrl.ePage.Masters.MobilePattern = false;
                            return false;
                        }
                    }
                    OrgAddressModalCtrl.ePage.Masters.MobilePattern = true;                
                }
                else
                {
                    toastr.warning("!check your Mobile No|First digit must be Plus(+)|+xx xxxx..");
                    //OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;
                    OrgAddressModalCtrl.ePage.Masters.MobilePattern = false;
                    return false;
                }
            }
        }
        function MailPattern(item){
            if (item == undefined) {
                toastr.warning("!Not a Valid Email ID|test@domain.com");
             //   OrgAddressModalCtrl.ePage.Masters.MailPatterns = false;
            }
            // else{
            //     OrgAddressModalCtrl.ePage.Masters.MailPatterns = true;
            // }
        }

        function OnStarChange(addresstype,index,address){
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[index].IsModified = true;
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[index].IsValid = true;
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[index].OAD_FK = OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.PK;

            var OncheckedAddressName = addresstype[index].AddressType;
            var OncheckedAddressIsMainAddress = addresstype[index].IsMainAddress;

            var remainingaddresses = $filter('filter')(OrgAddressModalCtrl.ePage.Masters.param.OrgAddress,function(value,key){
                return value.PK != address.PK;
            });

            if(OncheckedAddressIsMainAddress){
                angular.forEach(remainingaddresses,function(value,key){
                    angular.forEach(value.AddressCapability,function(value1,key1){
                        if(value1.AddressType == OncheckedAddressName  && value1.IsMainAddress){
                              var modalOptions = {
                            closeButtonText: 'Cancel',
                            actionButtonText: 'Ok',
                            headerText: 'Main Address already Mapped With Another Address',
                            bodyText: 'Do you want to Change Main Address ?'
                            };

                            confirmation.showModal({}, modalOptions)
                            .then(function(result) {
                                // OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress[key].AddressCapability[key1].IsMainAddress = false;
                                // OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress[key].AddressCapability[key1].IsModified = true;
                                // console.log(OrgAddressModalCtrl.ePage.Entities.Header.Data);
                                //value1.IsMainAddress = false;
                                OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress = [];
                                value1.IsMainAddress = false;
                                value1.IsModified = true;
                                value.IsModified = true;
                                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[index].IsMainAddress = true;
                                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[index].IsMapped = true;
                                angular.forEach(remainingaddresses,function(value2,key){
                                    OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress.push(value2);
                                })
                                OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress.push(OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView);
                            },
                            function () {
                                console.log("Cancelled");
                                OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress = [];
                                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[index].IsMainAddress = false;
                                angular.forEach(remainingaddresses,function(value2,key){
                                    OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress.push(value2);
                                })
                                OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress.push(OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView);
                            });
                        }else{

                        }
                    });
                });
            }
            // if(address.AddressCapability[index].AddressType == "OFC"&&address.AddressCapability[index].IsMainAddress){
            //     angular.forEach(OrgAddressModalCtrl.ePage.Masters.param.OrgAddress,function(value,key){
            //         if(value.PK != address.PK){
            //             angular.forEach(value.AddressCapability,function(value1,key1){
            //                 if(value1.AddressType=="OFC"&&value1.IsMainAddress){
            //                     var modalOptions = {
            //                 closeButtonText: 'Cancel',
            //                 actionButtonText: 'Ok',
            //                 headerText: 'OFC already Mapped With Another Address',
            //                 bodyText: 'Do you want to Change Main Address ?'
            //                 };

            //                 }
            //             });
            //         }
            //     });
            // }
        }

        function OnCheckboxChange(type,$index) {
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].IsModified = true;
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].IsValid = true;
            OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.AddressCapability[$index].OAD_FK = OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.PK;
        }

        function SelectedLookupCountry(item){
            if(item.entity)
                if(OrgAddressModalCtrl.ePage.Masters.CountryPK == item.entity.COU_PK)
                {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = item.entity.COU_Code;
                }
                else{
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = "";
                    toastr.warning("!CountryCode Not Match with UNLOCO"); 
                }
            else
            {
                if(OrgAddressModalCtrl.ePage.Masters.CountryPK == item.COU_PK)
                {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = item.COU_Code;
                }
                else{
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = "";
                    toastr.warning("!CountryCode Not Match with UNLOCO");
                }
            }    
        }
        function SelectedLookupData(item) {
            if(item.entity)
            {
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.RelatedPortCode = item.entity.Code;
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = item.entity.CountryCode;    
                OrgAddressModalCtrl.ePage.Masters.CountryPK = item.entity.CountryPK;
            }
            else{
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.RelatedPortCode = item.Code;
                OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode = item.CountryCode;
                OrgAddressModalCtrl.ePage.Masters.CountryPK = item.CountryPK;
            }
            // filter state list based on country
            var _filter = {
                    "CountryCode": OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.CountryCode,
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgAddress.API.CountryState.FilterID,
                };
            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.CountryState.Url, _input).then(function (response) {
                    OrgAddressModalCtrl.ePage.Masters.DropDownMasterList.State.ListSource =  response.data.Response;     
            });
            // GET COUNTRY PK    
            var _filters = {
                    "Code": OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.RelatedPortCode,
                };

                var _inputs = {
                    "searchInput": helperService.createToArrayOfObject(_filters),
                    "FilterID": appConfig.Entities.OrgAddress.API.UNLOCO.FilterID,
                };
            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.UNLOCO.Url, _inputs).then(function (response) {
                // OrgAddressModalCtrl.ePage.Masters.RW_PK = response.data.Response[0].RW;
                angular.forEach(response.data.Response,function(value,key){
                    if(value.Code == OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.RelatedPortCode){
                        OrgAddressModalCtrl.ePage.Masters.RW_PK = value.RW;                                            
                    }
                }); 
                
                // Get particular state through portcode
                var _filter = {
                        "PK": OrgAddressModalCtrl.ePage.Masters.RW_PK,
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.OrgAddress.API.CountryState.FilterID,
                    };
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.CountryState.Url, _input).then(function (response) {
                    OrgAddressModalCtrl.ePage.Masters.OrgAddress.FormView.State =  response.data.Response[0].Code;     
                });
            });
        }

        // ========================Address End========================

        // ========================Contact Start========================

        function InitOrgContact() {
            OrgAddressModalCtrl.ePage.Masters.OrgContact = {};
            OrgAddressModalCtrl.ePage.Masters.OrgContact.FormView = {};

            if (OrgAddressModalCtrl.ePage.Masters.param.Item) {
                OrgAddressModalCtrl.ePage.Masters.OrgContact.FormView = angular.copy(OrgAddressModalCtrl.ePage.Masters.param.Item);
            }
        }
        //Address final Validation
        function Validation($item,type) {
            var _index = organizationConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.OrgHeader.PK
            }).indexOf(OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK);
            $item.label = OrgAddressModalCtrl.ePage.Masters.param.Entity.label;
            
            var _errorcount = OrgAddressModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList;
               
            var add_index = OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress.map(function (value, key) {
                    return value.PK
                }).indexOf($item.PK);  

                OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgAddress[add_index] = $item;
                OrgAddressModalCtrl.ePage.Masters.Config.GeneralValidation(OrgAddressModalCtrl.ePage,type,add_index);
                if(OrgAddressModalCtrl.ePage.Entities.Header.Validations){
                    OrgAddressModalCtrl.ePage.Masters.Config.RemoveApiErrors(OrgAddressModalCtrl.ePage.Entities.Header.Validations,$item.label); 
                }

            if(_errorcount.length==0){                                           
              // Check Main address is none
                var remainingaddresses = $filter('filter')(OrgAddressModalCtrl.ePage.Masters.param.OrgAddress,function(value,key){
                return value.PK != $item.PK;
                });

                var count = 0;
                angular.forEach(remainingaddresses,function(value,key){
                    angular.forEach(value.AddressCapability,function(value,key){
                        if(value.IsMainAddress == true && value.AddressType == "OFC"){
                            count++;
                        }
                    });
                });
                
                angular.forEach($item.AddressCapability,function(value,key){
                    if(value.IsMainAddress == true && value.AddressType == "OFC"){
                        count++;
                    }
                });
                if(count == 0){
                    toastr.warning("Main Address Can't be Empty.Choose AddressType: OFC as Main Address");
                }else{
                    ValidSave($item,type);
                }
                // ValidSave($item,type);
            }
        }
        // ========================Address End========================
        function helperservice(type){
            helperService.SaveEntity(OrgAddressModalCtrl.ePage.Masters.param.Entity,'Organization').then(function (response) {
                if (response.Status === "success") {
                    var _exports = {
                        data: response.Data,
                        type: type
                    };
                    $uibModalInstance.close(_exports);
                    OrgAddressModalCtrl.ePage.Masters.Config.refreshgrid();
                } 
                else if (response.Status === "failed") {}
                OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Save";
                OrgAddressModalCtrl.ePage.Masters.IsDisableSave = false;

                OrgAddressModalCtrl.ePage.Entities.Header.Validations = response.Validations;
                angular.forEach(response.Validations, function (value, key) {
                    OrgAddressModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), OrgAddressModalCtrl.ePage.Masters.param.Entity.label, false, undefined, undefined, undefined, undefined, undefined);
                });
                if(OrgAddressModalCtrl.ePage.Entities.Header.Validations != null){
                    OrgAddressModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgAddressModalCtrl.ePage.Entities);
                    Cancel();
                }
                
            });
        }
        function Save(obj, type) {
            var count = 0;
            angular.forEach(obj.AddressCapability,function(value,key){
                if(value.IsMapped == true){
                    count++;
                }                      
            });
            if(count > 0){
                var _isEmpty = angular.equals(obj, {});
                if (_isEmpty) {
                toastr.warning("Please fill fields...!");
                } 
                else {
                obj.IsModified = true;
                if (type !== "OrgHeader") {
                    var _isExist = OrgAddressModalCtrl.ePage.Entities.Header.Data[type].some(function (value, key) {
                        return value.PK === obj.PK;
                    });

                    console.log(OrgAddressModalCtrl.ePage.Entities.Header.Data);

                if (!_isExist) {
                    var _filter = {
                        "ORG_FK": OrgAddressModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                    };

                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID,
                    };

                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                           OrgAddressModalCtrl.ePage.Entities.Header.Data[type] = response.data.Response;         
                        }
                        OrgAddressModalCtrl.ePage.Entities.Header.Data[type].push(obj);
                        helperservice(type);
                        OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                        OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;
                    });        
                        //Cancel();
                } else {
                        var _index = OrgAddressModalCtrl.ePage.Entities.Header.Data[type].map(function (value, key) {
                            if (value.PK === obj.PK) {
                                OrgAddressModalCtrl.ePage.Entities.Header.Data[type][key] = obj;
                                helperservice(type);
                                OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                                OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;
                            }
                        });
                        //Cancel();
                    }
                } 
                else if (type === "OrgHeader") {
                    OrgAddressModalCtrl.ePage.Entities.Header.Data[type] = obj;
                    helperservice(type);
                    OrgAddressModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                    OrgAddressModalCtrl.ePage.Masters.IsDisableSave = true;
                }
                if(type !== "OrgHeader")
                {
                    OrgAddressModalCtrl.ePage.Masters.param.Entity.isNew = false;   
                }
                }
            }    
            else{
                toastr.warning("Choose any One of the AddressType");
                }
        }
        function ValidSave($item,type){
            if(OrgAddressModalCtrl.ePage.Masters.MailPatterns)
            {
                if(OrgAddressModalCtrl.ePage.Masters.MobilePattern){
                    Save($item,type);   
                }else{
                    toastr.warning("!Not a Valid Mobile Number");        
                }
            }else{
                toastr.warning("!Not a Valid Email ID|test@domain.com");
            }
        }

        function Cancel() {
            OrgAddressModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            $uibModalInstance.dismiss("cancel");
        }

        Init();
    }
})();
