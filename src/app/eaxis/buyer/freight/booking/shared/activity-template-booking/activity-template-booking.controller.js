(function () {
    "use strict";

    angular
        .module("Application")
        .controller("activityTemplateBookingController", activityTemplateBookingController);

    activityTemplateBookingController.$inject = ["helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout"];

    function activityTemplateBookingController(helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout) {
        var activityTemplateBookingCtrl = this;

        function Init() {
            activityTemplateBookingCtrl.ePage = {
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
            activityTemplateBookingCtrl.ePage.Masters.emptyText = "-";
            activityTemplateBookingCtrl.ePage.Masters.TaskObj = activityTemplateBookingCtrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = activityTemplateBookingCtrl.taskObj;
            activityTemplateBookingCtrl.ePage.Masters.Complete = Complete;
            activityTemplateBookingCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            activityTemplateBookingCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            activityTemplateBookingCtrl.ePage.Masters.DatePicker = {};
            activityTemplateBookingCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            activityTemplateBookingCtrl.ePage.Masters.DatePicker.isOpen = [];
            activityTemplateBookingCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            activityTemplateBookingCtrl.ePage.Masters.IsDisableAllBtn = false;

            activityTemplateBookingCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            activityTemplateBookingCtrl.ePage.Masters.CompleteBtnText = "Complete";

            activityTemplateBookingCtrl.ePage.Masters.IsDisableSaveBtn = false;
            activityTemplateBookingCtrl.ePage.Masters.SaveBtnText = "Save";
            activityTemplateBookingCtrl.ePage.Masters.IsDisableCompleteBtnApproval = false;
            activityTemplateBookingCtrl.ePage.Masters.CompleteBtnTextApproval = "Send For Booking Approval";
            activityTemplateBookingCtrl.ePage.Masters.IsDisableCompleteBtnVerified = false;
            activityTemplateBookingCtrl.ePage.Masters.CompleteBtnTextVerified = "Booking Verified";
            activityTemplateBookingCtrl.ePage.Masters.IsDisableCompleteBtnApproved = false;
            activityTemplateBookingCtrl.ePage.Masters.CompleteBtnTextApproved = "Approve Booking";
            activityTemplateBookingCtrl.ePage.Masters.IsDisableCompleteBtnRejected = false;
            activityTemplateBookingCtrl.ePage.Masters.CompleteBtnTextRejected = "Reject Booking";
            activityTemplateBookingCtrl.ePage.Masters.IsDisableCompleteBtnConfirmed = false;
            activityTemplateBookingCtrl.ePage.Masters.CompleteBtnTextConfirmed = "Confirm Booking";
            activityTemplateBookingCtrl.ePage.Masters.TaskSave = TaskSave;

            if (activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
            console.log(activityTemplateBookingCtrl.ePage.Masters.TaskObj)
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (activityTemplateBookingCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = activityTemplateBookingCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": activityTemplateBookingCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    activityTemplateBookingCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = activityTemplateBookingCtrl.ePage.Masters.TaskConfigData;
                    activityTemplateBookingCtrl.ePage.Masters.MenuListSource = $filter('filter')(activityTemplateBookingCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });

                    activityTemplateBookingCtrl.ePage.Masters.ValidationSource = $filter('filter')(activityTemplateBookingCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Validation'
                    });
                    if (activityTemplateBookingCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    activityTemplateBookingCtrl.ePage.Masters.DocumentValidation = $filter('filter')(activityTemplateBookingCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    console.log(activityTemplateBookingCtrl.ePage.Masters.ValidationSource)
                    console.log(activityTemplateBookingCtrl.ePage.Masters.DocumentValidation)
                    console.log(activityTemplateBookingCtrl.ePage.Masters.TaskConfigData)
                    if (activityTemplateBookingCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    activityTemplateBookingCtrl.ePage.Masters.MenuObj = activityTemplateBookingCtrl.taskObj;
                    activityTemplateBookingCtrl.ePage.Masters.MenuObj.TabTitle = activityTemplateBookingCtrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            activityTemplateBookingCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        activityTemplateBookingCtrl.ePage.Masters.EntityObj = response.data.Response;
                        activityTemplateBookingCtrl.ePage.Entities.Header.Data = activityTemplateBookingCtrl.ePage.Masters.EntityObj;
                        GetPackageList();
                        getTaskConfigData();
                    }
                });
            }
        }

        // package list details
        function GetPackageList() {
            var _filter = {
                SHP_FK: activityTemplateBookingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            var _isExist = activityTemplateBookingCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                                return value1.PK === value.PK;
                            });

                            if (!_isExist) {
                                activityTemplateBookingCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                            }
                            activityTemplateBookingCtrl.currentShipment = {
                                [activityTemplateBookingCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo]: {
                                    ePage: {
                                        Entities: {
                                            Header: {
                                                Data: activityTemplateBookingCtrl.ePage.Entities.Header.Data
                                            }
                                        }
                                    }
                                },
                                label: activityTemplateBookingCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                                code: activityTemplateBookingCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                                isNew: false
                            };
                        });
                    } else {
                        activityTemplateBookingCtrl.currentShipment = {
                            [activityTemplateBookingCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo]: {
                                ePage: {
                                    Entities: {
                                        Header: {
                                            Data: activityTemplateBookingCtrl.ePage.Entities.Header.Data
                                        }
                                    }
                                }
                            },
                            label: activityTemplateBookingCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                            code: activityTemplateBookingCtrl.ePage.Masters.EntityObj.UIShipmentHeader.ShipmentNo,
                            isNew: false
                        };
                    }
                    myTaskActivityConfig.Entities.Shipment = activityTemplateBookingCtrl.currentShipment;
                }
            });
        }

        function SaveEntity(type) {
            var btnCopy = angular.copy(activityTemplateBookingCtrl.ePage.Masters["CompleteBtnText" + type])
            var btnDisableCopy = angular.copy(activityTemplateBookingCtrl.ePage.Masters["IsDisableCompleteBtn" + type])
            activityTemplateBookingCtrl.ePage.Masters["CompleteBtnText" + type] = "Please Wait...";
            activityTemplateBookingCtrl.ePage.Masters["IsDisableCompleteBtn" + type] = true;
            activityTemplateBookingCtrl.ePage.Masters.IsDisableAllBtn = true
            var _input = angular.copy(activityTemplateBookingCtrl.ePage.Masters.EntityObj);
            switch (type) {
                case "Approval":
                    _input.UIShpExtendedInfo.IsQBApprovalRequired = true;
                    _input.UIShpExtendedInfo.IsQBVerificationRequired = false;
                    break;
                case "Verified":
                    _input.UIShpExtendedInfo.IsQBApprovalRequired = false;
                    _input.UIShpExtendedInfo.IsQBVerificationRequired = false;
                    _input.UIShipmentHeader.IsBooking = false;
                    break;
                case "Approved":
                    _input.UIShpExtendedInfo.IsApproved = true;
                    break;
                case "Confirmed":
                    _input.UIShpExtendedInfo.IsQBApprovalRequired = false;
                    _input.UIShpExtendedInfo.IsQBVerificationRequired = false;
                    _input.UIShipmentHeader.IsBooking = false;
                    break;
                default:
                    break;
            }
            _input.UIShpExtendedInfo.IsModified = true;
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.Booking.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                    SaveOnly().then(function (response) {
                        if (response.data.Status == "Success") {
                            toastr.success("Task Completed Successfully...!");
                            var _data = {
                                IsCompleted: true,
                                Item: activityTemplateBookingCtrl.ePage.Masters.TaskObj
                            };

                            activityTemplateBookingCtrl.onComplete({
                                $item: _data
                            });
                        } else {
                            toastr.error("Task Completion Failed...!");
                        }
                        console.log(type)
                        activityTemplateBookingCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        activityTemplateBookingCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    });
                } else {
                    activityTemplateBookingCtrl.ePage.Masters["CompleteBtnText" + type] = btnCopy;
                    activityTemplateBookingCtrl.ePage.Masters["IsDisableCompleteBtn" + type] = btnDisableCopy;
                    activityTemplateBookingCtrl.ePage.Masters.IsDisableAllBtn = false
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": activityTemplateBookingCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": activityTemplateBookingCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            activityTemplateBookingCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": activityTemplateBookingCtrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": activityTemplateBookingCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": activityTemplateBookingCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": activityTemplateBookingCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            activityTemplateBookingCtrl.ePage.Masters.StandardConfigInput = {
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

            activityTemplateBookingCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (activityTemplateBookingCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTaskEdit"],
                    Code: [activityTemplateBookingCtrl.taskObj.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "BKG",
                        SubModuleCode: "BKG",
                    },
                    GroupCode: activityTemplateBookingCtrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: activityTemplateBookingCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (activityTemplateBookingCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTaskEdit"],
                    Code: [activityTemplateBookingCtrl.taskObj.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "SHP",
                        SubModuleCode: "SHP"
                    },
                    GroupCode: "Document",
                    EntityObject: activityTemplateBookingCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete(type) {
            if (activityTemplateBookingCtrl.ePage.Masters.ValidationSource.length > 0 || activityTemplateBookingCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (activityTemplateBookingCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTaskEdit"],
                        Code: [activityTemplateBookingCtrl.taskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "BKG",
                            SubModuleCode: "BKG",
                        },
                        GroupCode: activityTemplateBookingCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: activityTemplateBookingCtrl.ePage.Masters.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (activityTemplateBookingCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (activityTemplateBookingCtrl.ePage.Masters.docTypeSource.length == 0 || activityTemplateBookingCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            activityTemplateBookingCtrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            activityTemplateBookingCtrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTaskEdit"],
                            Code: [activityTemplateBookingCtrl.taskObj.PSI_InstanceNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "SHP",
                                SubModuleCode: "SHP",
                            },
                            GroupCode: "Document",
                            EntityObject: activityTemplateBookingCtrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTaskEdit.Entity[activityTemplateBookingCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (activityTemplateBookingCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(activityTemplateBookingCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(activityTemplateBookingCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        activityTemplateBookingCtrl.ePage.Masters.ShowErrorWarningModal(activityTemplateBookingCtrl.taskObj.PSI_InstanceNo);
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
            if (typeof activityTemplateBookingCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                activityTemplateBookingCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(activityTemplateBookingCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            activityTemplateBookingCtrl.ePage.Masters.docTypeSource = $filter('filter')(activityTemplateBookingCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(activityTemplateBookingCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": activityTemplateBookingCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": activityTemplateBookingCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": activityTemplateBookingCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (activityTemplateBookingCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(activityTemplateBookingCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            activityTemplateBookingCtrl.ePage.Masters.SaveBtnText = "Please Wait...";
            activityTemplateBookingCtrl.ePage.Masters.IsDisableSaveBtn = true;
            SaveEntity();
        }

        function CompleteWithSave(type) {
            SaveEntity(type);
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();