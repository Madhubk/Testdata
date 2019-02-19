(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BuyerActivityTemplate1Controller", BuyerActivityTemplate1Controller);

    BuyerActivityTemplate1Controller.$inject = ["helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout", "freightApiConfig", "three_consolidationConfig", "three_shipmentConfig"];

    function BuyerActivityTemplate1Controller(helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout, freightApiConfig, three_consolidationConfig, three_shipmentConfig) {
        var BuyerActivityTemplate1Ctrl = this;

        function Init() {
            BuyerActivityTemplate1Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template1",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            BuyerActivityTemplate1Ctrl.ePage.Masters.emptyText = "-";
            BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj = BuyerActivityTemplate1Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = BuyerActivityTemplate1Ctrl.taskObj;
            BuyerActivityTemplate1Ctrl.ePage.Masters.Complete = Complete;
            BuyerActivityTemplate1Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            BuyerActivityTemplate1Ctrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            BuyerActivityTemplate1Ctrl.ePage.Masters.DatePicker = {};
            BuyerActivityTemplate1Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            BuyerActivityTemplate1Ctrl.ePage.Masters.DatePicker.isOpen = [];
            BuyerActivityTemplate1Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            BuyerActivityTemplate1Ctrl.ePage.Masters.CompleteBtnText = "Complete";

            BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableSaveBtn = false;
            BuyerActivityTemplate1Ctrl.ePage.Masters.SaveBtnText = "Save";
            BuyerActivityTemplate1Ctrl.ePage.Masters.TaskSave = TaskSave;

            if (BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EEM_Code_3": EEM_Code_3,
                "SortColumn": "ECF_SequenceNo",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.ActivityFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BuyerActivityTemplate1Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = BuyerActivityTemplate1Ctrl.ePage.Masters.TaskConfigData;
                    BuyerActivityTemplate1Ctrl.ePage.Masters.MenuListSource = $filter('filter')(BuyerActivityTemplate1Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    // BuyerActivityTemplate1Ctrl.ePage.Masters.ValidationSource = $filter('filter')(BuyerActivityTemplate1Ctrl.ePage.Masters.TaskConfigData, { Category: 'Validation' });
                    BuyerActivityTemplate1Ctrl.ePage.Masters.ValidationSource = $filter('filter')(BuyerActivityTemplate1Ctrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    });
                    if (BuyerActivityTemplate1Ctrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    // BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(BuyerActivityTemplate1Ctrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(BuyerActivityTemplate1Ctrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'DocumentValidation'
                    })
                    if (BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    BuyerActivityTemplate1Ctrl.ePage.Masters.MenuObj = BuyerActivityTemplate1Ctrl.taskObj;
                    BuyerActivityTemplate1Ctrl.ePage.Masters.MenuObj.TabTitle = BuyerActivityTemplate1Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            BuyerActivityTemplate1Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", freightApiConfig.Entities["1_1"].API.listgetbyid.Url + BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data = BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj;
                        GetPackageList();
                        getTaskConfigData();
                        if (BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                            BuyerActivityTemplate1Ctrl.ePage.Masters.IsConsolAvailable = true;
                            GetConList(BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIConShpMappings[0].CON_FK);
                        }
                    }
                });
            }
        }

        function GetConList(CON_FK) {
            apiService.get("eAxisAPI", three_consolidationConfig.Entities.Header.API.GetByID.Url + CON_FK).then(function (response) {
                if (response.data.Response) {
                    BuyerActivityTemplate1Ctrl.ePage.Entities.Header.ConData = response.data.Response;
                    myTaskActivityConfig.Entities.Consol = BuyerActivityTemplate1Ctrl.ePage.Entities.Header.ConData;
                    BuyerActivityTemplate1Ctrl.ePage.Entities.Header.ConData.UIConConsolHeader.PK = BuyerActivityTemplate1Ctrl.ePage.Entities.Header.ConData.PK;
                    BuyerActivityTemplate1Ctrl.currentConsol = {
                        [response.data.Response.UIConConsolHeader.ConsolNo]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: BuyerActivityTemplate1Ctrl.ePage.Entities.Header.ConData
                                    }
                                }
                            }
                        },
                        label: response.data.Response.UIConConsolHeader.ConsolNo,
                        code: response.data.Response.UIConConsolHeader.ConsolNo,
                        isNew: false
                    };
                    myTaskActivityConfig.Entities.Consol = BuyerActivityTemplate1Ctrl.currentConsol;
                }
            });
        }

        // package list details
        function GetPackageList() {
            var _filter = {
                SHP_FK: BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            var _isExist = BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                                return value1.PK === value.PK;
                            });

                            if (!_isExist) {
                                BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                            }
                            BuyerActivityTemplate1Ctrl.currentShipment = {
                                [BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo]: {
                                    ePage: {
                                        Entities: {
                                            Header: {
                                                Data: BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data
                                            }
                                        }
                                    }
                                },
                                label: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                                code: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                                isNew: false
                            };
                        });
                    } else {
                        BuyerActivityTemplate1Ctrl.currentShipment = {
                            [BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo]: {
                                ePage: {
                                    Entities: {
                                        Header: {
                                            Data: BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data
                                        }
                                    }
                                }
                            },
                            label: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                            code: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                            isNew: false
                        };
                    }
                    myTaskActivityConfig.Entities.Shipment = BuyerActivityTemplate1Ctrl.currentShipment;
                }
            });
        }

        function SaveEntity() {
            var _input = angular.copy(BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            _input.UIShpExtendedInfo.IsModified = true;
            _input.UICustomEntity.IsModified = true;
            _input.UIJobRoutes.IsModified = true;
            apiService.post("eAxisAPI", freightApiConfig.Entities.shipmentlistbuyer.API.update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BuyerActivityTemplate1Ctrl.currentShipment = {
                        [response.data.Response.UIShipmentHeader.ShipmentNo]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj
                                    }
                                }
                            }
                        },
                        label: response.data.Response.UIShipmentHeader.ShipmentNo,
                        code: response.data.Response.UIShipmentHeader.ShipmentNo,
                        isNew: false
                    };
                    myTaskActivityConfig.Entities.Shipment = BuyerActivityTemplate1Ctrl.currentShipment;
                    toastr.success("Saved Successfully...!");
                    BuyerActivityTemplate1Ctrl.ePage.Masters.SaveBtnText = "Save";
                    BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableSaveBtn = false;

                } else {
                    toastr.error("Save Failed...!");
                    BuyerActivityTemplate1Ctrl.ePage.Masters.SaveBtnText = "Save";
                    BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": "",
                    "Val2": "",
                    "Val3": "",
                    "Val4": "",
                    "Val5": "",
                    "Val6": "",
                    "Val7": "",
                    "Val8": "",
                    "Val9": "",
                    "Val10": ""

                }
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function StandardMenuConfig() {
            BuyerActivityTemplate1Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_FK,
                "ParentEntityRefCode": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            BuyerActivityTemplate1Ctrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                // IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                // IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };

            BuyerActivityTemplate1Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP",
                    },
                    GroupCode: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                    Code: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (BuyerActivityTemplate1Ctrl.ePage.Masters.ValidationSource.length > 0 || BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                if (BuyerActivityTemplate1Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                        Code: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "SHP",
                            SubModuleCode: "SHP",
                        },
                        GroupCode: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                        EntityObject: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (BuyerActivityTemplate1Ctrl.ePage.Masters.docTypeSource.length == 0 || BuyerActivityTemplate1Ctrl.ePage.Masters.docTypeSource.length == response.length) {
                            BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                            Code: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "SHP",
                                SubModuleCode: "SHP",
                            },
                            GroupCode: [BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode],
                            EntityObject: BuyerActivityTemplate1Ctrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules[BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode].Entity[BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(BuyerActivityTemplate1Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        BuyerActivityTemplate1Ctrl.ePage.Masters.ShowErrorWarningModal(BuyerActivityTemplate1Ctrl.taskObj.PSI_InstanceNo);
                    } else {
                        CompleteWithSave();
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config);
            }

            BuyerActivityTemplate1Ctrl.ePage.Masters.docTypeSource = $filter('filter')(BuyerActivityTemplate1Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(BuyerActivityTemplate1Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (BuyerActivityTemplate1Ctrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(BuyerActivityTemplate1Ctrl.ePage.Masters.docTypeSource, 'DocType');
                        var DocumentListSource = _.groupBy(response.data.Response, 'DocumentType');
                        angular.forEach(TempDocTypeSource, function (value1, key1) {
                            angular.forEach(DocumentListSource, function (value, key) {
                                if (key == key1) {
                                    _arr.push(value);
                                }
                            });
                        });
                        deferred.resolve(_arr);
                    } else {
                        deferred.resolve(_arr);
                    }
                }
            });
            return deferred.promise;
        }

        function TaskSave() {
            BuyerActivityTemplate1Ctrl.ePage.Masters.SaveBtnText = "Please Wait...";
            BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            SaveEntity();
            if (BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                ConSave();
            }
        }
        function CompleteWithSave() {
            BuyerActivityTemplate1Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity();
            if (BuyerActivityTemplate1Ctrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                ConSave();
            }
            SaveOnly().then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: BuyerActivityTemplate1Ctrl.ePage.Masters.TaskObj
                    };
                    BuyerActivityTemplate1Ctrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                BuyerActivityTemplate1Ctrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function ConSave() {
            var _input = angular.copy(BuyerActivityTemplate1Ctrl.ePage.Entities.Header.ConData);
            _input.UIConConsolHeader.IsModified = true;
            apiService.post("eAxisAPI", freightApiConfig.Entities.ConsolList_Buyer.API.updatel.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Saved Successfully...!");
                    BuyerActivityTemplate1Ctrl.ePage.Masters.SaveBtnText = "Save";
                    BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                } else {
                    toastr.error("Save Failed...!");
                    BuyerActivityTemplate1Ctrl.ePage.Masters.SaveBtnText = "Save";
                    BuyerActivityTemplate1Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                }
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();