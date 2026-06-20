type CategoryType = "INCOME" | "EXPENSE";
type Category = {
  type: CategoryType;
  months: { month: number; amount: number }[];
};

export function categoryTotal(category: Category): number {
    let total = 0;
    for(const month of category.months){
        total += month.amount;
    }
    return total;
}

export function incomeTotal(categories: Category[]): number {
    let total = 0;
    for(const category of categories){
        if(category.type === "INCOME"){
            total += categoryTotal(category);
        }
    }
    return total;
}

export function expenseTotal(categories: Category[]): number {
    let total = 0;
    for(const category of categories){
        if(category.type === "EXPENSE"){
            total += categoryTotal(category);
        }
    }
    return total;
}

export function computeTotal(categories: Category[], initialBalance: number){
    const income = incomeTotal(categories);
    const expenses = expenseTotal(categories);

    return {
        incomeTotal: income,
        expenseTotal: expenses,
        result: income - expenses,
        initialBalance: initialBalance,
    };
}