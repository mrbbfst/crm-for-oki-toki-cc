export class Lead {
    name: string|null;
    phone: string|null;
    geo: string|null;
};

export class Info {
    info: number|undefined;
    error: [number?];
    alert: [number?];

    constructor(info_?:number, error_?:[number?], alert_?:[number?]) {
        this.info = info_;
        this.error = error_!;
        this.alert = alert_!;

    }
}

export class LeadListWithInfo extends Info {
    leads!:[Lead?];
    
    constructor() {
        super()
        this.leads = [];
    }
};
