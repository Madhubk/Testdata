(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApprovalNotifyEditDirectiveController", ApprovalNotifyEditDirectiveController);

    ApprovalNotifyEditDirectiveController.$inject = ["$injector", "helperService", "apiService", "appConfig", "toastr"];

    function ApprovalNotifyEditDirectiveController($injector, helperService, apiService, appConfig, toastr) {
        var ApprovalNotifyEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ApprovalNotifyEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Notification_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ApprovalNotifyEditDirectiveCtrl.entityObj
                    }
                }
            };

            ApprovalNotifyEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ExceptionNotifyInit();
        }

        function ExceptionNotifyInit() {
            ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj = ApprovalNotifyEditDirectiveCtrl.taskObj;
            ApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            ApprovalNotifyEditDirectiveCtrl.ePage.Masters.MarkAsRead = MarkAsRead;
            ApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
            ApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;

            if (ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        ApprovalNotifyEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
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
                    case "BKG":
                        GetShipmentDetails(_inputData);
                        break;
                    case "CNT":
                        GetContainerDetails(_inputData);
                        break;
                    default:
                        break;
                }
            }
        }

        function GetOrderDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIPorOrderHeader.OrderNo;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIPorOrderHeader.ContainerMode;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIPorOrderHeader.BuyerName;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIPorOrderHeader.SupplierName;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIPorOrderHeader.TransportMode;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIPorOrderHeader.IncoTerm;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIPorOrderHeader.PortOfLoading;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIPorOrderHeader.PortOfDischarge;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIPorOrderHeader.PlannedCarrier;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIPorOrderHeader.PlannedVoyage;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIPorOrderHeader.PlannedVessel;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIPorOrderHeader.PlannedETD;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIPorOrderHeader.PlannedETA;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UIPorOrderHeader.Comments;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIShipmentHeader.Origin;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIShipmentHeader.Destination;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIShipmentHeader.PlannedCarrier;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIShipmentHeader.PlannedVoyage;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIShipmentHeader.PlannedVessel;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIShipmentHeader.PlannedETD;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIShipmentHeader.PlannedETA;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.UIShipmentHeader.Comments;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainerList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.Response.ContainerNo;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.Response.ContainerMode;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.Response.ORG_Consignee_Code;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.Response.ORG_Consignor_Code;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.Response.TransportMode;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.Response.IncoTerm;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.Response.Origin;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.Response.Destination;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.Carrier;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.Voyage;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.Vessel;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.ETD;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.ETA;
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj.Comments = response.data.Response.Comments;
                }
            });
        }

        function MarkAsRead() {
            ApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
            ApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = true;
            var _input = InputData(ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj, 5);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _data = {
                        IsCompleted: true,
                        Item: ApprovalNotifyEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception read succesfully...");
                    ApprovalNotifyEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Exception read failed...");
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    ApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsMarkRead = false;
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
