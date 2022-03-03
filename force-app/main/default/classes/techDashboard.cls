public with sharing class techDashboard {
    static integer rowLimit = 1000;
    //getSRInfo - returns Service Resource Info for the tech
    @AuraEnabled(cacheable=true)
    public static ServiceResource getSRInfo(string userId) {
    return [select Id,Name,LastKnownLocationDate from serviceresource where relatedrecordid = :userId limit 1];
    }
    //getOpptyInfo - returns open or won opportunities that the tech has created
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpptyInfo(string userId) {
        return [SELECT ID, Name, StageName, IsWon,IsClosed,Amount from Opportunity where CreatedById = :userId and (IsClosed = False OR IsWon = True) LIMIT :rowLimit];
    }
    //getSAInfo - returns a list of SAs assigned to the tech and is scheduled, dispatched or in progress
    @AuraEnabled(cacheable=true)
    public static List<ServiceAppointment> getSAInfo(string userId) {
        string serviceResourceId = [select id from serviceresource where relatedrecordid = :userId].id;
        return [SELECT ID, AppointmentNumber, Status, ParentRecordId,SchedStartTime,SchedEndTime,Duration from ServiceAppointment where StatusCategory in ('Scheduled','Dispatched','InProgress') and Id in (select serviceappointmentid from assignedresource where serviceresourceid = :serviceResourceId) LIMIT :rowLimit];
    } 
    //getWOInfo - returns list of work orders and associated worktype and worktype work_type_category for the assigned SA
    @AuraEnabled(cacheable=true)
    public static List<WorkOrder> getWOInfo(string userId) {
        set<id> setParentRecordId = new set<id>();
        for(serviceappointment sa : getSAInfo(userId)) setParentRecordId.add(sa.ParentRecordId);
        return [select id,workordernumber,worktypeid,worktype.work_type_category__c from workorder where id in :setParentRecordId];
    } 
}