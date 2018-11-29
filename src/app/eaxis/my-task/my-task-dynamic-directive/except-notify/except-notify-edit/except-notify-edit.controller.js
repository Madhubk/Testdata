(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptNotifyEditDirectiveController", ExceptNotifyEditDirectiveController);

    ExceptNotifyEditDirectiveController.$inject = ["$injector", "helperService", "apiService", "appConfig", "toastr"];

    function ExceptNotifyEditDirectiveController($injector, helperService, apiService, appConfig, toastr) {
        var ExceptNotifyEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ExceptNotifyEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Notification_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ExceptNotifyEditDirectiveCtrl.entityObj
                    }
                }
            };

            ExceptNotifyEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            ExceptionNotifyInit();
        }

        function ExceptionNotifyInit() {
            ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj = ExceptNotifyEditDirectiveCtrl.taskObj;
            ExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            ExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
            ExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;
            ExceptNotifyEditDirectiveCtrl.ePage.Masters.MarkAsRead = MarkAsRead;
            if (ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        ExceptNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                    }
                    GetDetails(response.data.Response);
                }
            });
        }

        function GetDetails(_inputData) {
            if (_inputData.EntitySource) {
                switch (_inputData.EntitySource) {
                    case "POH":
                        GetOrderDetails(_inputData);
                        break;
                    case "SHP":
                        GetShipmentDetails(_inputData);
                        break;
                    case "CNT":
                        GetContainerDetails(_inputData);
                        break;
                    case "BKG":
                        GetShipmentDetails(_inputData);
                        break;
                    default:
                        break;
                }
            }
        }

        function GetOrderDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIPorOrderHeader.OrderNo;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIPorOrderHeader.ContainerMode;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIPorOrderHeader.BuyerName;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIPorOrderHeader.SupplierName;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIPorOrderHeader.TransportMode;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIPorOrderHeader.IncoTerm;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UIPorOrderHeader.Comments;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UIShipmentHeader.Comments;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainerList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UICntContainer.ContainerNo;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UICntContainer.ContainerMode;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UICntContainer.ORG_Consignee_Code;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UICntContainer.ORG_Consignor_Code;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UICntContainer.TransportMode;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UICntContainer.IncoTerm;
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UICntContainer.Comments;
                }
            });
        }

        function MarkAsRead() {
            ExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
            ExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = true;
            var _input = InputData(ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj, 2);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                    var _data = {
                        IsCompleted: true,
                        Item: ExceptNotifyEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception read succesfully...");
                    ExceptNotifyEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    ExceptNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                    toastr.error("Exception read failed...");
                }
            });
        }

        function InputData(_data, CompleteStepNo) {
            var _filterInput = {
                "ProcessName": _data.ProcessName,
                "EntitySource": _data.EntitySource,
                "EntityRefKey": _data.EntityRefKey,
                "KeyReference": _data.KeyReference,
                "CompleteInstanceNo": _data.PSI_InstanceNo,
                "CompleteStepNo": CompleteStepNo,
                "IsModified": true
            };
            return _filterInput;
        }

        Init();
    }
})();
