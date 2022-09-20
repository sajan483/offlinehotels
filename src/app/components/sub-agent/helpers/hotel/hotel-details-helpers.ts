export class SubAgentHotelDetailsHelper {

    constructor(){}

    setDataForHotelDeatils(respone: any,city:any){
        let selectedHotel = respone;
        let isGrouped: boolean;
        let selectedRoomGroups = [];
        let container: any = [];
        for (let i = 0; i < selectedHotel.room_groups.length; ++i) {
        for (let j = 0; j < selectedHotel.room_groups[i].rooms.length; ++j) {
            selectedHotel.room_groups[i].rooms[j].insertedState = city;
            selectedHotel.room_groups[i].rooms[j].isRoomSelectionChecked = false;
            selectedHotel.room_groups[i].rooms[j].insertedAmount = selectedHotel.room_groups[i].amount ? selectedHotel.room_groups[i].amount : 0;
        }
        }

        let hotelPics = [];
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

    getRoomDetailsFromOccupancyParams(val){
        let adultCount = 0;
        let childCount = 0;
        let roomCount = 0;
        let roomObject = [];
        let childAgeArray = [];
        let rooms = val.split('#');
        rooms.splice(0,1);
        rooms.forEach(data =>{
            let subValue = data.split('C');
            let roomData = subValue[0].split('_');
            roomCount = roomCount + (+roomData[0]);
            adultCount = adultCount + (roomData[0] * roomData[1]);
            childCount = childCount + (roomData[0] * roomData[2]);
            if(subValue.length > 1){
                let child = subValue;
                child.splice(0,1);
                childAgeArray = [];
                child.forEach(x =>{
                    let ages = x.split('_');
                    ages.splice(0,1);
                    childAgeArray.push(ages)
                })
            }
            for(let i=0;i<(+roomData[0]);i++){
                let obj = {
                    id:i,
                    child_ages:childAgeArray[i],
                    children:+roomData[2],
                    adults:+roomData[1],
                    pax_info_str:"",
                    seq_no:""
                }
                roomObject.push(obj)
            }
        })

        let detailObj = {
            roomObject:roomObject,
            roomCount:roomCount,
            adultCount:adultCount,
            childCount:childCount
        }

        return detailObj;

    }

}