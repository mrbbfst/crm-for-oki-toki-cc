export { Serializer };
// @deno-types="./xlsx.d.ts";
import { read } from './xlsx.js';
import { PHONE_PATTERN, SER_C } from "./constants.js";
import { Info, LeadListWithInfo } from "./structures.js";
class Serializer {
    constructor() {
        this.strategy_add = {
            "(A)ИМЯ-(B)ТЕЛЕФОН-(C)АДРЕСС": [this.name_cell_handler, this.phone_cell_handler, this.geo_cell_handler],
            "(A)ИМЯ-(B)ТЕЛЕФОН": [this.name_cell_handler, this.phone_cell_handler],
            "(A)ТЕЛЕФОН-(B)ИМЯ": [this.phone_cell_handler, this.name_cell_handler],
            "(A)АДРЕСС-(B)ИМЯ-(C)ТЕЛЕФОН": [this.geo_cell_handler, this.name_cell_handler, this.phone_cell_handler],
            "(A)АДРЕСС-(C)ТЕЛЕФОН-(B)ИМЯ": [this.geo_cell_handler, this.phone_cell_handler, this.name_cell_handler],
            "(B)ИМЯ-(C)ТЕЛЕФОН": [, this.name_cell_handler, this.phone_cell_handler],
            "(C)ТЕЛЕФОН-(B)ИМЯ": [, this.phone_cell_handler, this.name_cell_handler],
        };
        this.strategy_update = {
            "(A)ТЕЛЕФОН": [this.phone_cell_handler],
            "(B)ТЕЛЕФОН": [, this.phone_cell_handler],
            "(C)ТЕЛЕФОН": [, , this.phone_cell_handler],
        };
    }
    read_file(params) {
        return read(params, { type: 'binary' });
    }
    read_row(sheet_, row_, strategy_) {
        let result_ = {
            name: null,
            phone: null,
            geo: null
        };
        for (let column_num__ in strategy_) {
            if (strategy_[column_num__] == undefined)
                continue;
            let sign_column__ = SER_C.ENGLISH_ALPHABET[column_num__];
            strategy_[column_num__](this, sheet_, this.make_cord(sign_column__, row_), result_);
        }
        return result_;
    }
    does_data_exisx(sheet_, row_, column_count_) {
        let result_ = false;
        for (let i = 0; i < column_count_; i++) {
            let empty_ = false;
            let cell_value_ = this.get_cell(sheet_, this.make_cord(SER_C.ENGLISH_ALPHABET[i], row_));
            result_ = result_ || cell_value_ != null;
        }
        return result_;
    }
    normalize_strategy(strategy) {
        let result_ = [];
        if (this.strategy_add[strategy] != undefined)
            result_ = this.strategy_add[strategy];
        else if (this.strategy_update[strategy] != undefined)
            result_ = this.strategy_update[strategy];
        return result_;
    }
    serialize(xlsx_object, strategy_) {
        const get_sheet = function (book_) {
            return book_.Sheets[book_.SheetNames[0]];
        };
        const normalized_strategy_ = this.normalize_strategy(strategy_);
        const sheet_ = get_sheet(xlsx_object);
        let result = new LeadListWithInfo();
        let row_ = 0;
        while (this.does_data_exisx(sheet_, ++row_, strategy_.length)) {
            result.leads.push(this.read_row(sheet_, row_, normalized_strategy_));
        }
        this.add_information(result, strategy_);
        return result;
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
    // read and strategies functions
    make_cord(l, r) {
        return l + String(r);
    }
    get_cell(sheet_, cord_) {
        let target_;
        try {
            target_ = String(sheet_[cord_].v).trim();
            return target_;
        }
        catch (TypeError) {
            return null;
        }
        ;
    }
    phone_cell_handler(self, sheet_, cord_, lead /*leat it is out*/) {
        const get_or_null = (sheet__, cord__) => {
            let cell_ = self.get_cell(sheet_, cord_);
            if (cell_ == null)
                return cell_;
            if (cell_.length == SER_C.LENGTH_UA_PHONE) {
                if (cell_.match(RegExp(/^([0-9]{12})$/gs)))
                    return cell_;
            }
            if (cell_.length == SER_C.LENGTH_SHORT_UA_PHONE && cell_[0] == "0")
                return "38" + cell_;
            if (cell_.length == SER_C.LENGTH_TOO_LONG_13_UA_PHONE) {
                let first_two_number = cell_.slice(0, 2);
                if (first_two_number == "33")
                    return cell_.slice(1, cell_.length);
                let second_two_number = cell_.slice(1, 3);
                if (second_two_number == "88")
                    return cell_.slice(0, 2) + cell_.slice(3);
                let third_two_number = cell_.slice(2, 4);
                if (third_two_number == "00")
                    return cell_.slice(0, 3) + cell_.slice(4);
            }
            return null;
        };
        lead.phone = get_or_null(sheet_, cord_);
    }
    name_cell_handler(self, sheet_, cord_, lead /*leat it is out*/) {
        let cell_ = self.get_cell(sheet_, cord_);
        cell_ === null || cell_ === void 0 ? void 0 : cell_.trim();
        lead.name = cell_;
    }
    geo_cell_handler(self, sheet_, cord_, lead /*leat it is out*/) {
        const get_or_null = (sheet__, cord__) => {
            let cell_ = self.get_cell(sheet__, cord__);
            cell_ === null || cell_ === void 0 ? void 0 : cell_.trim();
            return cell_;
        };
        lead.geo = get_or_null(sheet_, cord_);
    }
    add_information(target_, strategy_) {
        let check = (ar_) => {
            let info_ = new Set(); /////////////тут начинай!!!!!!!!!!!!!!!!!!! скомпилируй посмотри ошибку
            let error_ = [];
            let alert_ = [];
            if (this.strategy_add[strategy_] != undefined) {
                for (let row__ in ar_) {
                    let item = target_.leads[row__];
                    info_.add(item.phone);
                    if (item.phone == undefined || item.name == undefined) {
                        error_.push(Number(row__) + 1);
                        continue;
                    }
                    if (!item.phone.match(PHONE_PATTERN))
                        alert_.push(Number(row__) + 1);
                }
            }
            else {
                for (let row__ in ar_) {
                    let item = target_.leads[row__];
                    info_.add(item.phone);
                    if (item.phone == null) {
                        error_.push(Number(row__) + 1);
                        continue;
                    }
                    if (!item.phone.match(PHONE_PATTERN))
                        alert_.push(Number(row__) + 1);
                }
            }
            return new Info(Number(info_.size), error_, alert_);
        };
        let check_info = check(target_.leads);
        target_.info = check_info.info;
        target_.alert = check_info.alert;
        target_.error = check_info.error;
    }
    clear_null_value(table) {
        let temp = [];
        for (let lead of table) {
            if (lead.name && lead.phone)
                temp.push(lead);
        }
        return temp;
    }
    cut_down(table) {
        let temp = [];
        for (let i in table) {
            temp[i] = table[i];
            temp[i].name = temp[i].name.slice(1, 60);
        }
        return temp;
    }
    normalize_up_data(table) {
        return this.cut_down(this.clear_null_value(table));
    }
}
