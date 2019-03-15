(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardGeneralController", OutwardGeneralController);

    OutwardGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "outwardConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal"];

    function OutwardGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, outwardConfig, helperService, toastr, $filter, $injector, $uibModal) {

        var OutwardGeneralCtrl = this;

        function Init() {

            var currentOutward = OutwardGeneralCtrl.currentOutward[OutwardGeneralCtrl.currentOutward.label].ePage.Entities;
            OutwardGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward,
            };

            // DatePicker
            OutwardGeneralCtrl.ePage.Masters.DatePicker = {};
            OutwardGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OutwardGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            OutwardGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            OutwardGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            OutwardGeneralCtrl.ePage.Masters.userselected = "";
            OutwardGeneralCtrl.ePage.Masters.Linesave = true;
            OutwardGeneralCtrl.ePage.Masters.Config = $injector.get("outwardConfig");

            OutwardGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            OutwardGeneralCtrl.ePage.Masters.SelectedLookupCode_Desc = SelectedLookupCode_Desc;
            OutwardGeneralCtrl.ePage.Masters.SelectedLookupCarrier = SelectedLookupCarrier;
            OutwardGeneralCtrl.ePage.Masters.SelectedLookupDataConsignee = SelectedLookupDataConsignee;
            OutwardGeneralCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            OutwardGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            OutwardGeneralCtrl.ePage.Masters.OtherConsigneeAddresses = OtherConsigneeAddresses;
            OutwardGeneralCtrl.ePage.Masters.SelectedLookupToWarehouse = SelectedLookupToWarehouse;
            //DropDown
            GetDropDownList();
            GeneralOperations();
            GetBindValues();
            GetClientAddress();
            AllocateUDF();
            GetNewConsigneeAddress();
            GetOrgAddress();

        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(OutwardGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                OutwardGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OutwardGeneralCtrl.currentOutward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                OutwardGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OutwardGeneralCtrl.currentOutward.label);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            OutwardGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }


        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WorkOrderType", "WmsOrderFulfillmentRule", "PickOption", "DropMode", "WorkOrder_SubType"];
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
                        OutwardGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OutwardGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }



        function GetClientAddress() {

            if (!OutwardGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader) {
                var obj = {
                    "OAD_Address1": "",
                    "OAD_Address2": "",
                    "OAD_State": "",
                    "OAD_PostCode": "",
                    "OAD_City": "",
                    "OAD_City": "",
                    "OAD_Fax": "",
                    "OAD_Phone": ""
                };
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader.push([obj]);
            }
        }

        function OtherConsigneeAddresses(otheraddress) {
            $uibModal.open({

                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right address",
                scope: $scope,

                templateUrl: 'app/eaxis/warehouse/outward/general/Consigneeaddress/address.html',
                controller: 'ConsigneeAddressController  as ConsigneeAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "UIJobAddress": OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress,
                            "otheraddress": otheraddress
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewConsigneeAddress() {
            var myvalue = OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == 'CED';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": OutwardGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "WAR",
                    "AddressType": "CED",
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
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }

        function GetOrgAddress() {
            var _filter = {
                "ORG_FK": OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Consignee_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OutwardGeneralCtrl.ePage.Masters.OrgConsigneeAddress = response.data.Response;
                }
            });
        }


        function SelectedLookupDataClient(item) {
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client = item.Code + ' - ' + item.FullName;
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK = item.PK;
            OnChangeValues(OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client, 'E3501')
            AllocateUDF();

            //#region JobAccounting

            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.map(function(value,key){
                if(value.EntityRefKey == OutwardGeneralCtrl.ePage.Entities.Header.Data.PK){
                    value.LocalOrg_Code = item.Code;
                    value.LocalOrg_FK = item.PK
                }
            })
           
            //#endregion
        }

        function SelectedLookupDataConsignee(item) {

            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Consignee = item.Code + ' - ' + item.FullName;
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Consignee_FK = item.PK;

            angular.forEach(OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                if (value.AddressType == "CED") {
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

            //#region JobAccounting

            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.map(function(value,key){
                if(value.EntityRefKey == OutwardGeneralCtrl.ePage.Entities.Header.Data.PK){
                    value.AgentOrg_Code = item.Code;
                    value.Agent_Org_FK = item.PK
                }
            })
           
            //#endregion
        }



        function SelectedLookupWarehouse(item) {
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Warehouse = item.WarehouseCode + " - " + item.WarehouseName;
            OnChangeValues(OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Warehouse, 'E3502');

            //#region JobAccounting

            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.map(function(value,key){
                if(value.EntityRefKey == OutwardGeneralCtrl.ePage.Entities.Header.Data.PK){
                    value.BranchCode = item.BRN_Code;
                    value.BranchName = item.BRN_BranchName;
                    value.GB = item.BRN_FK;
                }
            })

            //#endregion
        }

        function SelectedLookupToWarehouse(item) {
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferWarehouse = item.WarehouseCode + " - " + item.WarehouseName;
            OnChangeValues(OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferWarehouse, 'E3542');
        }

        function SelectedLookupCode_Desc(item) {
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ServiceLevel = item.Code + " - " + item.Description;
        }

        function SelectedLookupCarrier(item) {
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CarrierServiceLevel = item.Code + " - " + item.CarrierServiceLevelDescription;
        }

        function GeneralOperations() {
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.SER_ServiceLevel == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.SER_ServiceLevel = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.SER_ServiceLevelDescription == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.SER_ServiceLevelDescription = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CSL_CarrierServiceLevel == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CSL_CarrierServiceLevel = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CSL_CarrierServiceLevelDescription == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CSL_CarrierServiceLevelDescription = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeCode == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeCode = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeName == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeName = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferTo_WAR_Code == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferTo_WAR_Code = "";
            }
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferTo_WAR_Name == null) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferTo_WAR_Name = "";
            }

            if (!OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent)
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PackagesSent = 0;

            if (!OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits)
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TotalUnits = 0;

            if (OutwardGeneralCtrl.currentOutward.isNew) {
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ExternalReference = '';

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
                    "JobNo":OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID,
                    "EntityRefKey": OutwardGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "HeaderType":"JOB",
                    "LocalOrg_Code":"",
                    "LocalOrg_FK":"",
                }
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader.push(NewJobHeaderObject);
                //Getting Department Value

                var _filter = {
                    "Code": "LOG"
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": OutwardGeneralCtrl.ePage.Entities.Header.API.CmpDepartment.FilterID
                };

                apiService.post("eAxisAPI", OutwardGeneralCtrl.ePage.Entities.Header.API.CmpDepartment.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader[0].DeptCode = response.data.Response[0].Code;
                        OutwardGeneralCtrl.ePage.Entities.Header.Data.UIJobHeader[0].GE = response.data.Response[0].PK;
                    }
                });

            }

        }

        function GetBindValues() {
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Warehouse = OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode + ' - ' + OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName;
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ServiceLevel = OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.SER_ServiceLevel + ' - ' + OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.SER_ServiceLevelDescription;
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CarrierServiceLevel = OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CSL_CarrierServiceLevel + ' - ' + OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CSL_CarrierServiceLevelDescription;
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client = OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode + ' - ' + OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientName;
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Consignee = OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeCode + ' - ' + OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeName;
            OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferWarehouse = OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferTo_WAR_Code + ' - ' + OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferTo_WAR_Name;
            removehyphen();
        }

        function removehyphen() {

            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Warehouse == ' - ')
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Warehouse = ""

            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ServiceLevel == ' - ')
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ServiceLevel = "";

            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CarrierServiceLevel == ' - ')
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CarrierServiceLevel = "";

            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client == ' - ')
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Client = "";

            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Consignee == ' - ')
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.Consignee = "";

            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferWarehouse == " - ")
                OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.TransferWarehouse = "";
        }

        function AllocateUDF() {
            if (OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK) {
                var _filter = {
                    "ORG_FK": OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        OutwardGeneralCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }

        Init();
    }
})();