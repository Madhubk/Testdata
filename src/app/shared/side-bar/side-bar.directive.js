(function () {
    "use strict";

    angular
        .module("Application")
        .directive("sideBar", SideBar);

    function SideBar() {
        let exports = {
            restrict: "EA",
            templateUrl: "app/shared/side-bar/side-bar.html",
            controller: "SideBarController",
            controllerAs: "SideBarCtrl",
            bindToController: true,
            scope: {}
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("SideBarController", SideBarController);

    SideBarController.$inject = ["$scope", "$location", "$uibModal", "$sce", "authService", "apiService", "helperService", "appConfig"];

    function SideBarController($scope, $location, $uibModal, $sce, authService, apiService, helperService, appConfig) {
        /* jshint validthis: true */
        let SideBarCtrl = this;

        function Init() {
            SideBarCtrl.ePage = {
                "Title": "",
                "Prefix": "SideBarBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SideBarCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            SideBarCtrl.ePage.Masters.GetMenuLink = GetMenuLink;
            SideBarCtrl.ePage.Masters.CloseExtLinkModal = CloseExtLinkModal;
            SideBarCtrl.ePage.Masters.MenuList = authService.getUserInfo().Menus;

            SetDefaultActiveMenu();
        }

        function SetDefaultActiveMenu() {
            let _isExist = false;
            let _defaultActiveMenu = {
                Link: $location.path().substring(1, $location.path().length),
                MenuName: $location.path().split("/").pop()
            };

            SideBarCtrl.ePage.Masters.MenuList.map(value => {
                if (value.OtherConfig && typeof value.OtherConfig == "string") {
                    value.OtherConfig = JSON.parse(value.OtherConfig);
                }
                if (value.Link && value.Link != "#" && !_isExist) {
                    if (value.Link.indexOf(_defaultActiveMenu.Link) != -1) {
                        _isExist = true;
                        SideBarCtrl.ePage.Masters.ActiveMenu = value;
                    }
                } else if (value.Link && value.Link == "#" && value.MenuList && value.MenuList.length > 0 && !_isExist) {
                    value.MenuList.map(value2 => {
                        if (value2.Link) {
                            if (value2.Link.indexOf(_defaultActiveMenu.Link) != -1) {
                                _isExist = true;
                                SideBarCtrl.ePage.Masters.ActiveMenu = value2;
                            }
                        }
                    });
                }
            });
        }

        function GetMenuLink($item) {
            let _link = $item.Link;
            if ($item.Link && $item.Link != "#") {
                if ($item.OtherConfig && $item.OtherConfig.IsExternalMenu) {
                    _link = $item.Link;
                } else {
                    if (_link.charAt(0) == "/") {
                        _link = "#" + _link;
                    } else if (_link.charAt(0) != "#") {
                        _link = "#/" + _link;
                    }
                }
            } else {
                _link = "#";
            }
            return _link;
        }

        function OnMenuClick($item, $event) {
            SideBarCtrl.ePage.Masters.ActiveMenu = angular.copy($item);
            if ($item.OtherConfig && $item.OtherConfig.IsExternalMenu) {
                SideBarCtrl.ePage.Masters.ActiveMenu.Link = $sce.trustAsResourceUrl(SideBarCtrl.ePage.Masters.ActiveMenu.Link);
                OpenExternalLinkModal();
            } else if ($item.Link && $item.Link != "#") {
                LogVisitedMenu($item);
            }
        }

        function OpenModalInstance() {
            return SideBarCtrl.ePage.Masters.ExternalLinkModal = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "ext-link-modal right",
                scope: $scope,
                template: ` <div class="modal-header">
                    <button type="button" class="close" data-ng-click="SideBarCtrl.ePage.Masters.CloseExtLinkModal()">&times;</button>
                    <h5 class="modal-title" id="modal-title">
                        <strong>{{SideBarCtrl.ePage.Masters.ActiveMenu.Description}}</strong>
                    </h5>
                </div>
                <div class="modal-body without-footer">
                    <div class="text-center danger font-200 p-20" data-ng-if = "!SideBarCtrl.ePage.Masters.ActiveMenu.Link">Invalid URL...!</div>
                    <iframe src="{{SideBarCtrl.ePage.Masters.ActiveMenu.Link}}" frameborder="0" style="width:100%; height:99%;" data-ng-if = "SideBarCtrl.ePage.Masters.ActiveMenu.Link"></iframe>
                </div>`
            });
        }

        function OpenExternalLinkModal() {
            OpenModalInstance().result.then(response => {}, () => CloseExtLinkModal());
        }

        function CloseExtLinkModal() {
            SideBarCtrl.ePage.Masters.ExternalLinkModal.dismiss('cancel');
        }

        function LogVisitedMenu($item) {
            let _input = {
                USN_FK: authService.getUserInfo().LoginPK,
                ActionType: 'Visit',
                ActInfo: 'Menu',
                EntityRefKey: $item.Id,
                EntitySource: 'MENU',
                EntityDescription: $item.Code,
                IsActive: 0,
                TenantCode: authService.getUserInfo().TenantCode,
                SAP_FK: authService.getUserInfo().AppPK
            };

            apiService.post("authAPI", appConfig.Entities.SecSessionActivity.API.Insert.Url, [_input]);
        }

        Init();
    }
})();