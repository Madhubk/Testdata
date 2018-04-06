(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgCompanyModalController", OrgCompanyModalController);

    OrgCompanyModalController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModalInstance", "APP_CONSTANT", "authService", "apiService", "organizationConfig", "helperService", "toastr", "param"];

    function OrgCompanyModalController($rootScope, $scope, $state, $q, $location, $timeout, $uibModalInstance, APP_CONSTANT, authService, apiService, organizationConfig, helperService, toastr, param) {
        var OrgCompanyModalCtrl = this;

        function Init() {
            var currentOrganization = param.Entity[param.Entity.label].ePage.Entities;

            OrgCompanyModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgCompanyModalCtrl.ePage.Masters.param = param;
            OrgCompanyModalCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;
            console.log(OrgCompanyModalCtrl.ePage.Masters.DropDownMasterList.Company.ListSource);
            OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Save";
            OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = false;

            OrgCompanyModalCtrl.ePage.Masters.Save = Save;
            OrgCompanyModalCtrl.ePage.Masters.Cancel = Cancel;
            
            OrgCompanyModalCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            OrgCompanyModalCtrl.ePage.Masters.Config = organizationConfig;

            OrgCompanyModalCtrl.ePage.Masters.Validation = Validation;
            InitCompany();
            InitEmployee();
        }
        function InitRemoveError()
        {
            OnChangeValues('value','E9030');
            OnChangeValues('value','E9011');
        }


        function OnChangeValues(fieldvalue,code) { 
            angular.forEach(OrgCompanyModalCtrl.ePage.Masters.Config.ValidationValues,function(value,key){
                if(value.Code.trim() === code){
                    GetErrorMessage(fieldvalue,value);                   
                }
            });
        }

        function GetErrorMessage(fieldvalue,value){
            if (!fieldvalue) {
                OrgCompanyModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code,value.Message,"E",true,value.CtrlKey,OrgCompanyModalCtrl.ePage.Masters.param.Entity.label,false,undefined,undefined,undefined,undefined,value.GParentRef);
            } else {
                OrgCompanyModalCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code,"E",value.CtrlKey,OrgCompanyModalCtrl.ePage.Masters.param.Entity.label);
            }
        }

        function InitCompany() {
            OrgCompanyModalCtrl.ePage.Masters.Company = {};
            OrgCompanyModalCtrl.ePage.Masters.Company.FormView = {};

            if (OrgCompanyModalCtrl.ePage.Masters.param.Item) {
                OrgCompanyModalCtrl.ePage.Masters.Company.FormView = angular.copy(OrgCompanyModalCtrl.ePage.Masters.param.Item);
            }

            OrgCompanyModalCtrl.ePage.Masters.Company.FormView.ORG_FK = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
            OrgCompanyModalCtrl.ePage.Masters.Company.FormView.OrgARTerms = [];
        }

        function InitEmployee() {
            OrgCompanyModalCtrl.ePage.Masters.Employee = {};
            OrgCompanyModalCtrl.ePage.Masters.Employee.FormView = {};

            if (OrgCompanyModalCtrl.ePage.Masters.param.Item) {
                OrgCompanyModalCtrl.ePage.Masters.Employee.FormView = angular.copy(OrgCompanyModalCtrl.ePage.Masters.param.Item);
            }

            if (OrgCompanyModalCtrl.ePage.Masters.param.SelectedCompany) {
                OrgCompanyModalCtrl.ePage.Masters.Employee.FormView.CompanyPK = OrgCompanyModalCtrl.ePage.Masters.param.SelectedCompany.CMP_FK;
                OrgCompanyModalCtrl.ePage.Masters.Employee.FormView.CompanyCode = OrgCompanyModalCtrl.ePage.Masters.param.SelectedCompany.CMP_Name;
                OrgCompanyModalCtrl.ePage.Masters.Employee.FormView.CompanyName = OrgCompanyModalCtrl.ePage.Masters.param.SelectedCompany.CMP_Code;
            }

            OrgCompanyModalCtrl.ePage.Masters.Employee.FormView.OrgCode = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
            OrgCompanyModalCtrl.ePage.Masters.Employee.FormView.OrgName = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.FullName;
            OrgCompanyModalCtrl.ePage.Masters.Employee.FormView.OrgPK = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
        }

        // Company End //
        function Validation($item,type) {
            var _index = organizationConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.OrgHeader.PK
            }).indexOf(OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgHeader.PK);
            $item.label = OrgCompanyModalCtrl.ePage.Masters.param.Entity.label;
            //console.log(_Data.Header.Meta.ErrorWarning.GlobalErrorWarningList);
            // var _Data = $item.Entities,
            //     _input = _Data.Header.Data,
               var _errorcount = OrgCompanyModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList;
                
                var cmp_index = OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData.map(function (value, key) {
                    return value.PK
                }).indexOf($item.PK); 

                if(cmp_index == -1){cmp_index = 0;}
                OrgCompanyModalCtrl.ePage.Entities.Header.Data.OrgCompanyData[cmp_index] = $item;
                OrgCompanyModalCtrl.ePage.Masters.Config.GeneralValidation(OrgCompanyModalCtrl.ePage,type,cmp_index);
                if(OrgCompanyModalCtrl.ePage.Entities.Header.Validations){
                    OrgCompanyModalCtrl.ePage.Masters.Config.RemoveApiErrors(OrgCompanyModalCtrl.ePage.Entities.Header.Validations,$item.label); 
                }

            if(_errorcount.length==0){ 
                Save($item,type);
            }else{
                OrgCompanyModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgCompanyModalCtrl.ePage.Masters.param.Entity);
            }
        }

        function Save(obj, entity, type) {
            var _isEmpty = angular.equals(obj, {});

            if (_isEmpty) {
                toastr.warning("Please fill fields...!");
            } else {
                obj.IsModified = true;
                var _isExist = OrgCompanyModalCtrl.ePage.Entities.Header.Data[entity].some(function (value, key) {
                    return value.PK === obj.PK;
                });

                if (!_isExist) {
                    OrgCompanyModalCtrl.ePage.Entities.Header.Data[entity].push(obj);
                } else {
                    var _index = OrgCompanyModalCtrl.ePage.Entities.Header.Data[entity].map(function (value, key) {
                        if (value.PK === obj.PK) {
                            OrgCompanyModalCtrl.ePage.Entities.Header.Data[entity][key] = obj;
                        }
                    });
                }

                OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = true;

                helperService.SaveEntity(OrgCompanyModalCtrl.ePage.Masters.param.Entity,'Organization').then(function (response) {
                    if (response.Status === "success") {
                        var _exports = {
                            Data: obj,
                            entity: entity,
                            type: type
                        };
                        $uibModalInstance.close(_exports);
                        Cancel();
                        OrgCompanyModalCtrl.ePage.Masters.Config.refreshgrid();
                    } else if (response === "failed") {
                        Cancel();
                    }
                    OrgCompanyModalCtrl.ePage.Masters.SaveButtonText = "Save";
                    OrgCompanyModalCtrl.ePage.Masters.IsDisableSave = false;

                    OrgCompanyModalCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                    OrgCompanyModalCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), OrgCompanyModalCtrl.ePage.Masters.param.Entity.label, false, undefined, undefined, undefined, undefined, undefined);
                });
                if(OrgCompanyModalCtrl.ePage.Entities.Header.Validations !== null){
                    OrgCompanyModalCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrgCompanyModalCtrl.ePage.Entities);    
                }    
                
                });
            }
        }

        function Cancel() {
            OrgCompanyModalCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList = [];
            $uibModalInstance.dismiss('close');
        }

        Init();
    }
})();
