(function () {
    "use strict";
    angular
        .module("Application")
        .controller("OrganizationConsigneeController", OrganizationConsigneeController);

    OrganizationConsigneeController.$inject = ["$scope", "APP_CONSTANT", "authService", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr", "confirmation"];

    function OrganizationConsigneeController($scope, APP_CONSTANT, authService, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr, confirmation) {
        var OrganizationConsigneeCtrl = this;

        function Init() {
            var currentOrganization = OrganizationConsigneeCtrl.currentOrganization[OrganizationConsigneeCtrl.currentOrganization.code].ePage.Entities;

            OrganizationConsigneeCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Contact",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization,
            };

            ConsigneeInit();
        }

        function ConsigneeInit() {
            OrganizationConsigneeCtrl.ePage.Masters.Supplier = {};
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormView = false;
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormTransView = false;
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsNew = AddNew;
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsNewTrans = AddNewTrans
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj = {};
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.Save = Save;
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.SaveTrans = SaveTrans;
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsDisabled = false;
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
            OrganizationConsigneeCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            OrganizationConsigneeCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            // DatePicker
            OrganizationConsigneeCtrl.ePage.Masters.DatePicker = {};
            OrganizationConsigneeCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrganizationConsigneeCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrganizationConsigneeCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            // Document Tracking Grid Config
            OrganizationConsigneeCtrl.ePage.Masters.DocumentTracking = {};
            OrganizationConsigneeCtrl.ePage.Masters.DocumentTracking.GridData = [];
            OrganizationConsigneeCtrl.ePage.Masters.DocumentTracking.gridConfig = OrganizationConsigneeCtrl.ePage.Entities.Header.DocumentTracking.gridConfig;
            OrganizationConsigneeCtrl.ePage.Masters.DocumentTracking.gridConfig.columnDef = OrganizationConsigneeCtrl.ePage.Entities.Header.DocumentTracking.gridConfig.columnDef;

            ConsigneeGridCall();
            FollowUpConfig();
            GetCfxTypeList();
            GetCountryList();
            GetServiceLevel()
            GetCurrencyList();
            GetDocsList();
            GetAuthorityList();
            GetTransferRelatedList();
            GetValuationBasis();
        }

        function AutoCompleteOnSelect($item, _input) {
            if (_input) {
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj[_input + 'Code'] = $item.Code;
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj[_input + 'PK'] = $item.PK;
            }
        }

        function SelectedLookupData($item, _input) {
            if (_input) {
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj[_input + 'Code'] = $item.data.entity.Code;
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj[_input + 'PK'] = $item.data.entity.PK;
            }
        }
        // -------------Date time picker-------------
        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrganizationConsigneeCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        // --------consignee grid details start-----------
        function ConsigneeGridCall() {
            // Supplier  list
            OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails = {};
            OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.SelectedConsignorRow = SelectedConsignorRow;
            OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.SelectedConsignorRowRemove = SelectedConsignorRowRemove;
            var _filter = {
                BuyerPk: OrganizationConsigneeCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            }
            var _input = {
                "SearchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGBSMAP"
            }

            apiService.post('eAxisAPI', OrganizationConsigneeCtrl.ePage.Entities.Header.OrgBuyerSupplierMappingDeatils.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.GridData = response.data.Response;
                    } else {
                        OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.GridData = [];
                    }
                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.GridData = [];
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
                    OrganizationConsigneeCtrl.ePage.Entities.Header.Meta[value] = helperService.metaBase();
                    OrganizationConsigneeCtrl.ePage.Entities.Header.Meta[value].ListSource = response.data.Response[value];
                });
            });
        }
        // ------------- Country Details -----------------
        function GetCountryList() {
            // country list 
            OrganizationConsigneeCtrl.ePage.Masters.CountryList = {};
            OrganizationConsigneeCtrl.ePage.Masters.CountryList.ListSource = [];

            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsigneeCtrl.ePage.Masters.CountryList.ListSource = response.data.Response;
                    } else {
                        OrganizationConsigneeCtrl.ePage.Masters.CountryList.ListSource = [];
                    }
                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.CountryList.ListSource = [];
                }
            });
        }
        // ------------------------Service Level-----------
        function GetServiceLevel() {
            OrganizationConsigneeCtrl.ePage.Masters.ServiceLevelList = {};
            OrganizationConsigneeCtrl.ePage.Masters.ServiceLevelList.ListSource = [];
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    OrganizationConsigneeCtrl.ePage.Masters.ServiceLevelList = helperService.metaBase();
                    OrganizationConsigneeCtrl.ePage.Masters.ServiceLevelList.ListSource = response.data.Response;
                }
            });
        }
        // ------------- Currency Details -----------------
        function GetCurrencyList() {
            // currency list
            OrganizationConsigneeCtrl.ePage.Masters.CurrencyList = {};
            OrganizationConsigneeCtrl.ePage.Masters.CurrencyList.ListSource = [];

            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsigneeCtrl.ePage.Masters.CurrencyList.ListSource = response.data.Response;
                    } else {
                        OrganizationConsigneeCtrl.ePage.Masters.CurrencyList.ListSource = [];
                    }
                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.CurrencyList.ListSource = [];
                }
            });
        }
        // ------------- Docs Details -----------------
        function GetDocsList() {
            OrganizationConsigneeCtrl.ePage.Masters.DocumnetsList = {};
            OrganizationConsigneeCtrl.ePage.Masters.DocumnetsList.ListSource = [{
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
            OrganizationConsigneeCtrl.ePage.Masters.AuthorityToLeaveList = {};
            OrganizationConsigneeCtrl.ePage.Masters.AuthorityToLeaveList.ListSource = [{
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
            OrganizationConsigneeCtrl.ePage.Masters.TransferRelatedList = {};
            OrganizationConsigneeCtrl.ePage.Masters.TransferRelatedList.ListSource = [{
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
            OrganizationConsigneeCtrl.ePage.Masters.ValuationBasisList = {};
            OrganizationConsigneeCtrl.ePage.Masters.ValuationBasisList.ListSource = [{
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
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormView = true;
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsUpdate = false;
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsNewSave = true;
            OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails = {};
            OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIAddressContactList = {};
            OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIJobRequiredDocument = [];
            OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode = [];
            OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping = {};
        }

        function AddNewTrans(type, obj) {
            if (type == 'edit') {
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj = obj
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj.IsModified = true;
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormTransView = true;
                OrgAddressByShipper()
                OrgContactByShipper()
            } else if (type == 'delete') {
                obj.IsDeleted = true;
                obj.IsModified = true;
            } else {
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj = {}
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormTransView = true;
                OrgAddressByShipper()
                OrgContactByShipper()
            }
        }

        function OrgAddressByShipper() {
            var _filter = {
                "ORG_FK": OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.ORG_Supplier,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID,
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationConsigneeCtrl.ePage.Masters.Supplier.OrgAddress = response.data.Response;

                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.Supplier.OrgAddress = [];
                }
            });
        }

        function OrgContactByShipper() {
            var _filter = {
                "ORG_FK": OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.ORG_Supplier,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrganizationConsigneeCtrl.ePage.Masters.Supplier.OrgContact = response.data.Response;
                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.Supplier.OrgContact = [];
                }
            });
        }

        function SaveTrans() {
            var _index = OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode.map(function (value, key) {
                return value.PK;
            }).indexOf(OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj.PK);
            if (_index === -1) {
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj.PK = ""
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj.IsDeleted = false
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj.EntityRefKey = OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.PK
                OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode.push(OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj)
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormTransView = false;
            } else {
                OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode[_index] = OrganizationConsigneeCtrl.ePage.Masters.Supplier.TransModeObj
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormTransView = false;
            }

        }

        function Save($item) {
            var _index = OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.GridData.map(function (value, key) {
                return value.PK;
            }).indexOf($item.UIOrgBuyerSupplierMapping.PK);

            if (_index === -1) {
                OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.PK = "";
                OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.PK = "";
                OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.ORG_BuyerCode = OrganizationConsigneeCtrl.ePage.Entities.Header.Data.OrgHeader.Code;
                OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.ORG_Buyer = OrganizationConsigneeCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
                // OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode[0].OBS_FK = OrganizationConsigneeCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
                OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.IsModified = false;
                OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuyerSupplierMapping.IsDeleted = false;
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.SaveButtonText = "Please wait...";
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsDisabled = true;
                apiService.post("eAxisAPI", OrganizationConsigneeCtrl.ePage.Entities.Header.OrgBuyerSupplierMappingDeatils.API.Insert.Url, OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails).then(function (response) {
                    if (response.data.Response) {
                        toastr.success("Success saved...");
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsDisabled = false;
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormView = false;
                        ConsigneeGridCall();
                        // OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.GridData.push(response.data.Response.UIOrgBuyerSupplierMapping)
                    } else {
                        toastr.error("Save failed...");
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsDisabled = false;
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormView = false;
                    }
                });
            } else {
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.SaveButtonText = "Please wait...";
                OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsDisabled = true;

                $item = filterObjectUpdate($item, "IsModified");

                apiService.post("eAxisAPI", OrganizationConsigneeCtrl.ePage.Entities.Header.OrgBuyerSupplierMappingDeatils.API.Update.Url, $item).then(function (response) {
                    if (response.data.Response) {
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsDisabled = false;
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormView = false;
                        toastr.success("Success updated...");
                        ConsigneeGridCall();
                        // OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.GridData[_index] = response.data.Response.UIOrgBuyerSupplierMapping;
                    } else {
                        toastr.error("Save failed...");
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.SaveButtonText = "Save";
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsDisabled = false;
                        OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormView = false;
                    }
                });
            }

        }

        function SelectedConsignorRow(item) {
            OrganizationConsigneeCtrl.ePage.Masters.Supplier.IsFormView = true;
            // get details call
            apiService.get('eAxisAPI', OrganizationConsigneeCtrl.ePage.Entities.Header.OrgBuyerSupplierMappingDeatils.API.GetByID.Url + item.PK).then(function (response) {
                if (response.data.Response) {
                    OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails = response.data.Response;
                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails = {};
                }
            });
        }

        function SelectedConsignorRowRemove(item, index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    apiService.get('eAxisAPI', appConfig.Entities.OrgBuyerSupplierMapping.API.Delete.Url + item.PK).then(function (response) {
                        if (response.data.Response) {
                            OrganizationConsigneeCtrl.ePage.Masters.SupplierGridDetails.GridData.splice(index, 1)
                        }
                    });
                }, function () {
                    console.log("Cancelled");
                });

        }
        // ---------------- Consignor end --------------------
        // -----------------Mode Function Satrt-----------------
        function ModeFormsDetailsCall() {
            // Mode Details Grid Config
            OrganizationConsigneeCtrl.ePage.Masters.ModeDetails = {};
            OrganizationConsigneeCtrl.ePage.Masters.ModeDetails.IsFormView = false;
            OrganizationConsigneeCtrl.ePage.Masters.ModeDetails.SelectedGridMode = PopUpModal;
            OrganizationConsigneeCtrl.ePage.Masters.ModeDetails.IsNewMode = PopUpModal;
            OrganizationConsigneeCtrl.ePage.Masters.ModeDetails.gridConfig = OrganizationConsigneeCtrl.ePage.Entities.Header.ModeDetails.gridConfig;
            OrganizationConsigneeCtrl.ePage.Masters.ModeDetails.gridConfig.columnDef = OrganizationConsigneeCtrl.ePage.Entities.Header.ModeDetails.gridConfig.columnDef;
        }

        function ModeGridCall() {
            console.log(OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode)
            var _filter = {
                OBS_FK: OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.PK
            }
            var _input = {
                "SearchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGBSTRN"
            }
            apiService.post('eAxisAPI', OrganizationConsigneeCtrl.ePage.Entities.Header.OrgBuySupMappingTrnMode.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode = response.data.Response;
                    }
                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.UIOrgBuySupMappingTrnMode = [];
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
                templateUrl: "app/mdm/organization/consignee/consignee-modal/consignee-modal.html",
                controller: 'modePopUpModalController',
                controllerAs: "OrganizationConsigneeCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Mode": type,
                            "Data": $item,
                            "OrgHeader_PK": OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.PK,
                            "Header": OrganizationConsigneeCtrl.ePage.Entities.Header
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
            OrganizationConsigneeCtrl.ePage.Masters.DocDetails = {};
            OrganizationConsigneeCtrl.ePage.Masters.DocDetails.IsFormView = false;
            OrganizationConsigneeCtrl.ePage.Masters.DocDetails.SelectedDocumentTracking = DocModal;
            OrganizationConsigneeCtrl.ePage.Masters.DocDetails.IsNewDoc = DocModal;
            OrganizationConsigneeCtrl.ePage.Masters.DocDetails.gridConfig = OrganizationConsigneeCtrl.ePage.Entities.Header.ModeDetails.gridConfig;
            OrganizationConsigneeCtrl.ePage.Masters.DocDetails.gridConfig.columnDef = OrganizationConsigneeCtrl.ePage.Entities.Header.ModeDetails.gridConfig.columnDef;
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
                templateUrl: "app/mdm/organization/consignee/consignee-doc-modal/consignee-doc-modal.html",
                controller: 'docPopUpModalController',
                controllerAs: "DocPopUpModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Mode": type,
                            "Data": $item,
                            "OrgHeader_PK": OrganizationConsigneeCtrl.ePage.Masters.SupplierDetails.PK,
                            "Header": OrganizationConsigneeCtrl.ePage.Entities.Header
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
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig = {}
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.IsConsignorFollowupSave = FollowupConfigSave;
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.GridData = [];
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.SaveButtonText = "Save";
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.SaveButtonEnable = false;
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.FollowupWeekDaysSource = {};
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.FollowupWeekDaysSource.ListSource = [{
                    "WeeKDay_Code": 1,
                    "WeeKDay_Desc": "Sunday"
                },
                {
                    "WeeKDay_Code": 2,
                    "WeeKDay_Desc": "Monday"
                },
                {
                    "WeeKDay_Code": 3,
                    "WeeKDay_Desc": "Tuesday"
                },
                {
                    "WeeKDay_Code": 4,
                    "WeeKDay_Desc": "Wednesday"
                },
                {
                    "WeeKDay_Code": 5,
                    "WeeKDay_Desc": "Thursday"
                },
                {
                    "WeeKDay_Code": 6,
                    "WeeKDay_Desc": "Friday"
                },
                {
                    "WeeKDay_Code": 7,
                    "WeeKDay_Desc": "Saturday"
                }
            ];
            GetFollowUpConfigDetails();
            GetFollowUpSourceDetails();
        }

        function GetFollowUpSourceDetails() {
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.FollowupSourceList = {};
            var _filter = {
                "ModuleCode": "ORG",
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "ConsignorFollowUp"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "APPSETT"
            }
            apiService.post('eAxisAPI', appConfig.Entities.AppSettings.API.FindAll.Url + OrganizationConsigneeCtrl.ePage.Entities.Header.Data.OrgHeader.PK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.FollowupSourceList.ListSource = response.data.Response;
                    }
                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.FollowupSourceList.ListSource = [];
                }
            })
        }

        function GetFollowUpConfigDetails() {
            var _filter = {
                ORG_FK: OrganizationConsigneeCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            }
            var _input = {
                "SearchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGMISC"
            }
            apiService.post('eAxisAPI', OrganizationConsigneeCtrl.ePage.Entities.Header.ConsignorFollowUpConfig.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.GridData = response.data.Response;
                    }
                } else {
                    OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.GridData = [];
                }
            })
        }

        function FollowupConfigSave() {
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.SaveButtonText = "Please wait...";
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.SaveButtonEnable = true;
            OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.GridData.map(function (value, key) {
                value.IsModified = true;
            })

            apiService.post('eAxisAPI', OrganizationConsigneeCtrl.ePage.Entities.Header.ConsignorFollowUpConfig.API.Upsert.Url, OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.GridData[0]).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved successfully")
                    OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.SaveButtonText = "Save";
                    OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.SaveButtonEnable = false;
                    OrganizationConsigneeCtrl.ePage.Masters.FollowUpConfig.GridData.map(function (value, key) {
                        value.FollowUpSource = response.data.Response.FollowUpSource;
                        value.FollowUpDue = response.data.Response.FollowUpDue;
                        value.FollowUpMsg = response.data.Response.FollowUpMsg;
                        value.WeekDay = response.data.Response.WeekDay;
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