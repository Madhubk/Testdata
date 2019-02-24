(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplateOutward2Controller", ActivityTemplateOutward2Controller);

    ActivityTemplateOutward2Controller.$inject = ["$rootScope", "helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout", "outwardConfig"];

    function ActivityTemplateOutward2Controller($rootScope, helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout, outwardConfig) {
        var ActivityTemplateOutward2Ctrl = this;

        function Init() {
            ActivityTemplateOutward2Ctrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template_Outward",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplateOutward2Ctrl.ePage.Masters.emptyText = "-";
            ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj = ActivityTemplateOutward2Ctrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplateOutward2Ctrl.taskObj;
            ActivityTemplateOutward2Ctrl.ePage.Masters.Complete = Complete;
            ActivityTemplateOutward2Ctrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            ActivityTemplateOutward2Ctrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker = {};
            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";

            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveEntity = SaveEntity;

            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData;
                    ActivityTemplateOutward2Ctrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplateOutward2Ctrl.ePage.Masters.MenuObj = ActivityTemplateOutward2Ctrl.taskObj;
                    ActivityTemplateOutward2Ctrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplateOutward2Ctrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplateOutward2Ctrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplateOutward2Ctrl.ePage.Entities.Header.Data = ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj;

                        if (ActivityTemplateOutward2Ctrl.tabObj) {
                            ActivityTemplateOutward2Ctrl.currentOutward = ActivityTemplateOutward2Ctrl.tabObj;
                            myTaskActivityConfig.Entities.Outward = ActivityTemplateOutward2Ctrl.currentOutward;
                            getTaskConfigData();
                        } else {
                            outwardConfig.TabList = [];
                            outwardConfig.GetTabDetails(ActivityTemplateOutward2Ctrl.ePage.Entities.Header.Data.UIWmsOutwardHeader, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == ActivityTemplateOutward2Ctrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID) {
                                        ActivityTemplateOutward2Ctrl.currentOutward = value;
                                        myTaskActivityConfig.Entities.Outward = ActivityTemplateOutward2Ctrl.currentOutward;
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
            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Please Wait..";
            if (ActivityTemplateOutward2Ctrl.taskObj.ProcessName == "WMS_DeliveryMaterial" || ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Transfer Material") {
                if (myTaskActivityConfig.Entities.DeliveryData) {
                    myTaskActivityConfig.Entities.DeliveryData = filterObjectUpdate(myTaskActivityConfig.Entities.DeliveryData, "IsModified");
                    apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Update.Url, myTaskActivityConfig.Entities.DeliveryData).then(function (response) {
                        if (response.data.Response) {
                            myTaskActivityConfig.Entities.DeliveryData = response.data.Response;
                            if (myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo) {
                                if (myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code) {
                                    myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data.UIWmsOutward[0] = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsOutwardHeader;
                                }
                                myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data = filterObjectUpdate(myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data, "IsModified");
                                apiService.post("eAxisAPI", appConfig.Entities.WmsPickList.API.Update.Url, myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data).then(function (response) {
                                    if (!response.data.Validations) {
                                        if (response.data.Response) {
                                            myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data = response.data.Response;
                                            $rootScope.SaveOutwardFromTask(function (response) {
                                                if (response == "error") {
                                                    ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                                                    ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
                                                    ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                                                    ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                                                } else {
                                                    apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                                                        if (response.data.Response) {
                                                            response.data.Response.UIWmsOutwardHeader.Warehouse = response.data.Response.UIWmsOutwardHeader.WarehouseCode + " - " + response.data.Response.UIWmsOutwardHeader.WarehouseName;
                                                            response.data.Response.UIWmsOutwardHeader.Client = response.data.Response.UIWmsOutwardHeader.ClientCode + " - " + response.data.Response.UIWmsOutwardHeader.ClientName;
                                                            response.data.Response.UIWmsOutwardHeader.Consignee = response.data.Response.UIWmsOutwardHeader.ConsigneeCode + " - " + response.data.Response.UIWmsOutwardHeader.ConsigneeName;
                                                            response.data.Response.UIWmsOutwardHeader.TransferWarehouse = response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Code + " - " + response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Name;
                                                            myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data = response.data.Response;
                                                            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                                                            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";

                                                            var count = 0;
                                                            if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Confirm Delivery" && callback) {
                                                                angular.forEach(response.data.Response.UIWmsWorkOrderLine, function (value, key) {
                                                                    angular.forEach(myTaskActivityConfig.Entities.DeliveryData.UIWmsDeliveryLine, function (value1, key1) {
                                                                        if (value.AdditionalRef1Code == value1.AdditionalRef1Code) {
                                                                            value1.WorkOrderLineStatus = "DEL";
                                                                            value1.UISPMSDeliveryReport.DeliveryLineStatus = "DEL";
                                                                        }
                                                                        if (value1.WorkOrderLineStatus == "DEL") {
                                                                            count = count + 1;
                                                                        }
                                                                    });
                                                                });
                                                                if (count == myTaskActivityConfig.Entities.DeliveryData.UIWmsDeliveryLine.length) {
                                                                    myTaskActivityConfig.Entities.DeliveryData.UIWmsDelivery.WorkOrderStatus = "DEL";
                                                                }
                                                                myTaskActivityConfig.Entities.DeliveryData = filterObjectUpdate(myTaskActivityConfig.Entities.DeliveryData, "IsModified");
                                                                apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.Update.Url, myTaskActivityConfig.Entities.DeliveryData).then(function (response) {
                                                                    if (response.data.Response) {
                                                                        myTaskActivityConfig.Entities.DeliveryData = response.data.Response;
                                                                    }
                                                                });
                                                            }
                                                            if (ActivityTemplateOutward2Ctrl.taskObj.ProcessName == "WMS_DeliveryMaterial" && callback) {
                                                                angular.forEach(myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                                                                    angular.forEach(myTaskActivityConfig.Entities.DeliveryData.UIWmsDeliveryLine, function (value1, key1) {
                                                                        if (value.AdditionalRef1Code == value1.AdditionalRef1Code) {
                                                                            var _filter = {
                                                                                "DeliveryLine_FK": value1.PK
                                                                            };
                                                                            var _input = {
                                                                                "searchInput": helperService.createToArrayOfObject(_filter),
                                                                                "FilterID": appConfig.Entities.WmsDeliveryReport.API.FindAll.FilterID
                                                                            };

                                                                            apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryReport.API.FindAll.Url, _input).then(function (response) {
                                                                                if (response.data.Response) {                                                                                    
                                                                                    if (response.data.Response.length > 0) {
                                                                                        response.data.Response[0].IsModified = true;
                                                                                        if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Arrange Material") {
                                                                                            angular.forEach(myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data.UIWmsPickLine, function (v, k) {
                                                                                                if (value.AdditionalRef1Code == v.AdditionalRef1Code) {
                                                                                                    response.data.Response[0].DEL_PickUDF1 = v.PartAttrib1;
                                                                                                    response.data.Response[0].DEL_PickUDF2 = v.PartAttrib2;
                                                                                                    response.data.Response[0].DEL_PickUDF3 = v.PartAttrib3;
                                                                                                }
                                                                                            });
                                                                                        } else if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Deliver Material") {
                                                                                            response.data.Response[0].ManifestNo = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.ManifestNumber;
                                                                                            response.data.Response[0].Manifest_Fk = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.PK;
                                                                                            response.data.Response[0].Consignment_Fk = myTaskActivityConfig.Entities.ManifestData.TmsManifestConsignment[0].TMC_FK;
                                                                                            response.data.Response[0].ConsignmentNumber = myTaskActivityConfig.Entities.ManifestData.TmsManifestConsignment[0].TMC_ConsignmentNumber;
                                                                                            response.data.Response[0].ManifestType = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.ManifestTypeDesc;
                                                                                            response.data.Response[0].VehicleType = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.VehicleTypeDescription;
                                                                                            response.data.Response[0].VehicleNo = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.VehicleNo;
                                                                                            response.data.Response[0].DriverName = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.DriveName;
                                                                                            response.data.Response[0].DriverContactNo = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.DriverContactNo;
                                                                                            response.data.Response[0].EstimatedDispatchDate = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.EstimatedDispatchDate;
                                                                                            response.data.Response[0].EstimatedDeliveryDate = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.EstimatedDeliveryDate;
                                                                                        } else if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Get POD and Return to Order Desk") {
                                                                                            response.data.Response[0].ManifestType = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.ManifestTypeDesc;
                                                                                            response.data.Response[0].VehicleType = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.VehicleTypeDescription;
                                                                                            response.data.Response[0].VehicleNo = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.VehicleNo;
                                                                                            response.data.Response[0].DriverName = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.DriveName;
                                                                                            response.data.Response[0].DriverContactNo = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.DriverContactNo;
                                                                                            response.data.Response[0].EstimatedDispatchDate = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.EstimatedDispatchDate;
                                                                                            response.data.Response[0].EstimatedDeliveryDate = myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.EstimatedDeliveryDate;
                                                                                            response.data.Response[0].ActualDispatchDate = myTaskActivityConfig.Entities.ManifestData.TmsManifestConsignment[0].TMC_ActualPickupDateTime;
                                                                                            response.data.Response[0].AcutalDeliveryDate = myTaskActivityConfig.Entities.ManifestData.TmsManifestConsignment[0].TMC_ActualDeliveryDateTime;
                                                                                            response.data.Response[0].Receiver = myTaskActivityConfig.Entities.DeliveryData.UIWmsWorkorderReport.Receiver;
                                                                                            response.data.Response[0].ReceiverName = myTaskActivityConfig.Entities.DeliveryData.UIWmsWorkorderReport.Receiver;
                                                                                            response.data.Response[0].ReceiverContactNumber = myTaskActivityConfig.Entities.DeliveryData.UIWmsWorkorderReport.ReceiverContactNo;
                                                                                        }
                                                                                        apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryReport.API.Update.Url, response.data.Response[0]).then(function (response) {
                                                                                            if (response.data.Response) {
                                                                                                console.log("Delivery Report Updated for " + response.data.Response.DeliveryLineRefNo);
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                });
                                                            }
                                                            if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Transfer Material" && callback) {
                                                                var _filter = {
                                                                    "WOD_Parent_FK": response.data.Response.UIWmsOutwardHeader.PK
                                                                };
                                                                var _input = {
                                                                    "searchInput": helperService.createToArrayOfObject(_filter),
                                                                    "FilterID": appConfig.Entities.InwardList.API.FindAll.FilterID
                                                                };

                                                                apiService.post("eAxisAPI", appConfig.Entities.InwardList.API.FindAll.Url, _input).then(function (response) {
                                                                    if (response.data.Response) {
                                                                        if (response.data.Response.length > 0) {
                                                                            ActivityTemplateOutward2Ctrl.ePage.Masters.InwardDetails = response.data.Response[0];
                                                                            angular.forEach(myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                                                                                angular.forEach(myTaskActivityConfig.Entities.DeliveryData.UIWmsDeliveryLine, function (value1, key1) {
                                                                                    if (value.AdditionalRef1Code == value1.AdditionalRef1Code) {
                                                                                        var _filter = {
                                                                                            "DeliveryLine_FK": value1.PK
                                                                                        };
                                                                                        var _input = {
                                                                                            "searchInput": helperService.createToArrayOfObject(_filter),
                                                                                            "FilterID": appConfig.Entities.WmsDeliveryReport.API.FindAll.FilterID
                                                                                        };

                                                                                        apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryReport.API.FindAll.Url, _input).then(function (response) {
                                                                                            if (response.data.Response) {
                                                                                                if (response.data.Response.length > 0) {
                                                                                                    response.data.Response[0].IsModified = true;
                                                                                                    response.data.Response[0].DEL_MTR_INW_RefNo = ActivityTemplateOutward2Ctrl.ePage.Masters.InwardDetails.WorkOrderID;
                                                                                                    response.data.Response[0].DEL_MTR_INW_Fk = ActivityTemplateOutward2Ctrl.ePage.Masters.InwardDetails.PK;
                                                                                                    apiService.post("eAxisAPI", appConfig.Entities.WmsDeliveryReport.API.Update.Url, response.data.Response[0]).then(function (response) {
                                                                                                        if (response.data.Response) {
                                                                                                            console.log("Delivery Report Updated for " + response.data.Response.DeliveryLineRefNo);
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            if (callback)
                                                                callback();
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    } else {
                                        angular.forEach(response.data.Validations, function (value, key) {
                                            value.MessageType = "E";
                                            ActivityTemplateOutward2Ctrl.ePage.Masters.ErrorWarningConfig.Modules.MyTask.Entity[ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID].GlobalErrorWarningList.push(value);
                                        });
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateOutward2Ctrl.taskObj.PSI_InstanceNo);
                                    }
                                });
                            } else {
                                $rootScope.SaveOutwardFromTask(function (response) {
                                    if (response == "error") {
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                                    } else {
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                                        ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
                                        if (callback)
                                            callback();
                                    }
                                });
                            }
                        }
                    });
                } else if (myTaskActivityConfig.Entities.PickupData) {
                    if (callback) {
                        angular.forEach(myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                            apiService.get("eAxisAPI", appConfig.Entities.WmsWorkOrderLine.API.GetById.Url + value.AdditionalRef1Fk).then(function (response) {
                                if (response.data.Response) {
                                    if (value.Parent_FK == response.data.Response.PK) {
                                        if (response.data.Response.WorkOrderLineStatus == "MCWS") {
                                            response.data.Response.WorkOrderLineStatus = "ICWS";
                                        } else if (response.data.Response.WorkOrderLineStatus == "MCWT") {
                                            response.data.Response.WorkOrderLineStatus = "ICWT";
                                        } else if (response.data.Response.WorkOrderLineStatus == "MCWR") {
                                            response.data.Response.WorkOrderLineStatus = "ICWR";
                                        } else if (response.data.Response.WorkOrderLineStatus == "MTW") {
                                            response.data.Response.WorkOrderLineStatus = "ITW";
                                        } else if (response.data.Response.WorkOrderLineStatus == "MRW") {
                                            response.data.Response.WorkOrderLineStatus = "IRW";
                                        } else if (response.data.Response.WorkOrderLineStatus == "MSTW") {
                                            response.data.Response.WorkOrderLineStatus = "ISTW";
                                        } else if (response.data.Response.WorkOrderLineStatus == "MSW") {
                                            response.data.Response.WorkOrderLineStatus = "ISW";
                                        }
                                    }
                                    response.data.Response.IsModified = true;
                                    apiService.post("eAxisAPI", appConfig.Entities.WmsWorkOrderLine.API.Update.Url, response.data.Response).then(function (response) {
                                        if (response.data.Response) {
                                        }
                                    });
                                }
                            });
                        });
                    }
                    $timeout(function () {
                        if (myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo) {
                            if (myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code) {
                                myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data.UIWmsOutward[0] = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsOutwardHeader;
                            }
                            myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data = filterObjectUpdate(myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data, "IsModified");
                            apiService.post("eAxisAPI", appConfig.Entities.WmsPickList.API.Update.Url, myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data).then(function (response) {
                                if (response.data.Response) {
                                    myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data = response.data.Response;
                                    $rootScope.SaveOutwardFromTask(function (response) {
                                        if (response == "error") {
                                            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                                            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
                                            ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                                            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                                        } else {
                                            apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                                                if (response.data.Response) {
                                                    response.data.Response.UIWmsOutwardHeader.Warehouse = response.data.Response.UIWmsOutwardHeader.WarehouseCode + " - " + response.data.Response.UIWmsOutwardHeader.WarehouseName;
                                                    response.data.Response.UIWmsOutwardHeader.Client = response.data.Response.UIWmsOutwardHeader.ClientCode + " - " + response.data.Response.UIWmsOutwardHeader.ClientName;
                                                    response.data.Response.UIWmsOutwardHeader.Consignee = response.data.Response.UIWmsOutwardHeader.ConsigneeCode + " - " + response.data.Response.UIWmsOutwardHeader.ConsigneeName;
                                                    response.data.Response.UIWmsOutwardHeader.TransferWarehouse = response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Code + " - " + response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Name;
                                                    myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data = response.data.Response;
                                                    ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                                                    ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
                                                    if (callback)
                                                        callback();
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            $rootScope.SaveOutwardFromTask(function (response) {
                                if (response == "error") {
                                    ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                                    ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
                                    ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                                    ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                                } else {
                                    if (callback)
                                        callback();
                                }
                            });
                        }
                    }, 2000);
                    //     }
                    // });
                }
            } else {
                saves(callback);
            }
        }

        function saves(callback) {
            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = true;
            ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Please Wait..";
            var _input = angular.copy(ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj);
            _input.UIWmsOutwardHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Outward Saved Successfully...!");
                } else {
                    toastr.error("Outward Save Failed...!");
                }
                ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableSaveBtn = false;
                ActivityTemplateOutward2Ctrl.ePage.Masters.SaveBtnText = "Save";
                if (callback)
                    callback();
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            ActivityTemplateOutward2Ctrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": "ORD",
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplateOutward2Ctrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                IsDisableRelatedDocument: true
            };

            ActivityTemplateOutward2Ctrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "DEL",
                    },
                    GroupCode: ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "DEL"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource.length > 0) {
                    if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Get POD and Return to Order Desk") {
                        myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.UIWmsWorkorderReport = angular.copy(myTaskActivityConfig.Entities.DeliveryData.UIWmsWorkorderReport);
                        if (myTaskActivityConfig.Entities.ManifestData.TmsManifestConsignment[0].TMC_ActualDeliveryDateTime) {
                            myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data.ActualDeliveryDate = new Date();
                        }
                    }
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "WMS",
                            SubModuleCode: "DEL",
                        },
                        GroupCode: ActivityTemplateOutward2Ctrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource.length == 0 || (ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource.length == response.length)) {
                            ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.Document = true;
                        } else {
                            ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.Document = null;
                        }
                        if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Get POD and Return to Order Desk") {
                            ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsWorkorderReport = angular.copy(myTaskActivityConfig.Entities.DeliveryData.UIWmsWorkorderReport);
                            if (myTaskActivityConfig.Entities.ManifestData.TmsManifestConsignment[0].TMC_ActualDeliveryDateTime) {
                                ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.ActualDeliveryDate = new Date();
                            }
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "WMS",
                                SubModuleCode: "DEL",
                            },
                            GroupCode: "Document",
                            EntityObject: ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplateOutward2Ctrl.ePage.Masters.EntityObj.UIWmsOutwardHeader.WorkOrderID].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplateOutward2Ctrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateOutward2Ctrl.taskObj.PSI_InstanceNo);
                    } else {
                        ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                        ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
                        if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Transfer Material") {
                            myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus = 'PIF';
                            myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc = 'Finalized';
                            CompleteWithSave();
                        } else if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Deliver Material") {
                            myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.TransportBookedDateTime = new Date();
                            myTaskActivityConfig.Entities.ManifestData.TmsManifestConsignment[0].TMC_ActualPickupDateTime = new Date();
                            myTaskActivityConfig.Entities.ManifestData.TmsManifestConsignment[0].IsModified = true;
                            myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.IsModified = true;
                            CompleteWithSave();
                        } else if (ActivityTemplateOutward2Ctrl.taskObj.WSI_StepName == "Confirm Delivery") {
                            myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus = 'PIF';
                            myTaskActivityConfig.Entities.PickData[myTaskActivityConfig.Entities.PickData.label].ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc = 'Finalized';
                            myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.ManifestCompleteDatetime = new Date();
                            myTaskActivityConfig.Entities.ManifestData.TmsManifestHeader.IsModified = true;
                            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Update.Url, myTaskActivityConfig.Entities.ManifestData).then(function (response) {
                                if (response.data.Response.Response) {
                                    myTaskActivityConfig.Entities.ManifestData = response.data.Response.Response;
                                    outwardConfig.IsSaveManifest = true;
                                    CompleteWithSave();
                                }
                            });
                        } else {
                            CompleteWithSave();
                        }
                    }
                }, 1000);
            } else {
                CompleteWithSave();
            }
        }

        function GetDocumentValidation() {
            var deferred = $q.defer();
            if (typeof ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplateOutward2Ctrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                "EntityRefKey": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": "ORD"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplateOutward2Ctrl.ePage.Masters.docTypeSource, 'DocType');
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
            ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity(function () {
                SaveOnly().then(function (response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Task Completed Successfully...!");
                        var _data = {
                            IsCompleted: true,
                            Item: ActivityTemplateOutward2Ctrl.ePage.Masters.TaskObj
                        };

                        ActivityTemplateOutward2Ctrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                    ActivityTemplateOutward2Ctrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ActivityTemplateOutward2Ctrl.ePage.Masters.CompleteBtnText = "Complete";
                });
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

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();