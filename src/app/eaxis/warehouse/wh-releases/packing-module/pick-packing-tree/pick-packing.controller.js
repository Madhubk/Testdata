(function () {
  "use strict";

  angular
    .module("Application")
    .controller("PickPackingController", PickPackingController);

  PickPackingController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "confirmation", "toastr", "$filter", "$state", "$q", "$uibModal", "$sce"];

  function PickPackingController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, confirmation, toastr, $filter, $state, $q, $uibModal, $sce) {

    var PickPackingCtrl = this;

    function Init() {

      var currentPick = PickPackingCtrl.currentPick[PickPackingCtrl.currentPick.label].ePage.Entities;

      PickPackingCtrl.ePage = {
        "Title": "",
        "Prefix": "Pick_pack",
        "Masters": {},
        "Meta": helperService.metaBase(),
        "Entities": currentPick

      };

      PickPackingCtrl.ePage.Masters.Config = pickConfig;
      PickPackingCtrl.ePage.Masters.currentPick = PickPackingCtrl.currentPick;
      PickPackingCtrl.ePage.Masters.HeaderDetails = PickPackingCtrl.currentHeader;

      // closepackage
      PickPackingCtrl.ePage.Masters.ClosePackage = ClosePackage;

      PickPackingCtrl.ePage.Masters.Config.PackageListDetails = PickPackingCtrl.ePage.Masters.HeaderDetails;
      // Add parent Package
      PickPackingCtrl.ePage.Masters.AddPackage = AddPackage;
      // Add Child Package
      PickPackingCtrl.ePage.Masters.Add = Add;
      PickPackingCtrl.ePage.Masters.Delete = Delete;
      PickPackingCtrl.ePage.Masters.SavePackage = SavePackage;

      PickPackingCtrl.ePage.Masters.List = [];

      PickPackingCtrl.ePage.Masters.EnablePrintLabel = false;

      // to change the Normal json to Tree Json for package function call for GetByID Obj
      if (PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackage.length > 0) {
        PickPackingCtrl.ePage.Masters.EnablePrintLabel = true;
        PickPackingCtrl.ePage.Masters.Loading = false;
        PickPackingCtrl.ePage.Masters.EnablePackTree = true;
        PickPackingCtrl.ePage.Masters.SaveBtnEnable = true;
        ReverseJson(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackage);

        // Default seleted package
        PickPackingCtrl.ePage.Masters.tree[0].IsSelectedValue = true;
        PickPackingCtrl.ePage.Masters.Config.SelectedPackage = PickPackingCtrl.ePage.Masters.tree[0];
        PickPackingCtrl.ePage.Masters.SelectthePack = SelectthePack;
        PickPackingCtrl.ePage.Masters.Config.ItemDeleted = false;
      } else {
        PickPackingCtrl.ePage.Masters.EnablePackTree = false;
        PickPackingCtrl.ePage.Masters.tree = [];
        PickPackingCtrl.ePage.Masters.SaveBtnEnable = false;
      }

      // pack Type Model
      PickPackingCtrl.ePage.Masters.DropDownMasterList = {};
      PickPackingCtrl.ePage.Masters.PackList = {};
      PickPackingCtrl.ePage.Masters.SavePackType = SavePackType;
      PickPackingCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
      PickPackingCtrl.ePage.Masters.EditPackType = EditPackType;
      GetDropDownList();
      PickPackingCtrl.ePage.Masters.DeleteList = [];
      PickPackingCtrl.ePage.Masters.ItemDelete = ItemDelete;
      PickPackingCtrl.ePage.Masters.DeleteObj = [];
      PickPackingCtrl.ePage.Masters.PrintLabel = PrintLabel;
    }

    //#region selected package value 
    function SelectthePack(item, index) {
      angular.forEach(PickPackingCtrl.ePage.Masters.tree, function (val, key) {
        val.IsSelectedValue = false;
        if (val.nodes.length > 0)
          InnerLoop(val.nodes)
        if (PickPackingCtrl.ePage.Masters.tree.length - 1 == key) {
          PickPackingCtrl.ePage.Masters.Config.SelectedPackage = item;
          item.IsSelectedValue = true;
        }
      });
    }
    function InnerLoop(obj) {
      angular.forEach(obj, function (val, key) {
        val.IsSelectedValue = false;
        if (val.nodes.length > 0)
          InnerLoop(val.nodes)
      });
    }

    //#endregion

    //#region convert normal json to parent child json format

    function ReverseJson(JsonResponse) {
      // Response / input of Json Object Response By Sequence
      PickPackingCtrl.ePage.Masters.JsonObjectResponse = $filter('orderBy')(JsonResponse, 'Sequence');

      console.log("Result" + PickPackingCtrl.ePage.Masters.JsonObjectResponse);

      // Function call to convert the json
      ConvertJson(PickPackingCtrl.ePage.Masters.JsonObjectResponse);

      // Assigning the parent child json to the Tree Object (ng-repeat Obj)
      PickPackingCtrl.ePage.Masters.tree = PickPackingCtrl.ePage.Masters.FramedObject;

      // for first obj response select true 
      PickPackingCtrl.ePage.Masters.tree[0].IsSelectedValue = true;
    }

    // function to convert normal json to parent child json format
    function ConvertJson(JsonData) {

      var arry = JsonData;

      function convert(array) {
        var map = {};
        for (var i = 0; i < array.length; i++) {
          var obj = array[i];
          obj.nodes = [];

          map[obj.PK] = obj;

          var parent = obj.ParentPackage || '-';
          if (!map[parent]) {
            map[parent] = {
              nodes: []
            };
          }
          map[parent].nodes.push(obj);
        }

        return map['-'].nodes;

      }

      var r = convert(arry)

      PickPackingCtrl.ePage.Masters.FramedObject = r;

      // console.log('result', JSON.stringify(PickPackingCtrl.ePage.Masters.FramedObject));
    }

    //#endregion

    //#region Pack Type
    function GetDropDownList() {
      var typeCodeList = ["INW_LINE_UQ", "VOLUMEUNIT", "GrossWeightUnit", "DimentionsUnit"];
      var dynamicFindAllInput = [];

      typeCodeList.map(function (value, key) {
        dynamicFindAllInput[key] = {
          "FieldName": "TypeCode",
          "value": value
        }
      });
      var _input = {
        "searchInput": dynamicFindAllInput,
        "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
      };

      apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
        if (response.data.Response) {
          typeCodeList.map(function (value, key) {
            PickPackingCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
            PickPackingCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
          });
        }
      });
    }

    function EditPackType(EditData) {
      PickPackingCtrl.ePage.Masters.isParentChild = "isEdited";
      PickPackingCtrl.ePage.Masters.PackList = EditData;
      PackTypeModel();
    }

    // function ClosePackage(IsCloseData) {
    //   IsCloseData.IsClosed = true;
    //   toastr.warning("Package is Closed");
    //   SavePackage();
    // }

    function ClosePackage(IsCloseData) {
      {
        var modalOptions = {
          closeButtonText: 'No',
          actionButtonText: 'YES',
          headerText: 'Once Closed Data Can Not Be Edited..',
          bodyText: 'Do You Want To Close the Package?'
        };
        confirmation.showModal({}, modalOptions)
          .then(function (result) {
            IsCloseData.IsClosed = true;
            SavePackage();
            toastr.success("Package is Closed Successfully");
          }, function () {
            console.log("Cancelled");
          });
      }
    }

    function PackTypeModel() {
      return PickPackingCtrl.ePage.Masters.modalInstance = $uibModal.open({
        animation: true,
        backdrop: "static",
        keyboard: false,
        windowClass: "general-edits right address",
        scope: $scope,
        size: "md",
        templateUrl: "app/eaxis/warehouse/wh-releases/packing-module/pick-packing-tree/pack-type.html"
      });
    }

    function SavePackType(data) {
      var _packtype = data;

      // to check the obj is parent or child while adding the package
      if (PickPackingCtrl.ePage.Masters.isParentChild == "isParent") {
        ParentObject(_packtype);
        SavePackage();
        // PickPackingCtrl.ePage.Masters.PackList = {};
      } else if (PickPackingCtrl.ePage.Masters.isParentChild == "isChild") {
        ChildObject(_packtype);
        SavePackage();
        // PickPackingCtrl.ePage.Masters.PackList = {};
      } else if (PickPackingCtrl.ePage.Masters.isParentChild == "isEdited") {
        SavePackage();
      }


      CloseEditActivityModal();
    }

    function CloseEditActivityModal() {
      PickPackingCtrl.ePage.Masters.modalInstance.dismiss('cancel');
    }

    //#endregion

    //#region  Initial Header and Root Package

    // New Guid Generation
    function createGuid() {
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    }

    // initial Root Package Adding
    function AddPackage() {

      // to check its is parent or child
      PickPackingCtrl.ePage.Masters.isParentChild = "isParent";

      // empty master for model value
      PickPackingCtrl.ePage.Masters.PackList = {};

      // outward value to the package id
      PickPackingCtrl.ePage.Masters.PackList.PackageId = PickPackingCtrl.ePage.Masters.Config.PackageListDetails.UIPackageHeader.ExternalReference;
      PickPackingCtrl.ePage.Masters.PackList.PackageQty = "1";

      // pack type model function call
      PackTypeModel(PickPackingCtrl.ePage.Masters.isParentChild);

    }

    function ParentObject(_packtype) {

      // Guid Generation Function call
      var guid = createGuid();
      console.log(guid);

      PickPackingCtrl.ePage.Masters.EnablePackTree = true;
      PickPackingCtrl.ePage.Masters.SaveBtnEnable = true;
      // PickPackingCtrl.ePage.Masters.DisableAddpackBtn = true;

      // parent sequence calculation
      var post = PickPackingCtrl.ePage.Masters.tree.length + 1;
      // post = post.toString();
      var _obj = {
        // "name": "Package",
        "nodes": [],

        "Sequence": post,
        "PK": guid,
        "NKPackType": _packtype.NKPackType,
        "PackageQty": _packtype.PackageQty,
        "Length": _packtype.Length,
        "Width": _packtype.Width,
        "Height": _packtype.Height,
        "DimensionUQ": _packtype.DimensionUQ,
        "Weight": _packtype.Weight,
        "WeightUQ": _packtype.WeightUQ,
        "Volume": _packtype.Volume,
        "VolumeUQ": _packtype.VolumeUQ,
        "MarksAndNumbers": _packtype.MarksAndNumbers,
        "TransportRef": _packtype.TransportRef,
        "GoodsDescription": _packtype.GoodsDescription,
        "HSCode": _packtype.HSCode,
        "ParentPackage": null,
        "IsClosed": "",
        "IsReleased": "",
        "RequiredTemperatureMinimum": "",
        "RequiredTemperatureUnit": "",
        "RequiredTemperatureMaximum": "",
        "RH_NKCommodityCode": _packtype.RH_NKCommodityCode,
        "CommodityDesc": _packtype.CommodityDesc,
        "RequiresTemperatureControl": "",
        "PackageId": _packtype.PackageId,
        "IsCheckedWeighedCubed": "",
        "IsDamaged": "",
        "IsHeld": "",
        "PackageHeaderFK": PickPackingCtrl.ePage.Masters.Config.PackageListDetails.UIPackageHeader.PK,
        "IsModified": false,
        "IsDeleted": false,
        "IsNewInsert": true
      };

      PickPackingCtrl.ePage.Masters.tree.push(_obj);
    }
    //#endregion

    //#region Add and Delete Child Package

    // Add the Child Package
    function Add(data) {

      // to check its is parent or child
      PickPackingCtrl.ePage.Masters.isParentChild = "isChild";

      // data assigning
      PickPackingCtrl.ePage.Masters.Childdata = data;

      // empty master for model value
      PickPackingCtrl.ePage.Masters.PackList = {};

      // outward value to the package id
      PickPackingCtrl.ePage.Masters.PackList.PackageId = PickPackingCtrl.ePage.Masters.Config.PackageListDetails.UIPackageHeader.ExternalReference;

      PickPackingCtrl.ePage.Masters.PackList.PackageQty = "1";

      // pack type model function call
      PackTypeModel(PickPackingCtrl.ePage.Masters.isParentChild);

    };

    function ChildObject(_packtype) {

      // Guid Generation Function call
      var guid = createGuid();
      // console.log(guid);

      var post = PickPackingCtrl.ePage.Masters.Childdata.nodes.length + 1;
      var Order = PickPackingCtrl.ePage.Masters.Childdata.Sequence + '.' + post;

      var _obj = {
        // "name": newName,
        "nodes": [],
        "Sequence": Order,
        "PK": guid,
        "NKPackType": _packtype.NKPackType,
        "PackageQty": _packtype.PackageQty,
        "Length": _packtype.Length,
        "Width": _packtype.Width,
        "Height": _packtype.Height,
        "DimensionUQ": _packtype.DimensionUQ,
        "Weight": _packtype.Weight,
        "WeightUQ": _packtype.WeightUQ,
        "Volume": _packtype.Volume,
        "VolumeUQ": _packtype.VolumeUQ,
        "MarksAndNumbers": _packtype.MarksAndNumbers,
        "TransportRef": _packtype.TransportRef,
        "GoodsDescription": _packtype.GoodsDescription,
        "HSCode": _packtype.HSCode,
        "ParentPackage": PickPackingCtrl.ePage.Masters.Childdata.PK,
        "IsClosed": "",
        "IsReleased": "",
        "RequiredTemperatureMinimum": "",
        "RequiredTemperatureUnit": "",
        "RequiredTemperatureMaximum": "",
        "RH_NKCommodityCode": _packtype.RH_NKCommodityCode,
        "CommodityDesc": _packtype.CommodityDesc,
        "RequiresTemperatureControl": "",
        "PackageId": _packtype.PackageId,
        "IsCheckedWeighedCubed": "",
        "IsDamaged": "",
        "IsHeld": "",
        "PackageHeaderFK": PickPackingCtrl.ePage.Masters.Config.PackageListDetails.UIPackageHeader.PK,
        "IsModified": false,
        "IsDeleted": false,
        "IsNewInsert": true
      };

      PickPackingCtrl.ePage.Masters.Childdata.nodes.push(_obj);

      // json obj preparation
      // PickPackingCtrl.ePage.Masters.List.push(_obj);

      console.log(PickPackingCtrl.ePage.Masters.tree);
    }
    //#endregion

    //#region  Delete Function

    // Delete the Package and item

    function Delete(Data) {
      Del(Data);
      // console.log(PickPackingCtrl.ePage.Masters.DeleteList);

      angular.forEach(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackage, function (value, key) {
        angular.forEach(PickPackingCtrl.ePage.Masters.DeleteList, function (value1, key1) {
          if (value.PK == value1.PK) {
            value.IsDeleted = true;
          }
        });
        if (PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackage.length - 1 == key) {
          // Save(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackage);
          console.log(PickPackingCtrl.ePage.Masters.DeleteList);
          console.log(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackage)
          PackageItemDelete(PickPackingCtrl.ePage.Masters.DeleteList);
        }
      });

    }

    function Del(DeleteData) {
      PickPackingCtrl.ePage.Masters.DeleteList.push(DeleteData);
      if (DeleteData.nodes.length > 0)
        Deleteloop(DeleteData.nodes);
    }

    function Deleteloop(data) {
      angular.forEach(data, function (value, key) {
        PickPackingCtrl.ePage.Masters.DeleteList.push(value);
        if (value.nodes.length > 0)
          Deleteloop(value.nodes);
      });
    }

    // delete list for package of parent with child
    function ItemDelete(data) {

      PickPackingCtrl.ePage.Masters.DeleteObj.push(data);

      DeleteItem(PickPackingCtrl.ePage.Masters.DeleteObj);
    }

    // individual item delete
    function DeleteItem(DeleteData) {
      angular.forEach(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems, function (value, key) {
        angular.forEach(DeleteData, function (value1, key1) {
          if (value.PK == value1.PK) {
            value.IsDeleted = true;
          }
        });
        if (PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems.length - 1 == key) {
          console.log(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems);
          ItemDeleteUpdate(PickPackingCtrl.ePage.Masters.Config.PackageListDetails);
        }
      });
    }

    // package with item delete
    function PackageItemDelete(PackageDetails) {
      console.log(PackageDetails);
      if (PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems.length > 0) {
        angular.forEach(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems, function (value, key) {
          angular.forEach(PackageDetails, function (value1, key1) {
            if (value.PackageFK == value1.PK) {
              value.IsDeleted = true;
            }
          });
          if (PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems.length - 1 == key) {
            console.log(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackageItems);
            ItemDeleteUpdate(PickPackingCtrl.ePage.Masters.Config.PackageListDetails);
          }
        });
      } else {
        ItemDeleteUpdate(PickPackingCtrl.ePage.Masters.Config.PackageListDetails);
      }

    }

    // common save for packageitem and item delete
    function ItemDeleteUpdate($item) {
      PickPackingCtrl.ePage.Masters.Loading = true;
      PickPackingCtrl.ePage.Masters.Config.PackageListDetails = $item;

      var item = filterObjectUpdate(PickPackingCtrl.ePage.Masters.Config.PackageListDetails, "IsModified");

      apiService.post("eAxisAPI", PickPackingCtrl.ePage.Entities.Header.API.UpdatePackage.Url, PickPackingCtrl.ePage.Masters.Config.PackageListDetails).then(function (response) {
        if (response.data.Response) {
          PickPackingCtrl.ePage.Masters.Loading = false;
          // Get By Id Call
          apiService.get("eAxisAPI", PickPackingCtrl.ePage.Entities.Header.API.PackageGetByID.Url + response.data.Response.Response.PK).then(function (response) {
            PickPackingCtrl.ePage.Masters.Update = response.data.Response.lstUIPackage;
            PickPackingCtrl.ePage.Masters.Config.PackageListDetails = response.data.Response;
            PickPackingCtrl.ePage.Masters.Config.ItemDeleted = true;
            PickPackingCtrl.ePage.Masters.DeleteObj = [];
            // Reverse json Function Call
            ReverseJson(PickPackingCtrl.ePage.Masters.Update);
          });
          // toastr.success("Deleted Successfully");
        } else {
          toastr.error("Delete Failed");
        }
      });
    }

    //#endregion

    //#region Save Package

    function SavePackage() {
      // json changes call
      console.log(PickPackingCtrl.ePage.Masters.tree);
      JsonLoop(PickPackingCtrl.ePage.Masters.tree);

      //json list for updating and saving 
      Save(PickPackingCtrl.ePage.Masters.List);
    }

    function JsonLoop(myData) {
      myData.map(function (value, key) {
        var obj = {
          "Sequence": value.Sequence,
          "PK": value.PK,
          "NKPackType": value.NKPackType,
          "PackageQty": value.PackageQty,
          "Length": value.Length,
          "Width": value.Width,
          "Height": value.Height,
          "DimensionUQ": value.DimensionUQ,
          "Weight": value.Weight,
          "WeightUQ": value.WeightUQ,
          "Volume": value.Volume,
          "VolumeUQ": value.VolumeUQ,
          "MarksAndNumbers": value.MarksAndNumbers,
          "TransportRef": value.TransportRef,
          "GoodsDescription": value.GoodsDescription,
          "HSCode": value.HSCode,
          "ParentPackage": value.ParentPackage,
          "IsClosed": value.IsClosed,
          "IsReleased": value.IsReleased,
          "RequiredTemperatureMinimum": value.RequiredTemperatureMinimum,
          "RequiredTemperatureUnit": value.RequiredTemperatureUnit,
          "RequiredTemperatureMaximum": value.RequiredTemperatureMaximum,
          "RH_NKCommodityCode": value.RH_NKCommodityCode,
          "CommodityDesc": value.CommodityDesc,
          "RequiresTemperatureControl": value.RequiresTemperatureControl,
          "PackageId": value.PackageId,
          "IsCheckedWeighedCubed": value.IsCheckedWeighedCubed,
          "IsDamaged": value.IsDamaged,
          "IsHeld": value.IsHeld,
          "PackageHeaderFK": value.PackageHeaderFK,
          "IsModified": value.IsModified,
          "IsDeleted": value.IsDeleted,
          "IsNewInsert": value.IsNewInsert,
        }
        PickPackingCtrl.ePage.Masters.List.push(obj);
        if (value.nodes.length > 0)
          JsonLoop(value.nodes);
      });
      // console.log(PickPackingCtrl.ePage.Masters.List);
    }


    // update call for package update list
    function Save($item) {
      PickPackingCtrl.ePage.Masters.Loading = true;
      PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackage = $item;

      var item = filterObjectUpdate(PickPackingCtrl.ePage.Masters.Config.PackageListDetails.lstUIPackage, "IsModified");

      apiService.post("eAxisAPI", PickPackingCtrl.ePage.Entities.Header.API.UpdatePackage.Url, PickPackingCtrl.ePage.Masters.Config.PackageListDetails).then(function (response) {
        if (response.data.Response) {

          // Get By Id Call
          apiService.get("eAxisAPI", PickPackingCtrl.ePage.Entities.Header.API.PackageGetByID.Url + response.data.Response.Response.PK).then(function (response) {
            PickPackingCtrl.ePage.Masters.Loading = false;
            PickPackingCtrl.ePage.Masters.EnablePrintLabel = true;
            PickPackingCtrl.ePage.Masters.UpdatedList = response.data.Response.lstUIPackage;
            PickPackingCtrl.ePage.Masters.Config.PackageListDetails = response.data.Response;
            PickPackingCtrl.ePage.Masters.List = [];
            PickPackingCtrl.ePage.Masters.PackList = {};
            // Reverse json Function Call
            ReverseJson(PickPackingCtrl.ePage.Masters.UpdatedList);
          });
          toastr.success("Saved Successfully");
        } else {
          toastr.error("Save Failed");
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
    //#endregion

    //#region Label Print for Package
    function PrintLabel() {
      PickPackingCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

      var LabelObjectList = [];

      LabelObjectList.push(PickPackingCtrl.ePage.Masters.Config.PackageListDetails);

      apiService.post("eAxisAPI", PickPackingCtrl.ePage.Entities.Header.API.PrintPackageLabel.Url, LabelObjectList).then(function (response) {
        if (response.data.Response) {
          PickPackingCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
          $uibModal.open({
            windowClass: "general-edit  PackageLabel",
            templateUrl: 'app/eaxis/warehouse/wh-releases/packing-module/pick-packing-tree/package-label-modal.html',
            controller: function ($scope, $uibModalInstance) {

              function base64ToArrayBuffer(base64) {
                var binaryString = window.atob(base64);
                var binaryLen = binaryString.length;
                var bytes = new Uint8Array(binaryLen);
                for (var i = 0; i < binaryLen; i++) {
                  var ascii = binaryString.charCodeAt(i);
                  bytes[i] = ascii;
                }
                var blob = new Blob([(bytes)], {
                  type: "application/pdf"
                });
                var fileURL = URL.createObjectURL(blob);
                $scope.Barcodecontent = $sce.trustAsResourceUrl(fileURL);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = fileURL;
                a.download = 'PackageLabel.pdf';
              }

              base64ToArrayBuffer(response.data.Response);

              $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
              };
            }
          });
        } else {
          toastr.error("Could Not Generate Label");
        }
      });
    }
    //#endregion

    Init();
  }
})();