import Dexie from "dexie";

export const db= new Dexie('BudgetTrackerDB');

db.version(1).stores({
    Transactions: 'TransactionId, CategoryId, Date, Type, AccountId',
    Categories: 'CategoryId, Type',
    Budgets: 'BudgetId, CategoryId, Month'
})

db.version(2).stores({
    Transactions: 'TransactionId, CategoryId, Date, Type, AccountId',
    Categories: 'CategoryId, Type',
    Budgets: 'BudgetId, CategoryId, Month',
    Rates: 'RateId, Date'
})