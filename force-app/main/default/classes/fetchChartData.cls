public with sharing class fetchChartData {
    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getChartDataForPrice() {
        return [SELECT Price__c, Name FROM Car_Model__c WHERE Stage__c =: 'Launched' ORDER BY LastModifiedDate DESC];
    }

    @AuraEnabled(cacheable=true)
    public static List<Car_Model__c> getChartDataForUnitsSold() {
        return [SELECT Total_Cars_Sold__c, Name FROM Car_Model__c WHERE Stage__c =: 'Launched' ORDER BY LastModifiedDate DESC];
    }
}