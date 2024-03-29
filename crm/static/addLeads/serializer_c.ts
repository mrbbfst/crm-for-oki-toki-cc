export { Serializer }
import { utils, writeFileXLSX, WorkBook, WorkSheet } from './xlsx';

// @deno-types="./xlsx.d.ts";
import { read, writeFile } from './xlsx.js';
import { PHONE_PATTERN, SERIALIZE_STRATEGY, SER_C, TEXT_CONSTANT } from "./constants.js"
import { Lead, Info, LeadListWithInfo } from "./structures.js"

class Serializer {

    private strategy_add = {
        "(A)ИМЯ-(B)ТЕЛЕФОН-(C)АДРЕСС" : [this.name_cell_handler, this.phone_cell_handler, this.geo_cell_handler],
        "(A)ИМЯ-(B)ТЕЛЕФОН" : [this.name_cell_handler, this.phone_cell_handler],
        "(A)ТЕЛЕФОН-(B)ИМЯ" : [this.phone_cell_handler, this.name_cell_handler],
        "(A)АДРЕСС-(B)ИМЯ-(C)ТЕЛЕФОН" : [this.geo_cell_handler, this.name_cell_handler, this.phone_cell_handler],
        "(A)АДРЕСС-(C)ТЕЛЕФОН-(B)ИМЯ" : [this.geo_cell_handler, this.phone_cell_handler, this.name_cell_handler],
        "(B)ИМЯ-(C)ТЕЛЕФОН": [ , this.name_cell_handler, this.phone_cell_handler],
        "(C)ТЕЛЕФОН-(B)ИМЯ" : [ , this.phone_cell_handler, this.name_cell_handler],
        
    }; 
    private strategy_update = {
        "(A)ТЕЛЕФОН" : [this.phone_cell_handler],
        "(B)ТЕЛЕФОН" : [, this.phone_cell_handler],
        "(C)ТЕЛЕФОН" : [ , , this.phone_cell_handler],
    };
    constructor() {    
    }
    
    read_file(params): WorkBook {
        return read(params, {type: 'binary'});
    }

    private read_row(sheet_:WorkSheet, row_:number, strategy_:[(Function|undefined)?])
     : Lead {

        let result_:Lead = {
            name: null,
            phone:null,
            geo:null
        };
        for(let column_num__ in strategy_) {
            if(strategy_[column_num__]==undefined) 
                continue;
            let sign_column__ = SER_C.ENGLISH_ALPHABET[column_num__];
            (<Function>strategy_[column_num__])(this, sheet_, this.make_cord(sign_column__,row_), result_);
        }
        return result_;
    }

    private does_data_exisx(sheet_:WorkSheet, row_:number, column_count_:number) :boolean {
        let result_:boolean = false;
        for(let i:number=0;i<column_count_;i++) {
            let empty_ = false;
            let cell_value_ = this.get_cell(sheet_, this.make_cord(SER_C.ENGLISH_ALPHABET[i], row_));
            result_ = result_ || cell_value_!=null
        }
        return result_;
    }

    private normalize_strategy(strategy:string):[(Function|undefined)?] {
        let result_:[(Function|undefined)?] = [];
        if(this.strategy_add[strategy]!=undefined)
            result_ = this.strategy_add[strategy];
        else if(this.strategy_update[strategy]!= undefined)
            result_ = this.strategy_update[strategy];
        return  result_;
    }

    serialize(xlsx_object:WorkBook, strategy_:string)
        : LeadListWithInfo  
        {

            const get_sheet = function(book_:WorkBook): WorkSheet {
            return book_.Sheets[book_.SheetNames[0]];
            }

        const normalized_strategy_ = this.normalize_strategy(strategy_)
        const sheet_ = get_sheet(xlsx_object);
        let result: LeadListWithInfo = new LeadListWithInfo();
        let row_ = 0;   
        while(this.does_data_exisx(sheet_,++row_, strategy_.length)) {
            result.leads.push(this.read_row(sheet_,row_, normalized_strategy_));
        }
        this.add_information(result,strategy_);

        return result;
    }

    public get_add_strategyes() {
        let list: [k?:string] = [];
        for( let key in this.strategy_add)
            list.push(key);
        return list;
    }

    public get_update_strategyes() {
        let list: [k?:string] = [];
        for( let key in this.strategy_update)
            list.push(key);
        return list;
    }

    // read and strategies functions

    private make_cord(l:string,r:number):string  {
        return l+String(r);
    }

    private get_cell(sheet_:WorkSheet, cord_:string): string|null {
        let target_!:string|null;
        try {
            target_= String(sheet_[cord_].v).trim();
            return target_;
        } catch (TypeError) {
            return null
        };
        
    }

