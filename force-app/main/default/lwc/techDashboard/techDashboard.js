import { track,LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';

export default class LwcUserDetail extends LightningElement {
@track summary=true;
@track detail=false;
    get myUserId() {
        return Id;
    }
handleClick(event)  {
    this.detail=!this.detail;
    this.summary=!this.summary;
}   
printPage() {
    window.print();
}
}