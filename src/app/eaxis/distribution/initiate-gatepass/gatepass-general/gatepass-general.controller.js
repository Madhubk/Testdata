(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GatepassGeneralController", GatepassGeneralController);

    GatepassGeneralController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "$window", "$uibModal", "$filter", "toastr", "$http", "gatepassConfig", "creategatepassConfig", "errorWarningService", "$timeout"];

    function GatepassGeneralController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, helperService, $window, $uibModal, $filter, toastr, $http, gatepassConfig, creategatepassConfig, errorWarningService, $timeout) {

        var GatepassGeneralCtrl = this;

        function Init() {
            var currentGatepass = GatepassGeneralCtrl.currentGatepass[GatepassGeneralCtrl.currentGatepass.label].ePage.Entities;
            GatepassGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "GatePass_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentGatepass
            };

            // validation
            if (!GatepassGeneralCtrl.currentGatepass.code)
                GatepassGeneralCtrl.currentGatepass.code = "New";
            GatepassGeneralCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            GatepassGeneralCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Gatepass.Entity[GatepassGeneralCtrl.currentGatepass.code];

            GatepassGeneralCtrl.ePage.Masters.GenerateGatePassNo = GenerateGatePassNo;
            GatepassGeneralCtrl.ePage.Masters.Validation = Validation;
            GatepassGeneralCtrl.ePage.Masters.SelectedLookupOrg = SelectedLookupOrg;
            GatepassGeneralCtrl.ePage.Masters.SelectedLookupTransporter = SelectedLookupTransporter;

            GatepassGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            GatepassGeneralCtrl.ePage.Masters.SaveButtonText = "Save";

            GatepassGeneralCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;

            if ($state.current.url == "/create-gatepass") {
                GatepassGeneralCtrl.ePage.Masters.Config = creategatepassConfig;
            } else {
                GatepassGeneralCtrl.ePage.Masters.Config = gatepassConfig;
            }
            if (GatepassGeneralCtrl.currentGatepass.code)
                GatepassGeneralCtrl.ePage.Masters.str = GatepassGeneralCtrl.currentGatepass.code.replace(/\//g, '');

            GetNewAddress();
            GetAllVehicleType();
            GetDropDownList();
            generalOperation();
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Gatepass"],
                Code: [GatepassGeneralCtrl.currentGatepass.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "TMS",
                    SubModuleCode: "GAT",
                    // Code: "E0013"
                },
                EntityObject: GatepassGeneralCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function generalOperation() {
            // Sender
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode = "";
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName = "";
            GatepassGeneralCtrl.ePage.Masters.Organization = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode + ' - ' + GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName;
            if (GatepassGeneralCtrl.ePage.Masters.Organization == " - ")
                GatepassGeneralCtrl.ePage.Masters.Organization = "";

            // Transporter
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode = "";
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName == null)
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName = "";
            GatepassGeneralCtrl.ePage.Masters.Transporter = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode + ' - ' + GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName;
            if (GatepassGeneralCtrl.ePage.Masters.Transporter == " - ")
                GatepassGeneralCtrl.ePage.Masters.Transporter = "";
        }

        function SelectedLookupTransporter(item) {
            if (item.data) {
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterFK = item.data.entity.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode = item.data.entity.Code;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName = item.data.entity.FullName;
                GatepassGeneralCtrl.ePage.Masters.Transporter = item.data.entity.Code + '-' + item.data.entity.FullName;
            }
            else {
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterFK = item.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterCode = item.Code;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.TransporterName = item.FullName;
                GatepassGeneralCtrl.ePage.Masters.Transporter = item.Code + '-' + item.FullName;
            }
            if (!GatepassGeneralCtrl.currentGatepass.isNew)
                OnFieldValueChange('E3532');
        }

        function SelectedLookupOrg(item) {
            if (item.data) {
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_PK = item.data.entity.WAR_PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode = item.data.entity.WarehouseCode;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName = item.data.entity.WarehouseName;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK = item.data.entity.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_Code = item.data.entity.Code;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_FullName = item.data.entity.FullName;
                GatepassGeneralCtrl.ePage.Masters.Organization = item.data.entity.WarehouseCode + '-' + item.data.entity.WarehouseName;
            }
            else {
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_PK = item.WAR_PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseCode = item.WarehouseCode;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.WAR_WarehouseName = item.WarehouseName;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK = item.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_Code = item.Code;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_FullName = item.FullName;
                GatepassGeneralCtrl.ePage.Masters.Organization = item.WarehouseCode + '-' + item.WarehouseName;
            }
            if (!GatepassGeneralCtrl.currentGatepass.isNew)
                OnFieldValueChange('E3531');

            var _filter = {
                "ORG_FK": GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": GatepassGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", GatepassGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        angular.forEach(GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                            if (value.AddressType == "SND") {
                                value.ORG_FK = response.data.Response[0].ORG_FK;
                                value.OAD_Address_FK = response.data.Response[0].PK;
                                value.Address1 = response.data.Response[0].Address1;
                                value.Address2 = response.data.Response[0].Address2;
                                value.State = response.data.Response[0].State;
                                value.Postcode = response.data.Response[0].PostCode;
                                value.City = response.data.Response[0].City;
                                value.Email = response.data.Response[0].Email;
                                value.Mobile = response.data.Response[0].Mobile;
                                value.Phone = response.data.Response[0].Phone;
                                value.RN_NKCountryCode = response.data.Response[0].CountryCode;
                                value.Fax = response.data.Response[0].Fax;
                            }
                        });
                    }
                }
            });
        }

        function GetNewAddress() {
            var myvalue = GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": GatepassGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TGP",
                    "AddressType": "SND",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "Postcode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                GatepassGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
        }


        function Validation($item) {
            // save manipulation
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            GatepassGeneralCtrl.ePage.Masters.str = GatepassGeneralCtrl.currentGatepass.code.replace(/\//g, '');

            //Validation Call
            var _obj = {
                ModuleName: ["Gatepass"],
                Code: [$item.code],
                API: "Validation",
                FilterInput: {
                    ModuleCode: "TMS",
                    SubModuleCode: "GAT"
                },
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                ErrorCode: ["E3531", "E3532", "E3533", "E3534", "E3535", "E3536", "E3537"]
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.Gatepass.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    Save($item);
                } else {
                    GatepassGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(GatepassGeneralCtrl.currentGatepass);
                }
            });
        }

        function Save($item) {
            GatepassGeneralCtrl.ePage.Masters.SaveButtonText = "Please Wait...";

            GatepassGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TMSGatepassHeader.PK = _input.PK;
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GateinTime = new Date();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Gatepass').then(function (response) {
                GatepassGeneralCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;

                GatepassGeneralCtrl.ePage.Masters.SaveButtonText = "Save";

                if (response.Status === "success") {
                    var _index = gatepassConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(GatepassGeneralCtrl.currentGatepass[GatepassGeneralCtrl.currentGatepass.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        apiService.get("eAxisAPI",gatepassConfig.Entities.Header.API.GetByID.Url + GatepassGeneralCtrl.currentGatepass[GatepassGeneralCtrl.currentGatepass.label].ePage.Entities.Header.Data.PK).then(function (response) {
                            if (response.data.Response) {
                                gatepassConfig.TabList[_index][gatepassConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                gatepassConfig.TabList.map(function (value, key) {
                                    if (_index == key) {
                                        if (value.New) {
                                            value.label = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo;
                                            value[GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo] = value.New;
                                            delete value.New;
                                        }
                                    }
                                });
                                GatepassGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
                            }
                        });
                        toastr.success("Saved Successfully");

                        gatepassConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    toastr.error("save failed");
                    GatepassGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    // angular.forEach(response.Validations, function (value, key) {
                    //     GatepassGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), GatepassGeneralCtrl.currentGatepass.label, false, undefined, undefined, undefined, undefined, undefined);
                    // });
                    if (GatepassGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        GatepassGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(GatepassGeneralCtrl.currentGatepass);
                    }
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

        function GenerateGatePassNo(purpose) {
            if (GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_Code) {
                GatepassGeneralCtrl.ePage.Masters.submitButtonText = "Print Gate Pass";
                GatepassGeneralCtrl.ePage.Masters.isSubmitButton = false;
                var purposeCode = purpose;
                var dateCounter = $filter('date')(new Date(), 'ddMMyyyy', '');
                var sequenceNo = $filter('date')(new Date(), 'Hmmss', '');
                GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.GatepassNo = GatepassGeneralCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ORG_Code + "/" + purposeCode + "/" + dateCounter + "/" + sequenceNo;
            }
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["GatepassPurpose"];
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
                        GatepassGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        GatepassGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }


        function GetAllVehicleType() {
            var _filter = {
                "SortColumn": "CNM_Code",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 1000
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": GatepassGeneralCtrl.ePage.Entities.Header.API.MstContainer.FilterID
            };
            apiService.post("eAxisAPI", GatepassGeneralCtrl.ePage.Entities.Header.API.MstContainer.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    GatepassGeneralCtrl.ePage.Masters.VehicleType = response.data.Response;
                }
            });
        }


        Init();
    }

})();