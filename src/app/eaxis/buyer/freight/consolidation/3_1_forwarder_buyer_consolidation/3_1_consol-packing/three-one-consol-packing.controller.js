(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ThreeOneConsolPackingController", ThreeOneConsolPackingController);

    ThreeOneConsolPackingController.$inject = ["apiService", "helperService", "toastr"];

    function ThreeOneConsolPackingController(apiService, helperService, toastr) {
        /* jshint validthis: true */
        var ThreeOneConsolPackingCtrl = this;

        function Init() {
            var currentConsol = ThreeOneConsolPackingCtrl.currentConsol[ThreeOneConsolPackingCtrl.currentConsol.label].ePage.Entities;
            ThreeOneConsolPackingCtrl.ePage = {
                "Title": "",
                "Prefix": "Consol_Shipment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsol
            };

            //    ThreeOneConsolPackingCtrl.ePage.Masters.updateSelection = updateSelection;
            ThreeOneConsolPackingCtrl.ePage.Masters.UnAllocatePacklines = UnAllocatePacklines
            ThreeOneConsolPackingCtrl.ePage.Masters.AllocatePacklines = AllocatePacklines
            ThreeOneConsolPackingCtrl.ePage.Masters.SaveUnAllocatePacklines = SaveUnAllocatePacklines;
            ThreeOneConsolPackingCtrl.ePage.Masters.SaveAllocatePacklines = SaveAllocatePacklines;
            ThreeOneConsolPackingCtrl.ePage.Masters.IsContainer = true;
            ThreeOneConsolPackingCtrl.ePage.Masters.IsUnallocate = false;
            ThreeOneConsolPackingCtrl.ePage.Masters.IsAllocate = false;
            ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont = {};
        }

        //function updateSelection(position, $item) {
        //    angular.forEach(ThreeOneConsolPackingCtrl.ePage.Entities.Header.Data.UICntContainers, function (item, index) {
        //        if (position != index) {
        //            item.checked = false;
        //        } else {
        //            if (item.checked) {
        //                ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont = $item;
        //            } else {
        //                ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont = {}
        //            }
        //        }
        //    });
        //}



        function UnAllocatePacklines(x) {
            ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont = x;
            if (!angular.equals({}, ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont)) {
                ThreeOneConsolPackingCtrl.ePage.Masters.IsContainer = false;
                ThreeOneConsolPackingCtrl.ePage.Masters.IsAllocate = true;
                GetPkgCntMappingList();
            } else {
                toastr.warning("Please Select One Container..")
            }
        };

        function AllocatePacklines(y) {
            ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont = y;
            ThreeOneConsolPackingCtrl.ePage.Masters.IsContainer = false;
            ThreeOneConsolPackingCtrl.ePage.Masters.IsUnallocate = true;
            getUnAllocatePacklines();

        };

        function GetPkgCntMappingList() {
            ThreeOneConsolPackingCtrl.ePage.Masters.AllocatedList = undefined
            var _filter = {
                "CNT_PK": ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ThreeOneConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", ThreeOneConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _field = "";
                    response.data.Response.map(function (val, key) {
                        _field += val.PKG + ','
                    });
                    _field = _field.substring(0, _field.length - 1);
                    if (response.data.Response.length > 0) {
                        GetShpPackingList(_field, response.data.Response)
                    } else {
                        ThreeOneConsolPackingCtrl.ePage.Masters.AllocatedList = [];
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
                "FilterID": ThreeOneConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.ShpPackagesFindAll.FilterID
            };

            apiService.post("eAxisAPI", ThreeOneConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.ShpPackagesFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ThreeOneConsolPackingCtrl.ePage.Masters.AllocatedList = []
                    ThreeOneConsolPackingCtrl.ePage.Masters.AllocatedList = response.data.Response;
                    if (ThreeOneConsolPackingCtrl.ePage.Masters.AllocatedList.length > 0) {
                        data.map(function (val, key) {
                            ThreeOneConsolPackingCtrl.ePage.Masters.AllocatedList[key].UnAllocate_PK = val.PK;
                        });
                    }

                }
            });
        }

        function getUnAllocatePacklines() {
            ThreeOneConsolPackingCtrl.ePage.Masters.UnAllocatedList = undefined;
            var _filter = {
                "CON_FK": ThreeOneConsolPackingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ThreeOneConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.FindAllUnAllocatedPacks.FilterID
            };

            apiService.post("eAxisAPI", ThreeOneConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.FindAllUnAllocatedPacks.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ThreeOneConsolPackingCtrl.ePage.Masters.UnAllocatedList = []
                    ThreeOneConsolPackingCtrl.ePage.Masters.UnAllocatedList = response.data.Response.Response;

                    if (ThreeOneConsolPackingCtrl.ePage.Masters.UnAllocatedList.length > 0) {
                        ThreeOneConsolPackingCtrl.ePage.Entities.Header.Data.UnAllocatedList = [];
                        ThreeOneConsolPackingCtrl.ePage.Entities.Header.Data.UnAllocatedList = response.data.Response.Response;
                    }
                }
            });
        }

        function SaveUnAllocatePacklines() {
            if (ThreeOneConsolPackingCtrl.ePage.Masters.AllocatedList.length > 0) {
                var _field = "";
                var _tempArray = []
                ThreeOneConsolPackingCtrl.ePage.Masters.AllocatedList.map(function (val, key) {
                    if (val.checked) {
                        _field += val.UnAllocate_PK + ','
                        _tempArray.push(val)
                    }
                });
                _field = _field.substring(0, _field.length - 1);
                if (_tempArray.length > 0) {
                    apiService.post("eAxisAPI", ThreeOneConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.Delete.Url + _field).then(function (response) {
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
            if (ThreeOneConsolPackingCtrl.ePage.Masters.UnAllocatedList.length > 0) {
                var _tempArray = []
                ThreeOneConsolPackingCtrl.ePage.Masters.UnAllocatedList.map(function (val, key) {
                    if (val.checked) {
                        var _obj = {
                            "PK": "",
                            "PKG": val.PK,
                            "CNT": ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont.PK,
                            "ContainerNo": ThreeOneConsolPackingCtrl.ePage.Masters.selectedCont.ContainerNo
                        };
                        _tempArray.push(_obj)
                    }
                });
                if (_tempArray.length > 0) {
                    apiService.post("eAxisAPI", ThreeOneConsolPackingCtrl.ePage.Entities.PkgCntMapping.API.Insert.Url, _tempArray).then(function (response) {
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