(function () {
    "use strict";

    angular
        .module("Application")
        .controller("UploadImportPermitDocumentController", UploadImportPermitDocumentController);

    UploadImportPermitDocumentController.$inject = ["helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout"];

    function UploadImportPermitDocumentController(helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout) {
        var UploadImportPermitDocumentCtrl = this;

        function Init() {
            UploadImportPermitDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Upload Import Permit Document",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            UploadImportPermitDocumentCtrl.ePage.Masters.emptyText = "-";
            UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj = UploadImportPermitDocumentCtrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = UploadImportPermitDocumentCtrl.taskObj;
            UploadImportPermitDocumentCtrl.ePage.Masters.Complete = Complete;
            UploadImportPermitDocumentCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            UploadImportPermitDocumentCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            UploadImportPermitDocumentCtrl.ePage.Masters.DatePicker = {};
            UploadImportPermitDocumentCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            UploadImportPermitDocumentCtrl.ePage.Masters.DatePicker.isOpen = [];
            UploadImportPermitDocumentCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            UploadImportPermitDocumentCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            UploadImportPermitDocumentCtrl.ePage.Masters.CompleteBtnText = "Complete";


            if (UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj) {
                GetEntityObj();
            } else {
                UploadImportPermitDocumentCtrl.ePage.Masters.currentShipment = myTaskActivityConfig.Entities.Shipment;
                UploadImportPermitDocumentCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Shipment[myTaskActivityConfig.Entities.Shipment.label].ePage.Entities.Header.Data;
                UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj = myTaskActivityConfig.Entities.Shipment.taskObj;
                StandardMenuConfig();
                getContainerList();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    UploadImportPermitDocumentCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = UploadImportPermitDocumentCtrl.ePage.Masters.TaskConfigData;
                    UploadImportPermitDocumentCtrl.ePage.Masters.MenuListSource = $filter('filter')(UploadImportPermitDocumentCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });

                    UploadImportPermitDocumentCtrl.ePage.Masters.ValidationSource = $filter('filter')(UploadImportPermitDocumentCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Validation'
                    });
                    if (UploadImportPermitDocumentCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation = $filter('filter')(UploadImportPermitDocumentCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    console.log(UploadImportPermitDocumentCtrl.ePage.Masters.ValidationSource)
                    console.log(UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation)
                    console.log(UploadImportPermitDocumentCtrl.ePage.Masters.TaskConfigData)
                    if (UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    UploadImportPermitDocumentCtrl.ePage.Masters.MenuObj = UploadImportPermitDocumentCtrl.taskObj;
                    UploadImportPermitDocumentCtrl.ePage.Masters.MenuObj.TabTitle = UploadImportPermitDocumentCtrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            UploadImportPermitDocumentCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj = response.data.Response;
                        UploadImportPermitDocumentCtrl.ePage.Entities.Header.Data = UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj;
                        UploadImportPermitDocumentCtrl.currentShipment = {
                            [UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo]: {
                                ePage: {
                                    Entities: {
                                        Header: {
                                            Data: UploadImportPermitDocumentCtrl.ePage.Entities.Header.Data
                                        }
                                    }
                                }
                            },
                            label: UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                            code: UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                            taskObj: UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj,
                            isNew: false
                        };
                        myTaskActivityConfig.Entities.Shipment = UploadImportPermitDocumentCtrl.currentShipment;
                        getTaskConfigData();
                    }
                });
            }
        }

        function getContainerList() {
            var _filter = {
                "ShipmentPK": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerCntContainer.API.findall.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.findall.Url, _input).then(function (response) {
                if (response.data.Response) {
                    UploadImportPermitDocumentCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response;
                } else {
                    UploadImportPermitDocumentCtrl.ePage.Entities.Header.Data.UICntContainer = [];
                }
            });
        }



        function SaveEntity() {

            UploadImportPermitDocumentCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            UploadImportPermitDocumentCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            var _containerInput = [];
            UploadImportPermitDocumentCtrl.ePage.Entities.Header.Data.UICntContainer.map(function (val, key) {
                var containerObj = {};
                containerObj.EntityRefPK = val.PK,
                    containerObj.Properties = [{
                        "PropertyName": "CNT_CustomsClearenceDate",
                        "PropertyNewValue": val.CustomsClearenceDate
                    }];
                _containerInput.push(containerObj);

            });

            apiService.post('eAxisAPI', appConfig.Entities.BuyerCntContainer.API.UpdateRecords.Url, _containerInput).then(function (response) {
                if (response.data.Response) {
                    SaveOnly().then(function (response) {
                        if (response.data.Status == "Success") {
                            toastr.success("Task Completed Successfully...!");
                            var _data = {
                                IsCompleted: true,
                                Item: UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj
                            };

                            UploadImportPermitDocumentCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                        }
                        console.log(type)
                        UploadImportPermitDocumentCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        UploadImportPermitDocumentCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    });
                } else {
                    toastr.error("Save Failed...");
                    UploadImportPermitDocumentCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    UploadImportPermitDocumentCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });


        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            UploadImportPermitDocumentCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            UploadImportPermitDocumentCtrl.ePage.Masters.StandardConfigInput = {
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

            UploadImportPermitDocumentCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };

            UploadImportPermitDocumentCtrl.ePage.Masters.StandardMenuInput1 = {
                // Entity
                "Entity": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntityRefKey": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            UploadImportPermitDocumentCtrl.ePage.Masters.StandardConfigInput1 = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                IsDisableCount: true,
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

            UploadImportPermitDocumentCtrl.ePage.Masters.CommentConfig1 = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTaskEdit"],
                    Code: [UploadImportPermitDocumentCtrl.taskObj.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "BKG",
                    },
                    GroupCode: UploadImportPermitDocumentCtrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTaskEdit"],
                    Code: [UploadImportPermitDocumentCtrl.taskObj.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete(type) {
            if (UploadImportPermitDocumentCtrl.ePage.Masters.ValidationSource.length > 0 || UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (UploadImportPermitDocumentCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTaskEdit"],
                        Code: [UploadImportPermitDocumentCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "BKG",
                        },
                        GroupCode: UploadImportPermitDocumentCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (UploadImportPermitDocumentCtrl.ePage.Masters.docTypeSource.length == 0 || UploadImportPermitDocumentCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTaskEdit"],
                            Code: [UploadImportPermitDocumentCtrl.taskObj.PSI_InstanceNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "SHP",
                                SubModuleCode: "SHP",
                            },
                            GroupCode: "Document",
                            EntityObject: UploadImportPermitDocumentCtrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTaskEdit.Entity[UploadImportPermitDocumentCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(UploadImportPermitDocumentCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        UploadImportPermitDocumentCtrl.ePage.Masters.ShowErrorWarningModal(UploadImportPermitDocumentCtrl.taskObj.PSI_InstanceNo);
                    } else {
                        CompleteWithSave(type);
                    }
                }, 1000);
            } else {
                CompleteWithSave(type);
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            UploadImportPermitDocumentCtrl.ePage.Masters.docTypeSource = $filter('filter')(UploadImportPermitDocumentCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(UploadImportPermitDocumentCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": UploadImportPermitDocumentCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (UploadImportPermitDocumentCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(UploadImportPermitDocumentCtrl.ePage.Masters.docTypeSource, 'DocType');
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

        function CompleteWithSave(type) {
            SaveEntity();
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();