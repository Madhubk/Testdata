(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExceptNotifyDirectiveController", ExceptNotifyDirectiveController);

    ExceptNotifyDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr"];

    function ExceptNotifyDirectiveController($q, helperService, apiService, appConfig, toastr) {
        var ExceptNotifyDirectiveCtrl = this;

        function Init() {
            ExceptNotifyDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Notification_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitExceptionNotify();
            TaskGetById();
        }

        function InitExceptionNotify() {
            ExceptNotifyDirectiveCtrl.ePage.Masters.MyTask = ExceptNotifyDirectiveCtrl.taskObj;
            ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionData = {};
            ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionObj = {};
            ExceptNotifyDirectiveCtrl.ePage.Masters.MarkAsRead = MarkAsRead;
            ExceptNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
            ExceptNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;

            if (ExceptNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof ExceptNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    ExceptNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(ExceptNotifyDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + ExceptNotifyDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    ConsigneeDetails(response.data.Response);
                }
            });
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
                    ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIPorOrderHeader.Supplier;
                    ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIPorOrderHeader.Buyer;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.CntContainerList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                }
            });
        }

        function MarkAsRead() {
            ExceptNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Please wait...";
            ExceptNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = true;
            if (ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionComments) {
                JobCommentInsert().then(function (response) {
                    if (response.data.Status == "Success") {
                        Complete();
                    } else {
                        toastr.error("Failed...");
                        ExceptNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                        ExceptNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;
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
                "EntityRefKey": ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": ExceptNotifyDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Comments": ExceptNotifyDirectiveCtrl.ePage.Masters.ExceptionComments
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
            var _input = InputData(ExceptNotifyDirectiveCtrl.ePage.Masters.MyTask, 2);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Exception read succesfully...");
                    ExceptNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    ExceptNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;
                } else {
                    ExceptNotifyDirectiveCtrl.ePage.Masters.IsReadBtn = "Mark As Read";
                    ExceptNotifyDirectiveCtrl.ePage.Masters.IsMarkRead = false;
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
