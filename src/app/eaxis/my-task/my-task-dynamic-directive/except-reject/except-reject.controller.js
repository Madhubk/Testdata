(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptRejectDirectiveController", ExceptRejectDirectiveController);

    ExceptRejectDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr"];

    function ExceptRejectDirectiveController($q, helperService, apiService, appConfig, toastr) {
        var ExceptRejectDirectiveCtrl = this;

        function Init() {
            ExceptRejectDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Reject_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitExceptionReject();
            TaskGetById();
        }

        function InitExceptionReject() {
            ExceptRejectDirectiveCtrl.ePage.Masters.MyTask = ExceptRejectDirectiveCtrl.taskObj;
            ExceptRejectDirectiveCtrl.ePage.Masters.SendForApproval = SendForApproval;
            ExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
            ExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
            ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData = {};
            ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj = {};
            
            if (ExceptRejectDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ExceptRejectDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ExceptRejectDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ExceptRejectDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function TaskGetById() {
            if (ExceptRejectDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + ExceptRejectDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
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
                    ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIPorOrderHeader.Supplier;
                    ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIPorOrderHeader.Buyer;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainerList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function SendForApproval() {
            ExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = true;
            ExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Please wait...";
            var _input = {
                "PK": ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.PK,
                "EntityRefKey": ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode,
                "RelatedDetails": JSON.stringify(ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails),
                "IsModified": true
            };

            apiService.post('eAxisAPI', appConfig.Entities.JobException.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        JobCommentInsert().then(function (response) {
                            if (response.data.Status == "Success") {
                                Complete();
                            } else {
                                toastr.error("Failed...");
                                ExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
                                ExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                            }
                        });
                    } else {
                        Complete();
                    }
                } else {
                    toastr.error("Exception approval failed...");
                    ExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
                    ExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                }
            });
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            var _jobCommentsInput = {
                "PK": "",
                "EntityRefKey": ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": ExceptRejectDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Comments": ExceptRejectDirectiveCtrl.ePage.Masters.ExceptionComments
            }
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_jobCommentsInput]).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function Complete() {
            var _input = InputData(ExceptRejectDirectiveCtrl.ePage.Masters.MyTask, 4);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
                    ExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                    toastr.success("Task completed succesfully...");
                } else {
                    ExceptRejectDirectiveCtrl.ePage.Masters.IsApproval = false;
                    ExceptRejectDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                    toastr.error("Send approval failed...");
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
