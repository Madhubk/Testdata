(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdExceptApprovalDirectiveController", OrdExceptApprovalDirectiveController);

    OrdExceptApprovalDirectiveController.$inject = ["$q", "helperService", "apiService", "appConfig", "toastr", "authService"];

    function OrdExceptApprovalDirectiveController($q, helperService, apiService, appConfig, toastr, authService) {
        var OrdExceptApprovalDirectiveCtrl = this;

        function Init() {
            OrdExceptApprovalDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Approval_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitExceptionApproval();
        }

        function InitExceptionApproval() {
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask = OrdExceptApprovalDirectiveCtrl.taskObj;
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj = {};
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData = {};
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.Approval = Approval;
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;

            if (OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig) {
                if (typeof OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig == "string") {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig = JSON.parse(OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.OtherConfig);
                }
            }
            TaskGetById();
        }

        function TaskGetById() {
            if (OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                        if (typeof response.data.Response.RelatedDetails == "string") {
                            OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                            OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
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
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIOrder_Buyer.Supplier;
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIOrder_Buyer.Buyer;
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UIOrder_Buyer.PK;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UIShipmentHeader.PK;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Supplier = response.data.Response.UIShipmentHeader.ORG_Shipper_Code;
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.Buyer = response.data.Response.UIShipmentHeader.ORG_Consignee_Code;
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionObj.OSC_FK = response.data.Response.UICntContainer.PK;
                }
            });
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Approve") {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Please wait...";
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = true;
                    if (OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        Update().then(function (response) {
                            if (response.data.Status == "Success") {
                                JobCommentInsert().then(function (response) {
                                    if (response.data.Status == "Success") {
                                        ApprovalTask();
                                    } else {
                                        toastr.error("Failed...");
                                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                                    }
                                });
                            }
                        });
                    } else {
                        ApprovalTask();
                    }
                } else {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Please wait...";
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = true;
                    if (OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        Update().then(function (response) {
                            if (response.data.Status == "Success") {
                                JobCommentInsert().then(function (response) {
                                    if (response.data.Status == "Success") {
                                        RejectTask();
                                    } else {
                                        toastr.error("Failed...");
                                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                                    }
                                });
                            } else {
                                toastr.error("Failed...");
                                OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                            }
                        });
                    } else {
                        toastr.warning("Comments should be manotory...");
                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                    }
                }
            }
        }

        function Update() {
            var deferred = $q.defer();
            var _input = angular.copy(OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData);
            _input.Description = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionComments;
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
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.Description = OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
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
            var _input = InputData(OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask, 1, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.success("Exception succesfully Approved...");
                } else {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApprove = false;
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.error("Exception Approval failed...");
                }
            });
        }

        function RejectTask() {
            var _input = InputData(OrdExceptApprovalDirectiveCtrl.ePage.Masters.MyTask, 0, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Exception succesfully Rejected...");
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                } else {
                    toastr.error("Exception Rejection failed...");
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.IsReject = false;
                }
            });
        }

        function GetCommentsFilterList() {
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        function GetCommentsList() {
            OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = OrdExceptApprovalDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                    OrdExceptApprovalDirectiveCtrl.listSource = OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentsList;
                } else {
                    OrdExceptApprovalDirectiveCtrl.ePage.Masters.CommentsList = [];
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