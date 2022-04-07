

import { api, LightningElement, track, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'; 
import CLOSED_FIELD from '@salesforce/schema/Opportunity.IsClosed'

import customlabelopenoppty from "@salesforce/label/c.techOpenOppty";
import customlabelwonoppty from "@salesforce/label/c.techWonOppty"; 
import customlabelopptyheader from "@salesforce/label/c.techOpptyHeader"; 

export default class TechOpptyListView extends LightningElement {

    @api recordId;
    @track records;
    @track error;
    labels = {
        customlabelopenoppty,
        customlabelwonoppty,
        customlabelopptyheader
    };
    get hasRecords() {
        return this.records && this.records.length > 0;
    }

    @wire(getListUi,{
        objectApiName : OPPORTUNITY_OBJECT, 
        listViewApiName: 'My_Open_or_Won_Opportunities',
        sortBy: CLOSED_FIELD})
    callback({data, error}) {
        if (data) {
            this.records = data.records.records;
        } else if (error) {
            console.error(error);
            this.error = error;
        }
    }
}