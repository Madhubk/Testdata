(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolPackingController", ConsolPackingController);

    ConsolPackingController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "confirmation"];

    function ConsolPackingController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var ConsolPackingCtrl = this;

        function Init() {
            var currentConsol = ConsolPackingCtrl.currentConsol[ConsolPackingCtrl.currentConsol.label].ePage.Entities;
            ConsolPackingCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };

        //    ConsolPackingCtrl.ePage.Masters.updateSelection = updateSelection;
            ConsolPackingCtrl.ePage.Masters.UnAllocatePacklines = UnAllocatePacklines
            ConsolPackingCtrl.ePage.Masters.AllocatePacklines = AllocatePacklines
            ConsolPackingCtrl.ePage.Masters.SaveUnAllocatePacklines = SaveUnAllocatePacklines;
            ConsolPackingCtrl.ePage.Masters.SaveAllocatePacklines = SaveAllocatePacklines;
            ConsolPackingCtrl.ePage.Masters.IsContainer = true;
            ConsolPackingCtrl.ePage.Masters.IsUnallocate = false;
            ConsolPackingCtrl.ePage.Masters.IsAllocate = false;
            ConsolPackingCtrl.ePage.Masters.selectedCont = {};
        }

        //function updateSelection(position, $item) {
        //    angular.forEach(ConsolPackingCtrl.ePage.Entities.Header.Data.UICntContainers, function (item, index) {
        //        if (position != index) {
        //            item.checked = false;
        //        } else {
        //            if (item.checked) {
        //                ConsolPackingCtrl.ePage.Masters.selectedCont = $item;
        //            } else {
        //                ConsolPackingCtrl.ePage.Masters.selectedCont = {}
        //            }
        //        }
        //    });
        //}



        function UnAllocatePacklines(x) {
            ConsolPackingCtrl.ePage.Masters.selectedCont = x;
            if (!angular.equals({}, ConsolPackingCtrl.ePage.Masters.selectedCont)) {
                ConsolPackingCtrl.ePage.Masters.IsContainer = false;
                ConsolPackingCtrl.ePage.Masters.IsAllocate = true;
                GetPkgCntMappingList();
            } else {
                toastr.warning("Please Select One Container..")
            }
        };

        function AllocatePacklines(y) {
            ConsolPackingCtrl.ePage.Masters.selectedCont = y;
            ConsolPackingCtrl.ePage.Masters.IsContainer = false;
            ConsolPackingCtrl.ePage.Masters.IsUnallocate = true;
            getUnAllocatePacklines();

        };

        function GetPkgCntMappingList() {
            ConsolPackingCtrl.ePage.Masters.AllocatedList = undefined
            var _filter = {
                "CNT_PK": ConsolPackingCtrl.ePage.Masters.selectedCont.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", ConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _field = "";
                    response.data.Response.map(function (val, key) {
                        _field += val.PKG + ','
                    });
                    _field = _field.substring(0, _field.length - 1);
                    if (response.data.Response.length > 0) {
                        GetShpPackingList(_field, response.data.Response)
                    } else {
                        ConsolPackingCtrl.ePage.Masters.AllocatedList = [];
                    }
                }
            });
        }

        function GetShpPackingList(val, data) {
            var _filter = {
                "PKG_PKS": val
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.ShpPackagesFindAll.FilterID
            };

            apiService.post("eAxisAPI", ConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.ShpPackagesFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsolPackingCtrl.ePage.Masters.AllocatedList = []
                    ConsolPackingCtrl.ePage.Masters.AllocatedList = response.data.Response;
                    if (ConsolPackingCtrl.ePage.Masters.AllocatedList.length > 0) {
                        data.map(function (val, key) {
                            ConsolPackingCtrl.ePage.Masters.AllocatedList[key].UnAllocate_PK = val.PK;
                        });
                    }

                }
            });
        }

        function getUnAllocatePacklines() {
            ConsolPackingCtrl.ePage.Masters.UnAllocatedList = undefined;
            var _filter = {
                "CON_FK": ConsolPackingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.FindAllUnAllocatedPacks.FilterID
            };

            apiService.post("eAxisAPI", ConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.FindAllUnAllocatedPacks.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsolPackingCtrl.ePage.Masters.UnAllocatedList = []
                    ConsolPackingCtrl.ePage.Masters.UnAllocatedList = response.data.Response.Response; 

                    if (ConsolPackingCtrl.ePage.Masters.UnAllocatedList.length > 0) {
                        ConsolPackingCtrl.ePage.Entities.Header.Data.UnAllocatedList=[];
                        ConsolPackingCtrl.ePage.Entities.Header.Data.UnAllocatedList = response.data.Response.Response;
                    }
                }
            });
        }

        function SaveUnAllocatePacklines() {
            if (ConsolPackingCtrl.ePage.Masters.AllocatedList.length > 0) {
                var _field = "";
                var _tempArray = []
                ConsolPackingCtrl.ePage.Masters.AllocatedList.map(function (val, key) {
                    if (val.checked) {
                        _field += val.UnAllocate_PK + ','
                        _tempArray.push(val)
                    }
                });
                _field = _field.substring(0, _field.length - 1);
                if (_tempArray.length > 0) {
                    apiService.post("eAxisAPI", ConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.Delete.Url + _field).then(function (response) {
                        if (response.data.Response) {
                            GetPkgCntMappingList();
                        }
                    });
                } else {
                    toastr.warning("Please Select minimum one Allocated Packlines..")
                }

            } else {
                toastr.warning("There is no Allocated Packlines..")
            }
        }

        function SaveAllocatePacklines() {
            if (ConsolPackingCtrl.ePage.Masters.UnAllocatedList.length > 0) {
                var _tempArray = []
                ConsolPackingCtrl.ePage.Masters.UnAllocatedList.map(function (val, key) {
                    if (val.checked) {
                        var _obj = {
                            "PK": "",
                            "PKG": val.PK,
                            "CNT": ConsolPackingCtrl.ePage.Masters.selectedCont.PK,
                            "ContainerNo": ConsolPackingCtrl.ePage.Masters.selectedCont.ContainerNo
                        };
                        _tempArray.push(_obj)
                    }
                });
                if (_tempArray.length > 0) {
                    apiService.post("eAxisAPI", ConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.Insert.Url, _tempArray).then(function (response) {
                        if (response.data.Response) {
                            getUnAllocatePacklines();
                        }
                    });
                } else {
                    toastr.warning("Please Select minimum one Allocated Packlines..")
                }

            } else {
                toastr.warning("There is no Allocated Packlines..")
            }
        }


        Init();
    }
})();