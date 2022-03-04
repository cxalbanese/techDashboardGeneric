import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
//import getOpptyList from '@salesforce/apex/techDashboard.getOpptyInfo';
import { getListUi } from 'lightning/uiListApi';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'; 
import CLOSED_FIELD from '@salesforce/schema/Opportunity.IsClosed'
import techId from '@salesforce/user/Id';

export default class getOppties extends LightningElement {
    @track opptyData = [];
    @track errorData;
    @track opptyDataWon = [];
    @track errorDataWon;
    @wire(getListUi,{
        objectApiName : OPPORTUNITY_OBJECT, 
        listViewApiName: 'My_Open_Opportunities',
        sortBy: CLOSED_FIELD})
    dataRecord({data, error}){
       if(data){
            this.opptyData = data.records.records;
       }
       else if(error){
           this.errorData = error;
           this.opptyData = undefined;
       }
     }
     @wire(getListUi,{
        objectApiName : OPPORTUNITY_OBJECT, 
        listViewApiName: 'My_Won_Opportunities',
        sortBy: CLOSED_FIELD})
    dataRecordWon({data, error}){
       if(data){
            this.opptyDataWon = data.records.records;
       }
       else if(error){
           this.errorDataWon = error;
           this.opptyDataWon = undefined;
       }
     }

    get numOpenOppties() {
        return this.opptyData.length;
    }
    get numWonOppties() {
        return this.opptyDataWon.length;
    }   
}