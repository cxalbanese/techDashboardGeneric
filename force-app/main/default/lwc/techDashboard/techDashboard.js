import { track,LightningElement, wire } from 'lwc';
import Id from '@salesforce/user/Id';

import customlabelDashboardTitle from "@salesforce/label/c.DashboardTitle";
export default class LwcUserDetail extends LightningElement {
@track summary=true;
@track opptyDetail=false;
@track woDetail=false;
@track saDetail=false;
@track tsDetail=false;
labels = {
    customlabelDashboardTitle
};
    get myUserId() {
        return Id;
    }
handleOpptyClick(event)  {
    this.opptyDetail=!this.opptyDetail;
    this.summary=!this.summary;
}   
handleWOClick(event)  {
    this.woDetail=!this.woDetail;
    this.summary=!this.summary;
} 
handleSAClick(event)  {
    this.saDetail=!this.saDetail;
    this.summary=!this.summary;
}    
handleTSClick(event)  {
    this.tsDetail=!this.tsDetail;
    this.summary=!this.summary;
}    
printPage() {
    window.print();
}
}