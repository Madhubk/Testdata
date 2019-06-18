(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeploymentCompletionDirectiveController", DeploymentCompletionDirectiveController);

    DeploymentCompletionDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr", "authService", "downtimeRequestConfig"];

    function DeploymentCompletionDirectiveController($q, helperService, apiService, appConfig, toastr, authService, downtimeRequestConfig) {
        var DeploymentCompletionDirectiveCtrl = this;

        function Init() {
            DeploymentCompletionDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Approval_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                },
            };

            InitExceptionApproval();
            GetData();
        }

        function InitExceptionApproval() {
            DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask = DeploymentCompletionDirectiveCtrl.taskObj;
            DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj = {};
            DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData = {};
            DeploymentCompletionDirectiveCtrl.ePage.Masters.Approval = Approval;
            DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApprove = false;
            DeploymentCompletionDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            DeploymentCompletionDirectiveCtrl.ePage.Masters.IsReject = false;

            if (DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function GetData() {
            // Get saved data
            var GetPK = DeploymentCompletionDirectiveCtrl.taskObj;

            apiService.get("eAxisAPI", downtimeRequestConfig.Entities.Header.API.GetByID.Url + "/" + GetPK.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    console.log(response.data.Response)

                    DeploymentCompletionDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    
                    // var strAddtionalInfo = JSON.parse(DeploymentCompletionDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.AddtionalInfo);
                    
                    // DeploymentCompletionDirectiveCtrl.ePage.Entities.Header.Data.AppObj = {};
                    // DeploymentCompletionDirectiveCtrl.ePage.Entities.Header.Data.SrqArea = {};

                    // DeploymentCompletionDirectiveCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
                    // DeploymentCompletionDirectiveCtrl.ePage.Entities.Header.Data.SrqArea = strAddtionalInfo.Purpose;

                }
            });
        }

        function TaskGetById() {
            if (DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                        if (typeof response.data.Response.RelatedDetails == "string") {
                            DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                            DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
                        }
                        ConsigneeDetails(response.data.Response);
                        GetCommentsFilterList();
                        GetCommentsList();
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
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIOrder_Buyer.Supplier;
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIOrder_Buyer.Buyer;
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UIOrder_Buyer.PK;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UIShipmentHeader.PK;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UICntContainer.PK;
                }
            });
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Approve") {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApproveBtn = "Please wait...";
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApprove = true;
                    if (DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        Update().then(function (response) {
                            if (response.data.Status == "Success") {
                                JobCommentInsert().then(function (response) {
                                    if (response.data.Status == "Success") {
                                        ApprovalTask();
                                    } else {
                                        toastr.error("Failed...");
                                        DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApprove = false;
                                        DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                                    }
                                });
                            }
                        });
                    } else {
                        ApprovalTask();
                    }
                } else {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsRejectBtn = "Please wait...";
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsReject = true;
                    if (DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        Update().then(function (response) {
                            if (response.data.Status == "Success") {
                                JobCommentInsert().then(function (response) {
                                    if (response.data.Status == "Success") {
                                        RejectTask();
                                    } else {
                                        toastr.error("Failed...");
                                        DeploymentCompletionDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                        DeploymentCompletionDirectiveCtrl.ePage.Masters.IsReject = false;
                                    }
                                });
                            } else {
                                toastr.error("Failed...");
                                DeploymentCompletionDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                DeploymentCompletionDirectiveCtrl.ePage.Masters.IsReject = false;
                            }
                        });
                    } else {
                        toastr.warning("Comments should be manotory...");
                        DeploymentCompletionDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                        DeploymentCompletionDirectiveCtrl.ePage.Masters.IsReject = false;
                    }
                }
            }
        }

        function Update() {
            var deferred = $q.defer();
            var _input = angular.copy(DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData);
            _input.Description = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionComments;
            _input.RelatedDetails = JSON.stringify(_input.RelatedDetails);
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
            DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.Description = DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
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
            var _input = InputData(DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask, 1, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApprove = false;
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.success("Exception succesfully Approved...");
                } else {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApprove = false;
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.error("Exception Approval failed...");
                }
            });
        }

        function RejectTask() {
            var _input = InputData(DeploymentCompletionDirectiveCtrl.ePage.Masters.MyTask, 0, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Exception succesfully Rejected...");
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsReject = false;
                } else {
                    toastr.error("Exception Rejection failed...");
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.IsReject = false;
                }
            });
        }

        function GetCommentsFilterList() {
            DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        function GetCommentsList() {
            DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = DeploymentCompletionDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                    DeploymentCompletionDirectiveCtrl.listSource = DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentsList;
                } else {
                    DeploymentCompletionDirectiveCtrl.ePage.Masters.CommentsList = [];
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