(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliverMaterialController", DeliverMaterialController);

    DeliverMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig", "$injector", "toastr", "$filter"];

    function DeliverMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig, $injector, toastr, $filter) {
        var DeliverMaterialCtrl = this;
        var Config = $injector.get("pickConfig");

        function Init() {
            DeliverMaterialCtrl.ePage = {
                "Title": "",
                "Prefix": "Details_Page",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };
            DeliverMaterialCtrl.ePage.Masters.activeTabIndex = 0;
            DeliverMaterialCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            DeliverMaterialCtrl.ePage.Masters.emptyText = "-";
            if (DeliverMaterialCtrl.taskObj) {
                DeliverMaterialCtrl.ePage.Masters.TaskObj = DeliverMaterialCtrl.taskObj;
                GetEntityObj();
            } else {
                DeliverMaterialCtrl.ePage.Masters.Config = myTaskActivityConfig;
                DeliverMaterialCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data;
                outwardConfig.ValidationFindall();
                getDeliveryList();
                if (DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk)
                    GetManifestDetails();
                if (DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK) {
                    GetPickDetails();
                    Config.ValidationFindall();
                }
                GetDynamicLookupConfig();

                if (errorWarningService.Modules.MyTask)
                    DeliverMaterialCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[myTaskActivityConfig.Entities.Outward.label];
            }

            DeliverMaterialCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange;
            // DatePicker
            DeliverMaterialCtrl.ePage.Masters.DatePicker = {};
            DeliverMaterialCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DeliverMaterialCtrl.ePage.Masters.DatePicker.isOpen = [];
            DeliverMaterialCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            DeliverMaterialCtrl.ePage.Masters.CreateManifest = CreateManifest;
            DeliverMaterialCtrl.ePage.Masters.CreateManifestText = "Create Dispatch";
        }

        function GetManifestDetails() {
            apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk).then(function (response) {
                if (response.data.Response) {
                    DeliverMaterialCtrl.ePage.Entities.Header.ManifestDetails = response.data.Response;
                    myTaskActivityConfig.Entities.ManifestData = DeliverMaterialCtrl.ePage.Entities.Header.ManifestDetails;
                }
            });
        }

        function GetPickDetails() {
            apiService.get("eAxisAPI", Config.Entities.Header.API.GetByID.Url + DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK).then(function (response) {
                if (response.data.Response) {
                    DeliverMaterialCtrl.ePage.Entities.Header.PickData = response.data.Response;
                    Config.GetTabDetails(DeliverMaterialCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == DeliverMaterialCtrl.ePage.Entities.Header.PickData.UIWmsPickHeader.PickNo) {
                                DeliverMaterialCtrl.ePage.Masters.TabList = value;
                                myTaskActivityConfig.Entities.PickData = DeliverMaterialCtrl.ePage.Masters.TabList;
                            }
                        });
                    });
                }
            });
        }

        function CreateManifest() {
            DeliverMaterialCtrl.ePage.Masters.IsDisabled = true;
            DeliverMaterialCtrl.ePage.Masters.CreateManifestText = "Please Wait...";
            var _filter = {
                "WorkOrderID": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsPickLineSummary.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.WmsPickLineSummary.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response.length > 0) {
                    DeliverMaterialCtrl.ePage.Masters.PickLineList = response.data.Response;
                    DeliverMaterialCtrl.ePage.Masters.LoadingValue = "Creating Dispatch..";

                    helperService.getFullObjectUsingGetById(appConfig.Entities.TmsManifestList.API.GetById.Url, 'null').then(function (response) {
                        if (response.data.Response) {
                            response.data.Response.TmsManifestHeader.PK = response.data.Response.PK;
                            response.data.Response.TmsManifestHeader.SenderCode = DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_Code;
                            response.data.Response.TmsManifestHeader.SenderName = DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FullName;
                            response.data.Response.TmsManifestHeader.Sender_ORG_FK = DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FK;
                            response.data.Response.TmsManifestHeader.ReceiverCode = DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeCode;
                            response.data.Response.TmsManifestHeader.ReceiverName = DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeName;
                            response.data.Response.TmsManifestHeader.Receiver_ORG_FK = DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Consignee_FK;
                            response.data.Response.TmsManifestHeader.EstimatedDispatchDate = new Date();
                            response.data.Response.TmsManifestHeader.EstimatedDeliveryDate = new Date();
                            response.data.Response.TmsManifestHeader.EstimatedDispatchDate = $filter('date')(new Date(), "dd-MMM-yyyy hh:mm a")
                            response.data.Response.TmsManifestHeader.EstimatedDeliveryDate = $filter('date')(new Date(), "dd-MMM-yyyy hh:mm a")
                            DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk = response.data.Response.TmsManifestHeader.PK;
                            DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;

                            response.data.Response.JobAddress = angular.copy(DeliverMaterialCtrl.ePage.Entities.Header.Data.UIJobAddress);
                            angular.forEach(response.data.Response.JobAddress, function (value, key) {
                                value.PK = "";
                                if (value.AddressType == "CED")
                                    value.AddressType = "REC";
                            });

                            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Insert.Url, response.data.Response).then(function (response) {
                                if (response.data.Status == 'Success') {
                                    var _obj = {
                                        "PK": "",
                                        "IsDeleted": false,
                                        "IsModified": false,
                                        "TMC_Sender_ORG_FK": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FK,
                                        "TMC_SenderCode": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_Code,
                                        "TMC_SenderName": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FullName,
                                        "TMC_Receiver_ORG_FK": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Consignee_FK,
                                        "TMC_ReceiverCode": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeCode,
                                        "TMC_ReceiverName": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeName,
                                        "TMC_Client_ORG_FK": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK,
                                        "TMC_ClientId": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode,
                                        "TMC_ConsignmentNumber": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID,
                                        "TMC_ExpectedDeliveryDateTime": response.data.Response.TmsManifestHeader.EstimatedDeliveryDate,
                                        "TMC_ExpectedPickupDateTime": response.data.Response.TmsManifestHeader.EstimatedDispatchDate,
                                        "TMC_FK": "",
                                        "TMC_ServiceType": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderType,
                                        "TMM_ManifestNumber": response.data.Response.TmsManifestHeader.ManifestNumber,
                                        "TMM_FK": response.data.Response.TmsManifestHeader.PK,
                                        "TMC_SenderRef": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ExternalReference,
                                        "TMC_ReceiverRef": DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CustomerReference,
                                    }
                                    response.data.Response.TmsManifestConsignment.push(_obj);

                                    angular.forEach(DeliverMaterialCtrl.ePage.Masters.PickLineList, function (value, key) {
                                        var obj = {
                                            "PK": "",
                                            "Quantity": value.Units,
                                            "TMC_ConsignmentNumber": value.WOD_WorkOrderID,
                                            "TIT_ReceiverCode": value.WOD_ConsigneeCode,
                                            "TIT_ReceiverName": value.WOD_ConsigneeName,
                                            "TIT_Receiver_ORG_FK": value.WOD_ORG_Consignee_FK,
                                            "TIT_SenderCode": value.WOD_WAR_ORG_Code,
                                            "TIT_SenderName": value.WOD_WAR_ORG_FullName,
                                            "TIT_Sender_ORG_FK": value.WOD_WAR_ORG_FK,
                                            "TIT_ItemStatus": value.WorkOrderLineStatus,
                                            "TMC_FK": "",
                                            "IsDeleted": value.IsDeleted,
                                            "IsModified": value.IsModified,
                                            "TIT_ItemRef_ID": value.PAC_PackType,
                                            "TIT_ItemRefType": "Outward Line",
                                            "TIT_ItemRef_PK": value.PK,
                                            "TIT_ItemCode": value.ProductCode,
                                            "TIT_ItemDesc": value.ProductDescription,
                                            "TIT_FK": "",
                                            "TIT_Weight": value.Weight,
                                            "TIT_Volumn": value.Volume,
                                            "TMM_FK": response.data.Response.TmsManifestHeader.PK,
                                            "WOM_PartAttrib1": value.PartAttrib1,
                                            "WOM_PartAttrib2": value.PartAttrib2,
                                            "WOM_PartAttrib3": value.PartAttrib3,
                                            "WOM_PackingDate": value.PackingDate,
                                            "WOM_ExpiryDate": value.ExpiryDate,
                                            "WOM_Product_PK": value.PRO_FK
                                        }
                                        response.data.Response.TmsManifestItem.push(obj);
                                    });

                                    response.data.Response.TmsManifestHeader.SubmittedDateTime = new Date();
                                    response.data.Response.TmsManifestHeader.ApproveOrRejectDateTime = new Date();
                                    response.data.Response.TmsManifestHeader.ApprovalStatus = "Approved";
                                    response.data.Response.TmsManifestHeader.IsModified = true;
                                    apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Update.Url, response.data.Response).then(function (response) {
                                        if (response.data.Status == 'Success') {
                                            apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + response.data.Response.Response.PK).then(function (response) {
                                                if (response.data.Status == 'Success') {
                                                    DeliverMaterialCtrl.ePage.Masters.LoadingValue = "";
                                                    toastr.success("Manifest Created Successfully");
                                                    DeliverMaterialCtrl.ePage.Entities.Header.ManifestDetails = response.data.Response;
                                                    myTaskActivityConfig.Entities.ManifestData = DeliverMaterialCtrl.ePage.Entities.Header.ManifestDetails;

                                                    apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK).then(function (response) {
                                                        if (response.data.Response) {
                                                            DeliverMaterialCtrl.ePage.Entities.Header.Data = response.data.Response;
                                                            DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code = DeliverMaterialCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.ManifestNumber;
                                                            DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk = DeliverMaterialCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.PK;
                                                            DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;
                                                            apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.Update.Url, DeliverMaterialCtrl.ePage.Entities.Header.Data).then(function (response) {
                                                                if (response.data.Status == 'Success') {
                                                                    apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK).then(function (response) {
                                                                        if (response.data.Response) {
                                                                            response.data.Response.UIWmsOutwardHeader.Client = response.data.Response.UIWmsOutwardHeader.ClientCode + "-" + response.data.Response.UIWmsOutwardHeader.ClientName;
                                                                            response.data.Response.UIWmsOutwardHeader.Warehouse = response.data.Response.UIWmsOutwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsOutwardHeader.WarehouseName;
                                                                            response.data.Response.UIWmsOutwardHeader.Consignee = response.data.Response.UIWmsOutwardHeader.ConsigneeCode + "-" + response.data.Response.UIWmsOutwardHeader.ConsigneeName;
                                                                            myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data = response.data.Response;
                                                                            myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.GlobalVariables.NonEditable = true;
                                                                            DeliverMaterialCtrl.ePage.Entities.Header.Data = myTaskActivityConfig.Entities.Outward[myTaskActivityConfig.Entities.Outward.label].ePage.Entities.Header.Data;
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    toastr.error("Manifest Creation Failed. Please try again later.");
                                    DeliverMaterialCtrl.ePage.Masters.LoadingValue = "";
                                }
                            });
                        } else {
                            DeliverMaterialCtrl.ePage.Masters.LoadingValue = "";
                            toastr.success("Manifest Created Successfully");
                        }
                    });
                } else {
                    DeliverMaterialCtrl.ePage.Masters.IsDisabled = false;
                    DeliverMaterialCtrl.ePage.Masters.CreateManifestText = "Create Dispatch";
                    toastr.warning("Pickline is not available.");
                }
            });
        }

        function getDeliveryList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef2Fk).then(function (response) {
                if (response.data.Response) {
                    DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
                    myTaskActivityConfig.Entities.DeliveryData = DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData;
                    GeneralOperation();
                }
            });
        }

        function GeneralOperation() {
            // Client
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode = "";
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName = "";
            DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientCode + ' - ' + DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ClientName;
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client == " - ")
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Client = "";
            // Consignee
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode = "";
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName = "";
            DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeCode + ' - ' + DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.ConsigneeName;
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee == " - ")
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Consignee = "";
            // Warehouse
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode = "";
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName == null)
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName = "";
            DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseCode + ' - ' + DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.WarehouseName;
            if (DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse == " - ")
                DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData.UIWmsDelivery.Warehouse = "";
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var _filter = {
                pageName: 'WarehouseOutward'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["MyTask"],
                Code: [myTaskActivityConfig.Entities.Outward.label],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "WMS",
                    SubModuleCode: "DEL",
                    // Code: "E0013"
                },
                EntityObject: DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            DeliverMaterialCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetEntityObj() {
            if (DeliverMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + DeliverMaterialCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        DeliverMaterialCtrl.ePage.Masters.EntityObj = response.data.Response;
                    }
                });
            }
        }

        Init();
    }
})();