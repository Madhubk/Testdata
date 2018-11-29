(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneGeneralConController", ThreeOneGeneralConController);

    ThreeOneGeneralConController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "authService", "apiService", "three_consolidationConfig", "appConfig", "helperService", "toastr", "confirmation", "errorWarningService"];

    function ThreeOneGeneralConController($scope, $timeout, APP_CONSTANT, authService, apiService, three_consolidationConfig, appConfig, helperService, toastr, confirmation, errorWarningService) {
        /* jshint validthis: true */
        var ThreeOneGeneralConCtrl = this;

        function Init() {
            var currentConsol = ThreeOneGeneralConCtrl.currentConsol[ThreeOneGeneralConCtrl.currentConsol.label].ePage.Entities;
            ThreeOneGeneralConCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_General",
                "Masters": {
                    "ConsolShipment": {},
                    "Reference": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentConsol,
            };

            ThreeOneGeneralConCtrl.ePage.Masters.UnAllocatedList = undefined;
            var _filter = {
                "CON_FK": ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ThreeOneGeneralConCtrl.ePage.Entities.PkgCntMapping.API.FindAllUnAllocatedPacks.FilterID
            };

            apiService.post("eAxisAPI", ThreeOneGeneralConCtrl.ePage.Entities.PkgCntMapping.API.FindAllUnAllocatedPacks.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UnAllocatedList = [];
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UnAllocatedList = response.data.Response.Response;
                }
            });

            // DatePicker
            ThreeOneGeneralConCtrl.ePage.Masters.DatePicker = {};
            ThreeOneGeneralConCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ThreeOneGeneralConCtrl.ePage.Masters.DatePicker.isOpen = [];
            ThreeOneGeneralConCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ThreeOneGeneralConCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ThreeOneGeneralConCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            ThreeOneGeneralConCtrl.ePage.Masters.ValueChange = ValueChange;

            ThreeOneGeneralConCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Consolidation.Entity[ThreeOneGeneralConCtrl.currentConsol.code].GlobalErrorWarningList;
            ThreeOneGeneralConCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Consolidation.Entity[ThreeOneGeneralConCtrl.currentConsol.code];

            ThreeOneGeneralConCtrl.ePage.Masters.DropDownMasterList = three_consolidationConfig.Entities.Header.Meta;

            ThreeOneGeneralConCtrl.ePage.Masters.DropDownMasterListAddress = {
                "OAD_SendingForwarderAddressFK": helperService.metaBase(),
                "OAD_ReceivingForwarderAddressFK": helperService.metaBase(),
                "OAD_CarrierAddressFK": helperService.metaBase(),
                "OAD_CreditorAddressFK": helperService.metaBase()
            };


            ThreeOneGeneralConCtrl.ePage.Masters.SelectedData = SelectedData;
            ThreeOneGeneralConCtrl.ePage.Masters.SelectedDataPorts = SelectedDataPorts
            ThreeOneGeneralConCtrl.ePage.Masters.modeChange = ModeChange;
            ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = {}
            var _isEmpty = angular.equals({}, ThreeOneGeneralConCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersDropDownList();
            }

            if (!ThreeOneGeneralConCtrl.currentConsol.isNew) {
                dynamicOrgAddressFetch();
                ReferenceInit();
            } else {
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIShipmentHeaderList = [];
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.AgentType = 'AGT'
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.Phase = 'ALL'
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.AWBServiceLevel = 'STD'
            }
            var ValidationKeys = {
                "IsDomesticCheck": null
            };
            ThreeOneGeneralConCtrl.ePage.Entities.Header.Data["ValidationKeys"] = ValidationKeys;
            GetContainerType();
        }

        // $scope.$watchCollection('ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes', function (oldVal, newVal) {
        //     if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
        //         if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort == (authService.getUserInfo().CountryCode + authService.getUserInfo().BranchCode).trim()) {
        //             ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = _.filter(ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes, {
        //                 'LegOrder': 1
        //             })[0];
        //             if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj) {
        //                 if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode == ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj.TransportMode) {
        //                     ThreeOneGeneralConCtrl.ePage.Masters.LegLabel = 'First "' + ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode + '" Leg'
        //                 } else {
        //                     ThreeOneGeneralConCtrl.ePage.Masters.LegLabel = '(Departure Leg)';
        //                 }
        //             }
        //         } else if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort == (authService.getUserInfo().CountryCode + authService.getUserInfo().BranchCode).trim()) {
        //             ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = _.filter(ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes, {
        //                 'LegOrder': ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobRoutes.length
        //             })[0];
        //             if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj) {
        //                 if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode == ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj.TransportMode) {
        //                     ThreeOneGeneralConCtrl.ePage.Masters.LegLabel = 'Last "' + ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode + '" Leg'
        //                 } else {
        //                     ThreeOneGeneralConCtrl.ePage.Masters.LegLabel = '(Departure Leg)'
        //                 }
        //             }
        //         }
        //     } else {
        //         ThreeOneGeneralConCtrl.ePage.Masters.LegLabel = "";
        //         ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.JobRoutesObj = {};
        //     }
        // }, true);


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ThreeOneGeneralConCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                    ThreeOneGeneralConCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                    ThreeOneGeneralConCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                });
                for (var x in ThreeOneGeneralConCtrl.ePage.Entities.Header.Meta) {
                    ThreeOneGeneralConCtrl.ePage.Masters.DropDownMasterList[x] = ThreeOneGeneralConCtrl.ePage.Entities.Header.Meta[x];
                }

            });
        }

        function GetContainerType() {
            ThreeOneGeneralConCtrl.ePage.Masters.CfxTypesList = {}
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
                    ThreeOneGeneralConCtrl.ePage.Masters.CfxTypesList.CntType = response.data.Response
                    var obj = _.filter(ThreeOneGeneralConCtrl.ePage.Masters.CfxTypesList.CntType, {
                        'Key': ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode
                    })[0];
                    ThreeOneGeneralConCtrl.ePage.Masters.selectedMode = obj;
                }
            });

        }

        function ModeChange(obj) {
            if (obj) {
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode = obj.Key
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode = obj.PARENT_Key
                OnFieldValueChange('E9005')

            } else {
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ContainerMode = null
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.TransportMode = null
                OnFieldValueChange('E9005')

            }
        }

        function SelectedData(item, ListSource) {
            if (ListSource) {
                getSetNearByField(item, "OrgAddress", ListSource);
            }

        }

        function SelectedDataPorts(Str1, Str2) {
            if (Str1 && Str2) {
                var ValidationKeys = {
                    "IsDomesticCheck": null
                };
                ThreeOneGeneralConCtrl.ePage.Entities.Header.Data["ValidationKeys"] = ValidationKeys;
                if (three_consolidationConfig.PortsComparison(Str1, Str2)) {
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic = true
                } else {
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic = false;
                }
                if ((ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic == true) && (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort.slice(0, 2)) == (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort.slice(0, 2)) ||
                    ((ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic == false) && (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort.slice(0, 2)) != (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort.slice(0, 2)))) {
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.ValidationKeys.IsDomesticCheck = true;
                } else {
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.ValidationKeys.IsDomesticCheck = false;
                }
                OnFieldValueChange('E9002');
            }
        }

        function ValueChange(field) {
            switch (field) {
                case "AgentType":
                    if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.AgentType == 'CLD')
                        ThreeOneGeneralConCtrl.ePage.Masters.AgentView = true;
                    else ThreeOneGeneralConCtrl.ePage.Masters.AgentView = false;
                    OnFieldValueChange('E9001');
                    break;
                case "Is Domestic":
                    var ValidationKeys = {
                        "IsDomesticCheck": false
                    };
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data["ValidationKeys"] = ValidationKeys;
                    if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort, ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort) {
                        if ((ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic == true) && (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort.slice(0, 2)) == (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort.slice(0, 2)) ||
                            ((ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.IsDomestic == false) && (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.FirstLoadPort.slice(0, 2)) != (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.LastDischargePort.slice(0, 2)))) {
                            ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.ValidationKeys.IsDomesticCheck = true;
                        } else {
                            ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.ValidationKeys.IsDomesticCheck = false;
                        }
                    }
                    OnFieldValueChange('E9002');
                    break;
            }
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Consolidation"],
                Code: [ThreeOneGeneralConCtrl.currentConsol.code],
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
                EntityObject: ThreeOneGeneralConCtrl.ePage.Entities.Header.Data,
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
                    ThreeOneGeneralConCtrl.ePage.Masters.DropDownMasterListAddress[listSource].ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function dynamicOrgAddressFetch() {
            var dynamicFindAllOrgAddressInput = [{
                "OAD_SendingForwarderAddressFK": ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_SendingForwarderFK
            }, {
                "OAD_ReceivingForwarderAddressFK": ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_ReceivingForwarderFK
            }, {
                "OAD_CarrierAddressFK": ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CarrierFK
            }, {
                "OAD_CreditorAddressFK": ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIConConsolHeader.ORG_CreditorFK
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
                            ThreeOneGeneralConCtrl.ePage.Masters.DropDownMasterListAddress[value.FieldName].ListSource = response.data.Response[value.FieldName];
                        });
                    }
                });
            }
        }
        // ===================== Reference Begin =====================
        function ReferenceInit() {
            // Reference Form View
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.IsSelected = false;
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.IsFormView = false;
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView = {};
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.AddNewReference = AddNewReference;
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.SelectedGridRowReference = SelectedGridRowReference;
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.EditReference = EditReference;
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.DeleteReference = DeleteReference;
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.DeleteConfirmation = DeleteConfirmation;
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.AddToGridReference = AddToGridReference;

            if (!ThreeOneGeneralConCtrl.currentConsol.isNew) {
                GetReferenceList();
            } else {
                ThreeOneGeneralConCtrl.ePage.Masters.Reference.GridData = [];
            }
        }
        // APICall For Service and Reference
        function GetReferenceList() {
            // Reference grid list
            var _filter = {
                SortColumn: "CEN_EntryNum",
                SortType: "asc",
                EntityRefKey: ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEntryNum.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums = response.data.Response;
                    GetReferenceDetails();
                }
            });
        }
        //GridDetails For Reference
        function GetReferenceDetails() {
            var _gridData = [];
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.GridData = undefined;
            $timeout(function () {
                if (ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.length > 0) {
                    ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                        if (value.Category !== "CUS") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Reference List is Empty");
                }

                ThreeOneGeneralConCtrl.ePage.Masters.Reference.GridData = _gridData;
                ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView = {};
            }, 1000);
        }
        //Add New For Reference
        function AddNewReference() {
            if (!ThreeOneGeneralConCtrl.currentConsol.isNew) {
                ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView = {};
                ThreeOneGeneralConCtrl.ePage.Masters.Reference.IsFormView = true;
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
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.IsFormView = true;
            ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView = $item;
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
            var _index = ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.indexOf($item);
            if (_index != -1) {
                apiService.get("eAxisAPI", appConfig.Entities.JobEntryNum.API.Delete.Url + $item.PK).then(function (response) {
                    if (response.data.Response) {
                        ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.splice(_index, 1);
                        toastr.success("Record Deleted Successfully...!");
                        GetReferenceDetails();
                    }
                });
            }
        }

        // AddToGrid For Reference
        function AddToGridReference() {
            var _isEmpty = angular.equals({}, ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView);

            if (!_isEmpty) {
                var _index = ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                    return value.PK;
                }).indexOf(ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView.PK);

                if (_index === -1) {
                    ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView.EntityRefKey = ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.PK;
                    ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView.EntitySource = "CON";
                    ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView.Category = "OTH";
                    ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView.RN_NKCountryCode = authService.getUserInfo().CountryCode;
                    ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView.EntryIsSystemGenerated = false;
                    ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView.IsValid = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Insert.Url, [ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView]).then(function (response) {
                        if (response.data.Response) {
                            ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(response.data.Response[0]);
                            GetReferenceDetails();
                        }
                    });

                } else {
                    ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView.IsModified = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Update.Url, ThreeOneGeneralConCtrl.ePage.Masters.Reference.FormView).then(function (response) {
                        if (response.data.Response) {
                            ThreeOneGeneralConCtrl.ePage.Entities.Header.Data.UIJobEntryNums[_index] = response.data.Response;
                            GetReferenceDetails();
                        }
                    });
                }
                ThreeOneGeneralConCtrl.ePage.Masters.Reference.IsFormView = false;
            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }
        // ===================== Reference End =====================
        Init();
    }
})();