(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GeneralConController", GeneralConController);

    GeneralConController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "consolidationConfig", "appConfig", "helperService", "$filter", "toastr", "dynamicLookupConfig", "confirmation", "errorWarningService"];

    function GeneralConController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, consolidationConfig, appConfig, helperService, $filter, toastr, dynamicLookupConfig, confirmation, errorWarningService) {
        /* jshint validthis: true */
        var GeneralConCtrl = this;

        function Init() {
            var currentConsol = GeneralConCtrl.currentConsol[GeneralConCtrl.currentConsol.label].ePage.Entities;
            GeneralConCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_General",
                "Masters": {
                    "ConsolShipment": {},
                    "Reference": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentConsol,
            };

            GeneralConCtrl.ePage.Masters.UnAllocatedList = undefined;
            var _filter = {
                "CON_FK": GeneralConCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": GeneralConCtrl.ePage.Entities.PkgCntMapping.API.FindAllUnAllocatedPacks.FilterID
            };

            apiService.post("eAxisAPI", GeneralConCtrl.ePage.Entities.PkgCntMapping.API.FindAllUnAllocatedPacks.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GeneralConCtrl.ePage.Entities.Header.Data.UnAllocatedList = [];
                    GeneralConCtrl.ePage.Entities.Header.Data.UnAllocatedList = response.data.Response.Response;
                }
            });

            // DatePicker
            GeneralConCtrl.ePage.Masters.DatePicker = {};
            GeneralConCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            GeneralConCtrl.ePage.Masters.DatePicker.isOpen = [];
            GeneralConCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GeneralConCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            GeneralConCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            GeneralConCtrl.ePage.Masters.ValueChange = ValueChange;

            GeneralConCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consolidation.Entity[GeneralConCtrl.currentConsol.code].GlobalErrorWarningList;
            GeneralConCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consolidation.Entity[GeneralConCtrl.currentConsol.code];

            GeneralConCtrl.ePage.Masters.DropDownMasterList = consolidationConfig.Entities.Header.Meta;

            GeneralConCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_SendingForwarderAddressFK": helperService.metaBase(),
                "OAD_ReceivingForwarderAddressFK": helperService.metaBase(),
                "OAD_CarrierAddressFK": helperService.metaBase(),
                "OAD_CreditorAddressFK": helperService.metaBase()
            };
            GeneralConCtrl.ePage.Masters.AgentFilter = {
                "IsForwarder": true
            }
            GeneralConCtrl.ePage.Masters.CarrierFilter = {
                "IsShippingProvider": true,
                "IsConsignee": true
            }

            GeneralConCtrl.ePage.Masters.SelectedData = SelectedData;
            GeneralConCtrl.ePage.Masters.SelectedDataPorts = SelectedDataPorts
            // GeneralConCtrl.ePage.Masters.modeChange = ModeChange;
            GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = {}
            var _isEmpty = angular.equals({}, GeneralConCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersDropDownList();
            }

            if (!GeneralConCtrl.currentConsol.isNew) {
                dynamicOrgAddressFetch();
                ReferenceInit();
            } else {
                GeneralConCtrl.ePage.Entities.Header.Data.UIShipmentHeaderList = [];
                GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.AgentType = 'AGT'
                GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.Phase = 'ALL'
                GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.AWBServiceLevel = 'STD'
            }
            var ValidationKeys = { "IsDomesticCheck": null };
            GeneralConCtrl.ePage.Entities.Header.Data["ValidationKeys"] = ValidationKeys;
            GetContainerType();
        }

        $scope.$watchCollection('GeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes', function (oldVal, newVal) {
            if (GeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
                GeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes.map(function (value, key) {
                    if (value.LegOrder == '1') {
                        GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = value;
                    }
                })

                // if (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort == (authService.getUserInfo().CountryCode + authService.getUserInfo().BranchCode).trim()) {
                //     GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = _.filter(GeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes, {
                //         'LegOrder': 1
                //     })[0];
                //     if (GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj) {
                //         if (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode == GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj.TransportMode) {
                //             GeneralConCtrl.ePage.Masters.LegLabel = 'First "' + GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode + '" Leg'
                //         } else {
                //             GeneralConCtrl.ePage.Masters.LegLabel = '(Departure Leg)'
                //         }
                //     }
                // } else if (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort == (authService.getUserInfo().CountryCode + authService.getUserInfo().BranchCode).trim()) {
                //     GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = _.filter(GeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes, {
                //         'LegOrder': GeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes.length
                //     })[0];
                //     if (GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj) {
                //         if (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode == GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj.TransportMode) {
                //             GeneralConCtrl.ePage.Masters.LegLabel = 'Last "' + GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode + '" Leg'
                //         } else {
                //             GeneralConCtrl.ePage.Masters.LegLabel = '(Departure Leg)'
                //         }
                //     }
                // }
            } else {
                GeneralConCtrl.ePage.Masters.LegLabel = ""
                GeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = {}
            }
        }, true);


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            GeneralConCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["WEIGHTUNIT", "VOLUMEUNIT", "RELEASETYPE", "AIRWAY", "HEIGHTUNIT", "CON_TYPE", "CON_SERVICELEVEL", "CON_PAYMENT", "CON_SCRN", "PHASE", "CON_MANIFEST", "REFNUMTYPE", "SHP_TRANSTYPE", "SHP_CNTMODE"];
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
                    GeneralConCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                    GeneralConCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                });
                for (var x in GeneralConCtrl.ePage.Entities.Header.Meta) {
                    GeneralConCtrl.ePage.Masters.DropDownMasterList[x] = GeneralConCtrl.ePage.Entities.Header.Meta[x];
                }

            });
        }

        function GetContainerType() {
            GeneralConCtrl.ePage.Masters.CfxTypesList = {}
            //ContainerType
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    GeneralConCtrl.ePage.Masters.CfxTypesList.CntType = response.data.Response
                    var obj = _.filter(GeneralConCtrl.ePage.Masters.CfxTypesList.CntType, {
                        'Key': GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode
                    })[0];
                    GeneralConCtrl.ePage.Masters.selectedMode = obj;
                }
            });

        }

        // function ModeChange(obj) {
        //     if (obj) {
        //         GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode = obj.Key
        //         GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode = obj.PARENT_Key
        //         OnFieldValueChange('E9005')

        //     } else {
        //         GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode = null
        //         GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode = null
        //         OnFieldValueChange('E9005')

        //     }
        // }

        function SelectedData(item, ListSource) {
            if (ListSource) {
                getSetNearByField(item, "OrgAddress", ListSource);
            }

        }

        function SelectedDataPorts(Str1, Str2) {
            if (Str1 && Str2) {
                var ValidationKeys = { "IsDomesticCheck": null };
                GeneralConCtrl.ePage.Entities.Header.Data["ValidationKeys"] = ValidationKeys;
                if (consolidationConfig.PortsComparison(Str1, Str2)) {
                    GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic = true
                } else {
                    GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic = false;
                }
                if ((GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic == true) && (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort.slice(0, 2)) == (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort.slice(0, 2)) ||
                    ((GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic == false) && (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort.slice(0, 2)) != (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort.slice(0, 2)))) {
                    GeneralConCtrl.ePage.Entities.Header.Data.ValidationKeys.IsDomesticCheck = true;
                }
                else {
                    GeneralConCtrl.ePage.Entities.Header.Data.ValidationKeys.IsDomesticCheck = false;
                }
                OnFieldValueChange('E9002');
            }
        }

        function ValueChange(field) {
            switch (field) {
                case "AgentType":
                    if (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.AgentType == 'CLD')
                        GeneralConCtrl.ePage.Masters.AgentView = true;
                    else GeneralConCtrl.ePage.Masters.AgentView = false;
                    OnFieldValueChange('E9001');
                    break;
                case "Is Domestic":
                    var ValidationKeys = { "IsDomesticCheck": false };
                    GeneralConCtrl.ePage.Entities.Header.Data["ValidationKeys"] = ValidationKeys;
                    if (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort, GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort) {
                        if ((GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic == true) && (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort.slice(0, 2)) == (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort.slice(0, 2)) ||
                            ((GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic == false) && (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort.slice(0, 2)) != (GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort.slice(0, 2)))) {
                            GeneralConCtrl.ePage.Entities.Header.Data.ValidationKeys.IsDomesticCheck = true;
                        }
                        else {
                            GeneralConCtrl.ePage.Entities.Header.Data.ValidationKeys.IsDomesticCheck = false;
                        }
                    }
                    OnFieldValueChange('E9002');
                    break;
            }
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Consolidation"],
                Code: [GeneralConCtrl.currentConsol.code],
                API: "Group",
                FilterInput: {
                    ModuleCode: "CON",
                    SubModuleCode: "CON"
                },
                GroupCode: "CON_GENERAL",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: GeneralConCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function getSetNearByField(item, api, listSource) {
            var _filter = {
                ORG_FK: item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GeneralConCtrl.ePage.Masters.DropDownMasterListAddress[listSource].ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_SendingForwarderAddressFK": GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_SendingForwarderFK
            }, {
                "OAD_ReceivingForwarderAddressFK": GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ReceivingForwarderFK
            }, {
                "OAD_CarrierAddressFK": GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CarrierFK
            }, {
                "OAD_CreditorAddressFK": GeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CreditorFK
            }];
            var dynamicFindAllInputBuild = []
            dynamicFindAllOrgAddressInput.map(function (value, key) {
                if (value[Object.keys(value).join()] !== null) {
                    dynamicFindAllInputBuild.push({
                        "FieldName": Object.keys(value).join(),
                        "value": value[Object.keys(value).join()]
                    })
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInputBuild,
                "FilterID": appConfig.Entities.OrgAddress.API.DynamicFindAll.FilterID
            };
            if (dynamicFindAllInputBuild.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.DynamicFindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        dynamicFindAllInputBuild.map(function (value, key) {
                            GeneralConCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
                        });
                    }
                });
            }
        }
        // ===================== Reference Begin =====================
        function ReferenceInit() {
            // Reference Form View
            GeneralConCtrl.ePage.Masters.Reference.IsSelected = false;
            GeneralConCtrl.ePage.Masters.Reference.IsFormView = false;
            GeneralConCtrl.ePage.Masters.Reference.FormView = {};
            GeneralConCtrl.ePage.Masters.Reference.AddNewReference = AddNewReference;
            GeneralConCtrl.ePage.Masters.Reference.SelectedGridRowReference = SelectedGridRowReference;
            GeneralConCtrl.ePage.Masters.Reference.EditReference = EditReference;
            GeneralConCtrl.ePage.Masters.Reference.DeleteReference = DeleteReference;
            GeneralConCtrl.ePage.Masters.Reference.DeleteConfirmation = DeleteConfirmation;
            GeneralConCtrl.ePage.Masters.Reference.AddToGridReference = AddToGridReference;

            if (!GeneralConCtrl.currentConsol.isNew) {
                GetReferenceList();
            } else {
                GeneralConCtrl.ePage.Masters.Reference.GridData = [];
            }
        }
        // APICall For Service and Reference
        function GetReferenceList() {
            // Reference grid list
            var _filter = {
                SortColumn: "CEN_EntryNum",
                SortType: "asc",
                EntityRefKey: GeneralConCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEntryNum.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums = response.data.Response;
                    GetReferenceDetails();
                }
            });
        }
        //GridDetails For Reference
        function GetReferenceDetails() {
            var _gridData = [];
            GeneralConCtrl.ePage.Masters.Reference.GridData = undefined;
            $timeout(function () {
                if (GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.length > 0) {
                    GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                        if (value.Category !== "CUS") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Reference List is Empty");
                }

                GeneralConCtrl.ePage.Masters.Reference.GridData = _gridData;
                GeneralConCtrl.ePage.Masters.Reference.FormView = {};
            }, 1000);
        }
        //Add New For Reference
        function AddNewReference() {
            if (!GeneralConCtrl.currentConsol.isNew) {
                GeneralConCtrl.ePage.Masters.Reference.FormView = {};
                GeneralConCtrl.ePage.Masters.Reference.IsFormView = true;
            } else {
                toastr.warning("Please Save Consol....")
            }
        }

        function SelectedGridRowReference(item, type) {
            if (type == 'edit')
                EditReference(item);
            else
                DeleteConfirmation(item);
        }
        //Edit For Reference
        function EditReference($item) {
            GeneralConCtrl.ePage.Masters.Reference.IsFormView = true;
            GeneralConCtrl.ePage.Masters.Reference.FormView = $item;
        }

        function DeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteReference($item);
                }, function () {
                    console.log("Cancelled");
                });
        }
        //Delete For Reference
        function DeleteReference($item) {
            var _index = GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.indexOf($item);
            if (_index != -1) {
                apiService.get("eAxisAPI", appConfig.Entities.JobEntryNum.API.Delete.Url + $item.PK).then(function (response) {
                    if (response.data.Response) {
                        GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.splice(_index, 1);
                        toastr.success("Record Deleted Successfully...!");
                        GetReferenceDetails();
                    }
                });
            }
        }

        // AddToGrid For Reference
        function AddToGridReference() {
            var _isEmpty = angular.equals({}, GeneralConCtrl.ePage.Masters.Reference.FormView);

            if (!_isEmpty) {
                var _index = GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                    return value.PK;
                }).indexOf(GeneralConCtrl.ePage.Masters.Reference.FormView.PK);

                if (_index === -1) {
                    GeneralConCtrl.ePage.Masters.Reference.FormView.EntityRefKey = GeneralConCtrl.ePage.Entities.Header.Data.PK;
                    GeneralConCtrl.ePage.Masters.Reference.FormView.EntitySource = "CON";
                    GeneralConCtrl.ePage.Masters.Reference.FormView.Category = "OTH";
                    GeneralConCtrl.ePage.Masters.Reference.FormView.RN_NKCountryCode = authService.getUserInfo().CountryCode;
                    GeneralConCtrl.ePage.Masters.Reference.FormView.EntryIsSystemGenerated = false;
                    GeneralConCtrl.ePage.Masters.Reference.FormView.IsValid = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Insert.Url, [GeneralConCtrl.ePage.Masters.Reference.FormView]).then(function (response) {
                        if (response.data.Response) {
                            GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(response.data.Response[0]);
                            GetReferenceDetails();
                        }
                    });

                } else {
                    GeneralConCtrl.ePage.Masters.Reference.FormView.IsModified = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Update.Url, GeneralConCtrl.ePage.Masters.Reference.FormView).then(function (response) {
                        if (response.data.Response) {
                            GeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums[_index] = response.data.Response;
                            GetReferenceDetails();
                        }
                    });
                }
                GeneralConCtrl.ePage.Masters.Reference.IsFormView = false;
            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }
        // ===================== Reference End =====================
        Init();
    }
    angular
        .module("Application")
        .filter('shpcntmode', function () {
            return function (input, type) {
                var _list = [];
                if (input && type) {
                    var x = input.map(function (value, key) {
                        if (value.OtherConfig != "" && value.OtherConfig != undefined) {
                            var _input = JSON.parse(value.OtherConfig).mode
                            if (_input) {
                                var _index = _input.indexOf(type);
                                if (_index != -1) {
                                    _list.push(value)
                                }
                            }
                        }
                    });
                    return _list;
                }
            };
        });
})();