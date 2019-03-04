(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrdExceptRejectEditDirectiveController", OrdExceptRejectEditDirectiveController);

    OrdExceptRejectEditDirectiveController.$inject = ["$q", "$injector", "authService", "helperService", "apiService", "appConfig", "toastr", "APP_CONSTANT"];

    function OrdExceptRejectEditDirectiveController($q, $injector, authService, helperService, apiService, appConfig, toastr, APP_CONSTANT) {
        var OrdExceptRejectEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            OrdExceptRejectEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Exception_Reject_Edit_Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": OrdExceptRejectEditDirectiveCtrl.entityObj
                    }
                }
            };

            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ExceptionRejectInit();
        }

        function ExceptionRejectInit() {
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj = OrdExceptRejectEditDirectiveCtrl.taskObj;
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData = {};
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.Exception = {};
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.SendForApproval = SendForApproval;
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
            // DatePicker
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            if (OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj) {
                TaskGetById();
            }
            GetRelatedLookupList();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function TaskGetById() {
            apiService.get("eAxisAPI", appConfig.Entities.JobException.API.GetById.Url + OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData = response.data.Response;
                    if (typeof response.data.Response.RelatedDetails == "string") {
                        OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = JSON.parse(OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails);
                        OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.OtherConfigData = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails[0].Data;
                    } else {
                        OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = {};
                    }
                    GetDetails(response.data.Response);
                    GetConfigDetails(OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData);
                    GetCommentsList();
                    GetCommentsFilterList();
                } else {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails = {};
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
            apiService.get("eAxisAPI", appConfig.Entities.BuyerOrder.API["1_1_listgetbyid"].Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.UIOrder_Buyer = response.data.Response.UIOrder_Buyer;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIOrder_Buyer.OrderNo;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIOrder_Buyer.ContainerMode;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIOrder_Buyer.BuyerName;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIOrder_Buyer.SupplierName;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIOrder_Buyer.TransportMode;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIOrder_Buyer.IncoTerm;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIOrder_Buyer.PortOfLoading;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIOrder_Buyer.PortOfDischarge;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIOrder_Buyer.PlannedCarrier;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIOrder_Buyer.PlannedVoyage;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIOrder_Buyer.PlannedVessel;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIOrder_Buyer.PlannedETD;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIOrder_Buyer.PlannedETA;
                }
            });
        }

        function GetShipmentDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.UIShipmentHeader = response.data.Response.UIShipmentHeader;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UIShipmentHeader.ShipmentNo;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UIShipmentHeader.ContainerMode;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UIShipmentHeader.ConsigneeName;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UIShipmentHeader.ShipperName;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UIShipmentHeader.TransportMode;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UIShipmentHeader.IncoTerm;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UIShipmentHeader.Origin;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UIShipmentHeader.Destination;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UIShipmentHeader.PlannedCarrier;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UIShipmentHeader.PlannedVoyage;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UIShipmentHeader.PlannedVessel;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UIShipmentHeader.PlannedETD;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UIShipmentHeader.PlannedETA;
                }
            });
        }

        function GetContainerDetails(_data) {
            apiService.get("eAxisAPI", appConfig.Entities.BuyerCntContainer.API.GetById.Url + _data.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.UICntContainer = response.data.Response.UICntContainer;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.SourceNo = response.data.Response.UICntContainer.ContainerNo;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ContainerMode = response.data.Response.UICntContainer.ContainerMode;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Buyer = response.data.Response.UICntContainer.ORG_Consignee_Code;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Shipper = response.data.Response.UICntContainer.ORG_Consignor_Code;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.TransportMode = response.data.Response.UICntContainer.TransportMode;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.IncoTerm = response.data.Response.UICntContainer.IncoTerm;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Origin = response.data.Response.UICntContainer.Origin;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Destination = response.data.Response.UICntContainer.Destination;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Carrier = response.data.Response.UICntContainer.Carrier;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Voyage = response.data.Response.UICntContainer.Voyage;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.Vessel = response.data.Response.UICntContainer.Vessel;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETD = response.data.Response.UICntContainer.ETD;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj.ETA = response.data.Response.UICntContainer.ETA;
                }
            });
        }

        function SendForApproval() {
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = true;
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Please wait...";
            var _input = angular.copy(OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData);
            if (OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                _input.Description = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionComments;
            }
            _input.RelatedDetails = JSON.stringify(_input.RelatedDetails);
            _input.IsModified = true;
            apiService.post('eAxisAPI', appConfig.Entities.JobException.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionComments) {
                        JobCommentInsert().then(function (response) {
                            if (response.data.Status == "Success") {
                                Complete();
                            } else {
                                toastr.error("Failed...");
                                OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
                                OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                            }
                        });
                    } else {
                        Complete();
                    }
                } else {
                    toastr.error("Exception approval failed...");
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                }
            });
        }

        function JobCommentInsert() {
            var deferred = $q.defer();
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.CommentsType = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].TypeCode;
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.Description = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentDescriptionList[0].Value;
            var _input = angular.copy(OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData);

            _input.EntityRefKey = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey;
            _input.EntitySource = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource;
            _input.EntityRefCode = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode;

            if (OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey) {
                _input.ParentEntityRefKey = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _input.ParentEntitySource = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _input.ParentEntityRefCode = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey) {
                _input.AdditionalEntityRefKey = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _input.AdditionalEntitySource = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _input.AdditionalEntityRefCode = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_input]).then(function (response) {
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
            var _input = InputData(OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj, 4);
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                    var _data = {
                        IsCompleted: true,
                        Item: OrdExceptRejectEditDirectiveCtrl.ePage.Masters.TaskObj
                    };
                    toastr.success("Exception approved succesfully...");
                    OrdExceptRejectEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApproval = false;
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.IsApprovalTxt = "Send for Approval";
                    toastr.error("Exception approval failed...");
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

        function GetRelatedLookupList() {
            var _filter = {
                Key: "ExceptionVessel_3316,ExceptionCarrier_3317",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
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
                            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponseTemp = angular.copy(response.data.Response);
                            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse = response.data.Response;
                            if (OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails) {
                                OrdExceptRejectEditDirectiveCtrl.ePage.Masters.Exception.DataConfigResponse.Entities = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.RelatedDetails;
                            }
                        }
                    }
                }
            });
        }

        function GetCommentsList() {
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentsList = undefined;
            var _filter = {
                "EntityRefKey": OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefKey,
                "EntitySource": OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntitySource,
                "EntityRefCode": OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.EntityRefCode
            };
            _filter.CommentsType = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentTypeList;

            if (OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey && OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableParentEntity != true) {
                _filter.ParentEntityRefKey = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefKey;
                _filter.ParentEntitySource = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntitySource;
                _filter.ParentEntityRefCode = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.ParentEntityRefCode;
            }

            if (OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey && OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.IsDisableAdditionalEntity != true) {
                _filter.AdditionalEntityRefKey = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefKey;
                _filter.AdditionalEntitySource = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntitySource;
                _filter.AdditionalEntityRefCode = OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.AdditionalEntityRefCode;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobComments.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentsList = response.data.Response;
                } else {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentsList = [];
                }
            });
        }

        function GetCommentsFilterList() {
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentTypeList = undefined;
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "JobComments",
                "Key": OrdExceptRejectEditDirectiveCtrl.ePage.Masters.ExceptionData.Type
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentTypeList = response.data.Response[0].Value;
                        GetCommentsDescription(response.data.Response[0].Value);
                    } else {
                        var _commentTypeList = [{
                            TypeCode: "GEN",
                            Value: "General",
                            Key: "General"
                        }];
                        OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _commentTypeList;
                        OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentTypeList = "GEN";
                    }
                }
            });
        }

        function GetCommentsDescription($item) {
            OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = undefined;
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

                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = _list;
                } else {
                    OrdExceptRejectEditDirectiveCtrl.ePage.Masters.CommentDescriptionList = [];
                }
            });
        }

        Init();
    }
})();