import { HelperService } from "src/app/common/services/helper-service";
import Swal from "sweetalert2";
import { TranslateService } from '@ngx-translate/core';
import { DateTimeToDateFormat } from "../date_time/date_pipe";

export class CreateTripHelper {
  constructor(private helperService: HelperService,private translate: TranslateService,private dateFormate:DateTimeToDateFormat) { }

  /**
   * Method for setting hotel details  to details popup
   * @param data  response
   * @param selectedHotelInfo hotel info
   * @param rooms  room details
   */

  setDataForHotelDeatils(respone: any, selectedHotelInfo: any, rooms: any[]) {
    var selectedHotel = respone;
    var isGrouped: boolean;
    var selectedRoomGroups = [];
    var container: any = [];
    sessionStorage.setItem("noOfDays",JSON.stringify(this.helperService.noOfDaysBetweenTwoDates(this.dateFormate.transform(selectedHotel.check_in_time), this.dateFormate.transform(selectedHotel.check_out_time))))
    for (let i = 0; i < selectedHotel.room_groups.length; ++i) {
      for (let j = 0; j < selectedHotel.room_groups[i].rooms.length; ++j) {
        selectedHotel.room_groups[i].rooms[j].insertedState = selectedHotelInfo.city == "Makkah" ? "MAKKA" : "MADEENA";
        selectedHotel.room_groups[i].rooms[j].isRoomSelectionChecked = false;
        selectedHotel.room_groups[i].rooms[j].insertedAmount = selectedHotel.room_groups[i].amount ? selectedHotel.room_groups[i].amount : 0;
      }
    }

    var hotelPics = [];
    selectedHotel.meta_data.images.forEach(el => {
      if(el.image_webp_url != null){
        hotelPics.push(el.image_webp_url)
      }else if(el.image_url != null){
        hotelPics.push(el.image_url)
      }
    });
    hotelPics = hotelPics.filter(e=>e!=null && e!="None" && e!="");
    container.hotelPics = hotelPics;

    if (!selectedHotel.room_groups[0].is_grouped) {
      container.isGrouped = false;
      isGrouped = false;
    }

    if (selectedHotel.room_groups[0].is_grouped) {
      container.isGrouped = true;
      isGrouped = true;
    }

    // if (isGrouped) {
    //   for (let i = 0; i < selectedHotel.room_groups.length; ++i) {
    //     for (let j = 0; j < selectedHotel.room_groups[i].rooms.length; ++j) {
    //       selectedHotel.room_groups[i].rooms[j].insertedState = selectedHotelInfo.city == "Makkah" ? "MAKKA" : "MADEENA";
    //       selectedHotel.room_groups[i].rooms[j].isRoomSelectionChecked = false;
    //       selectedHotel.room_groups[i].rooms[j].insertedAmount = selectedHotel.room_groups[i].rooms[0].amount;
    //     }
    //   }
    //   selectedRoomGroups = [];
    //   selectedHotel.room_groups.forEach((element) => {
    //     if (element.is_grouped) {
    //       element.isRoomSelectionChecked = false;
    //       selectedRoomGroups.push(element);
    //     }
    //   });
    //   rooms.forEach((element) => {
    //     if (element.child_ages) {
    //       element.pax_info_str =
    //         element.adults +
    //         "ADT_" +
    //         element.children +
    //         "CHD_" +
    //         element.child_ages.sort().join("_");
    //     } else {
    //       element.pax_info_str =
    //         element.adults + "ADT_" + element.children + "CHD_";
    //     }
    //   });
    //   selectedRoomGroups.forEach((x) => {
    //     x.insertedAvailableCount = x.rooms
    //       .map((room) => room.available_count)
    //       .reduce((a, b) => a + b, 0);
    //   });

    //   selectedRoomGroups.forEach((x) => {
    //     x.rooms.forEach((room) => {
    //       room.adult_number = room.pax_info
    //         .filter((x) => x.type == "ADT")
    //         .map((a) => a.quantity)
    //         .reduce((a, b) => a + b, 0);
    //       room.child_number = room.pax_info
    //         .filter((x) => x.type == "CHD")
    //         .map((a) => a.quantity)
    //         .reduce((a, b) => a + b, 0);
    //     });
    //   });
    //   container.isSelectBtnActive = true;
    //   selectedRoomGroups = selectedRoomGroups.filter(this.helperService.onlyUnique);
    //   container.roomGroups = selectedRoomGroups;
    // }

    if (isGrouped) {
      let selectedRoomGroups = [];
      selectedHotel.room_groups.forEach(element => {
        if (element.is_grouped) {
          element.isRoomSelectionChecked = false;
          selectedRoomGroups.push(element);
        }
      });
      selectedRoomGroups.forEach(x => x.rooms.forEach(y => y.insertedQuantity = y.quantity));
      for (let i = 0; i < selectedRoomGroups.length; i++) {
        selectedRoomGroups[i].isExpand = true;
        selectedRoomGroups[i].isDisplayGroup = true;
        for (let j = 0; j < selectedRoomGroups[i].rooms.length; j++) {
          if (selectedRoomGroups[i].rooms[j].insertedQuantity > 1) {
            selectedRoomGroups[i].rooms[j].roomSplit = true;
            selectedRoomGroups[i].rooms[j].sequence = selectedRoomGroups[i].rooms[j].sequence + 1
            selectedRoomGroups[i].rooms.push(selectedRoomGroups[i].rooms[j])
            selectedRoomGroups[i].rooms[j].insertedQuantity = selectedRoomGroups[i].rooms[j].insertedQuantity - 1
          }
        }
      }

      rooms.forEach(element => {
        if (element.child_ages) {
          element.pax_info_str = element.adults + "ADT_" + element.children + "CHD_" + element.child_ages.sort().join("_");
        } else {
          element.pax_info_str = element.adults + "ADT_" + element.children + "CHD_";
        }
      });

      selectedRoomGroups.forEach(x => { x.insertedAvailableCount = x.rooms.map(room => room.available_count).reduce((a, b) => a + b, 0) });
      selectedRoomGroups.forEach(x => {
        x.rooms.forEach(room => {
          room.adult_number = room.pax_info.filter(x => x.type == "ADT").map(a => a.quantity).reduce((a, b) => a + b, 0)
          room.child_number = room.pax_info.filter(x => x.type == "CHD").map(a => a.quantity).reduce((a, b) => a + b, 0)
        });
      });
      container.rooomGroup = selectedRoomGroups
    }
    // if(!isGrouped){
    //   let totalRoomPrice = 0;
    //   let w = respone.room_groups.map(x=>x.rooms.map(y=>({name:y.name,meal:y.meal_title,pax:y.pax_info_str,price:y.amount})));let c = w.concat.apply([],w)
    //     c.forEach(elmt=>{respone.room_groups.forEach(x=>x.rooms.forEach(y=>{
    //             y.isRoomSelectionChecked = false;y.isExpand = false;
    //             if(elmt.name == y.name && elmt.pax == y.pax_info_str){
    //                 let r = c.filter(f=>f.name = elmt.name).map(t=>({mealTitle:t.meal,amount:t.price}));
    //                 let q = r.filter((v,i,a)=>a.findIndex(t=>(t.mealTitle === v.mealTitle))===i);
    //                 let z = [];q.forEach(m=>z.push(m));y.insertedMealTitle = z
    //             }else{
    //               y.insertedMealTitle = []
    //               y.insertedMealTitle.push({mealTitle:y.meal_title,amount:y.amount})
    //             }
    //         }))
    //     })
    //     respone.room_groups.forEach(x=>x.rooms.forEach(g=>g.insertedMealTitle = g.insertedMealTitle.filter((v,i,a)=>a.findIndex(t=>(t.mealTitle === v.mealTitle))===i)))
    //     respone.room_groups.forEach(x=>x.rooms = x.rooms.filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i))
    //     respone.room_groups.forEach(x=>x.rooms.forEach((y,i)=>{if(i==0){y.isRoomSelectionChecked = true;}}))
    //     respone.room_groups.forEach(x=>x.rooms.forEach(y=>y.isExpand = true))
    //     respone.room_groups.forEach(x=>x.rooms.forEach((y,i)=>{if(y.isRoomSelectionChecked){totalRoomPrice = totalRoomPrice + y.amount * y.quantity;}}))
    //     respone.room_groups.forEach((x) => {x.rooms.forEach((room) => {room.adult_number = room.pax_info.filter((x) => x.type == "ADT").map((a) => a.quantity).reduce((a, b) => a + b, 0);
    //             room.child_number = room.pax_info.filter((x) => x.type == "CHD").map((a) => a.quantity).reduce((a, b) => a + b, 0);});});
    //     container.roomPrice = totalRoomPrice;
    //     container.roomGroups = respone.room_groups
    //   }

    //   if (!isGrouped) {
    //     selectedHotel.room_groups.forEach(x => x.rooms.forEach(y => {
    //      y.isRoomSelectionChecked = false;y.isExpand = false;y.insertedMealTitle = [];
    //      y.isDisplay = true;y.insertedQuantity = y.quantity;y.roomSplit = false;
    //    }));
    //    selectedHotel.room_groups.forEach((x) => {
    //      x.rooms.forEach((room) => {
    //        room.adult_number = room.pax_info.filter((x) => x.type == "ADT").map((a) => a.quantity).reduce((a, b) => a + b, 0);
    //        room.child_number = room.pax_info.filter((x) => x.type == "CHD").map((a) => a.quantity).reduce((a, b) => a + b, 0);
    //      });
    //    });
    //    for (let i = 0; i < selectedHotel.room_groups.length; i++) {
    //      if (selectedHotel.room_groups[i].rooms[0].insertedQuantity > 1) {
    //        selectedHotel.room_groups[i].rooms[0].sequence = selectedHotel.room_groups[i].rooms[0].sequence + 1
    //        selectedHotel.room_groups[i].rooms[0].roomSplit = true;
    //        selectedHotel.room_groups.push(selectedHotel.room_groups[i])
    //        selectedHotel.room_groups[i].rooms[0].insertedQuantity = selectedHotel.room_groups[i].rooms[0].insertedQuantity - 1
    //      }
    //    }
    //    for (let i = 0; i < selectedHotel.room_groups.length; i++) {
    //      for (let j = 0; j < selectedHotel.room_groups[i].rooms.length; j++) {
    //        if (selectedHotel.room_groups[i].rooms[j].insertedQuantity > 1) {
    //          selectedHotel.room_groups[i].rooms[j].sequence = selectedHotel.room_groups[i].rooms[j].sequence + 1
    //          selectedHotel.room_groups[i].rooms[j].roomSplit = true;
    //          selectedHotel.room_groups[i].rooms[j].insertedQuantity = selectedHotel.room_groups[i].rooms[j].insertedQuantity - 1
    //        }
    //      }
    //    }

    //    selectedHotel.room_groups.sort((a, b) => a.group_id.localeCompare(b.group_id) || b.price - a.price);
    //    let w = selectedHotel.room_groups.map(x => x.rooms.map(y => ({ name: y.name, meal: y.meal_title, pax: y.pax_info_str ,price:y.display_fare_summary.total_amount})));
    //    let c = w.concat.apply([], w)
    //    c.forEach(elmt => {
    //      selectedHotel.room_groups.forEach(x => x.rooms.forEach(y => {
    //        y.isRoomSelectionChecked = false;y.isExpand = false;y.insertedMealTitle = [];
    //        y.isDisplay = true;y.insertedQuantity = 1;y.roomSplit = false;
    //        if (elmt.name == y.name && elmt.pax == y.pax_info_str) {
    //          let r = c.filter(f=>f.name = elmt.name).map(t=>({mealTitle:t.meal,amount:t.price,showMeal:false}));
    //          let q = r.filter((v,i,a)=>a.findIndex(t=>(t.mealTitle === v.mealTitle))===i);
    //          let z = [];q.forEach(m=>z.push(m));y.insertedMealTitle = z
    //        } else {
    //          y.insertedMealTitle = []
    //          y.insertedMealTitle.push({mealTitle:y.meal_title,amount:y.display_fare_summary.total_amount,showMeal:false})

    //        }
    //      }))
    //    })
    //    selectedHotel.room_groups.forEach(x => x.rooms.forEach(y=>y.insertedMealTitle[0].showMeal = true))
    //    selectedHotel.room_groups.forEach(x => x.rooms = x.rooms.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i))
    //    var groups = {};
    //    for (var i = 0; i < selectedHotel.room_groups.length; i++) {
    //      var groupName: string = selectedHotel.room_groups[i].group_id;
    //      if (!groups[groupName]) { groups[groupName] = []; }
    //      groups[groupName].push(selectedHotel.room_groups[i]);
    //    }
    //    selectedHotel.room_groups = [];
    //    for (var groupName in groups) { selectedHotel.room_groups.push({ x: groups[groupName] }); }
    //    let p = selectedHotel.room_groups.map(y => y.x)
    //    container.rooomGroup = p
    //  }
     if (!isGrouped) {
      selectedHotel.room_groups.forEach(x => x.rooms.forEach(y => {
       y.isRoomSelectionChecked = false;y.isExpand = false;y.insertedMealTitle = [];
       y.isDisplay = true;y.insertedQuantity = y.quantity;y.roomSplit = false;
     }));
     selectedHotel.room_groups.forEach((x) => {
       x.rooms.forEach((room) => {
         room.adult_number = room.pax_info.filter((x) => x.type == "ADT").map((a) => a.quantity).reduce((a, b) => a + b, 0);
         room.child_number = room.pax_info.filter((x) => x.type == "CHD").map((a) => a.quantity).reduce((a, b) => a + b, 0);
       });
     });
     for (let i = 0; i < selectedHotel.room_groups.length; i++) {
       if (selectedHotel.room_groups[i].rooms[0].insertedQuantity > 1) {
         selectedHotel.room_groups[i].rooms[0].sequence = selectedHotel.room_groups[i].rooms[0].sequence + 1
         selectedHotel.room_groups[i].rooms[0].roomSplit = true;
         selectedHotel.room_groups.push(selectedHotel.room_groups[i])
         selectedHotel.room_groups[i].rooms[0].insertedQuantity = selectedHotel.room_groups[i].rooms[0].insertedQuantity - 1
       }
     }
     for (let i = 0; i < selectedHotel.room_groups.length; i++) {
       for (let j = 0; j < selectedHotel.room_groups[i].rooms.length; j++) {
         if (selectedHotel.room_groups[i].rooms[j].insertedQuantity > 1) {
           selectedHotel.room_groups[i].rooms[j].sequence = selectedHotel.room_groups[i].rooms[j].sequence + 1
           selectedHotel.room_groups[i].rooms[j].roomSplit = true;
           selectedHotel.room_groups[i].rooms[j].insertedQuantity = selectedHotel.room_groups[i].rooms[j].insertedQuantity - 1
         }
       }
     }

     selectedHotel.room_groups.sort((a, b) => a.group_id.localeCompare(b.group_id) || b.price - a.price);
     let w = selectedHotel.room_groups.map(x => x.rooms.map(y => ({
       name: y.name,
       meal: y.meal_title,
       pax: y.pax_info_str ,
       price:y.display_fare_summary.total_amount,
       baseAmount:y.display_fare_summary.base_amount,
       tax:y.display_fare_summary.tax_amount,
       commission:y.display_fare_summary.commission_discount,
       rmGpObj:y.room_group_obj,
       rmId:y.room_id
     })));
     let c = w.concat.apply([], w)
     c.forEach(elmt => {
       selectedHotel.room_groups.forEach(x => x.rooms.forEach(y => {
         y.isRoomSelectionChecked = false;y.isExpand = false;y.insertedMealTitle = [];
         y.isDisplay = true;y.insertedQuantity = 1;y.roomSplit = false;
         if (elmt.name == y.name && elmt.pax == y.pax_info_str) {
           let r = c.filter(f=>f.name = elmt.name).map(t=>({
             mealTitle:t.meal,
             amount:t.price,
             showMeal:false,
             baseAmount:t.baseAmount,
             tax:t.tax,
             commission:t.commission,
             rmGpObj:t.rmGpObj,
             rmId:t.rmId
           }));
           let q = r.filter((v,i,a)=>a.findIndex(t=>(t.mealTitle === v.mealTitle))===i);
           let z = [];q.forEach(m=>z.push(m));y.insertedMealTitle = z
         } else {
           y.insertedMealTitle = []
           y.insertedMealTitle.push({
             mealTitle:y.meal_title,
             amount:y.display_fare_summary.total_amount,
             showMeal:false,
             baseAmount:y.display_fare_summary.base_amount,
             tax:y.display_fare_summary.tax_amount,
             commission:y.display_fare_summary.commission,
             rmGpObj:y.room_group_obj,
             rmId:y.room_id
           })
         }
       }))
     })
     selectedHotel.room_groups.forEach(x => x.rooms.forEach(y=>y.insertedMealTitle[0].showMeal = true))
     selectedHotel.room_groups.forEach(x => x.rooms = x.rooms.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i))
     var groups = {};
     for (var i = 0; i < selectedHotel.room_groups.length; i++) {
       var groupName: string = selectedHotel.room_groups[i].group_id;
       if (!groups[groupName]) { groups[groupName] = []; }
       groups[groupName].push(selectedHotel.room_groups[i]);
     }
     selectedHotel.room_groups = [];
     for (var groupName in groups) { selectedHotel.room_groups.push({ x: groups[groupName] }); }
     let p = selectedHotel.room_groups.map(y => y.x)
     container.rooomGroup = p
   }
    return container;
  }

  setDataForHotelDeatilsV2(respone: any, selectedHotelInfo: any, rooms: any[]) {
    var selectedHotel = respone;
    var isGrouped: boolean;
    var selectedRoomGroups = [];
    var container: any = [];
    sessionStorage.setItem("noOfDays", JSON.stringify(this.helperService.noOfDaysBetweenTwoDates(selectedHotel.check_in_time, selectedHotel.check_out_time)))
    for (let i = 0; i < selectedHotel.room_groups.length; ++i) {
      for (let j = 0; j < selectedHotel.room_groups[i].rooms.length; ++j) {
        selectedHotel.room_groups[i].rooms[j].insertedState = selectedHotelInfo.city == "Makkah" ? "MAKKA" : "MADEENA";
        selectedHotel.room_groups[i].rooms[j].isRoomSelectionChecked = false;
        selectedHotel.room_groups[i].rooms[j].insertedAmount = selectedHotel.room_groups[i].amount ? selectedHotel.room_groups[i].amount : 0;
      }
    }

    var hotelPics = [];
    selectedHotel.meta_data.images.forEach(el => {
      if (el.image_webp_url != null) {
        hotelPics.push(el.image_webp_url)
      } else if (el.image_url != null) {
        hotelPics.push(el.image_url)
      }

    });
    container.hotelPics = hotelPics;

    container.isGrouped = selectedHotel.room_groups[0].is_grouped;
    isGrouped = selectedHotel.room_groups[0].is_grouped;


    if (isGrouped) {
      let selectedRoomGroups = [];
      selectedHotel.room_groups.forEach(element => {
        if (element.is_grouped) {
          element.isRoomSelectionChecked = false;
          selectedRoomGroups.push(element);
        }
      });
      selectedRoomGroups.forEach(x => x.rooms.forEach(y => y.insertedQuantity = y.quantity));
      for (let i = 0; i < selectedRoomGroups.length; i++) {
        selectedRoomGroups[i].isExpand = true;
        selectedRoomGroups[i].isDisplayGroup = true;
        for (let j = 0; j < selectedRoomGroups[i].rooms.length; j++) {
          if (selectedRoomGroups[i].rooms[j].insertedQuantity > 1) {
            selectedRoomGroups[i].rooms[j].roomSplit = true;
            selectedRoomGroups[i].rooms[j].sequence = selectedRoomGroups[i].rooms[j].sequence + 1
            selectedRoomGroups[i].rooms.push(selectedRoomGroups[i].rooms[j])
            selectedRoomGroups[i].rooms[j].insertedQuantity = selectedRoomGroups[i].rooms[j].insertedQuantity - 1
          }
        }
      }

      selectedRoomGroups.forEach(x => { x.insertedAvailableCount = x.rooms.map(room => room.available_count).reduce((a, b) => a + b, 0) });
      selectedRoomGroups.forEach(x => {
        x.rooms.forEach(room => {
          room.adult_number = room.pax_info.filter(x => x.type == "ADT").map(a => a.quantity).reduce((a, b) => a + b, 0)
          room.child_number = room.pax_info.filter(x => x.type == "CHD").map(a => a.quantity).reduce((a, b) => a + b, 0)
        });
      });
      container.rooomGroup = selectedRoomGroups
    } else {
      selectedHotel.room_groups.forEach(x => x.rooms.forEach(y => {
        y.isRoomSelectionChecked = false;
        y.isExpand = false;
        // y.insertedMealTitle = [];
        y.isDisplay = true;
        y.insertedQuantity = y.quantity;
        y.roomSplit = false;
      }));
      selectedHotel.room_groups.forEach((x) => {
        x.rooms.forEach((room) => {
          room.adult_number = room.pax_info.filter((x) => x.type == "ADT").map((a) => a.quantity).reduce((a, b) => a + b, 0);
          room.child_number = room.pax_info.filter((x) => x.type == "CHD").map((a) => a.quantity).reduce((a, b) => a + b, 0);
        });
      });
      for (let i = 0; i < selectedHotel.room_groups.length; i++) {
        if (selectedHotel.room_groups[i].rooms[0].insertedQuantity > 1) {
          selectedHotel.room_groups[i].rooms[0].sequence = selectedHotel.room_groups[i].rooms[0].sequence + 1
          selectedHotel.room_groups[i].rooms[0].roomSplit = true;
          selectedHotel.room_groups.push(selectedHotel.room_groups[i])
          selectedHotel.room_groups[i].rooms[0].insertedQuantity = selectedHotel.room_groups[i].rooms[0].insertedQuantity - 1
        }
      }
      for (let i = 0; i < selectedHotel.room_groups.length; i++) {
        for (let j = 0; j < selectedHotel.room_groups[i].rooms.length; j++) {
          if (selectedHotel.room_groups[i].rooms[j].insertedQuantity > 1) {
            selectedHotel.room_groups[i].rooms[j].sequence = selectedHotel.room_groups[i].rooms[j].sequence + 1
            selectedHotel.room_groups[i].rooms[j].roomSplit = true;
            selectedHotel.room_groups[i].rooms[j].insertedQuantity = selectedHotel.room_groups[i].rooms[j].insertedQuantity - 1
          }
        }
      }

      selectedHotel.room_groups.sort((a, b) => a.group_id.localeCompare(b.group_id) || b.price - a.price);
      selectedHotel.room_groups.forEach((e)=>{
        e.rooms.forEach((e1)=>{
          e1.selected_board_type = e1.board_types[0];
        })
      });
      selectedHotel.room_groups.forEach(x => x.rooms.forEach(y => y.board_types[0].showMeal = true))
      selectedHotel.room_groups.forEach(x => x.rooms = x.rooms.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i))
      var groups = {};
      for (var i = 0; i < selectedHotel.room_groups.length; i++) {
        var groupName: string = selectedHotel.room_groups[i].group_id;
        if (!groups[groupName]) { groups[groupName] = []; }
        groups[groupName].push(selectedHotel.room_groups[i]);
      }
      selectedHotel.room_groups = [];
      for (var groupName in groups) { selectedHotel.room_groups.push({ x: groups[groupName] }); }
      let p = selectedHotel.room_groups.map(y => y.x)
      container.rooomGroup = p
    }
    return container;
  }
  cancelbuttondisable(makkahCancellation, medinahCancellation, transportCancellation, makkahchecked, medinahchecked, transportchecked): boolean {
    let viewbttn = false;
    if (makkahCancellation != null && medinahCancellation != null && transportCancellation != null) {
      if (makkahCancellation.success && medinahCancellation.success && transportCancellation.success) {
        if (makkahchecked && medinahchecked && transportchecked) {
          viewbttn = true;
        }
      } else if (makkahCancellation.success && medinahCancellation.success) {
        if (makkahchecked && medinahchecked) {
          viewbttn = true;
        }
      } else if (makkahCancellation.success && transportCancellation.success) {
        if (makkahchecked && transportchecked) {
          viewbttn = true;
        }
      } else if (medinahCancellation.success && transportCancellation.success) {
        if (medinahchecked && transportchecked) {
          viewbttn = true;
        }
      } else if (makkahCancellation.success) {
        if (makkahchecked) {
          viewbttn = true;
        }
      } else if (medinahCancellation.success) {
        if (medinahchecked) {
          viewbttn = true;
        }
      } else if (transportCancellation.success) {
        if (transportchecked) {
          viewbttn = true;
        }
      }
    } else if (makkahCancellation != null && medinahCancellation != null) {
      if (makkahCancellation.success && medinahCancellation.success) {
        if (makkahchecked && medinahchecked) {
          viewbttn = true;
        }
      } else if (makkahCancellation.success) {
        if (makkahchecked) {
          viewbttn = true;
        }
      } else if (medinahCancellation.success) {
        if (medinahchecked) {
          viewbttn = true;
        }
      }
    } else if (medinahCancellation != null && transportCancellation != null) {
      if (medinahCancellation.success && transportCancellation.success) {
        if (medinahchecked && transportchecked) {
          viewbttn = true;
        }
      } else if (medinahCancellation.success) {
        if (medinahchecked) {
          viewbttn = true;
        }
      } else if (transportCancellation.success) {
        if (transportchecked) {
          viewbttn = true;
        }
      }
    } else if (makkahCancellation != null && transportCancellation != null) {
      if (makkahCancellation.success && transportCancellation.success) {
        if (makkahchecked && transportchecked) {
          viewbttn = true;
        }
      } else if (makkahCancellation.success) {
        if (makkahchecked) {
          viewbttn = true;
        }
      } else if (transportCancellation.success) {
        if (transportchecked) {
          viewbttn = true;
        }
      }
    } else if (makkahCancellation != null) {
      if (makkahCancellation.success) {
        if (makkahchecked) {
          viewbttn = true;
        }
      }
    } else if (transportCancellation != null) {
      if (transportCancellation.success) {
        if (transportchecked) {
          viewbttn = true;
        }
      }
    } else if (medinahCancellation != null) {
      if (medinahCancellation.success) {
        if (medinahchecked) {
          viewbttn = true;
        }
      }
    }
    return viewbttn;
  }

  createPayuRequestForm(payment_create_response): any {
    var form = document.createElement("form");
    form.setAttribute("method", "get");
    form.setAttribute("id", "cashfree-form");
    form.setAttribute("action", payment_create_response.payment_url);

    for (var key in payment_create_response.post_params) {
      if (payment_create_response.post_params.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", payment_create_response.post_params[key]);
        form.appendChild(hiddenField);
      }
    }
    return form;
  }

  showSweetAlert(text,status,btnText):any {
    Swal.fire({
      text:this.translate.instant(text),
      icon: status,
      confirmButtonText:this.translate.instant(btnText),
    });
  }

  titleSweetAlert(icon,title,text,btnText){
    Swal.fire({
      icon: icon,
      title: this.translate.instant(title),
      text: this.translate.instant(text),
      confirmButtonText:this.translate.instant(btnText),
    })
  }

}
