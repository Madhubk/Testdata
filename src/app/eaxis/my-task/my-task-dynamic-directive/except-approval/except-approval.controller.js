(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptApprovalDirectiveController", ExceptApprovalDirectiveController);

    ExceptApprovalDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr"];

    function ExceptApprovalDirectiveController($q, helperService, apiService, appConfig, toastr) {
        var ExceptApprovalDirectiveCtrl = this;

        function Init() {
            ExceptApprovalDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Approval_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitExceptionApproval();
        }

        function InitExceptionApproval() {
            ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask = ExceptApprovalDirectiveCtrl.taskObj;
            ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj = {};
            ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData = {};
            ExceptApprovalDirectiveCtrl.ePage.Masters.Approval = Approval;
            ExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            ExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
            ExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            ExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;

            if (ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function TaskGetById() {
            if (ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                        ConsigneeDetails(response.data.Response);
                    }
                });
            }
        }

        function ConsigneeDetails(_inputData) {
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
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIPorOrderHeader.Supplier;
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIPorOrderHeader.Buyer;
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UIPorOrderHeader.PK;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UIShipmentHeader.PK;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainerList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                    ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UICntContainer.PK;
                }
            });
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Approve") {
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Please wait...";
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = true;
                    if (ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        JobCommentInsert().then(function (response) {
                            if (response.data.Status == "Success") {
                                ApprovalTask();
                            } else {
                                toastr.error("Failed...");
                                ExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                                ExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                            }
                        });
                    } else {
                        ApprovalTask();
                    }
                } else {
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Please wait...";
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = true;
                    if (ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        JobCommentInsert().then(function (response) {
                            if (response.data.Status == "Success") {
                                RejectTask();
                            } else {
                                toastr.error("Failed...");
                                ExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                ExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                            }
                        });
                    } else {
                        toastr.warning("Comments should be manotory...");
                        ExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                        ExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                    }
                }
            }
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            var _jobCommentsInput = {
                "PK": "",
                "EntityRefKey": ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Comments": ExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionComments
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
            var _input = InputData(ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask, 1, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.success("Exception succesfully Approved...");
                } else {
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.error("Exception Approval failed...");
                }
            });
        }

        function RejectTask() {
            var _input = InputData(ExceptApprovalDirectiveCtrl.ePage.Masters.MyTask, 0, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Exception succesfully Rejected...");
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                } else {
                    toastr.error("Exception Rejection failed...");
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    ExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
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
