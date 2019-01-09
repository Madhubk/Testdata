(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ActivityTemplateInwardController", ActivityTemplateInwardController);

    ActivityTemplateInwardController.$inject = ["$rootScope", "helperService", "APP_CONSTANT", "$q", "apiService", "authService", "appConfig", "toastr", "errorWarningService", "myTaskActivityConfig", "$filter", "$timeout", "inwardConfig", "confirmation"];

    function ActivityTemplateInwardController($rootScope, helperService, APP_CONSTANT, $q, apiService, authService, appConfig, toastr, errorWarningService, myTaskActivityConfig, $filter, $timeout, inwardConfig, confirmation) {
        var ActivityTemplateInwardCtrl = this;

        function Init() {
            ActivityTemplateInwardCtrl.ePage = {
                "Title": "",
                "Prefix": "Activity_Template_Inward",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            ActivityTemplateInwardCtrl.ePage.Masters.emptyText = "-";
            ActivityTemplateInwardCtrl.ePage.Masters.TaskObj = ActivityTemplateInwardCtrl.taskObj;
            myTaskActivityConfig.Entities.TaskObj = ActivityTemplateInwardCtrl.taskObj;
            ActivityTemplateInwardCtrl.ePage.Masters.Complete = Complete;
            ActivityTemplateInwardCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;

            ActivityTemplateInwardCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            // DatePicker
            ActivityTemplateInwardCtrl.ePage.Masters.DatePicker = {};
            ActivityTemplateInwardCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ActivityTemplateInwardCtrl.ePage.Masters.DatePicker.isOpen = [];
            ActivityTemplateInwardCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";

            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
            ActivityTemplateInwardCtrl.ePage.Masters.SaveEntity = SaveEntity;

            if (ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                GetEntityObj();
                StandardMenuConfig();
            }
        }
        // To get task configuration 
        function getTaskConfigData() {
            var EEM_Code_3;
            if (ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.Custom_CodeXI)
                EEM_Code_3 = ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.Custom_CodeXI;
            else
                EEM_Code_3 = "DEFAULT";

            var _filter = {
                "EEM_Code_2": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.WSI_StepCode,
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
                    ActivityTemplateInwardCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    myTaskActivityConfig.Entities.TaskConfigData = ActivityTemplateInwardCtrl.ePage.Masters.TaskConfigData;
                    ActivityTemplateInwardCtrl.ePage.Masters.MenuListSource = $filter('filter')(ActivityTemplateInwardCtrl.ePage.Masters.TaskConfigData, { Category: 'Menu' });
                    ActivityTemplateInwardCtrl.ePage.Masters.ValidationSource = $filter('filter')(ActivityTemplateInwardCtrl.ePage.Masters.TaskConfigData, function (val, key) {
                        return val.Category == 'Validation'
                    })
                    if (ActivityTemplateInwardCtrl.ePage.Masters.ValidationSource.length > 0) {
                        ValidationFindall();
                    }
                    ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation = $filter('filter')(ActivityTemplateInwardCtrl.ePage.Masters.TaskConfigData, { Category: 'DocumentValidation' });
                    if (ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation.length > 0) {
                        DocumentValidation();
                    }
                    ActivityTemplateInwardCtrl.ePage.Masters.MenuObj = ActivityTemplateInwardCtrl.taskObj;
                    ActivityTemplateInwardCtrl.ePage.Masters.MenuObj.TabTitle = ActivityTemplateInwardCtrl.taskObj.KeyReference;
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ActivityTemplateInwardCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateInwardCtrl.ePage.Masters.EntityObj = response.data.Response;
                        ActivityTemplateInwardCtrl.ePage.Entities.Header.Data = ActivityTemplateInwardCtrl.ePage.Masters.EntityObj;
                        if (ActivityTemplateInwardCtrl.tabObj) {
                            ActivityTemplateInwardCtrl.currentInward = ActivityTemplateInwardCtrl.tabObj;
                            myTaskActivityConfig.Entities.Inward = ActivityTemplateInwardCtrl.currentInward;
                            getTaskConfigData();
                        } else {
                            inwardConfig.GetTabDetails(ActivityTemplateInwardCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader, false).then(function (response) {
                                angular.forEach(response, function (value, key) {
                                    if (value.label == ActivityTemplateInwardCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID) {
                                        ActivityTemplateInwardCtrl.currentInward = value;
                                        myTaskActivityConfig.Entities.Inward = ActivityTemplateInwardCtrl.currentInward;
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
            ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Please Wait...";
            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = true;
            if (ActivityTemplateInwardCtrl.taskObj.WSI_StepName == "Receive Transferred Material") {
                if (callback) {
                    ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                    ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    $rootScope.FinalizeInwardFromTask(function (response) {
                        if (response == "error") {
                            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                            ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                            ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";
                            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        } else {
                            apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                                if (response.data.Response) {
                                    response.data.Response.UIWmsInwardHeader.Warehouse = response.data.Response.UIWmsInwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsInwardHeader.WarehouseName;
                                    response.data.Response.UIWmsInwardHeader.Client = response.data.Response.UIWmsInwardHeader.ClientCode + "-" + response.data.Response.UIWmsInwardHeader.ClientName;
                                    response.data.Response.UIWmsInwardHeader.TransferWarehouse = response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Code + "-" + response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Name;
                                    myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data = response.data.Response;
                                    ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                    ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                                    if (callback)
                                        callback();
                                }
                            });
                        }
                    });
                } else {
                    $rootScope.SaveInwardFromTask(function (response) {
                        if (response == "error") {
                            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                            ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                            ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";
                            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        } else {
                            apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                                if (response.data.Response) {
                                    response.data.Response.UIWmsInwardHeader.Warehouse = response.data.Response.UIWmsInwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsInwardHeader.WarehouseName;
                                    response.data.Response.UIWmsInwardHeader.Client = response.data.Response.UIWmsInwardHeader.ClientCode + "-" + response.data.Response.UIWmsInwardHeader.ClientName;
                                    response.data.Response.UIWmsInwardHeader.TransferWarehouse = response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Code + "-" + response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Name;
                                    myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data = response.data.Response;
                                    ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                    ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                                }
                            });
                        }
                    });
                }
            } else if (ActivityTemplateInwardCtrl.taskObj.WSI_StepName == "Collect Material") {
                $rootScope.SaveInwardFromTask(function (response) {
                    if (response == "error") {
                        ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                        ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                        ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";
                        ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    } else {
                        apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                            if (response.data.Response) {
                                response.data.Response.UIWmsInwardHeader.Warehouse = response.data.Response.UIWmsInwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsInwardHeader.WarehouseName;
                                response.data.Response.UIWmsInwardHeader.Client = response.data.Response.UIWmsInwardHeader.ClientCode + "-" + response.data.Response.UIWmsInwardHeader.ClientName;
                                response.data.Response.UIWmsInwardHeader.TransferWarehouse = response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Code + "-" + response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Name;
                                myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data = response.data.Response;
                                myTaskActivityConfig.Entities.PickupData = filterObjectUpdate(myTaskActivityConfig.Entities.PickupData, "IsModified");
                                apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Update.Url, myTaskActivityConfig.Entities.PickupData).then(function (response) {
                                    myTaskActivityConfig.Entities.PickupData = response.data.Response;
                                    toastr.success("Pickup Saved Successfully");
                                    ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                    ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                                    if (callback)
                                        callback();
                                });
                            }
                        });
                    }
                });
            } else if (ActivityTemplateInwardCtrl.taskObj.WSI_StepName == "Confirm Delivery and Get Signature") {
                if (callback) {
                    ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                    ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    $rootScope.FinalizeInwardFromTask(function (response) {
                        if (response == "error") {
                            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                            ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                            ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";
                            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        } else {
                            apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                                if (response.data.Response) {
                                    response.data.Response.UIWmsInwardHeader.Warehouse = response.data.Response.UIWmsInwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsInwardHeader.WarehouseName;
                                    response.data.Response.UIWmsInwardHeader.Client = response.data.Response.UIWmsInwardHeader.ClientCode + "-" + response.data.Response.UIWmsInwardHeader.ClientName;
                                    response.data.Response.UIWmsInwardHeader.TransferWarehouse = response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Code + "-" + response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Name;
                                    myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data = response.data.Response;
                                    angular.forEach(myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                                        angular.forEach(myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine, function (value1, key1) {
                                            if (value.AdditionalRef1Code == value1.AdditionalRef1Code) {
                                                if (value1.WAR_WarehouseCode == "BDL001") {
                                                    value1.WorkOrderLineStatus = "SCWS";
                                                } else {
                                                    value1.WorkOrderLineStatus = "STO";
                                                }
                                            }
                                        });
                                    });
                                    myTaskActivityConfig.Entities.PickupData = filterObjectUpdate(myTaskActivityConfig.Entities.PickupData, "IsModified");
                                    apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Update.Url, myTaskActivityConfig.Entities.PickupData).then(function (response) {
                                        myTaskActivityConfig.Entities.PickupData = response.data.Response;
                                        toastr.success("Pickup Saved Successfully");
                                        ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                        ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                                        if (callback)
                                            callback();
                                    });
                                }
                            });
                        }
                    });
                } else {
                    $rootScope.SaveInwardFromTask(function (response) {
                        if (response == "error") {
                            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                            ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                            ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";
                            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        } else {
                            apiService.get("eAxisAPI", appConfig.Entities.InwardList.API.GetById.Url + ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                                if (response.data.Response) {
                                    response.data.Response.UIWmsInwardHeader.Warehouse = response.data.Response.UIWmsInwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsInwardHeader.WarehouseName;
                                    response.data.Response.UIWmsInwardHeader.Client = response.data.Response.UIWmsInwardHeader.ClientCode + "-" + response.data.Response.UIWmsInwardHeader.ClientName;
                                    response.data.Response.UIWmsInwardHeader.TransferWarehouse = response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Code + "-" + response.data.Response.UIWmsInwardHeader.TransferTo_WAR_Name;
                                    myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data = response.data.Response;
                                    myTaskActivityConfig.Entities.PickupData = filterObjectUpdate(myTaskActivityConfig.Entities.PickupData, "IsModified");
                                    apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Update.Url, myTaskActivityConfig.Entities.PickupData).then(function (response) {
                                        myTaskActivityConfig.Entities.PickupData = response.data.Response;
                                        ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
                                        ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                                        toastr.success("Pickup Saved Successfully");
                                    });
                                }
                            });
                        }
                    });
                }
            } else {
                saves();
            }
        }

        function saves() {
            ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Please Wait...";
            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = true;
            var _input = angular.copy(myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data);
            _input = filterObjectUpdate(_input, "IsModified");
            apiService.post("eAxisAPI", appConfig.Entities.InwardList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
                ActivityTemplateInwardCtrl.ePage.Masters.SaveBtnText = "Save";
                ActivityTemplateInwardCtrl.ePage.Masters.IsDisableSaveBtn = false;
            });
        }

        function SaveOnly() {
            var deferred = $q.defer();
            if (ActivityTemplateInwardCtrl.taskObj.WSI_StepName == "Receive Transferred Material") {
                var _filter = {
                    "PK": myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data.UIWmsInwardHeader.AdditionalRef2Fk
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.WmsWorkOrder.API.FindAll.FilterID
                };
                apiService.post("eAxisAPI", appConfig.Entities.WmsWorkOrder.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        ActivityTemplateInwardCtrl.ePage.Masters.WorkOrderList = response.data.Response[0];
                        if (ActivityTemplateInwardCtrl.ePage.Masters.WorkOrderList.WorkOrderType == "PIC") {
                            apiService.get("eAxisAPI", appConfig.Entities.WmsPickupList.API.GetById.Url + ActivityTemplateInwardCtrl.ePage.Masters.WorkOrderList.PK).then(function (response) {
                                if (response.data.Response) {
                                    myTaskActivityConfig.Entities.PickupData = response.data.Response;
                                    myTaskActivityConfig.Entities.PickupData.UIvwWmsPickupLine = $filter('orderBy')(myTaskActivityConfig.Entities.PickupData.UIvwWmsPickupLine, 'PL_AdditionalRef1Code');
                                    myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine = $filter('orderBy')(myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine, 'AdditionalRef1Code');
                                    angular.forEach(myTaskActivityConfig.Entities.PickupData.UIvwWmsPickupLine, function (value1, key1) {
                                        angular.forEach(myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                                            // if (value.Parent_FK == value1.PL_PK) {
                                            if (value1.PL_WorkOrderLineStatus == "ICWS") {
                                                myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine[key1].WorkOrderLineStatus = "SCWS";
                                            } else if (value1.PL_WorkOrderLineStatus == "ICWT") {
                                                myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine[key1].WorkOrderLineStatus = "SCWT";
                                            } else if (value1.PL_WorkOrderLineStatus == "ICWR") {
                                                myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine[key1].WorkOrderLineStatus = "SCWR";
                                            } else if (value1.PL_WorkOrderLineStatus == "ITW") {
                                                myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine[key1].WorkOrderLineStatus = "STW";
                                            } else if (value1.PL_WorkOrderLineStatus == "IRW") {
                                                myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine[key1].WorkOrderLineStatus = "SRW";
                                            } else if (value1.PL_WorkOrderLineStatus == "ISTW") {
                                                myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine[key1].WorkOrderLineStatus = "SSTW";
                                            } else if (value1.PL_WorkOrderLineStatus == "ISW") {
                                                myTaskActivityConfig.Entities.PickupData.UIWmsPickupLine[key1].WorkOrderLineStatus = "SSW";
                                            }
                                            // }
                                        });
                                    });
                                    myTaskActivityConfig.Entities.PickupData = filterObjectUpdate(myTaskActivityConfig.Entities.PickupData, "IsModified");
                                    apiService.post("eAxisAPI", appConfig.Entities.WmsPickupList.API.Update.Url, myTaskActivityConfig.Entities.PickupData).then(function (response) {
                                        myTaskActivityConfig.Entities.PickupData = response.data.Response;
                                        toastr.success("Pickup Saved Successfully");
                                        // complete process
                                        var _inputObj = {
                                            "CompleteInstanceNo": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                                            "CompleteStepNo": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
                                    });
                                }
                            });
                        } else {
                            var input = myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data;
                            helperService.getFullObjectUsingGetById(appConfig.Entities.WmsOutwardList.API.GetById.Url, 'null').then(function (response) {
                                if (response.data.Response.Response) {
                                    //Assigning Header Object
                                    response.data.Response.Response.UIWmsOutwardHeader.PK = response.data.Response.Response.PK;
                                    response.data.Response.Response.UIWmsOutwardHeader.CreatedDateTime = new Date();
                                    response.data.Response.Response.UIWmsOutwardHeader.WorkOrderType = 'ORD';
                                    response.data.Response.Response.UIWmsOutwardHeader.ExternalReference = "Outward " + response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID;
                                    response.data.Response.Response.UIWmsOutwardHeader.ORG_Client_FK = input.UIWmsInwardHeader.ORG_Client_FK;
                                    response.data.Response.Response.UIWmsOutwardHeader.ORG_FK = input.UIWmsInwardHeader.ORG_FK;
                                    response.data.Response.Response.UIWmsOutwardHeader.ClientCode = input.UIWmsInwardHeader.ClientCode;
                                    response.data.Response.Response.UIWmsOutwardHeader.ClientName = input.UIWmsInwardHeader.ClientName;
                                    response.data.Response.Response.UIWmsOutwardHeader.ORG_Consignee_FK = input.UIWmsInwardHeader.ORG_Supplier_FK;
                                    response.data.Response.Response.UIWmsOutwardHeader.ConsigneeCode = input.UIWmsInwardHeader.SupplierCode;
                                    response.data.Response.Response.UIWmsOutwardHeader.ConsigneeName = input.UIWmsInwardHeader.SupplierName;
                                    response.data.Response.Response.UIWmsOutwardHeader.WAR_FK = input.UIWmsInwardHeader.WAR_FK;
                                    response.data.Response.Response.UIWmsOutwardHeader.WarehouseCode = input.UIWmsInwardHeader.WarehouseCode
                                    response.data.Response.Response.UIWmsOutwardHeader.WarehouseName = input.UIWmsInwardHeader.WarehouseName
                                    response.data.Response.Response.UIWmsOutwardHeader.WOD_Parent_FK = input.UIWmsInwardHeader.PK
                                    response.data.Response.Response.UIWmsOutwardHeader.AdditionalRef2Fk = input.UIWmsInwardHeader.AdditionalRef2Fk
                                    response.data.Response.Response.UIWmsOutwardHeader.RequiredDate = new Date();

                                    response.data.Response.Response.UIOrgHeader = input.UIOrgHeader;
                                    response.data.Response.Response.UIJobAddress = angular.copy(input.UIJobAddress);
                                    angular.forEach(response.data.Response.Response.UIJobAddress, function (value, key) {
                                        value.PK = "";
                                        if (value.AddressType == "SUD")
                                            value.AddressType = "CED";
                                    });
                                    //Assigning Outward Line Object
                                    input.UIWmsWorkOrderLine.map(function (value, key) {
                                        var LineObj = {
                                            "PK": "",
                                            "Parent_FK": value.PK,
                                            "Client_FK": value.Client_FK,
                                            "ORG_Client_FK": value.ORG_Client_FK,
                                            "ORG_ClientCode": value.ORG_ClientCode,
                                            "ORG_ClientName": value.ORG_ClientName,
                                            "ExternalReference": value.ExternalReference,
                                            "MCC_NKCommodityCode": value.MCC_NKCommodityCode,
                                            "MCC_NKCommodityDesc": value.MCC_NKCommodityDesc,
                                            "ProductCode": value.ProductCode,
                                            "ProductDescription": value.ProductDescription,
                                            "ProductCondition": value.ProductCondition,
                                            "PRO_FK": value.PRO_FK,
                                            "Packs": value.Packs,
                                            "PAC_PackType": value.PAC_PackType,
                                            "Units": value.Units,
                                            "StockKeepingUnit": value.StockKeepingUnit,
                                            "PalletId": value.PalletID,
                                            "PartAttrib1": value.PartAttrib1,
                                            "PartAttrib2": value.PartAttrib2,
                                            "PartAttrib3": value.PartAttrib3,
                                            "PackingDate": value.PackingDate,
                                            "ExpiryDate": value.ExpiryDate,
                                            "AdditionalRef1Code": value.AdditionalRef1Code,
                                            "AdditionalRef1Type": value.AdditionalRef1Type,
                                            "UseExpiryDate": value.UseExpiryDate,
                                            "UsePackingDate": value.UsePackingDate,
                                            "UsePartAttrib1": value.UsePartAttrib1,
                                            "UsePartAttrib2": value.UsePartAttrib2,
                                            "UsePartAttrib3": value.UsePartAttrib3,
                                            "WAR_FK": value.WAR_FK,
                                            "WorkOrderID": response.data.Response.Response.UIWmsOutwardHeader.WorkOrderID,
                                            "WorkOrderLineType": "ORD",
                                            "WorkOrderType": "ORD"
                                        }
                                        response.data.Response.Response.UIWmsWorkOrderLine.push(LineObj);
                                    });

                                    //Inserting Outward
                                    apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.Insert.Url, response.data.Response.Response).then(function (response) {
                                        if (response.data.Status == 'Success') {
                                            // complete process
                                            var _inputObj = {
                                                "CompleteInstanceNo": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                                                "CompleteStepNo": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
                                            toastr.success("Outward is successfully created.. Outward No : " + response.data.Response.UIWmsOutwardHeader.WorkOrderID, {
                                                tapToDismiss: false,
                                                closeButton: true,
                                                timeOut: 0
                                            });
                                            // toastr.success("Outward is successfully created.. Outward No : " + response.data.Response.UIWmsOutwardHeader.WorkOrderID);
                                        } else {
                                            toastr.error("Outward Save Failed.");
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                // complete process
                var _inputObj = {
                    "CompleteInstanceNo": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                    "CompleteStepNo": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
            }
            return deferred.promise;
        }

        function StandardMenuConfig() {
            ActivityTemplateInwardCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.Entity,
                "EntityRefKey": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.PK,
                "ParentEntityRefCode": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "ParentEntitySource": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };
            ActivityTemplateInwardCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                IsDisableRelatedDocument: true
            };

            ActivityTemplateInwardCtrl.ePage.Masters.CommentConfig = {
                IsDisableRefreshButton: true
            };
        }

        function ValidationFindall() {
            if (ActivityTemplateInwardCtrl.ePage.Masters.TaskObj) {
                if (errorWarningService.Modules.MyTask) {
                    errorWarningService.Modules.MyTask.ErrorCodeList = [];
                }
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateInwardCtrl.ePage.Masters.EntityObj.UIWmsInwardHeader.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "INW",
                    },
                    GroupCode: ActivityTemplateInwardCtrl.ePage.Masters.ValidationSource[0].Code,
                    EntityObject: ActivityTemplateInwardCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function DocumentValidation() {
            if (ActivityTemplateInwardCtrl.ePage.Masters.TaskObj) {
                // validation findall call
                var _obj = {
                    ModuleName: ["MyTask"],
                    Code: [ActivityTemplateInwardCtrl.ePage.Masters.EntityObj.UIWmsInwardHeader.WorkOrderID],
                    API: "Group",
                    FilterInput: {
                        ModuleCode: "WMS",
                        SubModuleCode: "INW"
                    },
                    GroupCode: "Document",
                    EntityObject: ActivityTemplateInwardCtrl.ePage.Masters.EntityObj,
                    ErrorCode: []
                };
                errorWarningService.GetErrorCodeList(_obj);
            }
        }

        function Complete() {
            if (ActivityTemplateInwardCtrl.ePage.Masters.ValidationSource.length > 0 || ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation.length > 0) {
                if (ActivityTemplateInwardCtrl.taskObj.WSI_StepName == "Collect Material" || ActivityTemplateInwardCtrl.taskObj.WSI_StepName == "Confirm Delivery and Get Signature") {
                    myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data.UIWmsWorkorderReport = myTaskActivityConfig.Entities.PickupData.UIWmsWorkorderReport;
                }
                if (ActivityTemplateInwardCtrl.ePage.Masters.ValidationSource.length > 0) {
                    var _obj = {
                        ModuleName: ["MyTask"],
                        Code: [ActivityTemplateInwardCtrl.ePage.Masters.EntityObj.UIWmsInwardHeader.WorkOrderID],
                        API: "Group",
                        FilterInput: {
                            ModuleCode: "WMS",
                            SubModuleCode: "INW",
                        },
                        GroupCode: ActivityTemplateInwardCtrl.ePage.Masters.ValidationSource[0].Code,
                        EntityObject: myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data
                    };
                    errorWarningService.ValidateValue(_obj);
                }

                if (ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation.length > 0) {
                    GetDocumentValidation().then(function (response) {
                        if (ActivityTemplateInwardCtrl.ePage.Masters.docTypeSource.length == 0 || ActivityTemplateInwardCtrl.ePage.Masters.docTypeSource.length == response.length) {
                            myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data.Document = true;
                        } else {
                            myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data.Document = null;
                        }
                        var _obj = {
                            ModuleName: ["MyTask"],
                            Code: [ActivityTemplateInwardCtrl.ePage.Masters.EntityObj.UIWmsInwardHeader.WorkOrderID],
                            API: "Group",
                            FilterInput: {
                                ModuleCode: "WMS",
                                SubModuleCode: "INW",
                            },
                            GroupCode: "Document",
                            EntityObject: myTaskActivityConfig.Entities.Inward[myTaskActivityConfig.Entities.Inward.label].ePage.Entities.Header.Data
                        };
                        errorWarningService.ValidateValue(_obj);
                    });
                }
                $timeout(function () {
                    var _errorcount = errorWarningService.Modules.MyTask.Entity[ActivityTemplateInwardCtrl.ePage.Masters.EntityObj.UIWmsInwardHeader.WorkOrderID].GlobalErrorWarningList;
                    if (_errorcount.length > 0) {
                        if (ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation.length > 0) {
                            angular.forEach(_errorcount, function (value, key) {
                                if (value.MetaObject == "Document") {
                                    // var docTypeSource = $filter('filter')(ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                                    //     return val.IsMondatory == true
                                    // });
                                    var doctypedesc = '';
                                    angular.forEach(ActivityTemplateInwardCtrl.ePage.Masters.docTypeSource, function (value, key) {
                                        doctypedesc = doctypedesc + value.DocTypeDesc + ",";
                                    });
                                    value.Message = 'Please Upload Document';
                                    doctypedesc = doctypedesc.slice(0, -1);
                                    value.Message = value.Message + " for this " + doctypedesc + " Document type";
                                }
                            });
                        }
                        ActivityTemplateInwardCtrl.ePage.Masters.ShowErrorWarningModal(ActivityTemplateInwardCtrl.taskObj.PSI_InstanceNo);
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
            if (typeof ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation[0].Config == "string") {
                ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation[0].Config = JSON.parse(ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation[0].Config);
            }

            ActivityTemplateInwardCtrl.ePage.Masters.docTypeSource = $filter('filter')(ActivityTemplateInwardCtrl.ePage.Masters.DocumentValidation[0].Config, function (val, key) {
                return val.IsMondatory == true
            })
            var doctype = '';
            angular.forEach(ActivityTemplateInwardCtrl.ePage.Masters.docTypeSource, function (value, key) {
                doctype = doctype + value.DocType + ",";
            });
            doctype = doctype.slice(0, -1);

            var _filter = {
                "Status": "Success",
                "DocumentType": doctype,
                // "ParentEntityRefCode": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                // "ParentEntitySource": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntitySource,
                "EntityRefKey": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "EntityRefCode": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.KeyReference,
                "EntitySource": ActivityTemplateInwardCtrl.ePage.Masters.TaskObj.EntitySource
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    var _arr = [];
                    if (ActivityTemplateInwardCtrl.ePage.Masters.docTypeSource.length > 0) {
                        var TempDocTypeSource = _.groupBy(ActivityTemplateInwardCtrl.ePage.Masters.docTypeSource, 'DocType');
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
            ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            SaveEntity(function () {
                SaveOnly().then(function (response) {
                    if (response.data.Status == "Success") {
                        toastr.success("Task Completed Successfully...!");
                        var _data = {
                            IsCompleted: true,
                            Item: ActivityTemplateInwardCtrl.ePage.Masters.TaskObj
                        };

                        ActivityTemplateInwardCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                    ActivityTemplateInwardCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ActivityTemplateInwardCtrl.ePage.Masters.CompleteBtnText = "Complete";
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