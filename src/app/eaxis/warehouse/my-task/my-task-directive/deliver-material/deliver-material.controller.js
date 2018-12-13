(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliverMaterialController", DeliverMaterialController);

    DeliverMaterialController.$inject = ["$scope", "apiService", "helperService", "appConfig", "myTaskActivityConfig", "APP_CONSTANT", "errorWarningService", "dynamicLookupConfig", "outwardConfig", "$injector", "toastr"];

    function DeliverMaterialController($scope, apiService, helperService, appConfig, myTaskActivityConfig, APP_CONSTANT, errorWarningService, dynamicLookupConfig, outwardConfig, $injector, toastr) {
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
                if (DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK)
                    GetPickDetails();
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
                    DeliverMaterialCtrl.ePage.Entities.Header.ManifestData = response.data.Response;
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
                            }
                        });
                    });
                }
            });
        }

        function CreateManifest() {
            DeliverMaterialCtrl.ePage.Masters.LoadingValue = "Creating Dispatch..";
            DeliverMaterialCtrl.ePage.Masters.IsDisabled = true;
            DeliverMaterialCtrl.ePage.Masters.CreateManifestText = "Please Wait...";
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
                    DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code = response.data.Response.TmsManifestHeader.ManifestNumber;
                    DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk = response.data.Response.TmsManifestHeader.PK;
                    DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;

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

                            angular.forEach(DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine, function (value, key) {
                                var obj = {
                                    "PK": "",
                                    "Quantity": value.Units,
                                    "TMC_ConsignmentNumber": value.WorkOrderID,
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

                            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Update.Url, response.data.Response).then(function (response) {
                                if (response.data.Status == 'Success') {
                                    apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + response.data.Response.Response.PK).then(function (response) {
                                        if (response.data.Status == 'Success') {
                                            DeliverMaterialCtrl.ePage.Masters.LoadingValue = "";
                                            toastr.success("Manifest Created Successfully");
                                            DeliverMaterialCtrl.ePage.Entities.Header.ManifestData = response.data.Response;
                                            DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code = response.data.Response.TmsManifestHeader.ManifestNumber;
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
        }

        function getDeliveryList() {
            apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + DeliverMaterialCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef2Fk).then(function (response) {
                if (response.data.Response) {
                    DeliverMaterialCtrl.ePage.Entities.Header.DeliveryData = response.data.Response;
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