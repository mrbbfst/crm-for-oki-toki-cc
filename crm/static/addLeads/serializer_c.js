export { Serializer };
// @deno-types="./xlsx.d.ts";
import { read } from './xlsx.mjs';
import { PHONE_PATTERN } from "./constants.js";
class Serializer {
    constructor() {
        this.strategy_add = {
            "(A)ИМЯ-(B)ТЕЛЕФОН-(C)АДРЕСС": this.strategy_A_NAME__B_PHONE_C_GEO,
            "(A)ИМЯ-(B)ТЕЛЕФОН": this.strategy_A_NAME__B_PHONE,
        };
        this.strategy_update = {
            "(A)ТЕЛЕФОН": this.strategy_PHONE_IN_TARGET_COLUMN_A,
            "(B)ТЕЛЕФОН": this.strategy_PHONE_IN_TARGET_COLUMN_B,
            "(C)ТЕЛЕФОН": this.strategy_PHONE_IN_TARGET_COLUMN_C,
        };
    }
    read_file(params) {
        return read(params, { type: 'binary' });
    }
    serialize(xlsx_object, strategy_) {
        let delete_next_key = (item_) => {
            delete item_.next;
        };
        let row_ = 1; //the line that is being read now
        let sheetname_ = xlsx_object.SheetNames[0];
        let sheet_ = xlsx_object.Sheets[sheetname_];
        let result = { 'leads': [], 'error': undefined, 'alert': undefined, 'info': undefined };
        let f;
        if (this.strategy_add[strategy_] != undefined) {
            f = this.strategy_add[strategy_];
        }
        else if (this.strategy_update[strategy_] != undefined) {
            f = this.strategy_update[strategy_];
        }
        let item = f(this, sheet_, row_);
        while (item.next) {
            delete_next_key(item);
            result.leads.push(item);
            item = f(this, sheet_, ++row_);
        }
        result.leads.push(item);
        this.add_information(result, strategy_);
        return result;
        //return {'leads' : [], 'error' : undefined, 'alert': undefined, 'info': undefined};
    }
    get_add_strategyes() {
        let list = [];
        for (let key in this.strategy_add)
            list.push(key);
        return list;
    }
    get_update_strategyes() {
        let list = [];
        for (let key in this.strategy_update)
            list.push(key);
        return list;
    }
    // strategies functions
    make_cord(l, r) {
        return l + String(r);
    }
    get_cell(sheet_, cord_) {
        let target_;
        try {
            target_ = String(sheet_[cord_].v);
            return target_;
        }
        catch (TypeError) {
            return null;
        }
        ;
    }
    strategy_A_NAME__B_PHONE_C_GEO(self, sheet_, row_) {
        /*next для информирования имеется ли в следующей строке какие то данные*/
        let target_ = {
            name: "",
            phone: "",
            geo: "",
            next: false
        };
        let next_;
        let name_temp;
        let phone_temp;
        let geo_temp;
        if (name_temp = self.get_cell(sheet_, self.make_cord('A', row_)))
            next_ = self.get_cell(sheet_, self.make_cord('A', row_ + 1));
        if (phone_temp = self.get_cell(sheet_, self.make_cord('B', row_)))
            next_ = next_ && self.get_cell(sheet_, self.make_cord('B', row_ + 1));
        geo_temp = self.get_cell(sheet_, self.make_cord('C', row_));
        next_ = next_ || self.get_cell(sheet_, self.make_cord('C', row_ + 1));
        target_.name = name_temp;
        target_.phone = phone_temp;
        target_.geo = geo_temp;
        target_.next = next_;
        return target_;
    }
    strategy_A_NAME__B_PHONE(self, sheet_, row_) {
        /*next для информирования имеется ли в следующей строке какие то данные*/
        let target_ = {
            name: "",
            phone: "",
            next: false
        };
        let next_;
        let name_temp;
        let phone_temp;
        if (name_temp = self.get_cell(sheet_, self.make_cord('A', row_)))
            next_ = self.get_cell(sheet_, self.make_cord('A', row_ + 1));
        if (phone_temp = self.get_cell(sheet_, self.make_cord('B', row_)))
            next_ = next_ && self.get_cell(sheet_, self.make_cord('B', row_ + 1));
        target_.name = name_temp;
        target_.phone = phone_temp;
        target_.next = next_;
        return target_;
        //return {name:'', phone:'', next:true};
    }
    strategy_PHONE_IN_TARGET_COLUMN_A(self, sheet_, row_) {
        return self.strategy_PHONE_IN_TARGET_COLUMN(self, sheet_, row_, "A");
    }
    strategy_PHONE_IN_TARGET_COLUMN_B(self, sheet_, row_) {
        return self.strategy_PHONE_IN_TARGET_COLUMN(self, sheet_, row_, "B");
    }
    strategy_PHONE_IN_TARGET_COLUMN_C(self, sheet_, row_) {
        return self.strategy_PHONE_IN_TARGET_COLUMN(self, sheet_, row_, "C");
    }
    strategy_PHONE_IN_TARGET_COLUMN(self, sheet_, row_, target_column_) {
        /*next для информирования имеется ли в следующей строке какие то данные*/
        let target_ = {
            phone: "",
            next: false
        };
        let next_;
        let phone_temp;
        if (phone_temp = self.get_cell(sheet_, self.make_cord(target_column_, row_)))
            next_ = self.get_cell(sheet_, self.make_cord(target_column_, row_ + 1));
        target_.phone = phone_temp;
        target_.next = next_;
        return target_;
        return { phone: '', next: true };
    }
    //analise functions 
    add_information(target_, strategy_) {
        let check = (ar_) => {
            let info_ = new Set(); /////////////тут начинай!!!!!!!!!!!!!!!!!!! скомпилируй посмотри ошибку
            let error_ = "";
            let alert_ = "";
            if (this.strategy_add[strategy_] != undefined) {
                for (let row__ in ar_) {
                    let item = target_.leads[row__];
                    info_.add(item.phone);
                    if (item.phone == undefined || item.name == undefined) {
                        error_ += String(Number(row__) + 1) + ", ";
                        continue;
                    }
                    if (!item.phone.match(PHONE_PATTERN))
                        alert_ += String(Number(row__) + 1) + ", ";
                }
            }
            else {
                for (let row__ in ar_) {
                    let item = target_.leads[row__];
                    info_.add(item.phone);
                    if (!item.phone.match(PHONE_PATTERN))
                        alert_ += String(Number(row__) + 1) + ", ";
                }
            }
            return { info: String(info_.size), alert: alert_, error: error_ };
        };
        let check_info = check(target_.leads);
        target_.info = check_info.info;
        target_.alert = check_info.alert;
        target_.error = check_info.error;
        //target_.info = String(check(target_.leads));
    }
}
