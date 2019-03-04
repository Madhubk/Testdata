(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdExceptApprovalEditDirectiveController", OrdExceptApprovalEditDirectiveController);

    OrdExceptApprovalEditDirectiveController.$inject = ["$q", "$injector", "helperService", "apiService", "appConfig", "toastr", "authService"];

    function OrdExceptApprovalEditDirectiveController($q, $injector, helperService, apiService, appConfig, toastr, authService) {
        var OrdExceptApprovalEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            OrdExceptApprovalEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Approval_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": OrdExceptApprovalEditDirectiveCtrl.entityObj
                    }
                }
            };

            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ExceptionApprovalInit();
        }

        function ExceptionApprovalInit() {
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj = OrdExceptApprovalEditDirectiveCtrl.taskObj;
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.Exception = {};
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.Approval = Approval;
            if (OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(response.data.Response.RelatedDetails);
                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
                    }
                    GetDetails(response.data.Response);
                    GetConfigDetails(OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData);
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
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIOrder_Buyer.OrderNo;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIOrder_Buyer.ContainerMode;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIOrder_Buyer.BuyerName;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIOrder_Buyer.SupplierName;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIOrder_Buyer.TransportMode;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIOrder_Buyer.IncoTerm;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIOrder_Buyer.PortOfLoading;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIOrder_Buyer.PortOfDischarge;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIOrder_Buyer.PlannedCarrier;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIOrder_Buyer.PlannedVoyage;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIOrder_Buyer.PlannedVessel;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIOrder_Buyer.PlannedETD;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIOrder_Buyer.PlannedETA;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIShipmentHeader.Origin;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIShipmentHeader.Destination;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIShipmentHeader.PlannedCarrier;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIShipmentHeader.PlannedVoyage;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIShipmentHeader.PlannedVessel;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIShipmentHeader.PlannedETD;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIShipmentHeader.PlannedETA;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UICntContainer.ContainerNo;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UICntContainer.ContainerMode;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UICntContainer.ORG_Consignee_Code;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UICntContainer.ORG_Consignor_Code;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UICntContainer.TransportMode;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UICntContainer.IncoTerm;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UICntContainer.Origin;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UICntContainer.Destination;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UICntContainer.Carrier;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UICntContainer.Voyage;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UICntContainer.Vessel;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UICntContainer.ETD;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UICntContainer.ETA;
                }
            });
        }

        function Approval(type) {
            if (type != undefined || type != "") {
                if (type == "Approved") {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Please wait...";
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = true;
                    if (OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        Update().then(function (response) {
                            if (response.data.Status == "Success") {
                                JobCommentInsert().then(function (response) {
                                    if (response.data.Status == "Success") {
                                        ApprovalTask();
                                    } else {
                                        toastr.error("Failed...");
                                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                                    }
                                });
                            } else {
                                toastr.error("Failed...");
                                OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                                OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                            }
                        });
                    } else {
                        ApprovalTask();
                    }
                } else {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Please wait...";
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = true;
                    if (OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        Update().then(function (response) {
                            if (response.data.Status == "Success") {
                                JobCommentInsert().then(function (response) {
                                    if (response.data.Status == "Success") {
                                        RejectTask();
                                    } else {
                                        toastr.error("Failed...");
                                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                                    }
                                });
                            } else {
                                toastr.error("Failed...");
                                OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                                OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                            }
                        });
                    } else {
                        toastr.warning("Comments should be manotory...");
                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    }
                }
            }
        }

        function Update() {
            var deferred = $q.defer();
            var _input = angular.copy(OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData);
            _input.Description = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionComments;
            _input.RelatedDetails = JSON.stringify(OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails);
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
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.Description = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
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
            var _input = InputData(OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj, 1, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    var _data = {
                        IsCompleted: true,
                        Item: OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception succesfully Approved...");
                    OrdExceptApprovalEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApprove = false;
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsApproveBtn = "Approve";
                    toastr.error("Exception Approval failed...");
                }
            });
        }

        function RejectTask() {
            var _input = InputData(OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj, 0, 3);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
                    var _data = {
                        IsCompleted: true,
                        Item: OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception succesfully Rejected...");
                    OrdExceptApprovalEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsRejectBtn = "Reject";
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.IsReject = false;
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
                            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponseTemp = angular.copy(response.data.Response);
                            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse = response.data.Response;
                            if (OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails) {
                                OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse.Entities = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails;
                            }
                        }
                    }
                }
            });
        }

        function GetCommentsList() {
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                } else {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentsList = [];
                }
            });
        }

        function GetCommentsFilterList() {
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    OrdExceptApprovalEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        Init();
    }
})();