    private phone_cell_handler(self: Serializer, sheet_: WorkSheet, 
                cord_:string, 
                lead:{name:string|null, phone:string|null, geo:string|null} /*leat it is out*/)
            
        {
            const get_or_null = (sheet__, cord__) => {
                let cell_ = self.get_cell(sheet_,cord_);
                if(cell_==null) 
                    return cell_
                if(cell_.length==SER_C.LENGTH_UA_PHONE) {
                    if(cell_.match(RegExp(/^([0-9]{12})$/gs)))
                        return cell_;
                }
                if(cell_.length==SER_C.LENGTH_SHORT_UA_PHONE && cell_[0] == "0")
                    return "38" + cell_;
                if(cell_.length==SER_C.LENGTH_TOO_LONG_13_UA_PHONE) {
                    let first_two_number = cell_.slice(0,2);
                    if(first_two_number=="33") 
                        return cell_.slice(1,cell_.length);
                    let second_two_number = cell_.slice(1,3);
                    if(second_two_number=="88")
                        return cell_.slice(0,2)+cell_.slice(3)
                    let third_two_number = cell_.slice(2,4);
                    if(third_two_number=="00")
                        return cell_.slice(0,3)+cell_.slice(4)
                }
                return null;
            }
            lead.phone = get_or_null(sheet_,cord_);
    }

    private name_cell_handler(self: Serializer, sheet_:WorkSheet, 
                cord_:string,
                lead: Lead /*leat it is out*/)
        {

            let cell_ = self.get_cell(sheet_, cord_);
            cell_?.trim();
            lead.name = cell_

    }

    private geo_cell_handler(self: Serializer, sheet_:WorkSheet, 
                cord_:string,
                lead:{name:string|null, phone:string|null, geo:string|null} /*leat it is out*/)
        {
            const get_or_null = (sheet__, cord__) => { 
                let cell_ = self.get_cell(sheet__, cord__);
                cell_?.trim();
                return cell_;
            };
            lead.geo = get_or_null(sheet_,cord_);

    }
 
    private add_information(target_: LeadListWithInfo, strategy_:string) {
        let check = (ar_) => {

                let info_ = new Set<string>();/////////////тут начинай!!!!!!!!!!!!!!!!!!! скомпилируй посмотри ошибку
                let error_:[number?] = [];
                let alert_:[number?] = [];

                if(this.strategy_add[strategy_] != undefined) {
                    for(let row__ in ar_) {
                        let item=target_.leads[row__];
                        info_.add(item.phone);
                        if(item.phone == undefined /*|| item.name == undefined*/) {
                            error_.push(Number(row__)+1); 
                            continue;
                        }
                        if(!item.phone.match(PHONE_PATTERN)) 
                            alert_.push(Number(row__)+1);
                    }
                } else {
                    for(let row__ in ar_) {
                        let item=target_.leads[row__];
                        info_.add(item.phone);
                        if(item.phone==null) {
                            error_.push(Number(row__)+1);
                            continue;
                        }
                        if(!item.phone!.match(PHONE_PATTERN)) 
                            alert_.push(Number(row__)+1);
                    }
                }
                
                return new Info(Number(info_.size), error_, alert_ );
        };
        let check_info = check(target_.leads);
        target_.info = check_info.info;
        target_.alert = check_info.alert;
        target_.error = check_info.error;
    }

    public fill_empty_name(table: [Lead?]) : [Lead?] {
        let temp: [Lead?] = [];
        for(let lead of table) {
            if(!lead.name) {
                lead.name=TEXT_CONSTANT.TEXT_INSTEAD_OF_EMPTY_NAME_FIELD;
            }
            temp.push(lead);
        }
        return temp;
    }

    public clear_null_value(table: [Lead?]) : [Lead?] 
    /*Return list of leads without rows which contains name or phone value equal null*/
    {
        let temp:[Lead?] = [];
        for(let lead of table) {
            if (lead.name && lead.phone)
                temp.push(lead);
        }
        return temp;
    }

    public cut_down(table: [Lead?]) : [Lead?] {
        let temp:[any?] = [];
        for(let i in table) {
            temp[i]=table[i];
            if(temp[i].name)
                temp[i].name = temp[i].name.slice(0,59);
            if (temp[i].geo) 
                temp[i].geo = temp[i].geo.slice(0,254);
        }
        return temp;
    }

    

    public normalize_up_data(table:[Lead?], strategy:string) : [Lead?] {
        if(strategy in this.strategy_add)
            return this.cut_down(this.clear_null_value(this.fill_empty_name(table)));
        else if(strategy in this.strategy_update)
            return this.cut_down(table);
    }

}