(function() {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentItemController", ConsignmentItemController);

    ConsignmentItemController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "consignmentConfig", "helperService", "toastr", "$injector", "$window", "confirmation"];

    function ConsignmentItemController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, consignmentConfig, helperService, toastr, $injector, $window, confirmation) {

        var ConsignmentItemCtrl = this;

        function Init() {
            var currentConsignment = ConsignmentItemCtrl.currentConsignment[ConsignmentItemCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentItemCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment,
            };

            ConsignmentItemCtrl.ePage.Masters.Config = consignmentConfig;

            ConsignmentItemCtrl.ePage.Masters.emptyText = "-";
            ConsignmentItemCtrl.ePage.Masters.selectedRow = -1;
            ConsignmentItemCtrl.ePage.Masters.Lineslist = true;
            ConsignmentItemCtrl.ePage.Masters.HeaderName = '';

            ConsignmentItemCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConsignmentItemCtrl.ePage.Masters.Edit = Edit;
            ConsignmentItemCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ConsignmentItemCtrl.ePage.Masters.Attach = Attach;
            ConsignmentItemCtrl.ePage.Masters.AddNew = AddNew;
            ConsignmentItemCtrl.ePage.Masters.Back = Back;
            ConsignmentItemCtrl.ePage.Masters.Done = Done;
            ConsignmentItemCtrl.ePage.Masters.SelectedLookupDataSender = SelectedLookupDataSender;
            ConsignmentItemCtrl.ePage.Masters.OnChangeReceiver = OnChangeReceiver;

        }

        function OnChangeReceiver(item) {
            angular.forEach(ConsignmentItemCtrl.ePage.Masters.ReceiverList, function(value, key) {
                if (value.ORG_MappingToCode == item) {
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Receiver_ORG_FK = value.MappingTo_FK;
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ReceiverCode = value.ORG_MappingToCode;
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_ReceiverName = value.ORG_MappingToName;
                }
            });
        }

        function SelectedLookupDataSender(item, index) {
            if (item.entity) {
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_SenderCode = item.entity.Code;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_SenderName = item.entity.FullName;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Sender_ORG_FK = item.entity.PK;
            } else {
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_SenderCode = item.Code;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_SenderName = item.FullName;
                ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Sender_ORG_FK = item.PK;
            }
            GetReceiver();
        }

        function GetReceiver() {
            var _filter = {
                "MappingFor_FK": ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow].TIT_Sender_ORG_FK,
                "MappingCode": "SENDER_RECEIVER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentItemCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentItemCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function(response) {
                if (response.data.Response) {
                    ConsignmentItemCtrl.ePage.Masters.ReceiverList = response.data.Response;
                }
            });
        }

        function Back() {
            ConsignmentItemCtrl.ePage.Masters.Lineslist = true;
        }

        function Done($item) {
            if (ConsignmentItemCtrl.ePage.Masters.HeaderName == 'New List') {
                $timeout(function() {
                    var objDiv = document.getElementById("ConsignmentItemCtrl.ePage.Masters.your_div");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 500);
            }
            
            var _isExist;
            var test1 = _.groupBy(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem, 'TIT_ItemCode');
            angular.forEach(test1, function(value, key) {
                if (key == $item.TIT_ItemCode) {
                    if (value.length > 1) {
                        _isExist = true;
                    }
                }
            })
            if (!_isExist) {
                SaveList(ConsignmentItemCtrl.currentConsignment);
            } else {
                toastr.warning($item.TIT_ItemCode + " Already Available...!");
            }
            ConsignmentItemCtrl.ePage.Masters.Lineslist = true;
        }

        function SaveList($item) {
            ConsignmentItemCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");
            apiService.post("eAxisAPI", "TmsConsignmentList/Update", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    ConsignmentItemCtrl.ePage.Entities.Header.Data = response.data.Response;
                }
            });
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function AddNew() {
            // var _queryString = {
            //     PK: null,
            //     ItemCode: null
            // };
            // _queryString = helperService.encryptData(_queryString);
            // $window.open("#/EA/single-record-view/consignmentitem/" + _queryString, "_blank");
            var obj = {
                "TIT_ItemRef_ID": "",
                "TIT_ItemCode": "",
                "TIT_ItemDesc": "",
                "TIT_ReceiverRef": "",
                "TIT_SenderRef": "",
                "TIT_Height": "",
                "TIT_Width": "",
                "TIT_Length": "",
                "TIT_Weight": "",
                "TIT_Volumn": "",
                "TIT_FK": "",
                "TIT_Receiver_ORG_FK": "",
                "TIT_ReceiverName": "",
                "TIT_ReceiverCode": "",
                "TIT_Sender_ORG_FK": "",
                "TIT_SenderName": "",
                "TIT_SenderCode": "",
                "TIT_ItemStatus": "",
                "PK": "",
                "IsDeleted": false,
                "IsModified": false
            }
            ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.push(obj);
            ConsignmentItemCtrl.ePage.Masters.Edit(ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length - 1, 'New List');
        }

        function setSelectedRow(index) {
            ConsignmentItemCtrl.ePage.Masters.selectedRow = index;
        }

        function Attach($item) {
            $item.some(function(value, index) {
                var _isExist = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.some(function(value1, index1) {
                    return value1.TIT_FK === value.PK;
                });
                if (!_isExist) {
                    var obj = {
                        "TIT_ItemRef_ID": value.ItemRef_ID,
                        "TIT_ItemCode": value.ItemCode,
                        "TIT_ItemDesc": value.ItemDesc,
                        "TIT_ReceiverRef": value.ReceiverRef,
                        "TIT_SenderRef": value.SenderRef,
                        "TIT_Height": value.Height,
                        "TIT_Width": value.Width,
                        "TIT_Length": value.Length,
                        "TIT_Weight": value.Weight,
                        "TIT_Volumn": value.Volumn,
                        "TIT_FK": value.PK,
                        "TIT_Receiver_ORG_FK": value.Receiver_ORG_FK,
                        "TIT_ReceiverName": value.ReceiverName,
                        "TIT_ReceiverCode": value.ReceiverCode,
                        "TIT_Sender_ORG_FK": value.Sender_ORG_FK,
                        "TIT_SenderName": value.SenderName,
                        "TIT_SenderCode": value.SenderCode,
                        "TIT_ItemStatus": value.ItemStatus,
                        "IsDeleted": value.IsDeleted,
                        "IsModified": value.IsModified
                    }
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.push(obj);
                } else {
                    toastr.warning(value.ItemCode + " Already Available...!");
                }
            });
        }
        function Edit(index, name) {
            ConsignmentItemCtrl.ePage.Masters.selectedRow = index;
            ConsignmentItemCtrl.ePage.Masters.Lineslist = false;
            ConsignmentItemCtrl.ePage.Masters.HeaderName = name;
            $timeout(function() { $scope.$apply(); }, 500);
            // var _queryString = {
            //     PK: obj.TIT_FK,
            //     ItemCode: obj.TIT_ItemCode
            // };
            // _queryString = helperService.encryptData(_queryString);
            // $window.open("#/EA/single-record-view/consignmentitem/" + _queryString, "_blank");
        }

        function RemoveRow() {
            var item = ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[ConsignmentItemCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function(result) {
                    // if (item.PK) {
                    //     apiService.get("eAxisAPI", ConsignmentItemCtrl.ePage.Entities.Header.API.LineDelete.Url + item.PK).then(function(response) {
                    //     });
                    // }
                    ConsignmentItemCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.splice(ConsignmentItemCtrl.ePage.Masters.selectedRow, 1);
                    toastr.success('Record Removed Successfully');
                    ConsignmentItemCtrl.ePage.Masters.selectedRow = ConsignmentItemCtrl.ePage.Masters.selectedRow - 1;
                }, function() {
                    console.log("Cancelled");
                });
        }

        Init();
    }

})();