(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplateOrderController", ActivityTemplateOrderController);

    ActivityTemplateOrderController.$inject = ["$q", "$scope", "$filter", "$timeout", "helperService", "APP_CONSTANT", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig"];

    function ActivityTemplateOrderController($q, $scope, $filter, $timeout, helperService, APP_CONSTANT, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig) {
        var ActivityTemplateOrderCtrl = this;

        function Init() {
            ActivityTemplateOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template_Order",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplateOrderCtrl.ePage.Masters.emptyText = "-";
            ActivityTemplateOrderCtrl.ePage.Masters.TaskObj = ActivityTemplateOrderCtrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplateOrderCtrl.taskObj;
            ActivityTemplateOrderCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            ActivityTemplateOrderCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            // DatePicker
            ActivityTemplateOrderCtrl.ePage.Masters.DatePicker = {};
            ActivityTemplateOrderCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplateOrderCtrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplateOrderCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplateOrderCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplateOrderCtrl.ePage.Masters.SaveBtnText = "Save & Complete";
            ActivityTemplateOrderCtrl.ePage.Masters.TaskSave = Complete;
            ActivityTemplateOrderCtrl.ePage.Masters.OnComplete = OnMailSucces;

            if (ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }

        function GetEntityObj() {
            if (ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateOrderCtrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplateOrderCtrl.ePage.Entities.Header.Data = ActivityTemplateOrderCtrl.ePage.Masters.EntityObj;
                        ActivityTemplateOrderCtrl.currentOrder = {
                            [response.data.Response.UIOrder_Buyer.OrderNo]: {
                                ePage: {
                                    Entities: {
                                        Header: {
                                            Data: ActivityTemplateOrderCtrl.ePage.Entities.Header.Data
                                        }
                                    }
                                }
                            },
                            label: response.data.Response.UIOrder_Buyer.OrderNo,
                            code: response.data.Response.UIOrder_Buyer.OrderNo,
                            isNew: false
                        };
                        myTaskActivityConfig.Entities.Order = ActivityTemplateOrderCtrl.currentOrder;
                        // GetTaskConfigData();
                        if (ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepCode) {
                            switch (ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepCode) {
                                case "ORD_CONFIRM_BUYER_ORC":
                                    GetTaskConfigData();
                                    break;
                                case "SFU_MAIL_BUYER_ORC":
                                    GetTaskConfigData();
                                    ActivityTemplateOrderCtrl.ePage.Masters.IsEnableBtn = true;
                                    ActivityTemplateOrderCtrl.ePage.Masters.IsFollowUpBtn = true;
                                    ActivityTemplateOrderCtrl.ePage.Masters.MailBtn = "Send Follow Up Mail";
                                    var _entitySource = "SFU",
                                        _templateObjDesc = "Order Summary Report",
                                        _templateObjKey = "OrderSummaryReport",
                                        _subjectSource = "Follow-up for PO's of -";
                                    MailInput(_subjectSource, _entitySource, _templateObjDesc, _templateObjKey);
                                    MailList(_entitySource);
                                    break;
                                case "CRD_UPDATE_BUYER_ORC":
                                    GetTaskConfigData('CRD');
                                    break;
                                case "VESSEL_PLAN_BUYER_ORC":
                                    GetTaskConfigData();
                                    ActivityTemplateOrderCtrl.ePage.Masters.IsEnableBtn = true;
                                    ActivityTemplateOrderCtrl.ePage.Masters.IsPreAdviceBtn = true;
                                    ActivityTemplateOrderCtrl.ePage.Masters.MailBtn = "Shipment Pre-Advice Mail";
                                    MailList();
                                    break;
                                case "CONVERT_BOOKING_BUYER_ORC":
                                    GetTaskConfigData();
                                    break;
                                default:
                                    ActivityTemplateOrderCtrl.ePage.Masters.IsEnableBtn = false;
                                    break;
                            }
                        }
                    }
                });
            }
        }

        function MailInput(_subjectSource, _entitySource, _templateObjDesc, _templateObjKey) {
            ActivityTemplateOrderCtrl.ePage.Masters.Input = {
                "EntityRefKey": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntitySource": _entitySource,
                "EntityRefCode": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.KeyReference,
                "Communication": null,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "RowObj": [ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.UIOrder_Buyer]
            }
            var _subject = _subjectSource + ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Buyer + " to " + ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.Supplier;
            ActivityTemplateOrderCtrl.ePage.Masters.MailObj = {
                Subject: _subject,
                Template: _templateObjKey,
                TemplateObj: {
                    Key: _templateObjKey,
                    Description: _templateObjDesc
                }
            };
        }
        // To get task configuration 
        function GetTaskConfigData(type) {
            var EEM_Code_3;
            if (type) {
                EEM_Code_3 = authService.getUserInfo().RoleCode + "_DEFAULT";
            } else if (ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.Custom_CodeXI && !EEM_Code_3) {
                EEM_Code_3 = ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            } else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplateOrderCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplateOrderCtrl.ePage.Masters.TaskConfigData;
                    ActivityTemplateOrderCtrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplateOrderCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });
                    ActivityTemplateOrderCtrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplateOrderCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Validation'
                    });
                    if (ActivityTemplateOrderCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplateOrderCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'DocumentValidation'
                    });
                    if (ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplateOrderCtrl.ePage.Masters.MenuObj = ActivityTemplateOrderCtrl.taskObj;
                    ActivityTemplateOrderCtrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplateOrderCtrl.taskObj.KeyReference;
                }
            });
        }

        function StandardMenuConfig() {
            ActivityTemplateOrderCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplateOrderCtrl.ePage.Masters.StandardConfigInput = {
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

            ActivityTemplateOrderCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplateOrderCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function ValidationFindall() {
            if (ActivityTemplateOrderCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTaskEdit"],
                    Code: [ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "ORD",
                        SubModuleCode: "ORD",
                    },
                    GroupCode: ActivityTemplateOrderCtrl.ePage.Masters.ValidationSource[0].Code,
                    // RelatedBasicDetails: [{
                    //     "UIField": "TEST",
                    //     "DbField": "TEST",
                    //     "Value": "TEST"
                    // }],
                    EntityObject: ActivityTemplateOrderCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplateOrderCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTaskEdit"],
                    Code: [ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "ORD",
                        SubModuleCode: "ORD"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplateOrderCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            ActivityTemplateOrderCtrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplateOrderCtrl.ePage.Masters.SaveBtnText = "Please wait...";
            if (ActivityTemplateOrderCtrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplateOrderCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTaskEdit"],
                        Code: [ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "ORD",
                            SubModuleCode: "ORD",
                        },
                        GroupCode: ActivityTemplateOrderCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: ActivityTemplateOrderCtrl.ePage.Masters.EntityObj
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplateOrderCtrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplateOrderCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            ActivityTemplateOrderCtrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplateOrderCtrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTaskEdit"],
                            Code: [ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "ORD",
                                SubModuleCode: "ORD",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplateOrderCtrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTaskEdit.Entity[ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplateOrderCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplateOrderCtrl.ePage.Masters.IsDisableSaveBtn = false;
                        ActivityTemplateOrderCtrl.ePage.Masters.SaveBtnText = "Save & Complete";
                        ActivityTemplateOrderCtrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateOrderCtrl.taskObj.PSI_InstanceNo);
                    } else {
                        CompleteWithSave();
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }

        function SaveEntity() {
            var deferred = $q.defer();
            var _input = angular.copy(ActivityTemplateOrderCtrl.ePage.Masters.EntityObj);
            (_input.Comments) ? _input.UIOrder_Buyer.Comments = _input.Comments: false;
            _input.UIOrder_Buyer.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (_input.Comments) {
                        JobCommentInsert(_input).then(function (response) {
                            if (response.data.Status == "Success") {} else {
                                toastr.error("Save Failed...");
                            }
                        });
                    }
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...!");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function JobCommentInsert(data) {
            var deferred = $q.defer();
            var _jobCommentsArray = [];
            var _jobCommentsInput = {
                "PK": "",
                "EntityRefKey": data.PK,
                "EntitySource": "CRD",
                "Comments": data.Comments
            }
            _jobCommentsArray.push(_jobCommentsInput);
            // job comments api call
            if (_jobCommentsArray.length > 0) {
                apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, _jobCommentsArray).then(function (response) {
                    if (response.data.Response) {
                        deferred.resolve(response);
                    } else {
                        toastr.error("Save Failed...");
                        deferred.reject('failed');
                    }
                });
                return deferred.promise;
            }
        }

        function CrdComplete() {
            var _inputObj = {
                "EntityRefCode": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefCode,
                "EntityRefKey": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntitySource": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntitySource,
                "CompleteInstanceNo": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post("eAxisAPI", appConfig.Entities.BuyerOrder.API.closecrd.Url, _inputObj).then(function (response) {
                toastr.success("Successfully saved...");
                var _data = {
                    IsCompleted: true,
                    Item: ActivityTemplateOrderCtrl.ePage.Masters.TaskObj
                };

                ActivityTemplateOrderCtrl.onComplete({
                    $item: _data
                });
                ActivityTemplateOrderCtrl.ePage.Masters.UpdateBtn = "Save & Complete";
                ActivityTemplateOrderCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplateOrderCtrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplateOrderCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplateOrderCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplateOrderCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplateOrderCtrl.ePage.Masters.docTypeSource, 'DocType');
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

        function CompleteWithSave() {
            SaveEntity().then(function (response) {
                if (response.data.Status == "Success") {
                    var _input = angular.copy(ActivityTemplateOrderCtrl.ePage.Masters.EntityObj);
                    if (!_input.Comments) {
                        SaveOnly().then(function (response) {
                            if (response.data.Status == "Success") {
                                ActivityTemplateOrderCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                ActivityTemplateOrderCtrl.ePage.Masters.SaveBtnText = "Save & Complete";
                                toastr.success("Task Completed Successfully...!");
                                var _data = {
                                    IsCompleted: true,
                                    Item: ActivityTemplateOrderCtrl.ePage.Masters.TaskObj
                                };

                                ActivityTemplateOrderCtrl.onComplete({
                                    $item: _data
                                });
                            } else {
                                toastr.error("Task Completion Failed...!");
                                ActivityTemplateOrderCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                ActivityTemplateOrderCtrl.ePage.Masters.SaveBtnText = "Save & Complete";
                            }
                        });
                    } else {
                        CrdComplete();
                        toastr.success("Task Completed Successfully...!");
                        var _data = {
                            IsCompleted: true,
                            Item: ActivityTemplateOrderCtrl.ePage.Masters.TaskObj
                        };

                        ActivityTemplateOrderCtrl.onComplete({
                            $item: _data
                        });
                    }

                } else {
                    toastr.error("Task Completion Failed...!");
                    ActivityTemplateOrderCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    ActivityTemplateOrderCtrl.ePage.Masters.SaveBtnText = "Save & Complete";
                }
            });
        }

        function OnMailSucces(type) {
            if (type == 'SFU') {
                var _input = FollowUpInput();
            } else {
                var _input = PreAdviceInput();
            }

            apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.updaterecords.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (type == 'SFU') {
                        CargoReadyTaskActive();
                    } else {
                        BookingtaskActive();
                    }
                    MailList();
                } else {
                    toastr.error("Failed...");
                }
            });
        }

        function CargoReadyTaskActive() {
            var _inputObj = {
                "EntityRefCode": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefCode,
                "EntityRefKey": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey,
                // "EntitySource": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntitySource,
                // "CompleteInstanceNo": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                // "CompleteStepNo": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.activatecrd.Url, _inputObj).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Mail sent successfully...");
                } else {
                    toastr.error("Failed...");
                }
            });
        }

        function BookingtaskActive() {
            var _inputObj = {
                "EntityRefCode": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefCode,
                "EntityRefKey": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey,
                // "EntitySource": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntitySource,
                // "CompleteInstanceNo": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                // "CompleteStepNo": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.WSI_StepNo
            }
            apiService.post('eAxisAPI', appConfig.Entities.BuyerOrder.API.activatecrd.Url, _inputObj).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Mail sent successfully...");
                } else {
                    toastr.error("Failed...");
                }
            });
        }

        function FollowUpInput() {
            var _updateInput = [];
            var _tempObj = {
                "EntityRefPK": ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK,
                "Properties": [{
                        "PropertyName": "POH_FollowUpSentDate",
                        "PropertyNewValue": new Date()
                    },
                    {
                        "PropertyName": "POH_IsFollowUpMailSent",
                        "PropertyNewValue": true
                    }, {
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "FLS"
                    }
                ]
            };
            _updateInput.push(_tempObj);
            return _updateInput;
        }

        function PreAdviceInput() {
            var _updateInput = [];
            var _tempObj = {
                "EntityRefPK": ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.UIOrder_Buyer.PK,
                "Properties": [
                    // {
                    //     "PropertyName": "POH_PreAdviceSentDate",
                    //     "PropertyNewValue": new Date()
                    // },
                    {
                        "PropertyName": "POH_IsPreadviceMailSent",
                        "PropertyNewValue": true
                    }, {
                        "PropertyName": "POH_OrderStatus",
                        "PropertyNewValue": "PAC"
                    }
                ]
            };
            _updateInput.push(_tempObj);
            return _updateInput;
        }

        function MailList(_entitySource) {
            var _filter = {
                "EntitySource": _entitySource,
                "EntityRefKey": ActivityTemplateOrderCtrl.ePage.Masters.TaskObj.EntityRefKey
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobEmail.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobEmail.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.MailHistory = response.data.Response;
                } else {
                    ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.MailHistory = [];
                }
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        $scope.$watch('ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.VesselPlanningGrid', function (newValue, oldValue) {
            if (ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.VesselPlanningGrid) {
                (ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.VesselPlanningGrid.length > 0) ? VesselVerify(ActivityTemplateOrderCtrl.ePage.Entities.Header.Data.VesselPlanningGrid): ActivityTemplateOrderCtrl.ePage.Masters.IsDisabledSend = false;
            }
        }, true);

        function VesselVerify(list) {
            for (var i = 0; i < list.length; i++) {
                if (EmptyOrNullCheck(list[i].CarrierOrg_Code) || EmptyOrNullCheck(list[i].Vessel)) {
                    ActivityTemplateOrderCtrl.ePage.Masters.IsDisabledSend = false;
                    return false;
                }
                if (EmptyOrNullCheck(list[i].LoadPort) || EmptyOrNullCheck(list[i].DischargePort)) {
                    ActivityTemplateOrderCtrl.ePage.Masters.IsDisabledSend = false;
                    return false;
                }
                if (EmptyOrNullCheck(list[i].ETA) || EmptyOrNullCheck(list[i].ETD)) {
                    ActivityTemplateOrderCtrl.ePage.Masters.IsDisabledSend = false;
                    return false;
                }
                if (EmptyOrNullCheck(list[i].BookingCutOffDate) || EmptyOrNullCheck(list[i].CargoCutOffDate)) {
                    ActivityTemplateOrderCtrl.ePage.Masters.IsDisabledSend = false;
                    return false;
                }
                if (EmptyOrNullCheck(list[i].VoyageFlight)) {
                    ActivityTemplateOrderCtrl.ePage.Masters.IsDisabledSend = false;
                    return false;
                }
            }
            ActivityTemplateOrderCtrl.ePage.Masters.IsDisabledSend = true;
            var _entitySource = "SPA",
                _templateObjDesc = "Order Pre-Advice",
                _templateObjKey = "Report3",
                _subjectSource = "Shipment Pre-Advice Notice -";
            MailInput(_subjectSource, _entitySource, _templateObjDesc, _templateObjKey);
        }

        function EmptyOrNullCheck(val) {
            if (val == "" || val == null || val == undefined)
                return true;
            else
                return false;
        }

        Init();
    }
})();