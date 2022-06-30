

import { api, LightningElement, track, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'; 
import CLOSED_FIELD from '@salesforce/schema/Opportunity.IsClosed'

import customlabelOpportunitiesCreated from "@salesforce/label/c.OpportunitiesCreated"; 
import customlabelOpportunityDetailsTitle from "@salesforce/label/c.OpportunityDetailsTitle";
import customlabelOpportunitiesNone from "@salesforce/label/c.OpportunitiesNone";  

import { NavigationMixin } from 'lightning/navigation';
export default class TechOpptyListView extends LightningElement {

    @api recordId;
    @track records;
    @track error;
    labels = {
        customlabelOpportunitiesCreated,
        customlabelOpportunityDetailsTitle,
        customlabelOpportunitiesNone
    };
    get hasRecords() {
        return this.records && this.records.length > 0;
    }
    navigateToOpportunity() {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage", 
            "attributes": {
            "url": 'com.salesforce.fieldservice://v1/sObject/$006B0000007vdv2IAA/details'
         }
            
        });
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