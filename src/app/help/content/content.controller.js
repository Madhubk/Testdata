(function () {
    "use strict";

    angular
        .module("Application")
        .controller("HelpContentController", HelpContentController);

    HelpContentController.$inject = ["$sce", "helperService", "helpConfig", "apiService", "APP_CONSTANT", "$location"];

    function HelpContentController($sce, helperService, helpConfig, apiService, APP_CONSTANT, $location) {
        /* jshint validthis: true */
        var HelpContentCtrl = this;
        var _queryString = $location.search();

        function Init() {
            HelpContentCtrl.ePage = {
                "Title": "",
                "Prefix": "HelpContent",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            try {
                if (_queryString.topic) {
                    HelpContentCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString.topic));
                    if (HelpContentCtrl.ePage.Masters.QueryString.PK) {
                        InitContent();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        function InitContent() {
            HelpContentCtrl.ePage.Masters.Content = {};
            HelpContentCtrl.ePage.Masters.GetDownloadImage = GetDownloadImage;
            GetContentList();
        }

        function GetContentList() {
            HelpContentCtrl.ePage.Masters.Content.ContentListSource = undefined;
            var _filter = {
                TOP_FK: HelpContentCtrl.ePage.Masters.QueryString.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": helpConfig.Entities.HLPDocuments.API.FindAll.FilterID
            };

            apiService.post("authAPI", helpConfig.Entities.HLPDocuments.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    HelpContentCtrl.ePage.Masters.Content.ContentListSource = response.data.Response;
                    HelpContentCtrl.ePage.Masters.Content.ContentListSource.map(function (value, key) {
                        if (value.ContentType == "TextFormater") {
                            value.Content = $sce.trustAsHtml(value.Content);
                        }
                        if (value.ContentType == 'Image' && value.JOD_FK) {
                            GetDownloadImage(value)
                        }
                    });
                } else {
                    HelpContentCtrl.ePage.Masters.Content.ContentListSource = [];
                }
            });
        }

        function GetDownloadImage($item) {
            apiService.get("eAxisAPI", helpConfig.Entities.DMS.API.DMSDownload.Url + $item.JOD_FK).then(function (response) {
                if (response.data.Response) {
                    $item.ImgSrc = "data:image/png;base64," + response.data.Response.Base64str;
                }
            });
        }

        Init();
    }
})();