public with sharing class techDashboard {
    static integer rowLimit = 1000;
    @AuraEnabled(cacheable=true)
    public static ServiceResource getSRInfo(string userId) {
    return [select Id,Name,LastKnownLocationDate from serviceresource where relatedrecordid = :userId limit 1];
    }
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpptyInfo(string userId) {
        return [SELECT ID, Name, StageName, IsWon,IsClosed,Amount from Opportunity where CreatedById = :userId and (IsClosed = False OR IsWon = True) LIMIT :rowLimit];
    }
    @AuraEnabled(cacheable=true)
    public static List<ServiceAppointment> getSAInfo(string userId) {
        string serviceResourceId = [select id from serviceresource where relatedrecordid = :userId].id;
        return [SELECT ID, AppointmentNumber, Status, ParentRecordId,SchedStartTime,SchedEndTime,Duration from ServiceAppointment where StatusCategory in ('Scheduled','Dispatched','InProgress') and Id in (select serviceappointmentid from assignedresource where serviceresourceid = :serviceResourceId) LIMIT :rowLimit];
    }    
    
}