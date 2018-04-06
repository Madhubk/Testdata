(function () {
    "use strict";

    angular
        .module("Application")
        .controller("paginationController", PaginationController);

    PaginationController.$inject = ["helperService", "appConfig", "$scope"];

    function PaginationController(helperService, appConfig, $scope) {
        /* jshint validthis: true */
        var PaginationCtrl = this;

        function Init() {
            PaginationCtrl.ePage = {
                "Title": "",
                "Prefix": "Pagination",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            
            InitPagination();
        }

        function InitPagination() {
            PaginationCtrl.ePage.Masters.NoPrevious = NoPrevious;
            PaginationCtrl.ePage.Masters.SelectPrevious = SelectPrevious;
            PaginationCtrl.ePage.Masters.isActive = isActive;
            PaginationCtrl.ePage.Masters.SelectPage = SelectPage;
            PaginationCtrl.ePage.Masters.NoNext = NoNext;
            PaginationCtrl.ePage.Masters.SelectNext = SelectNext;
            PaginationCtrl.ePage.Masters.PageSize = 25;

            $scope.$watch('PaginationCtrl.currentPage',function (value) {
                PaginationCtrl.ePage.Masters.PageFrom = ((value-1)*PaginationCtrl.ePage.Masters.PageSize) + 1;
                PaginationCtrl.ePage.Masters.PageTo = value * PaginationCtrl.ePage.Masters.PageSize;
            });

            $scope.$watch('PaginationCtrl.numPages', function(value) {
                PaginationCtrl.ePage.Masters.pages = [];
                for(var i=1;i<=value;i++) {
                  PaginationCtrl.ePage.Masters.pages.push(i);
                }
                if (PaginationCtrl.currentPage > value ) {
                    SelectPage(value);
                }
            });
        }

        function SelectPage(page) {
            if ( !isActive(page) ) {
              PaginationCtrl.currentPage = page;
              PaginationCtrl.onSelectPage({ page: page });
            }
        }
        
        function NoPrevious() {
            return PaginationCtrl.currentPage === 1;
        }
        
        function NoNext() {
            return PaginationCtrl.currentPage === PaginationCtrl.numPages;
        }
        
        function isActive(page) {            
            return PaginationCtrl.currentPage === page;
        }
        
        function SelectPrevious() {
            if ( !NoPrevious() ) {
              SelectPage(PaginationCtrl.currentPage-1);
            }
        }
        
        function SelectNext() {
            if ( !NoNext() ) {
              SelectPage(PaginationCtrl.currentPage+1);
            }
        }

        Init();
    }

})();
