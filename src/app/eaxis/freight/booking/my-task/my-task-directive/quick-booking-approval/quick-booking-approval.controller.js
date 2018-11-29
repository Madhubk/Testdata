(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QuickBookingApprovalDirectiveController", QuickBookingApprovalDirectiveController);

    QuickBookingApprovalDirectiveController.$inject = ["$window", "$q", "helperService", "apiService", "appConfig", "authService", "toastr"];

    function QuickBookingApprovalDirectiveController($window, $q, helperService, apiService, appConfig, authService, toastr) {
        var QuickBookingApprovalDirectiveCtrl = this;

        function Init() {
            QuickBookingApprovalDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Quick_Booking_Approval",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            QuickBookingApprovalDirectiveCtrl.ePage.Masters.MyTask = QuickBookingApprovalDirectiveCtrl.taskObj;
            QuickBookingApprovalDirectiveCtrl.ePage.Masters.ApproveOrReject = ApproveOrReject
            QuickBookingApprovalDirectiveCtrl.ePage.Masters.IsDisabled = false
            QuickBookingApprovalDirectiveCtrl.ePage.Masters.CompleteApprove = "Approve"
            QuickBookingApprovalDirectiveCtrl.ePage.Masters.CompleteReject = "Reject"
            TaskGetById();
        }

        function TaskGetById() {
            QuickBookingApprovalDirectiveCtrl.ePage.Masters.OrderDetails = [];
            if (QuickBookingApprovalDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + QuickBookingApprovalDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        QuickBookingApprovalDirectiveCtrl.ePage.Masters.HeaderDetails = response.data.Response;
                        OrderGetById(response.data.Response.PK);
                    }
                });
            }
        }

        function OrderGetById(_bookingPk) {
            var _filter = {
                "SHP_FK": _bookingPk
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        QuickBookingApprovalDirectiveCtrl.ePage.Masters.OrderDetails = response.data.Response;
                    }
                } else {

                }
            });
        }

        function ApproveOrReject(type) {
            var comments = QuickBookingApprovalDirectiveCtrl.ePage.Masters.Comments
            if (comments) {
                QuickBookingApprovalDirectiveCtrl.ePage.Masters.IsDisabled = true;
                QuickBookingApprovalDirectiveCtrl.ePage.Masters["Complete" + type] = "Please wait..";
                if (type == 'Approve') {
                    JobInsertInput('GEN');
                    JobCommentsInsert().then(function (response) {
                        if (response.data.Status == "Success") {
                            UpdateRecords(type).then(function (res) {
                                if (res.data.Status == "Success") {
                                    TaskComplete(type);
                                }
                            });
                        } else {
                            toastr.error("Save filed..");
                        }
                    });

                } else {
                    JobInsertInput('GEN');
                    JobCommentsInsert().then(function (response) {
                        if (response.data.Status == "Success") {
                            TaskComplete(type);
                        } else {
                            toastr.error("Save filed..");
                        }
                    });
                }
            } else {
                toastr.warning("Please Enter the Comments..")
            }
        }

        function UpdateRecords() {
            var deferred = $q.defer();
            var _input = [{
                "EntityRefPK": QuickBookingApprovalDirectiveCtrl.ePage.Masters.HeaderDetails.UIShpExtendedInfo.PK,
                "Properties": [{
                    "PropertyName": "SEI_IsApproved",
                    "PropertyNewValue": true
                }]
            }]
            // job routes update api call
            apiService.post("eAxisAPI", appConfig.Entities.ShpExtended.API.UpdateRecords.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function JobInsertInput(type) {
            QuickBookingApprovalDirectiveCtrl.ePage.Masters.CommentsArray = [{
                "PK": "",
                "EntityRefKey": QuickBookingApprovalDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": QuickBookingApprovalDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "CommentsType": type,
                "Comments": QuickBookingApprovalDirectiveCtrl.ePage.Masters.Comments
            }]
        }

        function JobCommentsInsert() {
            var deferred = $q.defer();
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, QuickBookingApprovalDirectiveCtrl.ePage.Masters.CommentsArray).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function TaskComplete(type) {

            var obj = {

                "CompleteInstanceNo": QuickBookingApprovalDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                "CompleteStepNo": QuickBookingApprovalDirectiveCtrl.ePage.Masters.MyTask.WSI_StepNo
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, obj).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Task " + type + " successfully");
                    QuickBookingApprovalDirectiveCtrl.onRefreshStatusCount()
                    QuickBookingApprovalDirectiveCtrl.onRefreshTask()
                } else {
                    toastr.error("Failed...");
                }
            });
        }

        Init();
    }
})();