public with sharing class fetchChartData {
    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getChartData() {
        return [SELECT Price__c, Name FROM Car_Model__c ORDER BY LastModifiedDate DESC];
    }
}