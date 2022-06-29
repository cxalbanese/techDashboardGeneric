import { LightningElement,track,wire} from 'lwc';
import getTSEMap from '@salesforce/apex/techDashboard.getTSInfo';
import techId from '@salesforce/user/Id';

export default class TechTimeSheetByWeek extends LightningElement {
    @track tseData;
    @track errorData;
    key;
    @wire(getTSEMap,{userId : techId})
    dataRecord({data, error}){
        if(data){
            this.tseData=data;
        }
        else if(error){
            this.errorData = error;
        }
    }
    dayHours(theday) {
        this.key=theday;
        return this.tseData?.[this.key] / 60;
    }
    get monHours() {
        return this.dayHours('Mon');
    }  
    get tueHours() {
        return this.dayHours('Tue');
    }     
    get wedHours() {
        return this.dayHours('Wed');
    }  
    get thuHours() {
        return this.dayHours('Thu');
    }  
    get friHours() {
        return this.dayHours('Fri');
    }  
    get satHours() {
        return this.dayHours('Sat');
    }  
    get sunHours() {
        return this.dayHours('Sun');
    }  
    get burden() {
        return this.dayHours('Burden');
    }
    get straight() {
        return this.dayHours('Straight');
    }
    get overtime() {
        return this.dayHours('Overtime');
    }   
    get totalHours() {
        return this.dayHours('Burden')+this.dayHours('Straight')+this.dayHours('Overtime');
    } 
}