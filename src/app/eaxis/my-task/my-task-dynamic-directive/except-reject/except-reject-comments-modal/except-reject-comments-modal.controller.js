(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CommentsHisModalController", CommentsHisModalController);

    CommentsHisModalController.$inject = ["apiService", "appConfig", "helperService", "$uibModalInstance", "param"];

    function CommentsHisModalController(apiService, appConfig, helperService, $uibModalInstance, param) {
        var CommentsHisModalCtrl = this;

        function Init() {
            CommentsHisModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Comments_History",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            
            InitCommentsHistory();       
        }

        function InitCommentsHistory() {
            CommentsHisModalCtrl.ePage.Masters.Param = param.BulkInput;   
            CommentsHisModalCtrl.ePage.Masters.Close = Close;
            ExceptionCommentDetails();
            // "0B72041F-7514-44C9-A3F7-1084E27E64A0"
        }

        function ExceptionCommentDetails() {
            var _filter = {
                "EntityRefKey" : CommentsHisModalCtrl.ePage.Masters.Param.PK,
                "EntitySource" : CommentsHisModalCtrl.ePage.Masters.Param.EntitySource
            };
            var _input = {
                "searchInput":  helperService.createToArrayOfObject(_filter),
                "FilterID" : appConfig.Entities.JobComments.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobComments.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if(response.data.Response.length > 0) {
                        CommentsHisModalCtrl.ePage.Masters.CommentHistory = response.data.Response;
                    } else {
                        CommentsHisModalCtrl.ePage.Masters.CommentHistory = [];
                    }
                } else {
                    CommentsHisModalCtrl.ePage.Masters.CommentHistory = [];
                }
            });
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
