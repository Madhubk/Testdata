(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DowntimeApprovalEditDirectiveController", DowntimeApprovalEditDirectiveController);

    DowntimeApprovalEditDirectiveController.$inject = ["$q", "$injector", "helperService", "apiService", "appConfig", "toastr", "authService", "downtimeRequestConfig"];

    function DowntimeApprovalEditDirectiveController($q, $injector, helperService, apiService, appConfig, toastr, authService, downtimeRequestConfig) {
        var DowntimeApprovalEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            DowntimeApprovalEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Approval_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": DowntimeApprovalEditDirectiveCtrl.entityObj
                    }
                }
            };

            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ExceptionApprovalInit();
            GetData();
        }

        function ExceptionApprovalInit() {
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj = DowntimeApprovalEditDirectiveCtrl.taskObj;
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.Exception = {};
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.Approval = Approval;
            if (DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function GetData() {
            // Get saved data
            var GetPK = DowntimeApprovalEditDirectiveCtrl.taskObj;

            apiService.get("eAxisAPI", downtimeRequestConfig.Entities.Header.API.GetByID.Url + "/" + GetPK.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    console.log(response.data.Response)

                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;

                    var strAddtionalInfo = JSON.parse(DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.AddtionalInfo);

                    // DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.AppObj = {};
                    // DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.SrqArea = {};

                    // DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
                    // DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.SrqArea = strAddtionalInfo.Purpose;

                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.AppObj = {};
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.SrqArea = {};

                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.SrqArea = strAddtionalInfo.Purpose;

                }
            });
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                        DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
                    }
                    GetDetails(response.data.Response);
                    GetConfigDetails(DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData);
                    GetCommentsList();
                    GetCommentsFilterList();
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
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIOrder_Buyer.OrderNo;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIOrder_Buyer.ContainerMode;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIOrder_Buyer.BuyerName;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIOrder_Buyer.SupplierName;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIOrder_Buyer.TransportMode;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIOrder_Buyer.IncoTerm;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIOrder_Buyer.PortOfLoading;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIOrder_Buyer.PortOfDischarge;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIOrder_Buyer.PlannedCarrier;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIOrder_Buyer.PlannedVoyage;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIOrder_Buyer.PlannedVessel;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIOrder_Buyer.PlannedETD;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIOrder_Buyer.PlannedETA;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIShipmentHeader.Origin;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIShipmentHeader.Destination;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIShipmentHeader.PlannedCarrier;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIShipmentHeader.PlannedVoyage;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIShipmentHeader.PlannedVessel;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIShipmentHeader.PlannedETD;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIShipmentHeader.PlannedETA;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UICntContainer.ContainerNo;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UICntContainer.ContainerMode;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UICntContainer.ORG_Consignee_Code;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UICntContainer.ORG_Consignor_Code;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UICntContainer.TransportMode;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UICntContainer.IncoTerm;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UICntContainer.Origin;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UICntContainer.Destination;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UICntContainer.Carrier;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UICntContainer.Voyage;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UICntContainer.Vessel;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UICntContainer.ETD;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UICntContainer.ETA;
                }
            });
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Approved") {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Please wait...";
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = true;
                    
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.Status = true;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.IsModified = true;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.RequestStatus = "Approved";
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.IsModified = true;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.ApprovedBy = authService.getUserInfo().UserId;

                    // DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.PK = DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.PK;
                    var _input = DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data;

                    // Update Data
                    apiService.post("eAxisAPI", downtimeRequestConfig.Entities.Header.API.UpdateDownTimeRequest.Url, _input).then(function (response) {
                        if (response.data.Status == "Success") {
                            ApprovalTask();
                            //toastr.success("Success...");
                        } else {
                            toastr.error("Failed...");
                            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                        }
                    });

                    // if (DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                    //     Update().then(function (response) {
                    //         if (response.data.Status == "Success") {
                    //             JobCommentInsert().then(function (response) {
                    //                 if (response.data.Status == "Success") {
                    //                     ApprovalTask();
                    //                 } else {
                    //                     toastr.error("Failed...");
                    //                     DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    //                     DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    //                 }
                    //             });
                    //         } else {
                    //             toastr.error("Failed...");
                    //             DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    //             DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    //         }
                    //     });
                    // } else {
                    //     ApprovalTask();
                    // }
                } else {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Please wait...";
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = true;

                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.Status = false;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.IsModified = true;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.RequestStatus = "Rejected";
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.IsModified = true;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.ApprovedBy = authService.getUserInfo().UserId;

                    var _input = DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data;

                    // Update Data
                    apiService.post("eAxisAPI", downtimeRequestConfig.Entities.Header.API.UpdateDownTimeRequest.Url, _input).then(function (response) {
                        if (response.data.Status == "Success") {
                            RejectTask();
                            //toastr.success("Success...");
                        } else {
                            toastr.error("Failed...");
                            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                        }
                    });

                    // if (DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                    //     Update().then(function (response) {
                    //         if (response.data.Status == "Success") {
                    //             JobCommentInsert().then(function (response) {
                    //                 if (response.data.Status == "Success") {
                    //                     RejectTask();
                    //                 } else {
                    //                     toastr.error("Failed...");
                    //                     DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    //                     DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    //                 }
                    //             });
                    //         } else {
                    //             toastr.error("Failed...");
                    //             DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    //             DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    //         }
                    //     });
                    // } else {
                    //     toastr.warning("Comments should be manotory...");
                    //     DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    //     DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    // }
                }
            }
        }

        function Update() {
            var deferred = $q.defer();
            var _input = angular.copy(DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData);
            _input.Description = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments;
            _input.RelatedDetails = JSON.stringify(DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails);
            _input.IsModified = true;
            apiService.post('eAxisAPI', appConfig.Entities.JobException.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.Description = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(function (response) {
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
            // var _input = InputData(DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj, 1, 3);
            // apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
            //         DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            //         var _data = {
            //             IsCompleted: true,
            //             Item: DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj
            //         };
            //         toastr.success("Exception succesfully Approved...");
            //         DowntimeApprovalEditDirectiveCtrl.onComplete({
            //             $item: _data
            //         });
            //     } else {
            //         DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
            //         DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            //         toastr.error("Exception Approval failed...");
            //     }
            // });


            // EBPMEngine / CompleteProcess
            var _inputObj = {
                "CompleteInstanceNo": DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": "",
                    "Val2": "",
                    "Val3": "",
                    "Val4": "",
                    "Val5": "",
                    "Val6": "",
                    "Val7": "",
                    "Val8": "",
                    "Val9": "",
                    "Val10": ""
                }
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    var _data = {
                        IsCompleted: true,
                        Item: DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception succesfully Approved...");
                    DowntimeApprovalEditDirectiveCtrl.onComplete({
                        $item: _data
                    });

                    // // EBPMEngine / InitiateProcess
                    // var _input = {
                    //     ProcessName: "DownTime_Request",
                    //     InitBy: "",

                    //     EntitySource: "SRQ",
                    //     EntityRefCode: DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.RequestNo,
                    //     EntityRefKey: DowntimeApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.PK,

                    //     SAP_FK: authService.getUserInfo().AppPK,
                    //     TenantCode: authService.getUserInfo().TenantCode,
                    //     IsModified: true
                    // };

                    // apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.InitiateProcess.Url, _input).then(function (response) {
                    //     if (response.data.Response) {
                    //         toastr.success("Process Initiated succesfully");
                    //     }
                    // });

                } else {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.error("Exception Approval failed...");
                }
            });
        }

        function RejectTask() {
            // var _input = InputData(DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj, 0, 3);
            // apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            //         DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
            //         var _data = {
            //             IsCompleted: true,
            //             Item: DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj
            //         };
            //         toastr.success("Exception succesfully Rejected...");
            //         DowntimeApprovalEditDirectiveCtrl.onComplete({
            //             $item: _data
            //         });
            //     } else {
            //         DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            //         DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
            //         toastr.error("Exception Rejection failed...");
            //     }
            // });

            // EBPMEngine / CompleteProcess
            var _inputObj = {
                "CompleteInstanceNo": DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": "",
                    "Val2": "",
                    "Val3": "",
                    "Val4": "",
                    "Val5": "",
                    "Val6": "",
                    "Val7": "",
                    "Val8": "",
                    "Val9": "",
                    "Val10": ""
                }
            }

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    var _data = {
                        IsCompleted: true,
                        Item: DowntimeApprovalEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception succesfully Rejected...");
                    DowntimeApprovalEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
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

        function GetConfigDetails(_dataConfig) {
            var _filter = {
                "DataEntryName": _dataConfig.CustomFormName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (typeof response.data.Response == "object") {
                        var _isEmpty = angular.equals({}, response.data.Response);
                        if (!_isEmpty) {
                            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponseTemp = angular.copy(response.data.Response);
                            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse = response.data.Response;
                            if (DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails) {
                                DowntimeApprovalEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse.Entities = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails;
                            }
                        }
                    }
                }
            });
        }

        function GetCommentsList() {
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                } else {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentsList = [];
                }
            });
        }

        function GetCommentsFilterList() {
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": DowntimeApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
            var _filter = {
                TypeCode: $item,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.MstCommentType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstCommentType.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    if (!_list) {
                        _list = [];
                    }

                    var _obj = {
                        TypeCode: "ALL",
                        Value: "All",
                        Key: "All"
                    };

                    _list.push(_obj);
                    _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    DowntimeApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        Init();
    }
})();