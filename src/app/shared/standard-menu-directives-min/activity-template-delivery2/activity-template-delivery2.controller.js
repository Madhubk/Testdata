(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplateDelivery2Controller", ActivityTemplateDelivery2Controller);

    ActivityTemplateDelivery2Controller.$inject = ["$rootScope", "helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout", "deliveryConfig"];

    function ActivityTemplateDelivery2Controller($rootScope, helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout, deliveryConfig) {
        var ActivityTemplateDelivery2Ctrl = this;

        function Init() {
            ActivityTemplateDelivery2Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template_Delivery_Request",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplateDelivery2Ctrl.ePage.Masters.emptyText = "-";
            ActivityTemplateDelivery2Ctrl.ePage.Masters.Config = myTaskActivityConfig;
            myTaskActivityConfig.Entities = {};
            ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj = ActivityTemplateDelivery2Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplateDelivery2Ctrl.taskObj;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.Complete = Complete;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            errorWarningService.Modules = {};

            // DatePicker
            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker = {};
            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.CompleteBtnText = "Complete";

            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Save";
            ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveEntity = SaveEntity;

            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData;
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.MenuObj = ActivityTemplateDelivery2Ctrl.taskObj;
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplateDelivery2Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplateDelivery2Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data = ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj;

                        if (ActivityTemplateDelivery2Ctrl.tabObj) {
                            ActivityTemplateDelivery2Ctrl.currentDelivery = ActivityTemplateDelivery2Ctrl.tabObj;
                            myTaskActivityConfig.Entities.Delivery = ActivityTemplateDelivery2Ctrl.currentDelivery;
                            getTaskConfigData();
                        } else {
                            deliveryConfig.TabList = [];
                            deliveryConfig.GetTabDetails(ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsDelivery, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID) {
                                        ActivityTemplateDelivery2Ctrl.currentDelivery = value;
                                        myTaskActivityConfig.Entities.Delivery = ActivityTemplateDelivery2Ctrl.currentDelivery;
                                        getTaskConfigData();
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }

        function SaveEntity(callback) {
            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Please Wait..";
            if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Create Delivery Challan") {
                if (myTaskActivityConfig.CallEntity == true) {
                    $rootScope.SaveOutwardFromTask(function (response) {
                        if (response == "error") {
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Save";
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                        } else {
                            saves(callback);
                        }
                    });
                } else {
                    saves(callback);
                }
            } else if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Acknowledge Delivery Request") {
                var _Data = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities,
                    _input = _Data.Header.Data,
                    _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
                deliveryConfig.GeneralValidation(myTaskActivityConfig.Entities.Delivery);
                if (ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask) {
                    if (ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity) {
                        ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity = {
                            [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID]: {
                                GlobalErrorWarningList: _errorcount
                            }
                        };
                    } else {
                        ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity = {
                            [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID]: {
                                GlobalErrorWarningList: []
                            }
                        };
                        ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity[ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID].GlobalErrorWarningList = _errorcount;
                    }
                } else {
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask = {};
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity = {
                        [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID]: {
                            GlobalErrorWarningList: []
                        }
                    };
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity[ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID].GlobalErrorWarningList = _errorcount;
                }

                if (_errorcount.length == 0) {
                    if (callback) {
                        if (!myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AcknowledgementDateTime)
                            myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                        if (!myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AcknowledgedPerson)
                            myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;
                        if (!myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AdditionalRef2Code)
                            myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AdditionalRef2Code = authService.getUserInfo().UserId;
                        if (!myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.DeliveryRequestedDateTime)
                            myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.DeliveryRequestedDateTime = new Date();

                        angular.forEach(myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                            if (value.UISPMSDeliveryReport) {
                                value.UISPMSDeliveryReport.AcknowledgedPerson = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AcknowledgedPerson;
                                value.UISPMSDeliveryReport.CSRReceiver = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AdditionalRef2Code;
                                value.UISPMSDeliveryReport.AcknowledgedDateTime = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AcknowledgementDateTime;
                                value.UISPMSDeliveryReport.RequestedDateTime = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.DeliveryRequestedDateTime;
                            }
                            var _filter = {
                                "DeliveryLine_FK": value.PK
                            };
                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": appConfig.Entities.WmsDeliveryReport.API.FindAll.FilterID
                            };

                            apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryReport.API.FindAll.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    if (response.data.Response.length > 0) {
                                        response.data.Response[0].IsModified = true;
                                        response.data.Response[0].AcknowledgedPerson = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AcknowledgedPerson;
                                        response.data.Response[0].CSRReceiver = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AdditionalRef2Code;
                                        response.data.Response[0].AcknowledgedDateTime = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.AcknowledgementDateTime;
                                        response.data.Response[0].RequestedDateTime = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.DeliveryRequestedDateTime;
                                        apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryReport.API.Update.Url, response.data.Response[0]).then(function (response) {
                                            if (response.data.Response) {
                                                console.log("Delivery Report Updated for " + response.data.Response.DeliveryLineRefNo);
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }
                    saves(callback);
                } else {
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Save";
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateDelivery2Ctrl.taskObj.PSI_InstanceNo);
                }
            } else {
                saves(callback);
            }
        }

        function saves(callback) {
            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Please Wait..";
            if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Create Delivery Challan") {
                if (callback) {
                    myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatus = "DIP";
                    angular.forEach(myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                        value.WorkOrderLineStatus = "DIP";
                        if (value.UISPMSDeliveryReport)
                            value.UISPMSDeliveryReport.DeliveryLineStatus = "Delivery In Progress";
                    });
                    myTaskActivityConfig.CallEntity = false;
                }
            }
            var _input = angular.copy(myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data);
            _input = filterObjectUpdate(_input, "IsModified");
            apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + response.data.Response.UIWmsDelivery.PK).then(function (response) {
                        if (response.data.Response) {
                            myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data = response.data.Response;
                            if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Create Delivery Challan") {
                                if (callback) {
                                    angular.forEach(myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIvwWmsDeliveryList, function (value, key) {
                                        var _filter = {
                                            "DeliveryLine_FK": value.DL_PK
                                        };
                                        var _input = {
                                            "searchInput": helperService.createToArrayOfObject(_filter),
                                            "FilterID": appConfig.Entities.WmsDeliveryReport.API.FindAll.FilterID
                                        };

                                        apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryReport.API.FindAll.Url, _input).then(function (response) {
                                            if (response.data.Response) {
                                                if (response.data.Response.length > 0) {
                                                    response.data.Response[0].IsModified = true;
                                                    response.data.Response[0].DEL_MTR_OUT_RefNo = value.MOT_WorkOrderId;
                                                    response.data.Response[0].DEL_MTR_OUT_Fk = value.MOT_WorkOrderPk;
                                                    response.data.Response[0].DEL_MTR_FromWH_Fk = value.MOT_WOD_WAR_FK;
                                                    response.data.Response[0].DEL_MTR_ToWH_Fk = value.MOT_WOD_TransferTo_WAR_FK;
                                                    response.data.Response[0].DEL_MTR_FromWH_Code = value.MOT_WAR_Code;
                                                    response.data.Response[0].DEL_MTR_ToWH_Code = value.MOT_WOD_TransferTo_WAR_Code;
                                                    response.data.Response[0].DEL_MTR_FromWH_Name = value.MOT_WAR_Name;
                                                    response.data.Response[0].DEL_MTR_ToWH_Name = value.MOT_WOD_TransferTo_WAR_Name;
                                                    response.data.Response[0].DEL_MTR_OUT_ExternalRefNumber = value.MOT_ExternalReference;
                                                    response.data.Response[0].DEL_MTR_CustomerReference = value.MOT_CustomerReference;
                                                    response.data.Response[0].DEL_MTR_OL_Fk = value.MOL_Pk;
                                                    response.data.Response[0].DEL_MTR_OUT_CreatedDateTime = value.MOT_CreatedDateTime;
                                                    response.data.Response[0].DEL_OUT_RefNo = value.OUT_WorkOrderId;
                                                    response.data.Response[0].DEL_OOU_Fk = value.OUT_WorkOrderPk;
                                                    response.data.Response[0].DEL_OUT_ExternalRefNumber = value.OUT_ExternalReference;
                                                    response.data.Response[0].DEL_OUT_CustomerReference = value.OUT_CustomerReference;
                                                    response.data.Response[0].DEL_OUT_CreatedDateTime = value.OUT_CreatedDateTime;                                                    
                                                    response.data.Response[0].ChallanDate = value.DEL_OUT_RequiredDate;
                                                    response.data.Response[0].DEL_OL_Fk = value.OL_Pk;
                                                    response.data.Response[0].DEL_OL_Product_Fk = value.OL_PrdPk;
                                                    response.data.Response[0].DEL_OL_ProductCode = value.OL_PrdCode;
                                                    response.data.Response[0].DEL_OL_ProductDesc = value.OL_PrdDesc;
                                                    response.data.Response[0].StatusCode = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatus;
                                                    response.data.Response[0].StatusDesc = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatusDesc;

                                                    apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryReport.API.Update.Url, response.data.Response[0]).then(function (response) {
                                                        if (response.data.Response) {
                                                            console.log("Delivery Report Updated for " + response.data.Response.DeliveryLineRefNo);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                            ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data;
                            ActivityTemplateDelivery2Ctrl.currentDelivery = {
                                [myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID]: {
                                    ePage: {
                                        Entities: {
                                            Header: {
                                                Data: ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data
                                            }
                                        }
                                    }
                                },
                                label: myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID,
                                code: myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID,
                                isNew: false
                            };

                            myTaskActivityConfig.Entities.Delivery = ActivityTemplateDelivery2Ctrl.currentDelivery;
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.Config.IsReload = true;
                            toastr.success("Delivery Saved Successfully...!");
                            if (callback) {
                                if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Acknowledge Delivery Request") {

                                    var DeliveryTime;
                                    if (ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.ResponseType == "NR") {
                                        DeliveryTime = 8;
                                    } else if (ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.ResponseType == "QR") {
                                        DeliveryTime = 4;
                                    } else if (ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.ResponseType == "CR") {
                                        DeliveryTime = 2;
                                    }

                                    var temp = "";
                                    angular.forEach(ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                                        temp = temp + "\n " + value.ProductCode + "\xa0\xa0\xa0" + value.Units + "\xa0\xa0\xa0" + value.StockKeepingUnit + "\n";
                                    });

                                    var _smsInput = {
                                        "MobileNo": myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data.UIWmsWorkorderReport.RequesterContactNo,
                                        "Message": "Dear " + ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester + "," + "\nWe received your request to deliver below products to Dhaka. Your delivery reference no: " + ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + ".\n" + temp + "\nThis will be delivered with in next " + DeliveryTime + " hours.Thank you."
                                    }
                                    apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                    });

                                    if (deliveryConfig.Entities.ClientContact.length > 0) {
                                        var _smsInput = {
                                            "MobileNo": deliveryConfig.Entities.ClientContact[0].Mobile,
                                            "Message": "Dear " + ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester + "," + "\nWe received your request to deliver below products to Dhaka. Your delivery reference no: " + ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + ".\n" + temp + "\nThis will be delivered with in next " + DeliveryTime + " hours.Thank you."
                                        }
                                        apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                        });
                                    }
                                    if (deliveryConfig.Entities.WarehouseContact.length > 0) {
                                        var _smsInput = {
                                            "MobileNo": deliveryConfig.Entities.WarehouseContact[0].Mobile,
                                            "Message": "Dear " + ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester + "," + "\nWe received your request to deliver below products to Dhaka. Your delivery reference no: " + ActivityTemplateDelivery2Ctrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + ".\n" + temp + "\nThis will be delivered with in next " + DeliveryTime + " hours.Thank you."
                                        }
                                        apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                        });
                                    }
                                }
                                callback();
                            }
                        }
                    });
                } else {
                    toastr.error("Save Failed...!");
                    if (callback)
                        callback();
                }
                ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                ActivityTemplateDelivery2Ctrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            ActivityTemplateDelivery2Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntityRefKey": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplateDelivery2Ctrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                IsDisableCount: true,
            };

            ActivityTemplateDelivery2Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "DEL",
                    },
                    GroupCode: ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj) {
                errorWarningService.Modules = {};
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "DEL"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplateDelivery2Ctrl.taskObj.WSI_StepName == "Create Delivery Challan") {
                    var input = myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data
                    var temp = 0;
                    angular.forEach(input.UIvwWmsDeliveryList, function (value, key) {
                        if (value.OL_PrdCode || value.MOL_PrdCode) {
                            temp = temp + 1;
                        }
                    });
                    if (temp == input.UIvwWmsDeliveryList.length) {
                        input.IsComplete = true;
                    }
                }
                if (ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "WMS",
                            SubModuleCode: "DEL",
                        },
                        GroupCode: ActivityTemplateDelivery2Ctrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: myTaskActivityConfig.Entities.Delivery[myTaskActivityConfig.Entities.Delivery.label].ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource.length == response.length) {
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "WMS",
                                SubModuleCode: "DEL",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplateDelivery2Ctrl.ePage.Masters.EntityObj.UIWmsDelivery.WorkOrderID].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplateDelivery2Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateDelivery2Ctrl.taskObj.PSI_InstanceNo);
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
            if (typeof ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplateDelivery2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplateDelivery2Ctrl.ePage.Masters.docTypeSource, 'DocType');
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
            ActivityTemplateDelivery2Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity(function () {
                SaveOnly().then(function (response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Task Completed Successfully...!");
                        var _data = {
                            IsCompleted: true,
                            Item: ActivityTemplateDelivery2Ctrl.ePage.Masters.TaskObj
                        };

                        ActivityTemplateDelivery2Ctrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ActivityTemplateDelivery2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                });
            });
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
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

        Init();
    }
})();