(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptApprovalEditDirectiveController", ExceptApprovalEditDirectiveController);

    ExceptApprovalEditDirectiveController.$inject = ["$q", "$injector", "helperService", "apiService", "appConfig", "toastr"];

    function ExceptApprovalEditDirectiveController($q, $injector, helperService, apiService, appConfig, toastr) {
        var ExceptApprovalEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            ExceptApprovalEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Approval_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ExceptApprovalEditDirectiveCtrl.entityObj
                    }
                }
            };

            ExceptApprovalEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ExceptionApprovalInit();
        }

        function ExceptionApprovalInit() {
            ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj = ExceptApprovalEditDirectiveCtrl.taskObj;
            ExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
            ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
            ExceptApprovalEditDirectiveCtrl.ePage.Masters.Approval = Approval;
            if (ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        ExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
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
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIPorOrderHeader.OrderNo;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIPorOrderHeader.ContainerMode;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIPorOrderHeader.BuyerName;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIPorOrderHeader.SupplierName;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIPorOrderHeader.TransportMode;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIPorOrderHeader.IncoTerm;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIPorOrderHeader.PortOfLoading;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIPorOrderHeader.PortOfDischarge;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIPorOrderHeader.PlannedCarrier;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIPorOrderHeader.PlannedVoyage;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIPorOrderHeader.PlannedVessel;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIPorOrderHeader.PlannedETD;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIPorOrderHeader.PlannedETA;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIShipmentHeader.Origin;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIShipmentHeader.Destination;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIShipmentHeader.PlannedCarrier;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIShipmentHeader.PlannedVoyage;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIShipmentHeader.PlannedVessel;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIShipmentHeader.PlannedETD;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIShipmentHeader.PlannedETA;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainerList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UICntContainer.ContainerNo;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UICntContainer.ContainerMode;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UICntContainer.ORG_Consignee_Code;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UICntContainer.ORG_Consignor_Code;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UICntContainer.TransportMode;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UICntContainer.IncoTerm;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UICntContainer.Origin;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UICntContainer.Destination;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UICntContainer.Carrier;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UICntContainer.Voyage;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UICntContainer.Vessel;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UICntContainer.ETD;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UICntContainer.ETA;
                }
            });
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Approved") {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Please wait...";
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = true;
                    if (ExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        JobCommentInsert().then(function (response) {
                            if (response.data.Status == "Success") {
                                ApprovalTask();
                            } else {
                                toastr.error("Failed...");
                                ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                                ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                            }
                        });
                    } else {
                        ApprovalTask();
                    }
                } else {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Please wait...";
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = true;
                    if (ExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        JobCommentInsert().then(function (response) {
                            if (response.data.Status == "Success") {
                                RejectTask();
                            } else {
                                toastr.error("Failed...");
                                ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                            }
                        });
                    } else {
                        toastr.warning("Comments should be manotory...");
                        ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                        ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    }
                }
            }
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            var _jobCommentsInput = {
                "PK": "",
                "EntityRefKey": ExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Comments": ExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments
            }

            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_jobCommentsInput]).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Job Comments Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function ApprovalTask() {
            var _input = InputData(ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj, 1, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    var _data = {
                        IsCompleted: true,
                        Item: ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception succesfully Approved...");
                    ExceptApprovalEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.error("Exception Approval failed...");
                }
            });
        }

        function RejectTask() {
            var _input = InputData(ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj, 0, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    var _data = {
                        IsCompleted: true,
                        Item: ExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception succesfully Rejected...");
                    ExceptApprovalEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    ExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    toastr.error("Exception Rejection failed...");
                }
            });
        }

        function InputData(_data, val, CompleteStepNo) {
            var _dataSolts = {
                "Val1": val
            }
            var _filterInput = {
                "ProcessName": _data.ProcessName,
                "EntitySource": _data.EntitySource,
                "EntityRefKey": _data.EntityRefKey,
                "KeyReference": _data.KeyReference,
                "CompleteInstanceNo": _data.PSI_InstanceNo,
                "DataSlots": _dataSolts,
                "CompleteStepNo": CompleteStepNo,
                "IsModified": true
            };
            return _filterInput;
        }

        Init();
    }
})();
