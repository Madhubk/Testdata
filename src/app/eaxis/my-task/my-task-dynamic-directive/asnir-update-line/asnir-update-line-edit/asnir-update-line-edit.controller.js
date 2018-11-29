(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AsnirUpdateLineEditDirectiveController", AsnirUpdateLineEditDirectiveController);

    AsnirUpdateLineEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "inwardConfig", "$window", "$state", "$q"];

    function AsnirUpdateLineEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, inwardConfig, $window, $state, $q) {
        var AsnirUpdateLineEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            AsnirUpdateLineEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": AsnirUpdateLineEditDirectiveCtrl.entityObj
                    }
                }
            };

            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj = AsnirUpdateLineEditDirectiveCtrl.taskObj;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.EntityObj = AsnirUpdateLineEditDirectiveCtrl.entityObj;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TabObj = AsnirUpdateLineEditDirectiveCtrl.tabObj;

            // functions
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.SelectedLookupDataSupplier = SelectedLookupDataSupplier;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.Save = Save;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            AsnirUpdateLineEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            // DatePicker
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            if (!AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function generalOperation() {
            // Warehouse
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode == null) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode = "";
            }
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName == null) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode = "";
            }
            AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode + " - " + AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName;
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse == " - ") {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = "";
            }
            // Client
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode == null) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode = "";
            }
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName == null) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName = "";
            }
            AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode + " - " + AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client == " - ") {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = "";
            }
            // Supplier
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode == null) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode = "";
            }
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName == null) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName = "";
            }
            AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode + " - " + AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName;
            if (AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier == " - ") {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = "";
            }

            // AsnirUpdateLineEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function SelectedLookupWarehouse(item) {
            if (item.entity) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode = item.entity.WarehouseCode;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName = item.entity.WarehouseName;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK = item.entity.PK;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = item.entity.WarehouseCode + " - " + item.entity.WarehouseName;
            }
            else {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode = item.WarehouseCode;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName = item.WarehouseName;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK = item.PK;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = item.WarehouseCode + " - " + item.WarehouseName;
            }
        }

        function SelectedLookupDataClient(item) {
            if (item.entity) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode = item.entity.Code;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName = item.entity.FullName;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK = item.entity.PK;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = item.entity.Code + "-" + item.entity.FullName;
            }
            else {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode = item.Code;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName = item.FullName;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK = item.PK;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = item.Code + "-" + item.FullName;
            }
        }

        function SelectedLookupDataSupplier(item) {
            if (item.entity) {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode = item.entity.Code;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName = item.entity.FullName;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Supplier_FK = item.entity.PK;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = item.entity.Code + "-" + item.entity.FullName;
            }
            else {
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode = item.Code;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName = item.FullName;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Supplier_FK = item.PK;
                AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = item.Code + "-" + item.FullName;
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        function getWorkOrder() {
            AsnirUpdateLineEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data = AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TabObj[AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TabList = AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TabObj;
            generalOperation();
            AsnirUpdateLineEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }
        function StandardMenuConfig() {
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            AsnirUpdateLineEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            apiService.get("eAxisAPI", 'WmsInwardList/GetById/' + AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    inwardConfig.GetTabDetails(AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID) {
                                AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TabList = value;
                                AsnirUpdateLineEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                    generalOperation();
                }
            });
        }

        function Complete() {
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    AsnirUpdateLineEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IsModified = true;

            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "PK": AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PK,
                "UIWmsInwardHeader": AsnirUpdateLineEditDirectiveCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader,
                "ProcessName": "ASN Inward Request",
                "InstanceNo": AsnirUpdateLineEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "InstanceStatus": "",
                "InstanceStepNo": "1",
                "Action": Action
            }
            apiService.post("eAxisAPI", appConfig.Entities.InwardList.API.UpdateInwardProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        Init();
    }
})();
