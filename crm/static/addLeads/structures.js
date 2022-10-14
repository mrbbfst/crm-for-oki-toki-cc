export class Lead {
}
;
export class Info {
    constructor(info_, error_, alert_) {
        this.info = info_;
        this.error = error_;
        this.alert = alert_;
    }
}
export class LeadListWithInfo extends Info {
    constructor() {
        super();
        this.leads = [];
    }
}
;
