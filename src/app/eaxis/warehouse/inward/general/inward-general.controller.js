(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardGeneralController", InwardGeneralController);

    InwardGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "inwardConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal"];

    function InwardGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, inwardConfig, helperService, toastr, $filter, $injector, $uibModal) {

        var InwardGeneralCtrl = this

        function Init() {

            var currentInward = InwardGeneralCtrl.currentInward[InwardGeneralCtrl.currentInward.label].ePage.Entities;

            InwardGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward,
            };

            // DatePicker
            InwardGeneralCtrl.ePage.Masters.DatePicker = {};
            InwardGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            InwardGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            InwardGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InwardGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            InwardGeneralCtrl.ePage.Masters.userselected = "";
            InwardGeneralCtrl.ePage.Masters.Linesave = true;
            InwardGeneralCtrl.ePage.Masters.IsAllocate = true;

            //Functions
            InwardGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            InwardGeneralCtrl.ePage.Masters.SelectedLookupServiceLevel = SelectedLookupServiceLevel;
            InwardGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            InwardGeneralCtrl.ePage.Masters.SelectedLookupSupplier = SelectedLookupSupplier;
            InwardGeneralCtrl.ePage.Masters.OtherSupplierAddresses = OtherSupplierAddresses;
            InwardGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            InwardGeneralCtrl.ePage.Masters.CheckFutureDate = CheckFutureDate;
            InwardGeneralCtrl.ePage.Masters.PutawayStartedDate = PutawayStartedDate;
            InwardGeneralCtrl.ePage.Masters.PutawayCompletedDate = PutawayCompletedDate;
            InwardGeneralCtrl.ePage.Masters.Config = $injector.get("inwardConfig");

            GetDropDownList();
            GeneralOperations();
            GetBindValues();
            GetClientAddress();
            AllocateUDF();
            GetOrgAddress();
            GetNewSupplierAddress();
        }


        function OnChangeValues(fieldvalue, code) {
            angular.forEach(InwardGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                InwardGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardGeneralCtrl.currentInward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                InwardGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, InwardGeneralCtrl.currentInward.label);
            }
        }

        function CheckFutureDate(fieldvalue) {
            if (fieldvalue) {
                var selectedDate = new Date(fieldvalue);
                var now = new Date();
                if (selectedDate > now) {
                    OnChangeValues(null, 'E3003')
                    OnChangeValues('value', 'E3034')
                } else {
                    OnChangeValues('value', 'E3003')
                    OnChangeValues('value', 'E3034')
                }
            }
        }

        function PutawayStartedDate(fieldvalue) {
            if (fieldvalue) {
                OnChangeValues('value', 'E3043');

                if (new Date(fieldvalue) > new Date(InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickSlipDateTime)) {
                    OnChangeValues('value', 'E3042');
                } else if (new Date(fieldvalue) < new Date(InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickSlipDateTime)) {
                    OnChangeValues(null, 'E3042');
                    OnChangeValues('value', 'E3044');
                }

            } else if (!fieldvalue && InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickCompDateTime) {
                OnChangeValues(null, 'E3043');
            } else {
                OnChangeValues('value', 'E3042');
            }
        }

        function PutawayCompletedDate(fieldvalue) {

            if (fieldvalue) {
                if (new Date(fieldvalue) > new Date(InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickStartDateTime)) {
                    OnChangeValues('value', 'E3044');
                } else if (new Date(fieldvalue) < new Date(InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickStartDateTime)) {
                    OnChangeValues(null, 'E3044');
                    OnChangeValues('value', 'E3042');
                }
            }
        }

        function OpenDatePicker($event, opened) {
            if (opened == "isPutOrPickStartDateTime" && !InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickSlipDateTime) {
                // do nothing
            } else if (opened == "isPutOrPickCompDateTime" && !InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PutOrPickStartDateTime) {
                //do nothing
            } else {
                $event.preventDefault();
                $event.stopPropagation();
                InwardGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
            }
        }



        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WorkOrderSubType", "WorkOrder_SubType"];
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
                        InwardGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        InwardGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function SelectedLookupClient(item) {
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = item.Code + '-' + item.FullName;
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK = item.PK;
            OnChangeValues(InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client, 'E3001');
            AllocateUDF();

            //#region JobAccounting

            InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.map(function(value,key){
                if(value.EntityRefKey == InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PK){
                    value.LocalOrg_Code = item.Code;
                    value.LocalOrg_FK = item.PK
                }
            })
           
            //#endregion
        }

        function SelectedLookupSupplier(item) {
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = item.Code + '-' + item.FullName;
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Supplier_FK = item.PK;
            angular.forEach(InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                if (value.AddressType == "SUD") {
                    value.ORG_FK = item.PK;
                    value.OAD_Address_FK = item.OAD_PK;
                    value.Address1 = item.OAD_Address1;
                    value.Address2 = item.OAD_Address2;
                    value.State = item.OAD_State;
                    value.PostCode = item.OAD_PostCode;
                    value.City = item.OAD_City;
                    value.Email = item.OAD_Email;
                    value.Mobile = item.OAD_Mobile;
                    value.Phone = item.OAD_Phone;
                    value.RN_NKCountryCode = item.OAD_CountryCode;
                    value.Fax = item.OAD_Fax;
                }
            });
            GetOrgAddress();
        }


        function SelectedLookupWarehouse(item) {
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = item.WarehouseCode + "-" + item.WarehouseName;
            OnChangeValues(InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse, 'E3002');


             //#region JobAccounting

            InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.map(function(value,key){
                if(value.EntityRefKey == InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PK){
                    value.AgentOrg_Code = item.Code;
                    value.Agent_Org_FK = item.PK
                }
            })
           
            //#endregion
           
        }

        function SelectedLookupServiceLevel(item) {
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ServiceLevel = item.Code + " - " + item.Description;
        }

        function GetClientAddress() {

            if (!InwardGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader) {
                var obj = {
                    "OAD_Address1": "",
                    "OAD_Address2": "",
                    "OAD_State": "",
                    "OAD_PostCode": "",
                    "OAD_City": "",
                    "OAD_City": "",
                    "OAD_Email": "",
                    "OAD_Mobile": "",
                };
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader.push([obj]);
            }
        }

        function OtherSupplierAddresses(otheraddress) {
            $uibModal.open({

                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right address",
                scope: $scope,

                templateUrl: 'app/eaxis/warehouse/inward/general/supplieraddress/address.html',
                controller: 'SupplierAddressController as SupplierAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "UIJobAddress": InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress,
                            "otheraddress": otheraddress
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewSupplierAddress() {
            var myvalue = InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == 'SUD';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": InwardGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "WAR",
                    "AddressType": "SUD",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "PostCode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }

        function GetOrgAddress() {
            var _filter = {
                "ORG_FK": InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Supplier_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardGeneralCtrl.ePage.Masters.OrgSupplierAddress = response.data.Response;
                }
            });
        }

        function GeneralOperations() {
            //Remove Null Values from data

            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode == null) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode = "";
            }
            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName == null) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName = "";
            }
            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevel == null) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevel = "";
            }
            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevelDescription == null) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevelDescription = "";
            }
            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode == null) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode = "";
            }
            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName == null) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName = "";
            }

            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode == null) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode = "";
            }
            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName == null) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName = "";
            }

            if (!InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent)
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent = 0;

            if (!InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits)
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalUnits = 0;

            if (!InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PackagesSent)
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.TotalPallets = 0;

            if (InwardGeneralCtrl.currentInward.isNew) {
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ExternalReference = '';

                var NewJobHeaderObject = 
                {
                    "AgentOrg_Code":"",
                    "Agent_Org_FK":"",
                    "GB":"",
                    "BranchCode":"",
                    "BranchName":"",
                    "GC":"",
                    "CompanyCode":"",
                    "CompanyName":"",
                    "GE":"",
                    "DeptCode":"",
                    "EntitySource":"WMS",
                    "JobNo":InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID,
                    "EntityRefKey": InwardGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "HeaderType":"JOB",
                    "LocalOrg_Code":"",
                    "LocalOrg_FK":"",
                }
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.push(NewJobHeaderObject);
                //Getting Department Value

                var _filter = {
                    "Code": "LOG"
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": InwardGeneralCtrl.ePage.Entities.Header.API.CmpDepartment.FilterID
                };

                apiService.post("eAxisAPI", InwardGeneralCtrl.ePage.Entities.Header.API.CmpDepartment.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader[0].DeptCode = response.data.Response[0].Code;
                        InwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader[0].GE = response.data.Response[0].PK;
                    }
                });
            }

        }

        function GetBindValues() {

            //Binding of Two values together
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode + ' - ' + InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName;
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ServiceLevel = InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevel + ' - ' + InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SER_ServiceLevelDescription;
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode + ' - ' + InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
            InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode + ' - ' + InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName;
            Removehyphen();
        }

        function Removehyphen() {

            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse == ' - ')
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = "";

            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ServiceLevel == ' - ')
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ServiceLevel = "";

            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client == ' - ')
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = "";

            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier == ' - ')
                InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = ""
        }

        function AllocateUDF() {
            if (InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK) {
                var _filter = {
                    "ORG_FK": InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        InwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }

        Init();
    }

})();