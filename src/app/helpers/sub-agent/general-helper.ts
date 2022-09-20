import { HedderComponent } from 'src/app/common/components/hedder/hedder.component';
import { SubAgentStateService } from '../../Services/sub-agent-state.service';

export class SubAgentGeneralHelper {

  constructor(private subagentState: SubAgentStateService) { }


  /**
   * function to process filter
   * @param hotelList to indicate FilterStatus based on filter response
   * @returns hotelList
   */
  processHotelFilter(hotelList) {
    let flag: boolean = false;
    if (this.subagentState && this.subagentState.FilterModel) {
      if (this.subagentState.FilterModel.Amenities && this.subagentState.FilterModel.Amenities.length > 0) {
        let checkedAmenities = this.subagentState.FilterModel.Amenities.filter(amenities => amenities.Tounched == true);
        if (checkedAmenities.length > 0) {
          if (hotelList && hotelList.length > 0) {
            hotelList.forEach(hotelList => {
              flag = false;
              if (hotelList.amenities && hotelList.amenities.length > 0) {
                hotelList.amenities.forEach(amenities => {
                  if ((checkedAmenities.filter(keyAm => keyAm.Name == amenities.name)).length > 0) {
                    flag = true;
                  }
                });
              }
              if (!flag) {
                hotelList.FilterStatus = false;
                this.subagentState.FilterModel.FilterApplied = true;
              }
            });
          }
        }
      }
      if (this.subagentState.FilterModel.StarRating && this.subagentState.FilterModel.StarRating.length > 0) {
        let checkedRatings = this.subagentState.FilterModel.StarRating.filter(rating => rating.Tounched == true);
        if (checkedRatings.length > 0) {
          if (hotelList && hotelList.length > 0) {
            hotelList.forEach(hotelList => {
              flag = false;
              if ((checkedRatings.filter(keyAm => keyAm.Type == hotelList.rating)).length > 0) {
                flag = true;
              }
              if (!flag) {
                hotelList.FilterStatus = false;
                this.subagentState.FilterModel.FilterApplied = true;
              }
            });
          }
        }
      }
      if (this.subagentState.FilterModel.MinPrice || this.subagentState.FilterModel.MaxPrice) {
        hotelList = this.filterHotelListWithPriceRange(hotelList);
      }
    }
    return hotelList;
  }

  /**
   * to reset the filterModel by making all tounched as false
   */
  resetFilterModel() {
    if (this.subagentState && this.subagentState.FilterModel) {
      if (this.subagentState.FilterModel.Amenities && this.subagentState.FilterModel.Amenities.length > 0) {
        this.subagentState.FilterModel.Amenities.forEach(element => {
          if (element.Tounched)
            element.Tounched = false;
        });
      }
      if (this.subagentState.FilterModel.StarRating && this.subagentState.FilterModel.StarRating.length > 0) {
        this.subagentState.FilterModel.StarRating.forEach(element => {
          if (element.Tounched)
            element.Tounched = false;
        });
      }
    }
    this.subagentState.FilterModel.FilterApplied = false;
    this.subagentState.FilterModel.MinPrice = 0;
    this.subagentState.FilterModel.MaxPrice = 0;
  }

  /**
   * to filter hotel list with price range
   * @param hotelList to indicate FilterStatus based on filter response
   * @returns hotelList
   */
  filterHotelListWithPriceRange(hotelList) {
    if (hotelList) {
      hotelList.forEach(list => {
        if (list.amount >= this.subagentState.FilterModel.MinPrice && list.amount <= this.subagentState.FilterModel.MaxPrice) {
          list.FilterStatus = true;
        }else{
          list.FilterStatus = false;
        }
      });
    }
    return hotelList;
  }

  /**
   * this methode used check iban number is valid
   */
  ibanTextValidation(iban){
    var letter = new Array (
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
    var digits = new Array (
      "10","11","12","13","14","15","16","17","18","19","20","21","22",
      "23","24","25","26","27","28","29","30","31","32","33","34","35");

    var sa_ilen = 24;
    var sa_ctry = "SA";
    var sa_bban: RegExp = /\d{2}[A-Za-z0-9]{18}/;

    // IBAN must consist entirely of characters a-z, A-Z, 0-9
    let chartr: RegExp = /\W|_/;
    if (chartr.test(iban)){
      return "IBAN contains illegal characters";
    }

    // First four characters must be letter-letter-digit-digit
    let letterDigit: RegExp = /^\D\D\d\d.+/;
    if(letterDigit.test(iban) == false){
      return "Invalid IBAN Number";
    }

    // Check digits cannot be 00, 01 or 99
    let digit: RegExp = /^\D\D00.+|^\D\D01.+|^\D\D99.+/;
    if(digit.test(iban)){
      return "Invalid IBAN check digits";
    }

    // Validate country code
    var city = iban.substr(0, 2);
    if(city != sa_ctry){
      return "Invalid country code - Saudi IBANs must begin with '"+sa_ctry+"'";
    }

    // Validate length
    if(iban.length != sa_ilen){
      return "Invalid length - Saudi IBANs must be '"+sa_ilen+"' characters long";
    }

    // Validate BBAN structure
    if (sa_bban.test(iban.substr(4, sa_ilen - 4)) == false){
      return "Invalid IBAN Number";
    }

    // Convert to upper case
    iban = iban.toUpperCase();

    // Move country and check digits to the end
    iban = iban.substr(4, 24 - 4) + iban.substr(0, 4);

    // Replace letters with digits
    for (let i = 0; i <= 25; i++)
    {
        while (iban.search(letter[i])!= -1)
        {
            iban = iban.replace(letter[i], digits[i]);
        }
    }

    // Calculate modulo 97 remainder
    let coss = Math.ceil(iban.length / 7);
    let rmndr = "";
    for (let i = 1; i <= coss; i++)
    {
        rmndr = String(parseFloat(rmndr + iban.substr((i - 1) * 7, 7)) % 97);
    }

    // Remainder must be 1
    if (rmndr != "1")
    {
      return "Incorrect IBAN check digits";
    }

    return "true";

  }

  currencyCalculation(amount){
    var decimalpoint:number = +HedderComponent.globelDecimel;
    var rate:number = +HedderComponent.globelRate;
    var total = amount * rate;
    return (Math.round(total * 100) / 100).toFixed(decimalpoint);
  }
}
