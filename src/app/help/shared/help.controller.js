(function () {
    "use strict";

    angular
        .module("Application")
        .controller("HelpController", HelpController);

    HelpController.$inject = ["helperService", "authService", "apiService", "appConfig"];

    function HelpController(helperService, authService, apiService, appConfig) {
        /* jshint validthis: true */
        var HelpCtrl = this;

        function Init() {
            HelpCtrl.ePage = {
                "Title": "",
                "Prefix": "Help",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            HelpCtrl.ePage.Masters.ApplicationLogo = "assets/img/logo/product-logo-dummy.png";

            GetLogos();
        }

        function GetLogos() {
            var _filter = {
                "USR_EntitySource": "USR_LOGO",
                "USR_EntityRefKey": authService.getUserInfo().UserPK,
                "USR_EntityRefCode": authService.getUserInfo().UserId,

                "TNT_EntitySource": "TNT_LOGO",
                "TNT_EntityRefKey": authService.getUserInfo().TenantPK,
                "TNT_EntityRefCode": authService.getUserInfo().TenantCode,

                "SAP_EntitySource": "SAP_LOGO",
                "SAP_EntityRefKey": authService.getUserInfo().AppPK,
                "SAP_EntityRefCode": authService.getUserInfo().AppCode
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecLogo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.SecLogo.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            if (value.EntitySource == "USR_LOGO") {
                                HelpCtrl.ePage.Masters.UserLogo = value.Logo;
                            } else if (value.EntitySource == "TNT_LOGO") {
                                HelpCtrl.ePage.Masters.TenantLogo = value.Logo;
                            } else if (value.EntitySource == "SAP_LOGO") {
                                HelpCtrl.ePage.Masters.AppLogo = value.Logo;
                            }
                        });
                    }
                }
            });
        }

        Init();
    }
})();
