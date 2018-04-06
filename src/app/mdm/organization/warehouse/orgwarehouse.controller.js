(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrgWarehouseController", OrgWarehouseController);

    OrgWarehouseController.$inject = ["$scope", "$location", "$uibModal", "apiService", "appConfig", "organizationConfig", "helperService", "toastr","confirmation"];

    function OrgWarehouseController($scope, $location, $uibModal, apiService, appConfig, organizationConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var OrgWarehouseCtrl = this;
        $scope.emptyText = "-";

        function Init() {
            var currentOrganization = OrgWarehouseCtrl.currentOrganization[OrgWarehouseCtrl.currentOrganization.label].ePage.Entities;

            OrgWarehouseCtrl.ePage = {
                "Title": "",
                "Prefix": "Organization_Company",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrganization
            };

            OrgWarehouseCtrl.ePage.Masters.DropDownMasterList = organizationConfig.Entities.Header.Meta;

            OrgWarehouseCtrl.ePage.Masters.OpenEditForm = OpenEditForm;
            OrgWarehouseCtrl.ePage.Masters.OnCompanySelect = OnCompanySelect;
            OrgWarehouseCtrl.ePage.Masters.RemoveRow = RemoveRow;

        //    GetCompanyListing();
        //  Miscservice();
        //  Receiveparam();
        //OrgWarehouseCtrl.ePage.Masters.SelectedCompany = OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgMiscServ[0];
        }

        function RemoveRow($item, type) {
            console.log(OrgWarehouseCtrl.ePage.Entities.Header.Data.WmsClientPickPackParamsByWms);
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteContact($item, type);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteContact($item, type) {
            //OrgWarehouseCtrl.ePage.Masters[type].IsOverlay = true;
            apiService.get("eAxisAPI", appConfig.Entities[type].API.Delete.Url + $item.PK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response === "Success") {
                        OrgWarehouseCtrl.ePage.Entities.Header.Data[type].map(function (value, key) {
                            if (value.PK === $item.PK) {
                                OrgWarehouseCtrl.ePage.Entities.Header.Data[type].splice(key, 1);
                            }
                        });
                        toastr.success("Record Deleted Successfully...!");
                    } else {
                        toastr.error("Could not Delete...!");
                    }

                //    OrgWarehouseCtrl.ePage.Masters[type].IsOverlay = false;
                }
            });
        }

        function Miscservice(){
            var _filter = {
                ORG_FK: OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": OrgWarehouseCtrl.ePage.Entities.Header.API.MiscService.FilterID
            };
            apiService.post("eAxisAPI", OrgWarehouseCtrl.ePage.Entities.Header.API.MiscService.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgCompanyData = response.data.Response[0];

                    //OnCompanySelect(OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgCompanyData[0], 0);
                }
            });
        }
        function Receiveparam(){
            var _filter = {
                ORG_FK: OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": OrgWarehouseCtrl.ePage.Entities.Header.API.ProductParams.FilterID
            };

            apiService.post("eAxisAPI", OrgWarehouseCtrl.ePage.Entities.Header.API.ProductParams.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgProductData = response.data.Response;

                    //OnCompanySelect(OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgCompanyData[0], 0);
                }
            });   
        }
        

        function GetCompanyListing() {
            OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgCompanyData = undefined;
            var _filter = {
                "ORG_FK": "OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgHeader.PK"
               
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgCompanyData.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.OrgCompanyData.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgCompanyData = response.data.Response;

                    OnCompanySelect(OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgCompanyData[0], 0);
                }
            });
        }

        function GetMiscServ() {
            apiService.get("eAxisAPI", appConfig.Entities.Organization.API.GetById.Url + OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgHeader.PK).then(function (response) {
                if (response.data.Response) {
                    OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgMiscServ = response.data.Response.OrgMiscServ;
                }
            });
        }

        function OnCompanySelect($item, index) {
           OrgWarehouseCtrl.ePage.Masters.SelectedCompany = $item;
        }

        // =====================Company End=====================



        function OpenEditForm($item, type, isNewMode) {
            if($item ==undefined&&type=="Pickingparamsbywh")
            {    
            var obj = {
                WarehouseCode : "",
                WarehouseName : "",
                WAR_FK : "",
                CartoniseByArea:"",
                IsPickAndPackEnabled:"",
                F3_NKPackType:"",
                NumberOfLabelsToPrintOnNew:"",
                NumberOfLabelsToPrintOnClose:"",
                PK:"",
                IsModified : true,
                IsDeleted : ""
                }
                // $item = [];
                $item=obj;  
            }
            else if($item ==undefined&&type=="Receiveparamsbywh")
            {
            var obj = {
                WarehouseCode : "",
                WarehouseName : "",
                WAR_FK : "",
                AreaName:"",
                AreaType:"",
                IsModified : true,
                IsDeleted : "",
                PK:""
                }
                //$item = [];
                $item=obj;  
            }   
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "warehouse-edit right " + type,
                scope: $scope,
                templateUrl: "app/mdm/organization/warehouse/org-warehouse-modal/" + type + "-modal.html",
                controller: 'OrgWarehouseModalController as OrgWarehouseModalCtrl',
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "Entity": OrgWarehouseCtrl.currentOrganization,
                            "Type": type,
                            "Item": $item,
                            "isNewMode": isNewMode
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    var _obj = {
                        "WmsClientPickPackParamsByWms": PickDataResponse,
                        "WmsClientParameterByWarehouse": ReceiveDataResponse,
                        "OrgMiscServ":MiscservResponse
                    };
                        _obj[response.entity](response); 
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        function MiscservResponse(response){
            //GetMiscServ();

            
        }
        function PickDataResponse(response) {
            
            var _filter = {
                "ORG_FK": OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                "SortColumn": "WPP_F3_NKPackType",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsClientPickPackParamsByWms.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.WmsClientPickPackParamsByWms.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgWarehouseCtrl.ePage.Entities.Header.Data.WmsClientPickPackParamsByWms = response.data.Response;
                }
            });


            // var _input = OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgHeader.PK;
            // apiService.get("eAxisAPI", appConfig.Entities.OrgHeader.API.GetById.Url+ _input ).then(function (response) {
            //     if (response.data.Response) {
            //         OrgWarehouseCtrl.ePage.Entities.Header.Data.WmsClientPickPackParamsByWms = response.data.Response.WmsClientPickPackParamsByWms;
            //         OrgWarehouseCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse = response.data.Response.WmsClientParameterByWarehouse;
            //     }
            // });
        }
        function ReceiveDataResponse(response){
            var _filter = {
                "ORG_FK": OrgWarehouseCtrl.ePage.Entities.Header.Data.OrgHeader.PK,
                "SortColumn": "WCP_AreaName",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsClientParameterByWarehouse.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.WmsClientParameterByWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OrgWarehouseCtrl.ePage.Entities.Header.Data.WmsClientParameterByWarehouse = response.data.Response;
                }
            });            
        }
        Init();
    }
})();
