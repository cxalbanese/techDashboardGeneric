import { api, LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOpptyList from '@salesforce/apex/techDashboard.getOpptyInfo';
import techId from '@salesforce/user/Id';

export default class getOppties extends LightningElement {
    @track numOpen=0;
    @track numWon=0;
    @track opptyData = [];
    @track errorData;
    @wire(getOpptyList,{userId : techId})
    dataRecord({data, error}){
       if(data){
           this.opptyData = data;
       }
       else if(error){
           this.errorData = error;
       }
     }
     handler() {
        refreshApex(this.getOpptyList);
      }

    get numOppties() {
        return this.opptyData.length;
    } 
    get numOpenOppties() {
        let numOpenOppty=0;
        this.opptyData.forEach(opptyFunction);
        function opptyFunction(value) {
            if(!value.IsClosed) {
                numOpenOppty++;
            }       
        }
        return numOpenOppty;
    }   
    get numWonOppties() {
        let numWonOppty=0;
        this.opptyData.forEach(opptyFunction);
        function opptyFunction(value) {
            if(value.IsWon) {
                numWonOppty++;
            }       
        }
        return numWonOppty;
    }    
}