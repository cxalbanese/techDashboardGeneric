public with sharing class techDashboard {
    static integer rowLimit = 1000;
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpptyInfo(string userId) {
       // system.debug('heres the parm ' + userId);
        return [SELECT ID, Name, StageName, IsWon,IsClosed,Amount from Opportunity where CreatedById = :userId and (IsClosed = False OR IsWon = True) LIMIT :rowLimit];
    }
    @AuraEnabled(cacheable=true)
    public static List<ServiceAppointment> getSAInfo(string userId) {
       // system.debug('heres the parm ' + userId);
        return [SELECT ID, AppointmentNumber, Status, ParentRecordId,SchedStartTime,SchedEndTime,Duration from ServiceAppointment where StatusCategory in ('Scheduled','Dispatched','InProgress') and Id in (select serviceappointmentid from assignedresource where serviceresourceid = :userId) LIMIT :rowLimit];
    }    
    
}