(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeploymentCompletionEditDirectiveController", DeploymentCompletionEditDirectiveController);

    DeploymentCompletionEditDirectiveController.$inject = ["$q", "$injector", "helperService", "apiService", "appConfig", "toastr", "authService", "downtimeRequestConfig"];

    function DeploymentCompletionEditDirectiveController($q, $injector, helperService, apiService, appConfig, toastr, authService, downtimeRequestConfig) {
        var DeploymentCompletionEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            DeploymentCompletionEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Approval_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": DeploymentCompletionEditDirectiveCtrl.entityObj
                    }
                }
            };

            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ExceptionApprovalInit();
            GetData();
        }

        function ExceptionApprovalInit() {
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj = DeploymentCompletionEditDirectiveCtrl.taskObj;
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.Exception = {};
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = false;
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.Approval = Approval;

            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsDeploymentBtn = "Deployment";
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsDeployment = false;
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.Deployment = Deployment;

            if (DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function Deployment() {
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsDeploymentBtn = "Please wait...";
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsDeployment = true;

            // EBPMEngine / CompleteProcess
            var _inputObj = {
                "CompleteInstanceNo": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsDeployment = false;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsDeploymentBtn = "Deployment";
                    var _data = {
                        IsCompleted: true,
                        Item: DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Deployed succesfully...");
                    DeploymentCompletionEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsDeployment = false;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsDeploymentBtn = "Deployment";
                    toastr.error("Deployed failed...");
                }
            });
        }

        function GetData() {
            // Get saved data
            var GetPK = DeploymentCompletionEditDirectiveCtrl.taskObj;

            apiService.get("eAxisAPI", downtimeRequestConfig.Entities.Header.API.GetByID.Url + "/" + GetPK.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    console.log(response.data.Response)

                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;

                    var strAddtionalInfo = JSON.parse(DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.AddtionalInfo);

                    // DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.AppObj = {};
                    // DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.SrqArea = {};

                    // DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
                    // DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.SrqArea = strAddtionalInfo.Purpose;

                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.AppObj = {};
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.SrqArea = {};

                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.SrqArea = strAddtionalInfo.Purpose;

                }
            });
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                        DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
                    }
                    GetDetails(response.data.Response);
                    GetConfigDetails(DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData);
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
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIOrder_Buyer.OrderNo;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIOrder_Buyer.ContainerMode;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIOrder_Buyer.BuyerName;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIOrder_Buyer.SupplierName;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIOrder_Buyer.TransportMode;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIOrder_Buyer.IncoTerm;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIOrder_Buyer.PortOfLoading;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIOrder_Buyer.PortOfDischarge;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIOrder_Buyer.PlannedCarrier;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIOrder_Buyer.PlannedVoyage;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIOrder_Buyer.PlannedVessel;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIOrder_Buyer.PlannedETD;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIOrder_Buyer.PlannedETA;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIShipmentHeader.Origin;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIShipmentHeader.Destination;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIShipmentHeader.PlannedCarrier;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIShipmentHeader.PlannedVoyage;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIShipmentHeader.PlannedVessel;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIShipmentHeader.PlannedETD;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIShipmentHeader.PlannedETA;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UICntContainer.ContainerNo;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UICntContainer.ContainerMode;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UICntContainer.ORG_Consignee_Code;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UICntContainer.ORG_Consignor_Code;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UICntContainer.TransportMode;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UICntContainer.IncoTerm;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UICntContainer.Origin;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UICntContainer.Destination;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UICntContainer.Carrier;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UICntContainer.Voyage;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UICntContainer.Vessel;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UICntContainer.ETD;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UICntContainer.ETA;
                }
            });
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Approved") {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Please wait...";
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = true;
                    
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.Status = true;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.IsModified = true;                    
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.IsModified = true;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.ApprovedBy = authService.getUserInfo().UserId;

                    // DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.PK = DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.PK;
                    var _input = DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data;

                    // Update Data
                    apiService.post("eAxisAPI", downtimeRequestConfig.Entities.Header.API.UpdateDownTimeRequest.Url, _input).then(function (response) {
                        if (response.data.Status == "Success") {
                            ApprovalTask();
                            //toastr.success("Success...");
                        } else {
                            toastr.error("Failed...");
                            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                        }
                    });

                    // if (DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                    //     Update().then(function (response) {
                    //         if (response.data.Status == "Success") {
                    //             JobCommentInsert().then(function (response) {
                    //                 if (response.data.Status == "Success") {
                    //                     ApprovalTask();
                    //                 } else {
                    //                     toastr.error("Failed...");
                    //                     DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    //                     DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    //                 }
                    //             });
                    //         } else {
                    //             toastr.error("Failed...");
                    //             DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    //             DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    //         }
                    //     });
                    // } else {
                    //     ApprovalTask();
                    // }
                } else {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Please wait...";
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = true;

                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.Status = false;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.IsModified = true;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.IsModified = true;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.ApprovedBy = authService.getUserInfo().UserId;

                    var _input = DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data;

                    // Update Data
                    apiService.post("eAxisAPI", downtimeRequestConfig.Entities.Header.API.UpdateDownTimeRequest.Url, _input).then(function (response) {
                        if (response.data.Status == "Success") {
                            RejectTask();
                            // toastr.success("Success...");
                        } else {
                            toastr.error("Failed...");
                            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
                        }
                    });

                    // if (DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                    //     Update().then(function (response) {
                    //         if (response.data.Status == "Success") {
                    //             JobCommentInsert().then(function (response) {
                    //                 if (response.data.Status == "Success") {
                    //                     RejectTask();
                    //                 } else {
                    //                     toastr.error("Failed...");
                    //                     DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    //                     DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    //                 }
                    //             });
                    //         } else {
                    //             toastr.error("Failed...");
                    //             DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    //             DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    //         }
                    //     });
                    // } else {
                    //     toastr.warning("Comments should be manotory...");
                    //     DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    //     DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    // }
                }
            }
        }

        function Update() {
            var deferred = $q.defer();
            var _input = angular.copy(DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData);
            _input.Description = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionComments;
            _input.RelatedDetails = JSON.stringify(DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails);
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
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.Description = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
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
            // var _input = InputData(DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj, 1, 3);
            // apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = false;
            //         DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            //         var _data = {
            //             IsCompleted: true,
            //             Item: DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj
            //         };
            //         toastr.success("Exception succesfully Approved...");
            //         DeploymentCompletionEditDirectiveCtrl.onComplete({
            //             $item: _data
            //         });
            //     } else {
            //         DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = false;
            //         DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            //         toastr.error("Exception Approval failed...");
            //     }
            // });


            // EBPMEngine / CompleteProcess
            var _inputObj = {
                "CompleteInstanceNo": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    var _data = {
                        IsCompleted: true,
                        Item: DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception succesfully Approved...");
                    DeploymentCompletionEditDirectiveCtrl.onComplete({
                        $item: _data
                    });

                    // // EBPMEngine / InitiateProcess
                    // var _input = {
                    //     ProcessName: "DownTime_Request",
                    //     InitBy: "",

                    //     EntitySource: "SRQ",
                    //     EntityRefCode: DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.RequestNo,
                    //     EntityRefKey: DeploymentCompletionEditDirectiveCtrl.ePage.Entities.Header.Data.UIServiceRequest.PK,

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
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.error("Exception Approval failed...");
                }
            });
        }

        function RejectTask() {
            // var _input = InputData(DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj, 0, 3);
            // apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            //         DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
            //         var _data = {
            //             IsCompleted: true,
            //             Item: DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj
            //         };
            //         toastr.success("Exception succesfully Rejected...");
            //         DeploymentCompletionEditDirectiveCtrl.onComplete({
            //             $item: _data
            //         });
            //     } else {
            //         DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            //         DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
            //         toastr.error("Exception Rejection failed...");
            //     }
            // });

            // EBPMEngine / CompleteProcess
            var _inputObj = {
                "CompleteInstanceNo": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    var _data = {
                        IsCompleted: true,
                        Item: DeploymentCompletionEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception succesfully Rejected...");
                    DeploymentCompletionEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.IsReject = false;
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
                            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponseTemp = angular.copy(response.data.Response);
                            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse = response.data.Response;
                            if (DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails) {
                                DeploymentCompletionEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse.Entities = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails;
                            }
                        }
                    }
                }
            });
        }

        function GetCommentsList() {
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                } else {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentsList = [];
                }
            });
        }

        function GetCommentsFilterList() {
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": DeploymentCompletionEditDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    DeploymentCompletionEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        Init();
    }
})();