export interface staff_details {
    name:         string;
    user_name:    string;
    agency:       string;
    phone_number: string;
    email:        string;
    branch:       Branch;
    role:         string;
    staff_type:   string;
}

export interface Branch {
    id:                  number;
    agency:              Agency;
    name:                string;
    contact_person_name: string;
    address:             string;
    latitude:            string;
    longitude:           string;
    phone_number:        string;
    email:               string;
    state:               string;
    city:                string;
    active:              boolean;
}

export interface Agency {
    id:              number;
    name:            string;
    website:         string;
    description:     string;
    iban:            string;
    licence_no:      string;
    active:          boolean;
    approved_on:     string;
    umrah_operator:  boolean;
    address:         string;
    phone_number:    string;
    email:           string;
    state:           string;
    city:            string;
    country:         string;
    primary_contact: string;
    sub_agencies:    any[];
}