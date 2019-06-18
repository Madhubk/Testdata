(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DowntimeApprovalDirectiveController", DowntimeApprovalDirectiveController);

    DowntimeApprovalDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr", "authService", "downtimeRequestConfig"];

    function DowntimeApprovalDirectiveController($q, helperService, apiService, appConfig, toastr, authService, downtimeRequestConfig) {
        var DowntimeApprovalDirectiveCtrl = this;

        function Init() {
            DowntimeApprovalDirectiveCtrl.ePage = {
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
            DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask = DowntimeApprovalDirectiveCtrl.taskObj;
            DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj = {};
            DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData = {};
            DowntimeApprovalDirectiveCtrl.ePage.Masters.Approval = Approval;
            DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
            DowntimeApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            DowntimeApprovalDirectiveCtrl.ePage.Masters.IsReject = false;

            if (DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function GetData() {
            // Get saved data
            var GetPK = DowntimeApprovalDirectiveCtrl.taskObj;

            apiService.get("eAxisAPI", downtimeRequestConfig.Entities.Header.API.GetByID.Url + "/" + GetPK.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    console.log(response.data.Response)

                    DowntimeApprovalDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    
                    // var strAddtionalInfo = JSON.parse(DowntimeApprovalDirectiveCtrl.ePage.Entities.Header.Data.UIDowntimeRequest.AddtionalInfo);
                    
                    // DowntimeApprovalDirectiveCtrl.ePage.Entities.Header.Data.AppObj = {};
                    // DowntimeApprovalDirectiveCtrl.ePage.Entities.Header.Data.SrqArea = {};

                    // DowntimeApprovalDirectiveCtrl.ePage.Entities.Header.Data.AppObj.UserImpacted = strAddtionalInfo.UsersImpacted;
                    // DowntimeApprovalDirectiveCtrl.ePage.Entities.Header.Data.SrqArea = strAddtionalInfo.Purpose;

                }
            });
        }

        function TaskGetById() {
            if (DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                        if (typeof response.data.Response.RelatedDetails == "string") {
                            DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                            DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
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
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIOrder_Buyer.Supplier;
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIOrder_Buyer.Buyer;
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UIOrder_Buyer.PK;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UIShipmentHeader.PK;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UICntContainer.PK;
                }
            });
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Approve") {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Please wait...";
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApprove = true;
                    if (DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        Update().then(function (response) {
                            if (response.data.Status == "Success") {
                                JobCommentInsert().then(function (response) {
                                    if (response.data.Status == "Success") {
                                        ApprovalTask();
                                    } else {
                                        toastr.error("Failed...");
                                        DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                                        DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                                    }
                                });
                            }
                        });
                    } else {
                        ApprovalTask();
                    }
                } else {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Please wait...";
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsReject = true;
                    if (DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        Update().then(function (response) {
                            if (response.data.Status == "Success") {
                                JobCommentInsert().then(function (response) {
                                    if (response.data.Status == "Success") {
                                        RejectTask();
                                    } else {
                                        toastr.error("Failed...");
                                        DowntimeApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                        DowntimeApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                                    }
                                });
                            } else {
                                toastr.error("Failed...");
                                DowntimeApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                DowntimeApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                            }
                        });
                    } else {
                        toastr.warning("Comments should be manotory...");
                        DowntimeApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                        DowntimeApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                    }
                }
            }
        }

        function Update() {
            var deferred = $q.defer();
            var _input = angular.copy(DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData);
            _input.Description = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionComments;
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
            DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.Description = DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
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
            var _input = InputData(DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask, 1, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.success("Exception succesfully Approved...");
                } else {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.error("Exception Approval failed...");
                }
            });
        }

        function RejectTask() {
            var _input = InputData(DowntimeApprovalDirectiveCtrl.ePage.Masters.MyTask, 0, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Exception succesfully Rejected...");
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                } else {
                    toastr.error("Exception Rejection failed...");
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                }
            });
        }

        function GetCommentsFilterList() {
            DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        function GetCommentsList() {
            DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = DowntimeApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                    DowntimeApprovalDirectiveCtrl.listSource = DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentsList;
                } else {
                    DowntimeApprovalDirectiveCtrl.ePage.Masters.CommentsList = [];
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