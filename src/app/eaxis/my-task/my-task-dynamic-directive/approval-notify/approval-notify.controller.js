(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApprovalNotifyDirectiveController", ApprovalNotifyDirectiveController);

    ApprovalNotifyDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr"];

    function ApprovalNotifyDirectiveController($q, helperService, apiService, appConfig, toastr) {
        var ApprovalNotifyDirectiveCtrl = this;

        function Init() {
            ApprovalNotifyDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Approval_Notification_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitApprovalNotify();
        }

        function InitApprovalNotify() {
            ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask = ApprovalNotifyDirectiveCtrl.taskObj;
            ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj = {};
            ApprovalNotifyDirectiveCtrl.ePage.Masters.MarkAsRead = MarkAsRead;
            ApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
            ApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;

            if (ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function TaskGetById() {
            if (ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
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
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIPorOrderHeader.Supplier;
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIPorOrderHeader.Buyer;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainerList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function MarkAsRead() {
            ApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
            ApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = true;
            if (ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionComments) {
                JobCommentInsert().then(function (response) {
                    if (response.data.Status == "Success") {
                        Complete();
                    } else {
                        toastr.error("Failed...");
                        ApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                        ApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                    }
                });
            } else {
                Complete();
            }
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            var _jobCommentsInput = {
                "PK": "",
                "EntityRefKey": ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Comments": ApprovalNotifyDirectiveCtrl.ePage.Masters.ExceptionComments
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

        function Complete() {
            var _input = InputData(ApprovalNotifyDirectiveCtrl.ePage.Masters.MyTask, 5);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Exception succesfully Read...");
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                } else {
                    toastr.error("Exception Read failed...");
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    ApprovalNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;
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
