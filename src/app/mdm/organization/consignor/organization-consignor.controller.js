(function () {
    "use strict";
    angular
        .module("Application")
        .controller("organizationConsignorController", OrganizationConsignorController);

    OrganizationConsignorController.$inject = ["$scope", "APP_CONSTANT", "authService", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr"];

    function OrganizationConsignorController($scope, APP_CONSTANT, authService, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr) {
        var OrganizationConsignorCtrl = this;

        function Init() {
            var currentOrganization = OrganizationConsignorCtrl.currentOrganization[OrganizationConsignorCtrl.currentOrganization.label].ePage.Entities;

            OrganizationConsignorCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Contact",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            OrganizationConsignorCtrl.ePage.Masters.OrgContact = {};
            OrganizationConsignorCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrganizationConsignorCtrl.ePage.Masters.Supplier = {};
            OrganizationConsignorCtrl.ePage.Masters.Supplier.IsFormView = false;
            OrganizationConsignorCtrl.ePage.Masters.Supplier.IsNew = AddNew;
            OrganizationConsignorCtrl.ePage.Masters.Supplier.Save = Save;
            OrganizationConsignorCtrl.ePage.Masters.Supplier.IsDisabled = false;
            OrganizationConsignorCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
            // Consignee function
            OrganizationConsignorCtrl.ePage.Masters.Consignee = {};
            OrganizationConsignorCtrl.ePage.Masters.Consignee.ConsigneeGridCall = ConsigneeGridCall;

            // DatePicker
            OrganizationConsignorCtrl.ePage.Masters.DatePicker = {};
            OrganizationConsignorCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrganizationConsignorCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrganizationConsignorCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            // Document Tracking Grid Config
            OrganizationConsignorCtrl.ePage.Masters.DocumentTracking = {};
            OrganizationConsignorCtrl.ePage.Masters.DocumentTracking.GridData = [];
            OrganizationConsignorCtrl.ePage.Masters.DocumentTracking.gridConfig = OrganizationConsignorCtrl.ePage.Entities.Header.DocumentTracking.gridConfig;
            OrganizationConsignorCtrl.ePage.Masters.DocumentTracking.gridConfig.columnDef = OrganizationConsignorCtrl.ePage.Entities.Header.DocumentTracking.gridConfig.columnDef;

            ConsigneeGridCall();
            FollowUpConfig();
        }
        // -------------Date time picker-------------
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrganizationConsignorCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        // --------consignee grid details start-----------
        function ConsigneeGridCall() {
            // Supplier  list
            OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails = {};
            OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails.SelectedConsignorRow = SelectedConsignorRow;
            OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails.gridConfig = OrganizationConsignorCtrl.ePage.Entities.Header.OrgSupplierBuyerMappingDeatils.gridConfig;
            OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails.gridConfig.columnDef = OrganizationConsignorCtrl.ePage.Entities.Header.OrgSupplierBuyerMappingDeatils.gridConfig.columnDef;
            console.log(OrganizationConsignorCtrl.ePage.Entities.Header.Data)
            var _filter = {
                SupplierPk: OrganizationConsignorCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            }
            var _input = {
                "SearchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGBSMAP"
            }

            apiService.post('eAxisAPI', OrganizationConsignorCtrl.ePage.Entities.Header.OrgSupplierBuyerMappingDeatils.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails.GridData = response.data.Response;
                    }
                } else {
                    OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails.GridData = [];
                }
            })
        }
        // --------consignee grid details end-----------
        // cfxTypeLit Details
        function GetCfxTypeList() {
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ORDSTATUS", "JOBADDR"];
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
                typeCodeList.map(function (value, key) {
                    OrganizationConsignorCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    OrganizationConsignorCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                });
            });
        }
        // ------------- Country Details -----------------
        function GetCountryList() {
            // country list 
            OrganizationConsignorCtrl.ePage.Masters.CountryList = {};
            OrganizationConsignorCtrl.ePage.Masters.CountryList.ListSource = [];

            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsignorCtrl.ePage.Masters.CountryList.ListSource = response.data.Response;
                    } else {
                        OrganizationConsignorCtrl.ePage.Masters.CountryList.ListSource = [];
                    }
                }
            });
        }
        // ------------- Currency Details -----------------
        function GetCurrencyList() {
            // currency list
            OrganizationConsignorCtrl.ePage.Masters.CurrencyList = {};
            OrganizationConsignorCtrl.ePage.Masters.CurrencyList.ListSource = [];

            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0)
                        OrganizationConsignorCtrl.ePage.Masters.CurrencyList.ListSource = response.data.Response;
                } else {
                    OrganizationConsignorCtrl.ePage.Masters.CurrencyList.ListSource = [];
                }
            });
        }
        // ------------- Docs Details -----------------
        function GetDocsList() {
            OrganizationConsignorCtrl.ePage.Masters.DocumnetsList = {};
            OrganizationConsignorCtrl.ePage.Masters.DocumnetsList.ListSource = [{
                    "DOC_Code": "IMP",
                    "DOC_Desc": "Send Import Documents to the Importer"
                },
                {
                    "DOC_Code": "BRK",
                    "DOC_Desc": "Send Import Documents to the Broker"
                },
                {
                    "DOC_Code": "BTH",
                    "DOC_Desc": "Send to both the Importer and the Broker"
                }
            ];
        }
        // ------------- Authority To Leave Details -----------------
        function GetAuthorityList() {
            OrganizationConsignorCtrl.ePage.Masters.AuthorityToLeaveList = {};
            OrganizationConsignorCtrl.ePage.Masters.AuthorityToLeaveList.ListSource = [{
                    "AUT_Code": "DEF",
                    "AUT_Desc": "Default from Registry(Currently authority to leave is denied)"
                },
                {
                    "AUT_Code": "YES",
                    "AUT_Desc": "Authority to leave is denied"
                },
                {
                    "AUT_Code": "NO",
                    "AUT_Desc": "Authority to leave is granted"
                }
            ];
        }
        // ------------- Transfer Related Details -----------------
        function GetTransferRelatedList() {
            OrganizationConsignorCtrl.ePage.Masters.TransferRelatedList = {};
            OrganizationConsignorCtrl.ePage.Masters.TransferRelatedList.ListSource = [{
                    "TR_Code": true,
                    "TR_Name": "Yes",
                    "TR_Desc": "Related"
                },
                {
                    "TR_Code": false,
                    "TR_Name": "No",
                    "TR_Desc": "Unrelated"
                }
            ];
        }
        // GetValuationBasis
        function GetValuationBasis() {
            OrganizationConsignorCtrl.ePage.Masters.ValuationBasisList = {};
            OrganizationConsignorCtrl.ePage.Masters.ValuationBasisList.ListSource = [{
                    "VAL_Code": "TV",
                    "VAL_Desc": "Transaction Value"
                },
                {
                    "VAL_Code": "IG",
                    "VAL_Desc": "Identical Good Value"
                },
                {
                    "VAL_Code": "SG",
                    "VAL_Desc": "Similar Good Value"
                },
                {
                    "VAL_Code": "DV",
                    "VAL_Desc": "Deductive Value"
                },
                {
                    "VAL_Code": "CV",
                    "VAL_Desc": "Computed Value"
                },
                {
                    "VAL_Code": "FB",
                    "VAL_Desc": "Fall-Back Value"
                }
            ];
        }
        // Consignor functionality start
        function AddNew() {
            OrganizationConsignorCtrl.ePage.Masters.Supplier.IsFormView = true;
            OrganizationConsignorCtrl.ePage.Masters.Supplier.IsUpdate = false;
            OrganizationConsignorCtrl.ePage.Masters.Supplier.IsNewSave = true;
            OrganizationConsignorCtrl.ePage.Masters.SupplierDetails = {};
            OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIAddressContactList = {};
            OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIJobRequiredDocument = [];
            OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode = [];
            OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping = {};

            GetCfxTypeList();
            GetCountryList();
            GetCurrencyList();
            GetDocsList();
            GetAuthorityList();
            GetTransferRelatedList();
            GetValuationBasis();
        }

        function Save($item) {
            var _index = OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails.GridData.map(function (value, key) {
                return value.PK;
            }).indexOf($item.UIOrgBuyerSupplierMapping.PK);

            if (_index === -1) {
                OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.PK = "";
                OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.PK = "";
                OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.ORG_SupplierCode = OrganizationConsignorCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
                OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.ORG_Supplier = OrganizationConsignorCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
                OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.IsModified = false;
                OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.IsDeleted = false;
                OrganizationConsignorCtrl.ePage.Masters.Supplier.SaveButtonText = "Please wait...";
                OrganizationConsignorCtrl.ePage.Masters.Supplier.IsDisabled = true;
                apiService.post("eAxisAPI", OrganizationConsignorCtrl.ePage.Entities.Header.OrgSupplierBuyerMappingDeatils.API.Insert.Url, OrganizationConsignorCtrl.ePage.Masters.SupplierDetails).then(function (response) {
                    if (response.data.Response) {
                        toastr.success("Success saved...")
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.IsDisabled = false;
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.IsFormView = false;
                        OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails.GridData.push(response.data.Response.UIOrgBuyerSupplierMapping)
                    } else {
                        toastr.error("Save failed...")
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.IsDisabled = false;
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.IsFormView = false;
                    }
                });
            } else {
                OrganizationConsignorCtrl.ePage.Masters.Supplier.SaveButtonText = "Please wait...";
                OrganizationConsignorCtrl.ePage.Masters.Supplier.IsDisabled = true;

                $item = filterObjectUpdate($item, "IsModified");

                apiService.post("eAxisAPI", OrganizationConsignorCtrl.ePage.Entities.Header.OrgSupplierBuyerMappingDeatils.API.Update.Url, $item).then(function (response) {
                    if (response.data.Response) {
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.IsDisabled = false;
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.IsFormView = false;
                        toastr.success("Success updated...")
                        OrganizationConsignorCtrl.ePage.Masters.SupplierGridDetails.GridData[_index] = response.data.Response.UIOrgBuyerSupplierMapping;
                    } else {
                        toastr.error("Save failed...")
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.IsDisabled = false;
                        OrganizationConsignorCtrl.ePage.Masters.Supplier.IsFormView = false;
                    }
                });
            }

        }

        function SelectedConsignorRow(item) {

            GetCfxTypeList();
            GetCountryList();
            GetCurrencyList();
            GetDocsList();
            GetAuthorityList();
            GetTransferRelatedList();
            GetValuationBasis();

            OrganizationConsignorCtrl.ePage.Masters.Supplier.IsFormView = true;
            apiService.get('eAxisAPI', OrganizationConsignorCtrl.ePage.Entities.Header.OrgSupplierBuyerMappingDeatils.API.GetByID.Url + item.data.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsignorCtrl.ePage.Masters.SupplierDetails = response.data.Response;
                    }
                } else {
                    OrganizationConsignorCtrl.ePage.Masters.SupplierDetails = [];
                }
            })

        }
        // ---------------- Consignor end --------------------
        // -----------------Mode Function Satrt-----------------
        function ModeFormsDetailsCall() {
            // Mode Details Grid Config
            OrganizationConsignorCtrl.ePage.Masters.ModeDetails = {};
            OrganizationConsignorCtrl.ePage.Masters.ModeDetails.IsFormView = false;
            OrganizationConsignorCtrl.ePage.Masters.ModeDetails.SelectedGridMode = PopUpModal;
            OrganizationConsignorCtrl.ePage.Masters.ModeDetails.IsNewMode = PopUpModal;
            OrganizationConsignorCtrl.ePage.Masters.ModeDetails.gridConfig = OrganizationConsignorCtrl.ePage.Entities.Header.ModeDetails.gridConfig;
            OrganizationConsignorCtrl.ePage.Masters.ModeDetails.gridConfig.columnDef = OrganizationConsignorCtrl.ePage.Entities.Header.ModeDetails.gridConfig.columnDef;
        }

        function ModeGridCall() {
            console.log(OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode)
            var _filter = {
                OBS_FK: OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.PK
            }
            var _input = {
                "SearchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGBSTRN"
            }
            apiService.post('eAxisAPI', OrganizationConsignorCtrl.ePage.Entities.Header.OrgBuySupMappingTrnMode.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode = response.data.Response;
                    }
                } else {
                    OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode = [];
                }
            })
        }

        function PopUpModal($item, type) {
            console.log($item, type)
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "attach-modal",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/mdm/organization/consignor/consignor-modal/consignor-modal.html",
                controller: 'ConsignorModePopUpModalController',
                controllerAs: "ConsignorModePopUpModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Mode": type,
                            "Data": $item,
                            "OrgHeader_PK": OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.PK,
                            "Header": OrganizationConsignorCtrl.ePage.Entities.Header
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    toastr.success("Record Added Successfully...!");
                    ModeGridCall();
                },
                function () {
                    console.log("Cancelled");
                }

            );
        }
        // --------Document Tracking Start------------
        function DocFormsDetailsCall() {
            // Mode Details Grid Config
            OrganizationConsignorCtrl.ePage.Masters.DocDetails = {};
            OrganizationConsignorCtrl.ePage.Masters.DocDetails.IsFormView = false;
            OrganizationConsignorCtrl.ePage.Masters.DocDetails.SelectedDocumentTracking = DocModal;
            OrganizationConsignorCtrl.ePage.Masters.DocDetails.IsNewDoc = DocModal;
            OrganizationConsignorCtrl.ePage.Masters.DocDetails.gridConfig = OrganizationConsignorCtrl.ePage.Entities.Header.ModeDetails.gridConfig;
            OrganizationConsignorCtrl.ePage.Masters.DocDetails.gridConfig.columnDef = OrganizationConsignorCtrl.ePage.Entities.Header.ModeDetails.gridConfig.columnDef;
        }

        function DocModal($item, type) {
            console.log($item, type)
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "attach-modal",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/mdm/organization/consignor/consignor-doc-modal/consignor-doc-modal.html",
                controller: 'consignorDocPopUpModalController',
                controllerAs: "ConsignorDocPopUpModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Mode": type,
                            "Data": $item,
                            "OrgHeader_PK": OrganizationConsignorCtrl.ePage.Masters.SupplierDetails.PK,
                            "Header": OrganizationConsignorCtrl.ePage.Entities.Header
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    toastr.success("Record Added Successfully...!");
                    DocGridCall();
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }
        // ---------------consignor followup config start--------------
        function FollowUpConfig() {
            OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig = {}
            OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig.IsConsignorFollowupSave = FollowupConfigSave;
            OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig.GridData = [];
            GetFollowUpConfigDetails();
        }

        function GetFollowUpConfigDetails() {
            var _filter = {
                ORG_FK: OrganizationConsignorCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            }
            var _input = {
                "SearchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGMISC"
            }
            apiService.post('eAxisAPI', OrganizationConsignorCtrl.ePage.Entities.Header.ConsignorFollowUpConfig.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig.GridData = response.data.Response;
                        OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig.GridData.map(function (value, key) {
                            value.WeekDay = value.WeekDay.toString();
                        })
                    }
                } else {
                    OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig.GridData = [];
                }
            })
        }

        function FollowupConfigSave() {
            OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig.GridData.map(function (value, key) {
                value.IsModified = true;
            })

            apiService.post('eAxisAPI', OrganizationConsignorCtrl.ePage.Entities.Header.ConsignorFollowUpConfig.API.Upsert.Url, OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig.GridData[0]).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved successfully")
                    OrganizationConsignorCtrl.ePage.Masters.FollowUpConfig.GridData.map(function (value, key) {
                        value.FollowUpSource = response.data.Response.FollowUpSource;
                        value.FollowUpDue = response.data.Response.FollowUpDue;
                        value.FollowUpMsg = response.data.Response.FollowUpMsg;
                        value.WeekDay = response.data.Response.WeekDay.toString();
                    })
                }
            })
        }
        // ---------------consignor followup config end--------------
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

        Init();
    }
})();