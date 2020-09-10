public with sharing class fetchChartData {
    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getChartData() {
        return [SELECT Price__c, Name FROM Car_Model__c WHERE Stage__c =: 'Launched' ORDER BY LastModifiedDate DESC];
    }
}
