(function () {
    "use strict";

    angular
        .module("Application")
        .controller("HelpTopicController", HelpTopicController);

    HelpTopicController.$inject = ["$scope", "helperService", "apiService", "helpConfig", "$location", "$window"];

    function HelpTopicController($scope, helperService, apiService, helpConfig, $location, $window) {
        /* jshint validthis: true */
        var HelpTopicCtrl = this;

        function Init() {
            HelpTopicCtrl.ePage = {
                "Title": "",
                "Prefix": "HelpTopic",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            try {
                InitTopic();
            } catch (error) {
                console.log(error);
            }
        }

        function InitTopic() {
            HelpTopicCtrl.ePage.Masters.Topic = {};
            HelpTopicCtrl.ePage.Masters.Topic.GetSubTopicList = GetSubTopicList;
            HelpTopicCtrl.ePage.Masters.Topic.OnTopicClick = OnTopicClick;

            GetTopicList();
        }



        function GetTopicList() {
            HelpTopicCtrl.ePage.Masters.Topic.ListSource = undefined;
            var _filter = {
                "Self_FK": "NULL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": helpConfig.Entities.Topics.API.FindAll.FilterID
            };

            apiService.post("authAPI", helpConfig.Entities.Topics.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    HelpTopicCtrl.ePage.Masters.Topic.ListSource = response.data.Response;

                    HelpTopicCtrl.ePage.Masters.Topic.ListSource.map(function (value, key) {
                        value.SubTopicList = [];
                    });
                } else {
                    HelpTopicCtrl.ePage.Masters.Topic.ListSource = [];
                }
            });
        }

        function OnTopicClick($item) {
            if ($item.ItHasChild === false) {
                var _queryString = $item;
                $window.open("#/help/content?topic=" + helperService.encryptData(_queryString));
            } else if ($item.ItHasChild === true) {
                ($item.IsToggle) ? $item.IsToggle = false: $item.IsToggle = true;
                if ($item.ItHasChild && (!$item.SubTopicList || $item.SubTopicList.length == 0)) {
                    GetSubTopicList($item);
                }
            }
        }

        function GetSubTopicList($item, $patent, mode) {
            var _filter = {
                "Self_FK": $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": helpConfig.Entities.Topics.API.FindAll.FilterID
            };

            apiService.post("authAPI", helpConfig.Entities.Topics.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        if (mode == "delete") {
                            toastr.warning("Could not delete...!");
                        } else {
                            if (!$item.SubTopicList) {
                                $item.SubTopicList = [];
                            }
                            response.data.Response.map(function (value, key) {
                                if (!value.SubTopicList) {
                                    value.SubTopicList = [];
                                }
                                $item.SubTopicList.push(value);
                            });
                            $item.ItHasChild = true;
                            $item.IsToggle = true;
                        }
                    } else {
                        $item.SubTopicList = [];
                        $item.ItHasChild = false;
                        $item.IsToggle = false;

                    }
                }
            });
        }

        Init();
    }
})();